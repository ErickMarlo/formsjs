Package.Register('forms.controls');

forms.controls.TextControl=forms.controls.BaseControl.extend({
	renderField : function(field) {
		var $fld=forms.controls.ControlManagerInstance.renderer.renderTextField(field);
		this._super(field,$($fld).find('input'));
		return $fld;
	}
	,setupvaluechange: function(fld){
		fld.$jq.on('keypress change',function(ev){debugger;
			if(fld.change) fld.change(ev);
			fld.form.change(fld,ev);
		});
	}
});