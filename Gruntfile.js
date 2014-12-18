'use strict';

var _ = require('lodash');

var desireds = require('./desireds');

var gruntConfig = { 
    
     jasmine_node: {
        src: ['./models/task.js'],
        options: {
          coverage: {},
          forceExit: true,
          match: '.',
          matchall: false,
          extensions: 'js',
          specNameMatcher: 'spec',
          jUnit: {
            report: true,
            savePath : "./build/reports/jasmine/",
            useDotNotation: true,
            consolidate: true
          }
    },
    all: ['tests/']
  },
        env: {
            // dynamically filled
        },
        simplemocha: {
            sauce: {
                options: {
                    timeout: 60000,
                    reporter: 'spec'
                },
                src: ['test/sauce/**/*-specs.js']
            }
        },    
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            gruntfile: {
                src: 'Gruntfile.js'
            },
            test: {
                options: {
                    jshintrc: 'test/.jshintrc'
                },                
                src: ['test/**/*.js']
            },
        },
        concurrent: {
            'test-sauce': [], // dynamically filled
        },
        watch: {
            gruntfile: {
                files: '<%= jshint.gruntfile.src %>',
                tasks: ['jshint:gruntfile']
            },
            test: {
                files: '<%= jshint.test.src %>',
                tasks: ['jshint:test']
            },
        },
    };
 
_(desireds).each(function(desired, key) {
    gruntConfig.env[key] = { 
        DESIRED: JSON.stringify(desired)
    };
    gruntConfig.concurrent['test-sauce'].push('test:sauce:' + key);
});

//console.log(gruntConfig);

module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig(gruntConfig);

    // These plugins provide necessary tasks.
    //grunt.loadNpmTasks('grunt-jasmine-node');

    grunt.loadNpmTasks('grunt-env');
    grunt.loadNpmTasks('grunt-simple-mocha');
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-jasmine-node-coverage');
    // Default task.
    
    
    grunt.registerTask('default', ['test:sauce:' + _(desireds).keys().first(),'jasmine_node']);

    _(desireds).each(function(desired, key) {
            grunt.registerTask('test:sauce:' + key, ['env:' + key, 'simplemocha:sauce']);
    });

    grunt.registerTask('test:sauce:parallel', ['concurrent:test-sauce']);
};
