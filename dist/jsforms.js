Package.Register('forms.controls');

forms.controls.BaseControl=Class.extend({
	controlManager : null
	,indexedseparator : '___'
	,init : function(controlManager){
		this.controlManager=controlManager;
	}
	,preprocess : function(fld,parent){
		if(!fld.form) fld.form=parent.form;
		if(!fld.target) fld.target='body';
		this.checkId(fld);
		fld.parent=parent;
		this.checkParentPath(fld);
		if(fld.form.idx.byid[fld.id])throw 'Field with id="'+fld.id+'" already exists in idx.';
		fld.form.idx.byid[fld.id]=fld;
		this._setuprefnotifications(fld);
		fld.updatelabel=function(label) {
			fld.$jq.find('[_target="label"]').html(label);
		};
	}
	,_setuprefnotifications: function(fld){
		if(fld.ref) {
			var rm=fld.form.refmap;
			if(rm[fld.ref]) {
				var lst=rm[fld.ref];
			} else {
				var lst=[];
				rm[fld.ref]=lst;
			}
			lst.push(fld);
		}
	}
	,_setupvalidation: function(fld){
		fld.validatefn=function(){
			var res=[];
			if(typeof fld.validate=='function') {
				var fnres=fld.validate();
				if(fnres) {
					res.push({id:fld.id+'Function',source:fld,message:fnres,isvalid:false});
				}
				return res;
			}
			for(var i=0;fld.validate && i<fld.validate.length;i++) {
				var vldr=fld.validate[i];
				for(var vld in vldr) {
					var vldi=forms.valid.ValidatorsInstance.idx[vld];
					if(!vldi) continue;
					var isvalid=vldi.isvalid(fld,vldr);
					if(isvalid) {
						var msg=vldi.success(fld,vldr);
					} else {
						var msg=vldi.error(fld,vldr);
					}
					if(msg) {
						res.push({id:fld.id+vld,source:fld,message:msg,isvalid:isvalid});
					}
				}
			}
			return res;
		};
	}
	,validate: function(fld) {
		if(fld.validatefn) return fld.validatefn();
		return [];
	}
	,destroy: function(fld){
		delete fld.form.idx.byid[fld.id];
	}
	,renderField : function(fld,$fld){
		fld.$jq=$fld;
	}
	,checkId : function(fld){
		if(!fld.id) {
			var cnt=this.controlManager.instanceCounter;
			fld.id='fld'+fld.type+cnt;
			this.controlManager.instanceCounter++;
		}
	}
	,checkParentPath : function(fld){
		if(fld.parent) {
			if(fld.parent.path) {
				fld.parentPath=fld.parent.path;
			}
			if(fld.parent.parentPath) {
				fld.parentPath=fld.parent.parentPath;
			}
		}
	}
	,onafterrender : function(fld){
		this._setupvalidation(fld);
		if(fld.onafterrender) {
			fld.onafterrender(fld);
		}
	}
	,onchange : function(fld,ev) {
		if(fld.onchange) fld.onchange(ev);
		var parent=fld.parent;
		while(parent) {
			if(parent.onchange) {
				parent.onchange(fld,ev);
			}
			parent=parent.parent;
		}
		fld.form.onchange(fld,ev);
	}
});
;Package.Register('forms.controls');

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
		field.find=function(id) {
			var fnditem=null;
			var fndfn=function(items){
				if(!items || fnditem) return ;
				for(var i=0;i<items.length;i++) {
					var fid=items[i].id;
					if(fid==id || fid.indexOf(ctx.indexedseparator+id)>-1) {
						fnditem=items[i];
					} else {
						fndfn(items[i].items);
					}
				}
			};
			fndfn(field.items);
			return fnditem;
		};
		if(!field.items) return $cont;
		for(var i=0;i<field.items.length;i++) {
			var fld=field.items[i];
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
	,addItem : function(fld,it){
		var ctx=this;
		if(!fld.items) {
			fld.items=[];
		}
		it.index=fld.items.length;
		fld.items.push(it);
		var dbit=SpahQL.db(it);
		dbit.select('//items/*').map(function(){//Select before preprocess, otherwise will get endless loop
			this.select('//id').map(function(){
				if(this.value().indexOf(ctx.indexedseparator)>-1) return ;
				this.replace(''+(fld.items.length-1)+ctx.indexedseparator+this.value());
			});
		});
		var ci=forms.controls.ControlManagerInstance.idx[it.type];
		ci.preprocess(it,fld);
		var $rend=ci.controlManager.renderer.renderField(it);
		fld.$jq.append($rend);
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
;Package.Register('forms.controls');

forms.controls.CustomControl=forms.controls.BaseControl.extend({
	renderField : function(field) {
		return this._super(field,$('<div></div>'));
	}
});
;Package.Register('forms.controls');

forms.controls.ValueControl=forms.controls.BaseControl.extend({
	preprocess : function(fld,parent){
		var ctx=this;
		fld.val=function(v) {
			if(typeof v=='undefined') {
				return ctx.getval(fld);
			} else {
				ctx.setval(fld,v);
			}
		};
		this._super(fld,parent);
	}
	,scatter : function(fld){
		this.onbeforescatter(fld);
		if(fld.path) {
			this.scatterPath(fld);
		} else if(fld.parentPath) {
			this.scatterParentPath(fld);
		} else {
			this.scatterSimple(fld);
		}
		this.onafterscatter(fld);
	}
	,onafterscatter: function(fld){
		if(fld.onafterscatter) {
			fld.onafterscatter();
		}
	}
	,onbeforescatter: function(fld){
		if(fld.onbeforescatter) {
			fld.onbeforescatter();
		}
	}
	,gather : function(fld){
		if(fld.path) {
			this.gatherPath(fld);
		} else if(fld.parentPath) {
			this.gatherParentPath(fld);
		} else {
			this.gatherSimple(fld);
		}
	}
	,gatherSimple : function(fld){
		var val=this.getval(fld);
		fld.form.db.value()[fld.id]=val;
	}
	,scatterSimple : function(fld){
		var val=fld.form.db.value()[fld.id];
		this.setval(fld,val);
	}
	,scatterParentPath : function(fld){
		var path=fld.parentPath+'/'+fld.id.replace(this.indexedseparator,'/');
		var sel=fld.form.db.select(path);
		this.setval(fld,sel.value());
	}
	,resolveVal: function(fld,val){
		var split=fld.id.split(this.indexedseparator);
		if(split.length==1) {
			return val[fld.id];
		} else if(split.length==2) {
			return val[parseInt(split[0])][split[1]];
		} else {
			throw 'Invalid field id: '+fld.id+'. In case of indexed fields it must be in format 0.fieldid.'
		}
	}
	,gatherParentPath : function(fld){
		var val=this.getval(fld);
		if(val==undefined)return;
		var path=fld.parentPath+'/'+fld.id.replace(this.indexedseparator,'/');
		var sel=fld.form.db.select(path);
		if(sel.length==0) throw 'No json path object found for:'+path;
		sel.replace(val);
	}
	,scatterPath : function(fld){
		var val=fld.form.db.select(fld.path).value();
		this.setval(fld,val);
	}
	,gatherPath : function(fld){
		var val=fld.$jq.val();
		var sel=fld.form.db.select(fld.path);
		if(sel.value()) {
			sel.replace(val);
		} else {
			throw 'No path in json in:'+fld.path
		}
	}
	,setval : function(fld,val){
		fld.$jq.val(val);
		fld.form.onchange(fld);
	}
	,getval : function(fld){
		var val=fld.$jq.val();
		return val;
	}
	,onafterrender : function(fld){
		this._super(fld);
		this.setupvaluechange(fld);
	}
	,setupvaluechange: function(fld){}
});
;Package.Register('forms.controls');

forms.controls.ColumnControl=forms.controls.BaseContainerControl.extend({
	renderField : function(field) {
		return this._super(field,forms.controls.ControlManagerInstance.renderer.renderColumn);
	}
});
;Package.Register('forms.controls');

forms.controls.RowControl=forms.controls.BaseContainerControl.extend({
	renderField : function(field) {
		return this._super(field,forms.controls.ControlManagerInstance.renderer.renderRow);
	}
});
;Package.Register('forms.controls');

forms.controls.BoxControl=forms.controls.BaseContainerControl.extend({
	renderField : function(fld) {
		var rend=forms.controls.ControlManagerInstance.renderer;
		var $boxcontent=this._super(fld,rend.renderBoxContent);
		var $box=rend.renderBox(fld);
		return $box.append($boxcontent);
	}
});
;Package.Register('forms.controls');

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
;Package.Register('forms.controls');

forms.controls.TabControl=forms.controls.BaseContainerControl.extend({
//		renderField : function(fld) {
//		}
});
;Package.Register('forms.controls');

forms.controls.TableControl=forms.controls.BaseControl.extend({
	renderField : function(fld) {
		var rend=forms.controls.ControlManagerInstance.renderer;
		var $cont=rend.renderTableContainer(fld);
		this._super(fld,$cont);
		var $tt=rend.renderTable(fld);
		var $th=rend.renderTableHead(fld);
		var $tf=rend.renderTableFoot(fld);
		var $table=$tt.append($th,$tf);
		return $cont.append($table);
	}
	,onafterrender : function(fld){
		var opt={
			processing : true
			,serverSide : true
		};
		if(fld.click) {
			opt.rowCallback=function(row,data){
				var $row=$(row);
				$row.bind('click',function(ev){
					$row.addClass('selected');
					fld.click(fld,row._DT_RowIndex,data,$row,ev);
				});
			};
		};
		var cols=[];
		for(var i=0;i<fld.columns.length;i++) {
			cols.push({data:fld.columns[i].id});
		}
		opt.columns=cols;
		opt=$.extend(opt,fld.options);
		$('#'+fld.id).dataTable(opt);
	}
});

;Package.Register('forms.controls');

forms.controls.TextControl=forms.controls.ValueControl.extend({
	renderField : function(field) {
		var $fld=forms.controls.ControlManagerInstance.renderer.renderTextField(field);
		this._super(field,$($fld).find('input'));
		return $fld;
	}
	,setupvaluechange: function(fld){
		var ctx=this;
		fld.$jq.on('keyup blur',function(ev){
			ctx.onchange(fld,ev);
		});
	}
});
;Package.Register('forms.controls');

forms.controls.TextareaControl=forms.controls.ValueControl.extend({
	renderField : function(field) {
		var $fld=forms.controls.ControlManagerInstance.renderer.renderTextareaField(field);
		this._super(field,$($fld).find('textarea'));
		return $fld;
	}
	,setupvaluechange: function(fld){
		var ctx=this;
		fld.$jq.on('keyup blur',function(ev){
			ctx.onchange(fld,ev);
		});
	}
});
;Package.Register('forms.controls');

forms.controls.InfoControl=forms.controls.ValueControl.extend({
	renderField : function(field) {
		var $fld=forms.controls.ControlManagerInstance.renderer.renderInfoField(field);
		this._super(field,$($fld).find('.info'));
		return $fld;
	}
	,setval : function(fld,val){
		fld.$jq.val(val);
	}
	,getval : function(fld){
	}
});
;Package.Register('forms.controls');

forms.controls.DateControl=forms.controls.TextControl.extend({
	onafterrender : function(fld){
		this._super(fld);
		var $inp=fld.$jq;
		$inp.datepicker({format:fld.format});
	}
	,setupvaluechange: function(fld){
		this._super(fld);
		var ctx=this;
		fld.$jq.on('changeDate',function(ev){
			ctx.onchange(fld,ev);
		});
	}
});
;Package.Register('forms.controls');

forms.controls.SelectControl=forms.controls.ValueControl.extend({
	renderField : function(fld) {
		var $fld=forms.controls.ControlManagerInstance.renderer.renderSelectField(fld);
		var select=$($fld).find('select');
		this._super(fld,select);
		var ctx=this;
		fld.load=function(lopt,$jq){
			ctx.load.call(fld,lopt,$jq);
		};
		fld.load(fld.options,select);
		return $fld;
	}
	,load: function(lopt,$jq){
		if(!$jq) $jq=this.$jq;
		if(!lopt)return;
		for(var i=0;i<lopt.length;i++) {
			var opt=lopt[i];
			if(opt.options) {
				var $optgrp=$('<optgroup label="'+opt.text+'"></optgroup>');
				$optgrp.data('data',opt)
				$jq.append($optgrp);
				this.load(opt.options,$optgrp);
			} else {
				var $opt=$('<option value="'+opt.value+'">'+opt.text+'</option>');
				$opt.data('data',opt);
				$jq.append($opt);
			}
		}
	}
	,setupvaluechange: function(fld){
		var ctx=this;
		fld.$jq.on('change',function(ev){
			ctx.onchange(fld,ev);
		});
	}
});
;Package.Register('forms.controls');

forms.controls.ButtonControl=forms.controls.BaseControl.extend({
	renderField : function(fld) {
		var $fld=this.getRenderFn()(fld);
		this._super(fld,$fld);
		$('body').on('click','#'+fld.id,function(e){
			if(fld.click) {
				return fld.click(fld);
			}
		});
		return $fld;
	}
	,getRenderFn : function() {
		return forms.controls.ControlManagerInstance.renderer.renderButton;
	}
});
;Package.Register('forms.controls');

forms.controls.ToolbarButtonControl=forms.controls.ButtonControl.extend({
	getRenderFn : function() {
		return forms.controls.ControlManagerInstance.renderer.renderToolbarButton;
	}
});
;Package.Register('forms.controls');

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
//	,_addItem : function(fld,tab,$itroot,active){
//		var rend=forms.controls.ControlManagerInstance.renderer;
//		this.checkId(tab);
//		tab.parent=fld;
//		this.checkParentPath(tab);
//		tab.form=fld.form;
//		var $tabcontent=this._superContentFn(tab,function(){return $tc;});
//		$itroot.append($tabcontent);
//	}
//	,addItem : function(fld,tab,$itroot,active){
//		this._addItem(fld,tab,$itroot,active);
//		if(!fld.items) {
//			fld.items=[];
//		}
//		fld.items.push(tab);
//	}
});
;Package.Register('forms.controls');

forms.controls.AccordionItemControl=forms.controls.BaseContainerControl.extend({
	renderField : function(fld) {
		var rend=forms.controls.ControlManagerInstance.renderer;
		var $body=this._super(fld,rend.renderAccordionItemBody);
		var $head=rend.renderAccordionItemHead(fld);
		var $content=rend.renderAccordionItemContent(fld);
		fld.updatelabel=function(label) {
			$head.find('[_target="label"]').html(label);
		};
		return $($('<div></div>').append($head,$content.append($body)).children());
	}
});
;Package.Register('forms.controls');

forms.controls.BreadcrumbControl=forms.controls.BaseContainerControl.extend({
	renderField : function(field) {
		return this._super(field,forms.controls.ControlManagerInstance.renderer.renderBreadcrumbContainer);
	}
});
;Package.Register('forms.controls');

forms.controls.BreadcrumbItemControl=forms.controls.BaseContainerControl.extend({
	renderField : function(field) {
		return this._super(field,forms.controls.ControlManagerInstance.renderer.renderBreadcrumbItem);
	}
});
;Package.Register('forms.controls');

forms.controls.MessageControl=forms.controls.BaseControl.extend({
	renderField : function(field) {
		var $fld=forms.controls.ControlManagerInstance.renderer.renderMessage(field);
		$fld.hide();
		this._super(field,$fld);
		var ctx=this;
		field.show=function(type,messages) {
			ctx.show(field,type,messages);
		};
		field.hide=function(){
			ctx.hide(field);
		};
		field.clear=function(){
			ctx.clear(field);
		};
		return $fld;
	}
	,hide : function(fld) {
		fld.$jq.hide();
	}
	,clear : function(fld) {
		fld.$jq.find('div').remove();
	}
	,show : function(fld,type,msgs) {
		forms.controls.ControlManagerInstance.renderer.changeAlertType(fld,type);
		for (var i = 0, max = msgs.length; i < max; i++) {
			var msg=$('<div></div>').html(msgs[i]);//<a href="#" class="alert-link">Alert Link</a>
			fld.$jq.append(msg);
		}
		fld.$jq.show();
	}
});
;Package.Register('forms.controls');

forms.controls.ControlManager=Class.extend({
	idx:{}
	,instanceCounter : 0
	,renderer : null
	,init : function(){
		this.idx['Custom']=new forms.controls.CustomControl(this);
		this.idx['Text']=new forms.controls.TextControl(this);
		this.idx['Textarea']=new forms.controls.TextareaControl(this);
		this.idx['Info']=new forms.controls.InfoControl(this);
		this.idx['Date']=new forms.controls.DateControl(this);
		this.idx['Select']=new forms.controls.SelectControl(this);
		this.idx['Button']=new forms.controls.ButtonControl(this);
		this.idx['ToolbarButton']=new forms.controls.ToolbarButtonControl(this);
		this.idx['Column']=new forms.controls.ColumnControl(this);
		this.idx['Row']=new forms.controls.RowControl(this);
		this.idx['Box']=new forms.controls.BoxControl(this);
		this.idx['Message']=new forms.controls.MessageControl(this);
		this.idx['Tabs']=new forms.controls.TabsControl(this);
		this.idx['Tab']=new forms.controls.TabControl(this);
		this.idx['Table']=new forms.controls.TableControl(this);
		this.idx['Accordion']=new forms.controls.AccordionControl(this);
		this.idx['AccordionItem']=new forms.controls.AccordionItemControl(this);
	}
});

forms.controls.ControlManagerInstance=new forms.controls.ControlManager();
;Package.Register('forms.valid');

forms.valid.Validators=Class.extend({
	 idx: {}
	,init: function() {
		this.idx['required']={
			error: function(fld,vld) {
				 return 'Field '+fld.label+' is required.';
			}
			,success: function(fld,vld) {}
			,isvalid: function(fld,vld){
				return vld.required===true && fld.val();
			}
		};
		this.idx['minlen']={
			error: function(fld,vld) {
				 return 'Field '+fld.label+' min. length is '+vld.minlen+'.';
			}
			,success: function(fld,vld) {}
			,isvalid: function(fld,vld){
				return fld.val().length>=vld.minlen;
			}
		};
		this.idx['maxlen']={
			error: function(fld,vld) {
				 return 'Field '+fld.label+' max. length is '+vld.maxlen+'.';
			}
			,success: function(fld,vld) {}
			,isvalid: function(fld,vld){
				return fld.val().length<vld.maxlen;
			}
		};
		this.idx['regexp']={
			error: function(fld,vld) {
				 return 'Field '+fld.label+' does`nt match expression '+vld.regexp+'.';
			}
			,success: function(fld,vld) {}
			,isvalid: function(fld,vld){
				return vld.regexp.test(fld.val());
			}
		};
	}
});

forms.valid.ValidatorsInstance=new forms.valid.Validators();
;Package.Register('forms.valid');
Package.Register('forms.valid.temp');

forms.valid.ValidationEngineView=Class.extend({
	show: function(res) {
		for (var i = 0; i < res.length; i++) {
			var r=res[i]
			var $jq=r.source.$jq;
			$jq.data('validationMessage',r.message);
			forms.valid.temp[r.id]={
				show: function(field, rules, i, options) {
					return field.data('validationMessage');
				}
			};
			$jq.addClass('validate[funcCall[forms.valid.temp.'+(r.id)+'.show]]');
		}
		if(res.length) {
			res[0].source.form.$jq.validationEngine('validate');
		}
	}
});
;Package.Register('forms.renderer');

forms.renderer.BaseRenderer=Class.extend({
	init : function(){
		forms.controls.ControlManagerInstance.renderer=this;
	}
	,renderitems : function(form){
		var items=form.items;
		var $root=$('<div class="row">');
		var $obj=$('<div class="col-lg-12">');//$('<div class="row">').append('<div class="col-lg-12">')
		for(var i=0;i<items.length;i++) {
			var fld=items[i];
			$obj.append(this.renderField(fld));
		}
		return $root.append($obj);
	}
	,renderField : function(field){
		var rend=forms.controls.ControlManagerInstance.idx[field.type];
		if(!rend) throw 'No renderer for field type:'+field.type;
		var res=rend.renderField(field);
		return res;
	}
});
;Package.Register('forms.renderer');

forms.renderer.BootstrapRenderer=forms.renderer.BaseRenderer.extend({
	renderForm : function (frm) {
		return $('<form class="horizontal"></form>');
	}
	,renderColumn : function(fld){
		return $('<div id="'+fld.id+'" class="control-group'+(fld.cols?' col-lg-'+fld.cols:'')+'">');
	}
	,renderRow : function(fld){
		return $('<div id="'+fld.id+'" class="row"></div>');
	}
	,renderBox : function(fld){
		var $tb=$('<div class="toolbar"></div>');
		var $tbul=$('<ul class="nav" _target="toolbar"></ul>');
		for (var i = 0, max = fld.items.length; i < max; i++) {
			var ft=fld.items[i];
			if(ft.target!=='toolbar') continue;
			var $a=$('<a id="'+ft.id+'" href="#">'+(ft.icon?'<i class="icon-'+ft.icon+'"></i>':'')+(ft.label?ft.label:'')+'</a>');
//			if(ft.click) {
//				$a.bind('click',function(){
//					return ft.click.call(fld);
//				});
//			}
			var $ft=$('<li></li>').append($a);
			$tbul.append($ft);
		}
		var $collapselnk=$('<li><a class="accordion-toggle minimize-box" data-toggle="collapse" href="#'+fld.id+'Body">'
						+'<i class="icon-chevron-up"></i>'+'</a></li>');
		var toolbar=$tb.append($tbul.append($collapselnk));
		var $box=$('<div class="box dark" id="'+fld.id+'"></div>');
		return $($box).append(
						$('<header></header>').append('<h5>'+(fld.icon?'<i class="icon-'+fld.icon+'"></i>':'')+''+(fld.label?fld.label:'')+'</h5>',toolbar)
					);
	}
	,renderToolbarButton: function(fld) {
		var $a=$('<a id="'+fld.id+'" href="#">'+(fld.icon?'<i class="icon-'+fld.icon+'"></i>':'')+(fld.label?fld.label:'')+'</a>');
		return $a;
	}
	,renderBoxContent : function(fld){
		var $body=$('<div id="'+fld.id+'Body" class="accordion-body collapse in body"></div>');
		return $body;
	}
	,getValidations: function(fld) {
		if(!fld.validate)return ;
		var s='validate[';
		for(var i=0;i<fld.validate.length;i++) {
			var v=fld.validate[i];
		}
	}
	,renderTextField : function(fld){
		var $fld=this._getLabel(fld)
						+'<div class="'+(fld.controlcols?'col-lg-'+fld.controlcols:'')+'"><input class="form-control" type="text" id="'+fld.id+'" '+(fld.placeholder?'placeholder="'+fld.placeholder+'"':'')+' value=""></div>';
		var $grp=$('<div class=""></div>').append($fld);
		return $grp;
	}
	,renderTextareaField : function(fld){
		var $fld=this._getLabel(fld)
						+'<div class="'+(fld.controlcols?'col-lg-'+fld.controlcols:'')+'"><textarea class="form-control" id="'+fld.id+'" '+(fld.placeholder?'placeholder="'+fld.placeholder+'"':'')+'></textarea></div>';
		var $grp=$('<div class=""></div>').append($fld);
		return $grp;
	}
	,renderInfoField : function(fld){
		var $fld=this._getLabel(fld)
						+'<div class="'+(fld.controlcols?'col-lg-'+fld.controlcols:'')+'"><input class="form-control info" id="'+fld.id+'" disabled="disabled"></div>';
		var $grp=$('<div class=""></div>').append($fld);
		return $grp;
	}
	,_getLabel: function(fld){
		return '<label for="'+fld.id+'" class="control-label '+(fld.labelcols?'col-lg-'+fld.labelcols:'')+'">'+fld.label+'</label>';
	}
	,renderSelectField : function(fld){
		var $fld=this._getLabel(fld)
						+'<div class="'+(fld.controlcols?'col-lg-'+fld.controlcols:'')+'"><select id="'+fld.id+'" class="form-control"></div>';
		var $grp=$('<div class=""></div>').append($fld);
		return $grp;
	}
	,renderButton : function(fld){
		var fld=$('<button id="'+fld.id+'" class="btn btn-primary btn-lg" data-toggle="modal">'+fld.label+'</button>');
		return fld;
	}
	,renderTabsRoot : function(fld){
		return $('<div id="'+fld.id+'"></div>');
	}
	,renderTabsHead: function(fld){
		return $('<ul class="nav nav-tabs"></ul>');
	}
	,renderTabsBody: function(fld){
		return $('<div class="tab-content"></ul>');
	}
	,renderTabTitle : function(fld,isactive){
		return $('<li'+(isactive?' class="active"':'')+'><a href="#'+fld.id+'" data-toggle="tab">'+fld.label+'</li>');
	}
	,renderTabContent : function(fld,isactive){
		return $('<div class="tab-pane fade '+(isactive?' in active':'')+'" id="'+fld.id+'"></div>')
	}
	,renderTableContainer : function(fld){
		return $('<div class="table-responsive"></div>');
	}
	,renderTable : function(fld){
		return $('<table id="'+fld.id+'" class="table table-striped table-bordered table-hover"></table>');
	}
	,renderTableHead: function(fld){
		return this.renderTableHeadFoot(fld,'thead');
	}
	,renderTableFoot: function(fld){
		return this.renderTableHeadFoot(fld,'tfoot');
	}
	,renderTableHeadFoot : function(fld,type){
		var $thead=$('<'+type+'></'+type+'>');
		var $thtr=$('<tr></tr>');
		for(var i=0;i<fld.columns.length;i++) {
			$thtr.append($('<th></th>').html(fld.columns[i].label));
		}
		$thead.append($thtr);
		return $thead;
	}
	,renderAccordionRoot : function(fld){
		return $('<div id="'+fld.id+'"></div>');
	}
	,renderAccordionItemRoot: function(fld){
		return $('<div class="panel panel-default"></div>');
	}
	,renderAccordionItemHead: function(fld){
		return $('<div class="panel-heading"></div>').append(
						$('<h4 class="panel-title"></h4>')
						.append('<a _target="label" data-toggle="collapse" data-parent="#'+fld.parent.id+'" href="#'+fld.id+'">'+fld.label+'</a>'));
	}
	,renderAccordionItemContent: function(fld){
		return $('<div id="'+fld.id+'" class="panel-collapse collapse'+(fld.index===0?' in':'')+'">');
	}
	,renderAccordionItemBody: function(fld){
		return $('<div class="panel-body"></div>');
	}
	,clearBreadcrumb: function(fld){
		$('ul#'+fld.id+'.breadcrumb').html('');
	}
	,renderBreadcrumbContainer: function(fld){
		return $('<ul id="'+fld.id+'" class="breadcrumb"></ul>');
	}
	,renderBreadcrumbItem: function(fld,isactive,click){
		if(isactive) {
			return $('<li id="'+fld.id+'" class="active">'+fld.label+'</li>');
		} else {
			return $('<li id="'+fld.id+'"></li>').append($('<a href="#">'+fld.label+'</a>').click(function(){
				if(click) {
					return click.call(fld);
				}
			}));
		}
	}
	,renderMessage : function (fld) {
		var $msgdiv=$('<div class="alert alert-success alert-dismissable"></div>');
		var $dismissbtn=$('<button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>');
		$msgdiv.append($dismissbtn);
		return $msgdiv;
	}
	,changeAlertType : function(fld,type) {
		fld.$jq.removeClass('alert-success alert-info alert-warning alert-danger');
		fld.$jq.addClass('alert-'+type);
	}
});

;Package.Register('forms');

forms.Application=Class.extend({
	navigation: []
	,activeform: null
	,formsdefs: {}
	,forms: {}
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
	,createform: function(deforclaz,params){
		var ctx=this;
		var createFn=function(deforclaz){
			var frm=new (deforclaz)(params);
			ctx.formsdefs[frm.id]=deforclaz;
			frm.render(ctx.selector);
			ctx.forms[frm.id]=frm;
		};
		if(typeof deforclaz=='function') {
			createFn(deforclaz);
			return ;
		} else if(typeof deforclaz=='object') {
			deforclaz=forms.BaseForm.extend(deforclaz);
			createFn(deforclaz);
		} else if(typeof deforclaz=='string') {
			throw 'Not implemented yet';
		}
	}
	,destroyform: function(frmid){
		if(this.activeform==frmid) this.activeform=null;
		for(var i=0;i<this.navigation.length;i++) {
			if(this.navigation[i].id==frmid) {
				this.navigation.splice(i,1);
				break;
			}
		}
		var frm=this.forms[frmid];
		frm.destroy();
		delete this.forms[frmid];
		delete this.formsdefs[frmid];
	}
	,showform: function(frmid){
		this.activeform=frmid;
		if(this.navigation.length>0) {
			this.navigation[this.navigation.length-1].show(false);
		}
		this.navigation.push(this.forms[frmid]);
		this.navigation[this.navigation.length-1].show(true);
		this.updatebreadcrumb();
	}
	,back: function(){
		if(this.navigation.length<=1) {
			return ;
		}
		var curr=this.navigation[this.navigation.length-1];
		var back=this.navigation[this.navigation.length-2];
		curr.show(false);
		back.show(true);
		this.navigation.splice(this.navigation.length-1,1);
		this.activeform=back.id;
		
		this.updatebreadcrumb();
	}
	,updatebreadcrumb: function(){
		var rend=forms.controls.ControlManagerInstance.renderer;
		var breadcrumb={
			id: 'appbreadcrumb'
		};
		rend.clearBreadcrumb(breadcrumb);
		if(!$(this.selector).find('#'+breadcrumb.id).length) {
			$(this.selector).prepend(rend.renderBreadcrumbContainer(breadcrumb));
		}
		var ctx=this;
		for(var i=0;i<this.navigation.length;i++) {
			var frm=this.navigation[i];
			$('#'+breadcrumb.id).append(rend.renderBreadcrumbItem(frm,frm.id==this.activeform,function(){
				if(ctx.activeform!==this.id) {
					ctx.back();
				}
			}));
		}
	}
});
;Package.Register('forms');

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
		return {result:result,show: function(){
				ctx.validationViewer.show(result);
		}};
	}
});