'use strict';

module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt);

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*!\n' +
        ' * <%= pkg.name %> v<%= pkg.version %> (<%= pkg.homepage %>)\n' +
        ' * Copyright <%= grunt.template.today("yyyy") %> <%= pkg.author.name %> \n' +
        ' * Licensed under MIT license \n' +
        ' */\n\n',
    // Task configuration.
    concat: {
      options: {
        banner: '<%= banner %>',
        stripBanners: true
      },
      dist: {
        src: ['src/js/<%= pkg.name %>.js'],
        dest: 'dist/<%= pkg.name %>.js'
      },
    },
    less: {
      dist: {
        options: {
          banner: '<%= banner %>',
          paths: ["src/less"]
        },
        files: {"dist/<%= pkg.name %>.css": "src/less/style.less"}
      }
    },
    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      dist: {
        src: '<%= concat.dist.dest %>',
        dest: 'dist/<%= pkg.name %>.min.js'
      },
    },
    cssmin:{
      dist: {
        files: [{
          expand: true,
          cwd: 'dist',
          src: ['**/*.css', '!**/*.min.css'],
          dest: 'dist',
          ext: '.min.css'
        }]
      }
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      lib: {
        options: {
          jshintrc: 'src/js/.jshintrc'
        },
        src: ['src/js/*.js']
      }
    },
    clean:{
      dist:{
        src: ['dist']
      },
    },
    notify:{
      css:{
        options: {
          title: 'Success!',
          message: 'CSS files were compiled.',
        }
      },
      js:{
        options: {
          title: 'Success!',
          message: 'Js files were compiled.',
        }
      },
      dist:{
        options: {
          title: 'Success!',
          message: 'Distribution is ready',
        }
      },
    },
    watch: {
      less: {
        files: 'src/less/**/*.less',
        tasks: ['less:dist','cssmin','notify:css']
      },
      js: {
        files: 'src/js/*.js',
        tasks: ['jshint:lib','concat','uglify','notify:js']
      }
    }
  });

  // Default task.
  grunt.registerTask('default', ['watch']);  
  
  // Distribution task.
  grunt.registerTask('dist', [
    'clean:dist',
    'jshint',
    'concat',
    'uglify',
    'less:dist',
    'cssmin',
    'notify:dist'
  ]);

};
