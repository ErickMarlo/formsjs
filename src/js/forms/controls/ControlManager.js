Package.Register('forms.controls');

forms.controls.ControlManager=Class.extend({
	idx:{}
	,renderer : null
	,init : function(){
		this.idx['Text']=new forms.controls.TextControl(this);
		this.idx['Button']=new forms.controls.ButtonControl(this);
		this.idx['Column']=new forms.controls.ColumnControl(this);
		this.idx['Row']=new forms.controls.RowControl(this);
		this.idx['Box']=new forms.controls.BoxControl(this);
		this.idx['Tabs']=new forms.controls.TabsControl(this);
		this.idx['Tab']=new forms.controls.TabControl(this);
		this.idx['Table']=new forms.controls.TableControl(this);
	}
});

forms.controls.ControlManagerInstance=new forms.controls.ControlManager();