var gulp=require('gulp');
var plumber=require('gulp-plumber');
var jade=require('gulp-jade');
var sourcemaps=require('gulp-sourcemaps');
var concat=require('gulp-concat');
var uglify=require('gulp-uglify');
var fs=require('fs');
var vm=require('vm');

var htmlSrc='src/index.jade';
var jsSrc=[
	'src/intro.js',
	'src/html.js',
	'src/main.js',
	'src/outro.js'
];
var jsHtmlSrc=[
	'src/html.js'
];

gulp.task('html',function(){
	var ctx={};
	jsHtmlSrc.forEach(function(src){
		vm.runInNewContext(fs.readFileSync(src),ctx);
	});
	gulp.src(htmlSrc)
		.pipe(plumber())
		.pipe(jade({
			locals: ctx
		}))
		.pipe(gulp.dest('public_html'));
});

gulp.task('js',function(){
	gulp.src(jsSrc)
		.pipe(plumber())
		.pipe(sourcemaps.init())
		.pipe(concat('index.js'))
		.pipe(uglify())
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('public_html'));
});

gulp.task('watch',function(){
	gulp.watch([htmlSrc,jsHtmlSrc],['html']);
	gulp.watch(jsSrc,['js']);
});

gulp.task('default',['html','js']);
