Package.Register('forms.controls');

forms.controls.SelectControl=forms.controls.BaseControl.extend({
	renderField : function(fld) {
		var $fld=forms.controls.ControlManagerInstance.renderer.renderSelectField(fld);
		var select=$($fld).find('select');
		this._super(fld,select);
		
		return $fld;
	}
});