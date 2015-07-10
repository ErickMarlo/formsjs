Package.Register('forms.controls');

forms.controls.TabsControl=forms.controls.BaseContainerControl.extend({
	_superContentFn : null
	,renderField : function(fld) {
		this._superContentFn=this._super;
		this.checkId(fld);
		var rend=forms.controls.ControlManagerInstance.renderer;
		var $root=rend.renderTabsRoot(fld);
		var $th=rend.renderTabsHead(fld);
		var $tb=rend.renderTabsBody(fld);
		fld.$jq=$tb;
		for(var i=0;i<fld.items.length;i++) {
			var tab=fld.items[i];
			this._addItem(fld,tab,$th,$tb,i==0);
		}
		$root.append($th,$tb);
		var ctx=this;
		fld.addItem = function(it){
			ctx.addItem(fld,it,$th,$tb);
		};
		return $root;
	}
	,_addItem : function(fld,tab,$th,$tb,active){
		var rend=forms.controls.ControlManagerInstance.renderer;
		var $tt=rend.renderTabTitle(tab,active);
		$th.append($tt);
		var $tc=rend.renderTabContent(tab,active);
		$tb.append($tc);
		var $tabcontent=this._superContentFn(tab,function(){return $tc;});
		$tc.append($tabcontent);
	}
	,addItem : function(fld,tab,$th,$tb){
		this._addItem(fld,tab,$th,$tb);
		if(!fld.items) {
			fld.items=[];
		}
		fld.items.push(tab);
	}
});