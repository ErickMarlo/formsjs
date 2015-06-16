Package.Register('forms.controls');

forms.controls.BreadcrumbControl=forms.controls.BaseContainerControl.extend({
	renderField : function(field) {
		return this._super(field,forms.controls.ControlManagerInstance.renderer.renderBreadcrumbContainer);
	}
});