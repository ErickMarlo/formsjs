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
	,destroy: function(fld){
		this._super(fld);
		if(!fld.items)return ;
		for(var i=0;i<fld.items.length;i++) {
			this.destroy(fld.items[i]);
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
		this.onafterrender(it);
	}
	,scatter : function(fld){
		if(fld.path) {
			var val=fld.form.db.select(fld.path).value();
			fld.val=val;
			if($.isArray(val) && typeof fld.createitem=='function') {
				var ctx=this;
				for(var i=0;i<val.length;i++) {
					var it=fld.createitem(i,val[i]);
					if(!it) continue;
					var dbit=SpahQL.db(it);
					dbit.select('//items/*').map(function(){
						this.select('//id').map(function(){
							if(this.value().indexOf(ctx.indexedseparator)>-1) return ;
							this.replace(''+i+ctx.indexedseparator+this.value());
						});
					});
					this.addItem(fld,it);
				}
			}
		}
	}
	,gather : function(){}
	,onafterrender : function(it){
		this._super(it);
		if(!it.items)return ;
		for(var i=0;i<it.items.length;i++) {
			var fld=it.items[i];
			var ci=forms.controls.ControlManagerInstance.idx[fld.type];
			if(ci) {
				ci.onafterrender(fld);
			}
		}
	}
	,validate: function(fld,res){
		fld.validate(res);
		if(!fld.items) {
			return ;
		}
		for(var i=0;i<fld.length;i++) {
			this.validate(fld[i],res);
		}
	}
});