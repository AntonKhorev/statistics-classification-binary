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

		function createOptionInput(optionName) {
			function openClose(inputTag) {
				return $(inputTag).on('input',function(){
					options.code[optionName]=this.value;
					applyCodeOptions();
				});
			}
			function select(){
				return $("<select>").append(options.code[optionName+'AvailableValues'].map(function(optionAvailableValue){
					return $("<option>").val(optionAvailableValue).html(options.i18n('options.code.'+optionName+'.'+optionAvailableValue));
				})).on('change',function(){
					options.code[optionName]=this.value;
					containerNode.find(".code-options [data-option^='"+optionName+".']").show()
						.not("[data-option^='"+optionName+"."+this.value+".']").hide();
					applyCodeOptions();
				});
			}
			if (optionName=='postprocess') {
				return openClose("<textarea spellcheck='false'>");
			} else if (optionName=='split') {
				return select();
			} else if (optionName=='splitRandomSeed') {
				return openClose("<input type='number'>");
			} else if (optionName=='splitRandomRatio' || optionName=='threshold') {
				return openClose("<input type='number' min='0' max='1' step='any'>");
			} else {
				return openClose("<input type='text'>");
			}
		}

		var code=div.find('code');
		code.replaceWith(
			createOptionInput(div.attr('data-option')).attr('id',id).val(code.text())
		);
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
