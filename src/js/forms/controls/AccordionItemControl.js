Package.Register('forms.controls');

forms.controls.AccordionItemControl=forms.controls.BaseContainerControl.extend({
	renderField : function(fld) {
		var rend=forms.controls.ControlManagerInstance.renderer;
		var $head=rend.renderAccordionItemHead(fld);
		var $content=rend.renderAccordionItemContent(fld);
		var $body=this._super(fld,rend.renderAccordionItemBody);
		return $($('<div></div>').append($head,$content.append($body)).html());
	}
});