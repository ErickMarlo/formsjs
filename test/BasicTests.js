describe("Basic tests suite", function() {
	afterEach(function(){
		tests.getapp().destroyforms();
	});
	
	it("Require renderer property", function() {
		var app=tests.getapp();
		var frm=forms.BaseForm.extend({
			id: 'testform'
		});
		expect(function(){app.createform(frm);}).toThrow('No renderer defined in the form. Define renderer property, for ex.: renderer:"Bootstrap"');
	}); 

	it("Require items:[] property", function() {
		var app=tests.getapp();
		var frm=forms.BaseForm.extend({
			id: 'testform'
			,renderer: 'Bootstrap'
		});
		expect(function(){app.createform(frm);}).toThrow('No items defined in the form. Define items : []');
	}); 

	it("Happy minimal form", function() {
		var app=tests.getapp();
		var frm=forms.BaseForm.extend({ 
			id: 'testform'
			,renderer: 'Bootstrap'
			,items : []
		});
		expect(function(){app.createform(frm);}).not.toThrow();
		expect(function(){app.showform('testform');}).not.toThrow();
	}); 

	it("Form items definition minimum fails", function() {
		var app=tests.getapp();
		var frm=forms.BaseForm.extend({ 
			id: 'testform'
			,renderer: 'Bootstrap'
			,items : [
				{id : 'name'}
			]
		});
		expect(function(){app.createform(frm);}).toThrow('Field type is required.');
	}); 

	it("Form items definition minimum success", function() {
		var app=tests.getapp();
		var frm=forms.BaseForm.extend({ 
			id: 'testform'
			,renderer: 'Bootstrap'
			,items : [
				{id : 'name', type: 'Text'}
			]
		});
		expect(function(){app.createform(frm);}).not.toThrow();
	}); 


});
