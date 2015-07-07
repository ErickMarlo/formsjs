JSForms is javascript forms engine, to make forms creation fun and easy.
Minimalistic form example:

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
