describe("Scatter/gather test suite", function() {
	afterEach(function(){
		tests.getapp().destroyforms();
	});
	
	it("Simple", function() {
		var app=tests.getapp();
		var frm=forms.BaseForm.extend({
			id : 'testform'
			,renderer : 'Bootstrap'
			,items : [
				{id: 'id', type: 'Text'}
				,{id: 'name', type: 'Text'}
			]
		});
		app.createform(frm);
		app.showform('testform');
		var ofrm=app.forms.testform;
		var json={
			id : '1'
			,name : 'testname'
		};
		ofrm.scatter(json);
		ofrm.idx.byid.name.$jq.val('testname1');
		ofrm.gather();
		expect(json.name).toEqual('testname1');
		expect(json.name).toEqual(ofrm.db.value().name);
	});
	
	it('Nested subpaths',function(){
		var app=tests.getapp();
		var frm=forms.BaseForm.extend({
			id : 'testform'
			,renderer : 'Bootstrap'
			,items : [
				{type : 'Row', items: [
						{type : 'Column', path : '/address', items : [
							{id: 'street', type: 'Text'}
							,{id: 'building', type: 'Text'}						
						]}
				]}
				,{type : 'Row', items: [
						{type : 'Column', path : '/office', items : [
							{id: 'id', type: 'Text'}
							,{id: 'name', type: 'Text'}						
						]}
				]}
			]
		});
		app.createform(frm);
		app.showform('testform');
		var ofrm=app.forms.testform;
		var json={
			address : {
				street : 'Vilniaus st.'
				,building : 10
			}
			,office : {
				id : 1
				,name : 'Big shock Ltd.'
			}
		};
		ofrm.scatter(json);
		ofrm.idx.byid.street.$jq.val('Jono st.');
		ofrm.idx.byid.building.$jq.val('1');
		ofrm.idx.byid.name.$jq.val('Big shock LTD.');
		ofrm.gather();
		expect(json.address.street).toEqual('Jono st.');
		expect(json.address.building).toEqual('1');
		expect(json.office.id).toEqual('1');
		expect(json.office.name).toEqual('Big shock LTD.');
	});
	
	it('JSON path node optional',function(){
		var app=tests.getapp();
		var frm=forms.BaseForm.extend({
			id : 'testform'
			,renderer : 'Bootstrap'
			,items : [
				{id: 'street', type: 'Text'}
				,{id: 'building', type: 'Text'}						
			]
		});
		app.createform(frm);
		app.showform('testform');
		var ofrm=app.forms.testform;
		var json={
			street : 'Vilniaus st.'
		};
		ofrm.scatter(json);
		ofrm.gather();
		expect(json.street).toEqual('Vilniaus st.');
		expect(json.building).toEqual(''); 
	});
	
	it('JSON path node optional. SpahQL value.replace failure',function(){
		var app=tests.getapp();
		var frm=forms.BaseForm.extend({
			id : 'testform'
			,renderer : 'Bootstrap'
			,items : [
				{type : 'Row', items: [
						{type : 'Column', path : '/address', items : [
							{id: 'street', type: 'Text'}
							,{id: 'building', type: 'Text'}
						]}
				]}
				,{type : 'Row', items: [
						{type : 'Column', path : '/office', items : [
							{id: 'id', type: 'Text'}
							,{id: 'name', type: 'Text'}
						]}
				]}
			]
		});
		app.createform(frm);
		app.showform('testform');
		var ofrm=app.forms.testform;
		var json={
			address : {
				street : 'Vilniaus st.'
			}
			,office : {
				id : 1
				,name : 'Big shock Ltd.'
			}
		};
		ofrm.scatter(json);
		ofrm.idx.byid.street.$jq.val('Jono st.');
		ofrm.idx.byid.building.$jq.val('1');
		ofrm.idx.byid.name.$jq.val('Big shock LTD.');
		ofrm.gather();
		expect(json.address.street).toEqual('Jono st.');
		expect(json.address.building).toEqual('1');
		expect(json.office.id).toEqual('1');
		expect(json.office.name).toEqual('Big shock LTD.');
	});
	
	it('Scatter gather lists',function(){
		var app=tests.getapp();
		var createitemfn=function(i,o){
			return {
				type : 'AccordionItem'
				,items : [
					{type : 'Text' , id : 'name'}
				]
			};
		};
		var frm=forms.BaseForm.extend({
			id : 'testform'
			,renderer : 'Bootstrap'
			,items : [
				{type : 'Accordion', id : 'names', path : '/namelist' , createitem : createitemfn}
			]
		});
		app.createform(frm);
		app.showform('testform');
		var json={
			namelist : [
				{name : 'John'}
				,{name : 'Paul'}
				,{name : 'Albert'}
			]
		};
		var ofrm=app.forms.testform;
		ofrm.scatter(json);
		ofrm.idx.byid.names.items[0].items[0].$jq.val('Robert');
		ofrm.gather();
		expect(json.namelist[0].name).toEqual('Robert');
		expect(json.namelist.length).toEqual(3);
		ofrm.idx.byid.names.addItem(createitemfn());
		ofrm.idx.byid.names.items[3].items[0].$jq.val('John');
		ofrm.gather();
		expect(json.namelist[3].name).toEqual('John');
		expect(json.namelist.length).toEqual(4);
	});
	
});
