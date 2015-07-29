var gulp=require('gulp');
var plumber=require('gulp-plumber');
var jade=require('gulp-jade');
var sourcemaps=require('gulp-sourcemaps');
var concat=require('gulp-concat');
var uglify=require('gulp-uglify');
var fs=require('fs');
var vm=require('vm');

var jsSrc=[
	'src/intro.js',
	'src/html.js',
	'src/main.js',
	'src/outro.js'
];
var jsHtmlSrc=[
	'src/html.js'
];

gulp.task('empty-html',function(){
	gulp.src('src/empty.jade')
		.pipe(plumber())
		.pipe(jade())
		.pipe(gulp.dest('public_html/empty'));
});

gulp.task('static-html',function(){
	var ctx={};
	jsHtmlSrc.forEach(function(src){
		vm.runInNewContext(fs.readFileSync(src),ctx);
	});
	gulp.src('src/static.jade')
		.pipe(plumber())
		.pipe(jade({
			locals: ctx
		}))
		.pipe(gulp.dest('public_html/static'));
});

gulp.task('js',function(){
	gulp.src(jsSrc)
		.pipe(plumber())
		.pipe(sourcemaps.init())
		.pipe(concat('index.js'))
		.pipe(uglify())
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('public_html/lib'));
});

gulp.task('watch',function(){
	gulp.watch(['src/empty.jade'],['empty-html']);
	gulp.watch(['src/static.jade',jsHtmlSrc],['static-html']);
	gulp.watch(jsSrc,['js']);
});

gulp.task('default',['empty-html','static-html','js']);
