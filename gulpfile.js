// Initialize modules
const { src, dest, watch, series } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const babel = require('gulp-babel');
const terser = require('gulp-terser');
const browsersync = require('browser-sync').create();

// Log errors utility
const logError = (error) => {
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
    // Optional: Notify BrowserSync if it's running
    if (browsersync.active) {
        browsersync.notify(`Error: ${error.message}`, 5000);
    }
};

// Sass task 
function scssTask() {
    return src('app/scss/style.scss', { sourcemaps: true })
        .pipe(sass().on('error', (error) => {
            logError(error);
            sass.logError(error); // Gulp-sass built-in error logging
            this.emit('end'); // Prevent Gulp from crashing
        }))
        .pipe(sass())
        .pipe(postcss([autoprefixer(), cssnano()]))
        .pipe(dest('dist', { sourcemaps: '.' }));
}

// JavaScript task
function jsTask() {
    return src('app/scripts/script.js', { sourcemaps: true })
        .pipe(babel({ presets: ['@babel/preset-env'] }))
        .pipe(terser())
        .pipe(dest('dist', { sourcemaps: '.' }));
}


// Browersync task 
function browsersyncServer(cb) {
    browsersync.init({
        server: {
            baseDir: '.',
        },
        notify: {
            style: {
                top: 'auto',
                bottom: '0',
            },
        },
    });
    cb(); // callback
}
function browsersynReaload(cb) {
    browsersync.reload();
    cb(); // callback
}

// Watch task
function watchTask() {
    watch('*.html', browsersynReaload);
    watch(
        ['app/scss/**/*.scss', 'app/scripts/*.js'],
        series(scssTask, jsTask, browsersynReaload)
    );
}


// default export
exports.default = series(scssTask, jsTask, browsersyncServer, watchTask);

// Gulp Build Task
exports.build = series(scssTask, jsTask);