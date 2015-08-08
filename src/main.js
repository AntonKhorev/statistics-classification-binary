$('.statistics-classification-binary').each(function(){
	var containerNode=$(this);
	var htmlOptions={
		heading: this.nodeName=='SECTION',
		lang: containerNode.closest('[lang]').attr('lang'),
		storage: containerNode.attr('data-storage'),
	};
	var codeOptions=htmlOptions.storage&&JSON.parse(localStorage[htmlOptions.storage]);
	var options=getOptions(htmlOptions,codeOptions);
	containerNode.html(generateHtml(options));
	containerNode.find('[data-option]').each(function(){
		// TODO why parsing out stuff when can just regenerate with inputs instead of generateHtml() with static html?
		var div=$(this);
		var optionName=div.attr('data-option');
		var code=div.find('code');
		var optionValue=code.text();
		code.replaceWith(
			$("<input type='text' value='"+optionValue+"' />").on('input',function(){
				options.code[optionName]=this.value;
				containerNode.find('table code pre').html(generateCode(options));
				if (htmlOptions.storage) {
					localStorage[htmlOptions.storage]=JSON.stringify(options.code);
				}
			})
		);
		div.wrapInner("<label>");
	});
});
