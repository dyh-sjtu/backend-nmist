let gulp = require('gulp');
let browserSync = require('browser-sync').create();
let reload = browserSync.reload;
let nodemon = require('gulp-nodemon');

let jshint = require('gulp-jshint');

gulp.task('browser-sync', ['nodemon'], function() {
	browserSync.init(null, {
		proxy: 'http://localhost:8100',
		files: ['**'],
		browser: 'chrome',
		notify: false,
		port: 3000
	});
});

gulp.task('js', function() {
	return gulp.src(['./routes/**/*.js', './configs/*.js', './public/js/*.js', './models/*.js', './common/*.js']) // 检查文件：js目录下所有的js文件
		.pipe(jshint()) // 进行检查
		.pipe(jshint.reporter('default')) // 对代码进行报错提示
});
gulp.task('css', function() {
	return gulp.src(['./public/css/*.css']) // 检查文件：pulic/css目录下所有的css文件
});

gulp.task('nodemon', function(cb) {
	let called = false;
	return nodemon({
		script: 'app.js'
	}).on('start', function() {
		if (!called) {
			cb();
			called = true;
		}
	});
});

gulp.task('clean', function(cb) {
	del(['./dist'], cb)
});

gulp.task('dist', ['js']);

gulp.task('default', ['browser-sync']);