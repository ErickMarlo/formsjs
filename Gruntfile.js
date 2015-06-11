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
				separator : ';'
			}
      ,basic_and_extras : {
        files : {
          'dist/<%= pkg.name %>.js' : [
		  	  	 'src/js/core/Clazz.js'
	  				,'src/js/core/spahql.js'
  					,'src/js/forms/BaseForm.js'
				  ]
          ,'dist/<%= pkg.name %>IE.js' : [
		  			 'src/assets/js/html5shiv.js'
	  				,'src/assets/js/respond.min.js'
          ] 
        }
      }
			,dist: {
				src : [
					 'src/js/core/Clazz.js'
					,'src/js/core/spahql.js'
					,'src/js/forms/BaseForm.js'
				]
				,dest : 'dist/<%= pkg.name %>.js'
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
		,clean : ['dist/<%= pkg.name %>.js','dist/<%= pkg.name %>.min.js','dist/<%= pkg.name %>.min.css']
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-cssmin');

	grunt.registerTask('build', ['concat','uglify','cssmin']);
};