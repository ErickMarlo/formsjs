Package.Register('forms.controls');

forms.controls.MessageControl=forms.controls.BaseControl.extend({
	renderField : function(field) {
		var $fld=$('<div></div>');
		$fld.hide();
		this._super(field,$fld);
		var ctx=this;
		field.show=function(type,messages) {
			ctx.show(field,type,messages);
		};
		field.hide=function(){
			ctx.hide(field);
		};
		field.clear=function(){
			ctx.clear(field);
		};
		return $fld;
	}
	,hide : function(fld) {
		fld.$jq.hide();
	}
	,clear : function(fld) {
		fld.$jq.find('div').remove();
	}
	,show : function(fld,type,smsg) {
		var rend=forms.controls.ControlManagerInstance.renderer;
		rend.changeAlertType(fld,type);
		var ico=rend.renderMessageIcon(type);
		var msg=$('<div></div>').append(ico,smsg);//<a href="#" class="alert-link">Alert Link</a>
		var $m=forms.controls.ControlManagerInstance.renderer.renderMessage(fld);
		fld.$jq.append($m.append(msg));
		fld.$jq.show();
	}
});