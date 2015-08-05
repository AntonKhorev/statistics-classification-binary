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

['en','ru'].forEach(function(lang){
	var ctxs={
		'en':{
			pageLang: 'en',
			pageTitle: 'Binary classification',
			jsStub: 'javascript disabled',
		},
		'ru':{
			pageLang: 'ru',
			pageTitle: 'Бинарная классификация',
			jsStub: 'javascript отключен',
		},
	};
	['empty','static'].forEach(function(template){
		gulp.task(lang+'-'+template+'-html',function(){
			var ctx=ctxs[lang];
			if (template=='static') {
				jsHtmlSrc.forEach(function(src){
					vm.runInNewContext(fs.readFileSync(src),ctx);
				});
			}
			gulp.src('src/'+template+'.jade')
				.pipe(plumber())
				.pipe(rename({
					dirname: lang+'/'+template,
					basename: 'index',
				}))
				.pipe(jade({
					locals: ctx
				}))
				.pipe(gulp.dest(destination));
		});
	});
});

gulp.task('lib-js',function(){
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
	gulp.watch(['src/empty.jade'],['en-empty-html','ru-empty-html']);
	gulp.watch(['src/static.jade',jsHtmlSrc],['en-static-html','ru-static-html']);
	gulp.watch(jsSrc,['lib-js']);
});

gulp.task('default',['en-empty-html','ru-empty-html','en-static-html','ru-static-html','lib-js']);
