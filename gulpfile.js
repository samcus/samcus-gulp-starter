const gulp = require('gulp');
const babel = require('gulp-babel');
const sourcemaps = require('gulp-sourcemaps');
const browserify = require('gulp-browserify');
const uglify = require('gulp-uglify');
const sass = require('gulp-sass');
const sassGlob = require('gulp-sass-glob');
const sassLint = require('gulp-sass-lint');
const eslint = require('gulp-eslint');
const imagemin = require('gulp-imagemin');
const notifier = require('node-notifier');
const del = require('del');
const Promise = require('bluebird');
const doiuse = require('doiuse');
const jsinspect = require('gulp-jsinspect');
const browserSync = require('browser-sync').create();
const postcss = require('gulp-postcss');

// Watch Mode (Dev Only)
if(process.env.NODE_ENV == 'development'){
    const watchJS = gulp.watch('src/js/**/*.js', ['default']);
    const watchCSS = gulp.watch('src/scss/**/*.scss', ['default']);
    const watchImages = gulp.watch('src/images/**/*.{png,gif,jpg,jpeg,svg}', ['default']);
    const watchFonts = gulp.watch('src/fonts/**/*.{woff,woff2,ttf,otf}', ['default']);
    const watchHTML = gulp.watch("index.html").on('change', browserSync.reload);
    // Event Listeners
    watchJS.on('change', (event) => { browserSync.reload; clean('resources/js/**/*').then(buildJS(event)) });
    watchCSS.on('change', (event) => { browserSync.reload; clean('resources/stylesheets/**/*').then(buildCSS(event)) });
    watchImages.on('change', (event) => { browserSync.reload; clean('resources/images/**/*').then(compressImages(event)) });
    watchFonts.on('change', (event) => { browserSync.reload; clean('resources/fonts/**/*').then(copyFonts(event)) });
}

let firstBuild = true;

// Run on Init
gulp.task('default', () => {
    if(firstBuild) {
        if(process.env.NODE_ENV == 'development'){
            browserSync.init({
                //proxy: "local.dev",
                server: {
                    baseDir: "./"
                }
            })
        }
        clean('resources/js/**/*').then(buildJS);
        clean('resources/stylesheets/**/*').then(buildCSS);
        clean('resources/images/**/*').then(compressImages);
        clean('resources/fonts/**/*').then(copyFonts);
        firstBuild = false;
    }
});

// Delete Specific Paths
const clean = (paths) => {
    return new Promise((resolve,reject)=>{
        resolve(del([paths]));
    });
};

// Build JavaScript (ES6)
const buildJS = (event) => {
    console.log('Updating JavaScript (ES6)!');
    gulp.src('src/js/app.js')
        .pipe(jsinspect({
            "threshold":     5,
            "identifiers":   true,
            "literals":      true,
            "color":         true,
            "minInstances":  2,
            "failOnMatch": false
        }))
        .pipe(eslint({
            useEslintrc : true
        }))
        .pipe(eslint.format())
        .pipe(browserify({ insertGlobals : true, debug : !gulp.env.production }))
        .pipe(sourcemaps.init())
        .pipe(babel({ presets: ['es2015'] }))
        .pipe(uglify())
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest('resources/js'))
        .pipe(browserSync.stream())
        .on('end', ()=>{
            notifier.notify({title:'Gulp Notifier', message:'Updated JavaScript (ES6)!'});
        });
};

// Build CSS (SCSS)
const buildCSS = (event) => {
    console.log('Updating CSS!');
    gulp.src('src/scss/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sassGlob())
        .pipe(sass().on('error', sass.logError))
        .pipe(sassLint())
        .pipe(sassLint.format())
        .pipe(postcss([
            doiuse({
                browsers: [
                'ie >= 8'
                ],
                ignore: [], // an optional array of features to ignore
                ignoreFiles: ['**/normalize.css'], // an optional array of file globs to match against original source file path, to ignore
                onFeatureUsage: function (usageInfo) {
                    //console.log('test: ',usageInfo.message)
                }
            })
        ]))
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest('resources/stylesheets'))
        .pipe(browserSync.stream())
        .on('end', () => {
            notifier.notify({title:'Gulp Notifier', message:'Updated CSS!'});
        });
};

// Compress Images
const compressImages = (event) => {
    console.log('Compressing Images!');
    gulp.src('src/images/**/*')
    .pipe(imagemin())
    .pipe(gulp.dest('resources/images/'))
    .pipe(browserSync.stream())
    .on('end', () => {
        notifier.notify({title:'Gulp Notifier', message:'Compressed Images!'});
    });
};

// Copy Fonts
const copyFonts = (event) => {
    console.log('Copying Fonts');
    gulp.src('src/fonts/**/*')
    .pipe(gulp.dest('resources/fonts/'))
    .pipe(browserSync.stream())
    .on('end', () => {
        notifier.notify({title:'Gulp Notifier', message:'Copied Fonts!'});
    });
};