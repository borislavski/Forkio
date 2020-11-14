const { src, dest, parallel, series, watch } = require('gulp');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const clean = require('gulp-clean');
const cleanCSS = require('gulp-clean-css');
const concat = require('gulp-concat');
const imagemin = require('gulp-imagemin');
const minifyJS = require('gulp-js-minify');

const serve = (cb) => { 
    browserSync.init({
        server: {
            baseDir: './'
        },
        port: 5500,
        notify: false,
        browser: 'chrome'
    });
    cb();
}
const watcher = (cb) => {
    watch('./index.html').on('change', browserSync.reload);
    watch('./src/scss/**/*.scss', toMinifyCSS);
    watch('./src/js/**/*.js', toMinifyJS);
    watch('./src/img/**/*.{jpg, png, gif, svg, webp}', toMinifyIMG);
    cb();
}
const cleaner = () => {
    return src('./dist/**/*')
        .pipe(clean());
}
const toMinifyCSS = () => {
    return src('./src/scss/main.scss')
        .pipe(sass({
            outputStyle: 'expanded'
        }))
        .pipe(concat('style.min.css'))
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 5 ie version']
        }))
        .pipe(cleanCSS())
        .pipe(dest('./dist/css/'))
        .pipe(browserSync.stream());
}
const toMinifyJS = () => {
    return src('./src/js/script.js')
        .pipe(concat('script.min.js'))
        .pipe(minifyJS())
        .pipe(dest('./dist/js/'))
        .pipe(browserSync.stream());
}
const toMinifyIMG = () => {
    return src('./src/img/**/*')
        .pipe(imagemin())
        .pipe(dest('./dist/img/'))
        .pipe(browserSync.stream());
}
exports.serve = serve;
exports.watcher = watcher;
exports.cleaner = cleaner;
exports.toMinifyCSS = toMinifyCSS;
exports.toMinifyJS = toMinifyJS;
exports.toMinifyIMG = toMinifyIMG;
const build = series(toMinifyIMG, parallel(toMinifyCSS, toMinifyJS));
const dev = series(build, serve, watcher);
exports.build = build;
exports.dev = dev;
exports.default = dev;
