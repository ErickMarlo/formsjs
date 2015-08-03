Package.Register('forms.controls');

forms.controls.SelectControl=forms.controls.BaseListControl.extend({
	_renderListField : function(fld) {
		return forms.controls.ControlManagerInstance.renderer.renderSelectField(fld);
	}
	,_findListControl : function($fld) {
		return $($fld).find('select');
	}
	,_createGroup : function(opt) {
		return $('<optgroup label="'+opt.text+'"></optgroup>');
	}
	,_createItem : function(opt) {
		return $('<option value="'+opt.value+'">'+opt.text+'</option>');
	}
});