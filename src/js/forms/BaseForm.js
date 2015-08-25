Package.Register('forms');

forms.BaseForm=Class.extend({
	items : null
	,db : null
	,rendererImpl : null
	,validationViewer: null
	,$jq : null
	,idx : {
		byid : {}
	}
	,refmap: {}
	,init : function(){
		this.rendererImpl=eval('new forms.renderer.'+this.renderer+'Renderer()');
		if(this.validationViewer) this.validationViewer=eval('new forms.valid.'+this.validationViewer+'View()');
		this.preprocess();
		this.itemsdb=SpahQL.db(this.items);
	}
	,render : function(sel){
		var rimp=this.rendererImpl;
		var $rnd=rimp.renderitems(this);
		var $frm=rimp.renderForm(this);
		$frm.hide();
		this.$jq=$frm.append($rnd);
		$(sel).append(this.$jq);
		this.onafterrender(this);
	}
	,onchange: function(fld,ev){
		this.notifyrefs(fld,ev);
	}
	,notifyrefs: function(fld,ev){
		var lst=this.refmap[fld.id];
		if(!lst) return ;
		for(var i=0;i<lst.length;i++) {
			var dst=lst[i];
			var v=fld.val();
			if(ev && ev.type=='keypress') v+=String.fromCharCode(ev.charCode);
			dst.val(v);
		}
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
		if(ci.gather) {
			ci.gather(fld);
		}
		if(!fld.items) {
			return ;
		}
		for(var i=0;i<fld.items.length;i++) {
			this.gatherField(fld.items[i]);
		}
	}
	,scatterField : function(fld){
		var ci=forms.controls.ControlManagerInstance.idx[fld.type];
		if(ci.scatter) {
			ci.scatter(fld);
		}
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
		var ctx=this;
		return {result:result,count:result.length,show: function(){
				ctx.validationViewer.show(ctx,result);
		},clear: function(){
			ctx.validationViewer.clear(ctx);
		},unmarkcontainers: function() {
			ctx.validationViewer.unmarkcontainers(ctx);	
		},markcontainers: function() {
			ctx.validationViewer.markcontainers(ctx,result);	
		},showsummary: function(fldid,title) {
			ctx.validationViewer.showsummary(ctx,fldid,result,title);
		}};
	}
});