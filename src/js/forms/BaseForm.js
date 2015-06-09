Package.Register('forms');

forms.BaseForm=Class.extend({
	items : null
	,db : null
	,rendererImpl : null
	,$jq : null
	,idx : {
		byid : {}
	}
	,init : function(){
		this.rendererImpl=eval('new forms.renderer.'+this.renderer+'Renderer()');
		this.itemsdb=SpahQL.db(this.items);
	}
	,render : function(sel){
		this.$jq=this.rendererImpl.renderitems(this);
		$(sel).append(this.$jq);
		this.onafterrender(this);
	}
	,onafterrender : function(it){
		for(var i=0;i<this.items.length;i++) {
			this.onafterrenderfield(this.items[i]);
		}
	}
	,onafterrenderfield : function(fld){
		var ci=forms.controls.ControlManagerInstance.idx[fld.type];
		if(!ci)return ;
		ci.onafterrenderfield(fld);
		if(!fld.items)return ;
		for(var i=0;i<fld.items.length;i++) {
			this.onafterrenderfield(fld.items[i]);
		}
	}
	,initDb : function(json){
		if(!this.db) {
			if(!json) json={};
			this.db=SpahQL.db(json);
		}
	}
	,scatter : function(json){
		this.initDb(json);
		for(var i=0;i<this.items.length;i++) {
			this.scatterField(this.items[i]);
		}
	}
	,gather : function(){
		this.initDb();
		for(var i=0;i<this.items.length;i++) {
			this.gatherField(this.items[i]);
		}
	}
	,gatherField : function(fld){
		var ci=forms.controls.ControlManagerInstance.idx[fld.type];
		if(!ci)return ;
		ci.gather(fld);
		if(!fld.items) {
			return ;
		}
		for(var i=0;i<fld.items.length;i++) {
			this.gatherField(fld.items[i]);
		}
	}
	,scatterField : function(fld){
		var ci=forms.controls.ControlManagerInstance.idx[fld.type];
		if(!ci)return ;
		ci.scatter(fld);
		if(!fld.items) {
			return ;
		}
		for(var i=0;i<fld.items.length;i++) {
			this.scatterField(fld.items[i]);
		}
	}
});