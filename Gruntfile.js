module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
         banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
				,compress : true
      },
			my_target: {
			files: [
				 {'dist/dependencies.min.js': ['dist/dependencies.js']}
				,{'dist/jsforms.min.js': ['dist/jsforms.js']}
				,{'dist/jsformsIE.min.js': ['dist/jsformsIE.js']}
			]}
    }
		,concat : {
			options: {
				separator : '\n;'
			}
      ,basic_and_extras : {
        files : {
          'dist/dependencies.js' : [
             'src/assets/plugins/jquery-2.0.3.min.js'
            ,'src/assets/plugins/bootstrap/js/bootstrap.min.js'
            ,'src/assets/plugins/modernizr-2.6.2-respond-1.1.0.min.js'
						,'src/assets/plugins/daterangepicker/moment.js'
            ,'src/assets/plugins/dataTables/jquery.dataTables.js'
            ,'src/assets/plugins/dataTables/dataTables.bootstrap.js'
            ,'src/assets/plugins/datepicker/js/bootstrap-datepicker.js'
//            ,'src/assets/plugins/validationengine/js/jquery.validationEngine.js'
//            ,'src/assets/plugins/validationengine/js/languages/jquery.validationEngine-en.js'
            ,'src/assets/plugins/autosize/jquery.autosize.min.js'
						,'src/assets/plugins/jquery.dualListbox-1.3/jQuery.dualListBox-1.3.js'
						,'src/assets/plugins/chosen/chosen.jquery.js'
	  				,'src/js/core/spahql.js'
		  	  	,'src/js/core/Clazz.js'
				  ]
          ,'dist/<%= pkg.name %>.js' : [
						"src/js/forms/controls/BaseControl.js"
						,"src/js/forms/utils/DateFormatter.js"
						,"src/js/forms/controls/BaseContainerControl.js"
						,"src/js/forms/controls/CustomControl.js"
						,"src/js/forms/controls/ValueControl.js"
						,"src/js/forms/controls/BaseListControl.js"
						,"src/js/forms/controls/ColumnControl.js"
						,"src/js/forms/controls/RowControl.js"
						,"src/js/forms/controls/BoxControl.js"
						,"src/js/forms/controls/TabsControl.js"
						,"src/js/forms/controls/TabControl.js"
						,"src/js/forms/controls/TableControl.js"
						,"src/js/forms/controls/TextControl.js"
						,"src/js/forms/controls/PasswordControl.js"
						,"src/js/forms/controls/TextareaControl.js"
						,"src/js/forms/controls/InfoControl.js"
						,"src/js/forms/controls/DateControl.js"
						,"src/js/forms/controls/DaterangeControl.js"
						,"src/js/forms/controls/CheckboxControl.js"
						,"src/js/forms/controls/CheckboxesControl.js"
						,"src/js/forms/controls/SelectControl.js"
						,"src/js/forms/controls/SearchableControl.js"
						,"src/js/forms/controls/ButtonControl.js"
						,"src/js/forms/controls/ToolbarButtonControl.js"
						,"src/js/forms/controls/AccordionControl.js"
						,"src/js/forms/controls/AccordionItemControl.js"
						,"src/js/forms/controls/BreadcrumbControl.js"
						,"src/js/forms/controls/BreadcrumbItemControl.js"
						,"src/js/forms/controls/MessageControl.js"
						,"src/js/forms/controls/DuallistControl.js"
						,"src/js/forms/controls/ControlManager.js"
						,"src/js/forms/valid/Validators.js"
						,"src/js/forms/valid/ValidationEngineView.js"
						,"src/js/forms/valid/PopoverView.js"
						,"src/js/forms/renderer/BaseRenderer.js"
						,"src/js/forms/renderer/BootstrapRenderer.js"
						,"src/js/forms/Application.js"
						,"src/js/forms/BaseForm.js"
				  ]
          ,'dist/<%= pkg.name %>IE.js' : [
		  			 'src/assets/js/html5shiv.js'
	  				,'src/assets/js/respond.min.js'
          ] 
        }
      }
		}
    ,cssmin : {
      target : {
        files :{
            'dist/<%= pkg.name %>.min.css' : 
              [
                 'src/assets/plugins/bootstrap/css/bootstrap.css'
                ,'src/assets/css/main.css'
                ,'src/assets/css/theme.css'
                ,'src/assets/css/MoneAdmin.css'
                ,'src/assets/plugins/Font-Awesome/css/font-awesome.css'
                ,'src/assets/css/layout2.css'
                ,'src/assets/plugins/flot/examples/examples.css'
                ,'src/assets/plugins/timeline/timeline.css'
                ,'src/assets/plugins/dataTables/dataTables.bootstrap.css'
                ,'src/assets/plugins/datepicker/css/datepicker.css'
                ,'src/assets/plugins/chosen/chosen.css'
//                ,'src/assets/plugins/validationengine/css/validationEngine.jquery.css'
              ]
          }
      
      }
    }
    ,copy : {
      main : {
         src : 'src/assets/plugins/Font-Awesome/font/*.*'
        ,dest: 'font/'
        ,flatten : true      
        ,expand : true
      }
    }
		,clean : ['dist/<%= pkg.name %>.js','dist/<%= pkg.name %>.min.js','dist/<%= pkg.name %>.min.css']
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-copy');

	grunt.registerTask('default', ['concat','uglify','cssmin','copy']);
};