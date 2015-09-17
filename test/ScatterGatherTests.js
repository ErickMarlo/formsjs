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
	
});
