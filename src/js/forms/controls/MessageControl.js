Package.Register('forms.controls');

forms.controls.MessageControl=forms.controls.BaseControl.extend({
	renderField : function(field) {
		var $fld=$('<div></div>');
		$fld.hide();
		this._super(field,$fld);
		var ctx=this;
		field.show=function(messages,kind,title) {
			ctx.show(field,messages,kind,title);
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
	,show : function(fld,smsg,kind,title) {
		if(kind)fld.kind=kind;
		if(!fld.kind)fld.kind='success';
		fld.title=title;
		var rend=forms.controls.ControlManagerInstance.renderer;
//		rend.changeAlertType(fld,type);
		var ico=rend.renderMessageIcon(fld);
		var icotd=$('<td style="vertical-align:top;"></td>').append(ico);
		var msgtd=$('<td></td>').append(smsg);
		var tr=$('<tr></tr>').append(icotd,msgtd);
		var tbl=$('<table></table>').append(tr);
		var msg=tbl;
		var $m=forms.controls.ControlManagerInstance.renderer.renderMessage(fld);
		fld.$jq.html('');
		fld.$jq.append($m.append(msg));
		fld.$jq.show();
	}
});