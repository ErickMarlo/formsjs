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
			if(fld.target=='body') {
				$cont.append($fld);
			} else {
				$cont.find('[_target="'+fld.target+'"]').append($fld);
			}
		}
		return $cont;
	}
	,preprocess : function(fld,parent){
		this._super(fld,parent);
		if(!fld.items) return ;
		for(var i=0;i<fld.items.length;i++) {
			var ci=forms.controls.ControlManagerInstance.idx[fld.items[i].type];
			ci.preprocess(fld.items[i],fld);
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
		var ctx=this;
		if(!field.items) {
			field.items=[];
		}
		field.items.push(it);
		var dbit=SpahQL.db(it);
		dbit.select('//items/*').map(function(){//Select before preprocess, otherwise will get endless loop
			this.select('//id').map(function(){
				if(this.value().indexOf(ctx.indexedseparator)>-1) return ;
				this.replace(''+(field.items.length-1)+ctx.indexedseparator+this.value());
			});
		});
		var ci=forms.controls.ControlManagerInstance.idx[it.type];
		ci.preprocess(it,field);
		var $rend=ci.controlManager.renderer.renderField(it);
		field.$jq.append($rend);
		this.onafterrender(it);
	}
	,scatter : function(fld){
		if(fld.path) {
			var val=fld.form.db.select(fld.path).value();
			fld.val=val;
			if($.isArray(val) && typeof fld.createitem=='function') {
				for(var i=0;i<val.length;i++) {
					var it=fld.createitem(i,val[i]);
					if(!it) continue;
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
	,validate: function(fld){
		var res=this._super(fld);
		if(!fld.items) {
			return res;
		}
		var res=[];
		for(var i=0;i<fld.items.length;i++) {
			var res1=this.validate(fld.items[i],res);
			res=res.concat(res1);
		}
		return res;
	}
});