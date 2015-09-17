// Karma configuration
// Generated on Wed Sep 16 2015 15:40:27 GMT+0300 (FLE Daylight Time)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine', 'jasmine-matchers','ng-scenario'],

    // list of files / patterns to load in the browser
    files: [
      'test-main.js',
      {pattern: 'dist/dependencies.js', included: true, nocache:true},
      {pattern: 'dist/jsforms.js', included: true, nocache:true},
      {pattern: 'test/**/*.js', included: true, nocache:true}
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
//    preprocessors: {
//			'test/**/*.js': 'coverage'
//    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['mocha','progress'/*,'dots','growl','teamcity','junit','coverage','html-reporter'*/],

//    junitReporter: {
//      outputDir: '', // results will be saved as $outputDir/$browserName.xml 
//      outputFile: undefined, // if included, results will be saved as $outputDir/$browserName/$outputFile 
//      suite: '' // suite will become the package name attribute in xml testsuite element 
//    },
//		urlRoot : '/_karma_/',
//		plugins : ['mocha-reporter','karma-junit-reporter'],
		
//		plugins : ['growl','teamcity','junit','coverage','html-reporter'],

//		coverageReporters : {
//			type: 'html'
//			,dir : 'coverage/'
//			,file : 'coverage.html'
//		},

    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],

		proxies : {
			'/' : 'http://localhost:3000/'
		},

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false
  })
};

//module.exports = function(config) {
//  config.set({
//    reporters: ['progress', 'junit'],
// 
//    // the default configuration 
//    junitReporter: {
//      outputDir: '', // results will be saved as $outputDir/$browserName.xml 
//      outputFile: undefined, // if included, results will be saved as $outputDir/$browserName/$outputFile 
//      suite: '' // suite will become the package name attribute in xml testsuite element 
//    }
//  });
//}; 
