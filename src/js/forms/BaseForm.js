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
		this.preprocess();
		this.itemsdb=SpahQL.db(this.items);
	}
	,render : function(sel){
		var $rnd=this.rendererImpl.renderitems(this);
		this.$jq=$('<form class="horizontal"></form>').append($rnd);
		$(sel).append(this.$jq);
		this.onafterrender(this);
	}
	,onafterrender : function(it){
		for(var i=0;i<it.items.length;i++) {
			var fld=it.items[i];
			var ci=forms.controls.ControlManagerInstance.idx[fld.type];
			if(!ci)return ;
			ci.onafterrender(fld);
		}
	}
	,preprocess : function(){
		for(var i=0;i<this.items.length;i++) {
			this.preprocessfield(this.items[i]);
		}
	}
	,preprocessfield : function(fld,parent){
		fld.form=this;
		var ci=forms.controls.ControlManagerInstance.idx[fld.type];
		ci.preprocess(fld,parent);
	}
	,destroy: function(){
		for(var i=0;i<this.items.length;i++) {
			var it=this.items[i];
			var ci=forms.controls.ControlManagerInstance.idx[it.type];
			ci.destroy(it);
		}
		this.$jq.remove();
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
	,show: function(visi){
		if(visi) {
			this.$jq.show();
		} else {
			this.$jq.hide();
		}
	}
	,validate: function(){
		var result=[];
		for(var i=0;i<this.items.length;i++) {
			var ci=forms.controls.ControlManagerInstance.idx[this.items[i].type];
			var fld=this.items[i];
			var res=ci.validate(fld);
			result=result.concat(res);
		}
		return result;
	}
});