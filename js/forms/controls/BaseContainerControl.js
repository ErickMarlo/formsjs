Package.Register('forms.controls');

forms.controls.BaseContainerControl=forms.controls.BaseControl.extend({
	renderField : function(field,rendfn) {
		this.checkId(field);
		if(!field.items) return;
		var $cont=rendfn(field);
		field.$jq=$cont;
		for(var i=0;i<field.items.length;i++) {
			var fld=field.items[i];
			fld.parent=field;
			this.checkParentPath(fld);
			var $fld=forms.controls.ControlManagerInstance.renderer.renderField(fld);
			$cont.append($fld);
		}
		this.checkParentPath(field);
		var ctx=this;
		field.addItem = function(it){
			ctx.addItem(field,it);
		};
		return $cont;
	}
	,addItem : function(field,it){
		it.parent=field;
		this.checkParentPath(it);
		var $rend=forms.controls.ControlManagerInstance.renderer.renderField(it);
		field.$jq.append($rend);
		if(!field.items) {
			field.items=[];
		}
		field.items.push(it);		
	}
	,scatter : function(fld){
		if(fld.path) {
			var val=fld.form.db.select(fld.path).value();
			fld.val=val;
		}
	}
	,gather : function(){}
});