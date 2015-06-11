Package.Register('forms.controls');

forms.controls.AccordionControl=forms.controls.BaseContainerControl.extend({
//	_superContentFn : null
	renderField : function(fld) {
//		this._superContentFn=this._super;
		this.checkId(fld);
		var rend=forms.controls.ControlManagerInstance.renderer;
		var $root=rend.renderAccordionRoot(fld);
		var $itroot=this._super(fld,rend.renderAccordionItemRoot);
//		for(var i=0;i<fld.items.length;i++) {
//			var acit=fld.items[i];
//			this._addItem(fld,tab,$itroot,i==0);
//			this._super(acit);
//		}
		return $root.append($itroot);
//		var ctx=this;
//		fld.addItem = function(it){
//			ctx.addItem(fld,it,$th,$tb);
//		};
//		return $root;
	}
	,_addItem : function(fld,tab,$itroot,active){
		var rend=forms.controls.ControlManagerInstance.renderer;
		this.checkId(tab);
		tab.parent=fld;
		this.checkParentPath(tab);
		tab.form=fld.form;
		var $tabcontent=this._superContentFn(tab,function(){return $tc;});
		$itroot.append($tabcontent);
	}
	,addItem : function(fld,tab,$itroot,active){
		this._addItem(fld,tab,$itroot,active);
		if(!fld.items) {
			fld.items=[];
		}
		fld.items.push(tab);
	}
});