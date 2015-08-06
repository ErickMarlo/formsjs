Package.Register('forms.valid');
Package.Register('forms.valid.temp');

forms.valid.ValidationEngineView=Class.extend({
	show: function(ctx,res) {
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