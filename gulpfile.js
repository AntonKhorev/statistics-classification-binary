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
var langCodes=['en','ru'];
var templateCodes=['empty','static'];
var langData={
	'en':{
		name: 'English',
		templateData: {
			'empty': 'Javascript only',
			'static': 'Static HTML',
		},
		pageTitle: 'Binary classification',
		jsStub: 'javascript disabled',
	},
	'ru':{
		name: 'Русский',
		templateData: {
			'empty': 'Только javascript',
			'static': 'Статический HTML',
		},
		pageTitle: 'Бинарная классификация',
		jsStub: 'javascript отключен',
	},
};

langCodes.forEach(function(lang){
	templateCodes.forEach(function(template){
		gulp.task(lang+'-'+template+'-html',function(){
			var ld=langData[lang];
			var ctx={
				pageLang: lang,
				pagesLangs: langCodes.map(function(l){
					return {
						code: l,
						name: langData[l].name,
					};
				}),
				pageTemplate: template,
				pagesTemplates: templateCodes.map(function(t){
					return {
						code: t,
						name: ld.templateData[t],
					};
				}),
				pageTitle: ld.pageTitle,
				jsStub: ld.jsStub,
			};
			if (template=='static') {
				jsHtmlSrc.forEach(function(src){
					vm.runInNewContext(fs.readFileSync(src),ctx);
				});
			}
			gulp.src('src/'+template+'.jade')
				.pipe(plumber())
				.pipe(rename({
					basename: 'index'
				}))
				.pipe(jade({
					locals: ctx
				}))
				.pipe(gulp.dest(destination+'/'+lang+'/'+template));
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
	gulp.watch(['src/index.jade','src/empty.jade'],['en-empty-html','ru-empty-html']);
	gulp.watch(['src/index.jade','src/static.jade',jsHtmlSrc],['en-static-html','ru-static-html']);
	gulp.watch(jsSrc,['lib-js']);
});

gulp.task('default',['en-empty-html','ru-empty-html','en-static-html','ru-static-html','lib-js']);
