Package.Register('forms');

forms.Application=Class.extend({
	forms: []
	,defidx: {}
	,idx: {}
	,rootUrl : null
	,selector : null
	,init: function(params){
		$.extend(this,params);
	}
	,addItem: function(formid){
		
	}
	,loadform: function(claz,params,callback){
		var ctx=this;
		var frmpath=(this.rootUrl?this.rootUrl:'')+claz.replace(/\./g, '/');
		$.ajax({
			 url: frmpath
			,type: 'POST'
			,data: params
			,dataType: 'script'
			,success: function(scr){
				ctx.defidx[claz]=eval(scr);
				if(callback) callback.call(ctx);
			}
		});
	}
	,showform: function(parent,claz,params){
		if(typeof claz=='object') {
			var frm=new (claz)(params);
			this.defidx[frm.id]=claz;
			frm.render(this.selector);
			this.forms.push(frm);
			this.idx[frm.id]=frm;
			return ;
		}
		var def=this.defidx[claz];
		if(!def) {
			this.loadform(claz,params,function(){
				def=this.defidx[claz];
				var frm=new (def)(params);
				
			});
		}
	}
});