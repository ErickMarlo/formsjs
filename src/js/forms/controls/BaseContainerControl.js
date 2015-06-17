Package.Register('forms.controls');

forms.controls.BaseContainerControl=forms.controls.BaseControl.extend({
	renderField : function(field,rendfn) {
		var ctx=this;
		this.checkId(field);
		this.checkParentPath(field);
		var $cont=rendfn(field);
		field.$jq=$cont;
		field.addItem = function(it){
			ctx.addItem(field,it);
		};
		if(!field.items) return $cont;
		for(var i=0;i<field.items.length;i++) {
			var fld=field.items[i];
			fld.index=i;
			var $fld=forms.controls.ControlManagerInstance.renderer.renderField(fld);
			$cont.append($fld);
		}
		return $cont;
	}
	,preprocess : function(fld,parent){
		this._super(fld,parent);
		if(!fld.items)return;
		for(var i=0;i<fld.items.length;i++) {
			this.preprocess(fld.items[i],fld);
		}
	}
	,addItem : function(field,it){
		var ci=forms.controls.ControlManagerInstance.idx[it.type];
		ci.preprocess(it,field);
		var $rend=ci.controlManager.renderer.renderField(it);
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
			if($.isArray(val) && typeof fld.addItem=='function') {
				for(var i=0;i<val.length;i++) {
					var it=fld.createItem(i,val[i]);
					var dbit=SpahQL.db(it);
					dbit.select('//id').map(function(){
						this.replace(''+i+'.'+this.value());
					});
					this.addItem(fld,it);
				}
			}
		}
	}
	,gather : function(){}
});