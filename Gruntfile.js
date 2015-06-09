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
			,dist: {
				src : [
					 'src/js/core/Clazz.js'
					,'src/js/core/spahql.js'
					,'src/js/forms/BaseForm.js'
				]
				,dest : 'dist/<%= pkg.name %>.js'
			}
		}
		,clean : ['dist/<%= pkg.name %>.js','dist/<%= pkg.name %>.min.js']
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-clean');

	grunt.registerTask('build', ['concat','uglify']);
};