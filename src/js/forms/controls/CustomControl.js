Package.Register('forms.controls');

forms.controls.CustomControl=forms.controls.BaseControl.extend({
	renderField : function(field) {
		return this._super(field,$('<div></div>'));
	}
	,setVal : function(fld,val){
	}
	,getVal : function(fld){
	}
});