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
		containerNode.find('table code pre').html(generateCode(options));
		if (options.html.storage) {
			localStorage[options.html.storage]=JSON.stringify(options.code);
		}
	}
	containerNode.find('.code-options [data-option]').each(function(){
		// TODO why parsing out stuff when can just regenerate with inputs instead of generateHtml() with static html?
		var div=$(this);
		var id=generateId();
		var label=div.find('.label');
		label.replaceWith("<label for='"+id+"'>"+label.html()+"</label>");
		var optionName=div.attr('data-option');
		var code=div.find('code');
		var optionValue=code.text();
		code.replaceWith(
			$("<input type='text' id='"+id+"' value='"+optionValue+"' />").on('input',function(){
				options.code[optionName]=this.value;
				applyCodeOptions();
			})
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
