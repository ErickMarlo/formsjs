Package.Register('forms.valid');

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