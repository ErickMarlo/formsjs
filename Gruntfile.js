module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
         banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
				,compress : true
      },
      my_target: {
				 src:['dist/<%= pkg.name %>.js']
				,dest : 'dist/<%= pkg.name %>.min.js'
      }
    }
		,concat : {
			options: {
				separator : '\n;'
			}
      ,basic_and_extras : {
        files : {
          'dist/<%= pkg.name %>.js' : [
             'src/assets/plugins/jquery-2.0.3.min.js'
            ,'src/assets/plugins/bootstrap/js/bootstrap.min.js'
            ,'src/assets/plugins/modernizr-2.6.2-respond-1.1.0.min.js'
            ,'src/assets/plugins/flot/jquery.flot.js'
            ,'src/assets/plugins/flot/jquery.flot.resize.js'
            ,'src/assets/plugins/flot/jquery.flot.time.js'
            ,'src/assets/plugins/flot/jquery.flot.stack.js'
            ,'src/assets/js/for_index.js'
            ,'src/assets/plugins/dataTables/jquery.dataTables.js'
            ,'src/assets/plugins/dataTables/dataTables.bootstrap.js'
		  	  	,'src/js/core/Clazz.js'
	  				,'src/js/core/spahql.js'
  					,'src/js/forms/BaseForm.js'
  					,'src/js/forms/controls/BaseControl.js'
  					,'src/js/forms/controls/BaseContainerControl.js'
  					,'src/js/forms/controls/ColumnControl.js'
  					,'src/js/forms/controls/RowControl.js'
  					,'src/js/forms/controls/BoxControl.js'
  					,'src/js/forms/controls/TabsControl.js'
  					,'src/js/forms/controls/TabControl.js'
  					,'src/js/forms/controls/TableControl.js'
  					,'src/js/forms/controls/TextControl.js'
  					,'src/js/forms/controls/ButtonControl.js'
  					,'src/js/forms/controls/AccordionControl.js'
  					,'src/js/forms/controls/AccordionItemControl.js'
  					,'src/js/forms/controls/ControlManager.js'
  					,'src/js/forms/renderer/BaseRenderer.js'
  					,'src/js/forms/renderer/BootstrapRenderer.js'
  					,'src/js/forms/BaseForm.js'
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

	grunt.registerTask('build', ['concat','uglify','cssmin','copy']);
};