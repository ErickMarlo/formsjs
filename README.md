JSForms is javascript forms engine, to make forms creation fun and easy.
##### Minimalistic form example

    var app=new forms.Application({
      selector: '#content .inner'
    });
    var mfrm=forms.BaseForm.extend({
        id: 'minimalisticform'
        ,renderer : 'Bootstrap'
        ,label: 'Minimalistic form example'
        ,items : [
            {type: 'Row', items: [
                {type: 'Column', items: [
                    {type: 'Text', label: 'Test textbox'}
                    ,{type: 'Select', label: 'Test select', options:[
                        {text: 'Items1', value: 'val1'}
                    ]}
                    ,{type: 'Button', label: 'Test button'}
                ]}
            ]}
        ]
    });
    app.createform(mfrm);
    app.showform('mfrm');

    <link rel="stylesheet" href="../dist/jsforms.min.css" />

    <script src="../dist/dependencies.js"></script>
    <script src="../dist/jsforms.js"></script>


src/js/test.html currently supports all variatons of controls, properties, methods supported by this framework.

##### Form level properties
* id : unique id for the form
* items : fields hierarchy of the form
* renderer : rendering layer for the form, currently supported is 'Bootstrap'
* label : title for the form
* db : form dataset operated by scatter and gather methods
* idx.byid : flat index of fields in the form
* $jq : JQuery instance of form

##### Form level methods

You can call these methods or override any of them. For example:

    init : function() {
      this._super();//don't forget to call supper when overriding
    }

* init - called when application creates form
* render(selector) - when form is beeing constructed
* onafterrender(item) - when item in form hierarchy just constructed
* preprocess - just before form fields will be prepared to render
* destroy - destroy form
* scatter(json) - fill fields with values from json
* gather - fill form db property with fields values
* show(visibility) - show or hide this form
* validate - get validation report of the form. To show validation call: form.validate().show()

##### Field level properties

Fields can be of two type: container and simple. All fields have these common properties:

* type - which is mandatory
* id - which is optional, but in case you omit it, it will be generated at preprocess phase

###### Container fields

All container fields have items property, which contains childs fields definitions. Containers may be nested into each others.

* type : currenlty are supported the following containers: Box,Row,Column,Tabs,Tab,Accordion,AccordionItem
* items : [] children of the container
* label : label for container
* path : json path used to map values when scattering gathering json values in child elements
* icon : currenlty Box control only. Icon subset is taken from font awesome. Spcify th-large for ex.
* validate : validate container
* cols : grid system cols this control occupies. Applicable for column control

the following methods are supported:

* addItem : adds item dynamically to container. For ex.: form.idx.byid.testctrl.addItem({});
* createitem : define this method at container control, to create controls dynamically, when scatterring data and there is no control to display that data.

########

    {id: 'testAccordionScatter',type: 'Accordion',path: '/obj/data/testDynaAccordion',createitem: function(i,o){
        return {
            type: 'AccordionItem', label: 'Item:'+i
            ,id: 'dynaAccordionItem'+i
            ,items: [
                {type: 'Row',items: [
                    {type: 'Column', items: [
                        {type: 'Text', id: 't1', label: 'T1'}
                    ]}
                ]}
            ]
        };
    }}


###### Simple fields

Currently are supported the following simple fields: Text,Date,Select,Button,Table. The following properties are supported:

* id
* type
* label
* path : field binding path into json. This overrides container path.For ex.:path:'/obj/data/gr3'
* validate : validation rules. For ex.: validate: [{required:true},{minlen:3},{maxlen:6}].Validate can be function also.
* labelcols : grid system cols label occupies
* controlcols : grid system cols this control occupies

The following methods are supported:

* click : beeing invoked when Button is clicked
* validate : perform field validation and return custom error message
