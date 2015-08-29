var idCounter=0;
function generateId() {
	return 'statistics-classification-binary-id-'+(idCounter++);
}

$('.statistics-classification-binary').each(function(){
	var containerNode=$(this);
	var htmlOptions={
		heading: this.nodeName=='SECTION',
		lang: containerNode.closest('[lang]').attr('lang'),
		storage: containerNode.attr('data-storage'),
	};
	var codeOptions={};
	if (htmlOptions.storage && localStorage[htmlOptions.storage]) {
		codeOptions=JSON.parse(localStorage[htmlOptions.storage]);
	}
	var options=getOptions(htmlOptions,codeOptions);
	containerNode.html(generateHtml(options));

	function applyCodeOptions() {
		containerNode.find('table').replaceWith(generateCodeTable(options));
		if (options.html.storage) {
			localStorage[options.html.storage]=JSON.stringify(options.code);
		}
	}
	containerNode.find('.code-options [data-option]').each(function(){
		// TODO why parsing out stuff when can just regenerate with inputs instead of generateHtml() with static html?
		var div=$(this);
		var id=generateId();
		var label=div.find('.label');
		var labelTitle=label.attr('title');
		var newLabel=$("<label for='"+id+"'>"+label.html()+"</label>");
		if (labelTitle) {
			newLabel.attr('title',labelTitle);
		}
		label.replaceWith(newLabel);

		function createOptionInput(optionName,optionValue) {
			function openClose(inputTagOpen,inputTagClose) {
				return $(inputTagOpen+htmlEncode(optionValue)+inputTagClose).attr('id',id).on('input',function(){ // TODO htmlencode value
					options.code[optionName]=this.value;
					applyCodeOptions();
				})
			}
			if (optionName=='postprocess') {
				return openClose("<textarea spellcheck='false'>","</textarea>");
			} else if (optionName=='split') {
				return $("<select><option>TODO</option></select>");
			} else if (optionName=='splitRandomSeed') {
				return openClose("<input type='number' value='","' />");
			} else if (optionName=='splitRandomRatio' || optionName=='threshold') {
				return openClose("<input type='number' min='0' max='1' step='any' value='","' />");
			} else {
				return openClose("<input type='text' value='","' />");
			}
		}

		var code=div.find('code');
		code.replaceWith(createOptionInput(div.attr('data-option'),code.text()));
	});
	containerNode.find('.code-options').append(
		$("<div class='code-input' />").append(
			$("<button type='button'>"+options.i18n('Reset options')+"</button>").click(function(){
				options.code.reset();
				containerNode.find('.code-options [data-option]').each(function(){
					var div=$(this);
					var optionName=div.attr('data-option');
					div.find('input').each(function(){
						this.value=options.code[optionName];
					});
				});
				applyCodeOptions();
			})
		)
	);
});
