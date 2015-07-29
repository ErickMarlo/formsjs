Package.Register('forms.controls');

forms.controls.TextareaControl=forms.controls.ValueControl.extend({
	renderField : function(field) {
		var $fld=forms.controls.ControlManagerInstance.renderer.renderTextareaField(field);
		this._super(field,$($fld).find('textarea'));
		return $fld;
	}
	,setupvaluechange: function(fld){
		fld.$jq.on('keyup blur',function(ev){
			if(fld.onchange) fld.onchange(ev);
			fld.form.onchange(fld,ev);
		});
	}
});