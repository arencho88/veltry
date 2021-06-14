const {src, dest, watch, parallel, series} = require('gulp');
const scss 	= require('gulp-sass');
const concat = require('gulp-concat');
const browserSync = require('browser-sync').create();
const uglify = require('gulp-uglify-es').default;
const autoprefixer = require('gulp-autoprefixer');
const imagemin = require('gulp-imagemin');
const del = require('del');

function browser(){
	browserSync.init({
		server: {
			baseDir: "app/"
	  	}
	});
}

function cleanDist(){
	return del([
			'images',
			'css',
			'fonts',
			'scss',
			'js',
			'*.html'								
		]);
}

function styles(){
	return src([
			'node_modules/normalize.css/normalize.css',
			// 'node_modules/slick-carousel/slick/slick.scss',
			'app/scss/style.scss',
		])
		.pipe(scss({outputStyle: 'compressed'}))
		.pipe(concat('style.min.css'))
		.pipe(autoprefixer({
			overrideBrowserslist: ['last 10 version'],
			grid: true
		}))
		.pipe(dest('app/css'))
		.pipe(browserSync.stream())
}

function scripts(){
	return src([
		// 'node_modules/jquery/dist/jquery.min.js',
		// 'node_modules/slick-carousel/slick/slick.min.js',
		'app/js/main.js',
	])  
	.pipe(concat('main.min.js'))
	.pipe(uglify())
	.pipe(dest('app/js'))
	.pipe(browserSync.stream())
}

function images(){
	return src('app/images/**/*')
		.pipe(imagemin(
			[
				imagemin.gifsicle({interlaced: true}),
				imagemin.mozjpeg({quality: 75, progressive: true}),
				imagemin.optipng({optimizationLevel: 5}),
				imagemin.svgo({
					 plugins: [
						  {removeViewBox: true},
						  {cleanupIDs: false}
					 ]
				})
		  ]
		))
		.pipe(dest('images'))
}

function build(){
	return src ([
		'app/css/style.min.css',
		'app/scss/*.scss',
		'app/fonts/**/*',
		'app/js/main.min.js',
		'app/js/main.js',
		'app/*.html',
	], {base: 'app'}) 
	.pipe(dest('.'))
}

function watching(){
	watch(['app/scss/**/*.scss'], styles);
	watch(['app/*.html']).on('change', browserSync.reload);
	watch(['app/js/**/*.js', '!app/js/main.min.js'], scripts);
}

exports.styles = styles;
exports.watching = watching;
exports.browser = browser;
exports.scripts = scripts;
exports.images = images;
exports.cleanDist = cleanDist;

exports.build = series(cleanDist, images, build);
exports.default = parallel(styles, scripts, browser, watching);