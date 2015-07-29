Package.Register('forms.controls');

forms.controls.TextControl=forms.controls.ValueControl.extend({
	renderField : function(field) {
		var $fld=forms.controls.ControlManagerInstance.renderer.renderTextField(field);
		this._super(field,$($fld).find('input'));
		return $fld;
	}
	,setupvaluechange: function(fld){
		var ctx=this;
		fld.$jq.on('keyup blur',function(ev){
			ctx.onchange(fld,ev);
		});
	}
});