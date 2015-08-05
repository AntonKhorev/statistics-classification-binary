var gulp=require('gulp');
var rename=require('gulp-rename');
var plumber=require('gulp-plumber');
var jade=require('gulp-jade');
var sourcemaps=require('gulp-sourcemaps');
var concat=require('gulp-concat');
var uglify=require('gulp-uglify');
var fs=require('fs');
var vm=require('vm');

var jsHtmlSrc=[
	'src/i18n.js',
	'src/i18n/en.js',
	'src/i18n/ru.js',
	'src/html.js',
];
var jsSrc=[].concat(
	[
		'src/intro.js',
	],
	jsHtmlSrc,
	[
		'src/main.js',
		'src/outro.js',
	]
);
var destination='public_html';

gulp.task('empty-html',function(){
	gulp.src('src/empty.jade')
		.pipe(plumber())
		.pipe(rename({
			dirname: 'empty',
			basename: 'index',
		}))
		.pipe(jade())
		.pipe(gulp.dest(destination));
});

gulp.task('static-html',function(){
	var ctx={};
	jsHtmlSrc.forEach(function(src){
		vm.runInNewContext(fs.readFileSync(src),ctx);
	});
	gulp.src('src/static.jade')
		.pipe(plumber())
		.pipe(rename({
			dirname: 'static',
			basename: 'index',
		}))
		.pipe(jade({
			locals: ctx
		}))
		.pipe(gulp.dest(destination));
});

gulp.task('js',function(){
	gulp.src(jsSrc)
		.pipe(plumber())
		.pipe(sourcemaps.init())
		.pipe(concat('statistics-classification-binary.js'))
		.pipe(uglify())
		.pipe(sourcemaps.write('.',{
			sourceRoot: '../src'
		}))
		.pipe(gulp.dest(destination+'/lib'));
});

gulp.task('watch',function(){
	gulp.watch(['src/empty.jade'],['empty-html']);
	gulp.watch(['src/static.jade',jsHtmlSrc],['static-html']);
	gulp.watch(jsSrc,['js']);
});

gulp.task('default',['empty-html','static-html','js']);
