Package.Register('forms.controls');

forms.controls.MessageControl=forms.controls.BaseControl.extend({
	renderField : function(field) {
		var $fld=forms.controls.ControlManagerInstance.renderer.renderMessage(field);
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
	,show : function(fld,type,msgs) {
		forms.controls.ControlManagerInstance.renderer.changeAlertType(fld,type);
		for (var i = 0, max = msgs.length; i < max; i++) {
			var msg=$('<div></div>').html(msgs[i]);//<a href="#" class="alert-link">Alert Link</a>
			fld.$jq.append(msg);
		}
		fld.$jq.show();
	}
	,setval : function(fld,val){
	}
	,getval : function(fld){
	}
});