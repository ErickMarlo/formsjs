Package.Register('forms.controls');

forms.controls.CheckboxControl=forms.controls.ValueControl.extend({
	renderField : function(field) {
		var $fld=forms.controls.ControlManagerInstance.renderer.renderCheckbox(field);
		this._super(field,$($fld).find('input'));
		return $fld;
	}
	,setupvaluechange: function(fld){
		var ctx=this;
		fld.$jq.on('change',function(ev){
			ctx.onchange(fld,ev);
		});
	}
	,setval : function(fld,val){
		fld.$jq.prop('checked',val);
		fld.form.onchange(fld);
	}
	,getval : function(fld){
		var val=fld.$jq.prop('checked');
		return val;
	}
});