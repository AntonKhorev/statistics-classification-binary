QUnit.test('no heading',function(assert){
	$('#qunit-fixture').html(generateHtml());
	assert.equal($('#qunit-fixture').find('h1').length,0);
	assert.equal($('#qunit-fixture').find('h2').length,0);
});
QUnit.test('h1 heading',function(assert){
	$('#qunit-fixture').html(generateHtml({heading:true}));
	assert.equal($('#qunit-fixture').find('h1').length,1);
	assert.equal($('#qunit-fixture').find('h2').length,0);
});
QUnit.test('h2 heading',function(assert){
	$('#qunit-fixture').html(generateHtml({heading:'h2'}));
	assert.equal($('#qunit-fixture').find('h1').length,0);
	assert.equal($('#qunit-fixture').find('h2').length,1);
});
QUnit.test('default lang',function(assert){
	$('#qunit-fixture').html(generateHtml({heading:true}));
	assert.equal($('#qunit-fixture').find('h1').text(),'Binary classification');
});
QUnit.test('lang ru',function(assert){
	$('#qunit-fixture').html(generateHtml({heading:true,lang:'ru'}));
	assert.equal($('#qunit-fixture').find('h1').text(),'Бинарная классификация');
});
