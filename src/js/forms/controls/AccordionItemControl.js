Package.Register('forms.controls');

forms.controls.AccordionItemControl=forms.controls.BaseContainerControl.extend({
	renderField : function(fld) {
		var rend=forms.controls.ControlManagerInstance.renderer;
		var $body=this._super(fld,rend.renderAccordionItemBody);
		var $head=rend.renderAccordionItemHead(fld);
		var $content=rend.renderAccordionItemContent(fld);
		fld.updatelabel=function(label) {
			$head.find('[_target="label"]').html(label);
		};
		return $($('<div></div>').append($head,$content.append($body)).children());
	}
});