Package.Register('forms.controls');

forms.controls.ColumnControl=forms.controls.BaseContainerControl.extend({
	renderField : function(field) {
		return this._super(field,forms.controls.ControlManagerInstance.renderer.renderColumn);
	}
});