Package.Register('forms.controls');

forms.controls.ControlManager=Class.extend({
	idx:{}
	,instanceCounter : 0
	,renderer : null
	,init : function(){
		this.idx['Custom']=new forms.controls.CustomControl(this);
		this.idx['Text']=new forms.controls.TextControl(this);
		this.idx['Password']=new forms.controls.PasswordControl(this);
		this.idx['Textarea']=new forms.controls.TextareaControl(this);
		this.idx['Info']=new forms.controls.InfoControl(this);
		this.idx['Date']=new forms.controls.DateControl(this);
		this.idx['Daterange']=new forms.controls.DaterangeControl(this);
		this.idx['Checkbox']=new forms.controls.CheckboxControl(this);
		this.idx['Checkboxes']=new forms.controls.CheckboxesControl(this);
		this.idx['Select']=new forms.controls.SelectControl(this);
		this.idx['Searchable']=new forms.controls.SearchableControl(this);
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
		this.idx['Duallist']=new forms.controls.DuallistControl(this);
	}
});

forms.controls.ControlManagerInstance=new forms.controls.ControlManager();