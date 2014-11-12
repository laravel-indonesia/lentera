module.exports = function(grunt) {

  var assetsDir = 'assets/',
      scriptsDir = assetsDir + 'js/',
      srcDir     = scriptsDir + 'src/',
      scssDir = assetsDir + 'scss/',
      imageDir = assetsDir + 'images/',
      stylesDir = assetsDir + 'css/',
      pluginDir = scriptsDir + 'plugins/',
      vendorDir = scriptsDir + 'vendors/';

  var bannerContent = '/*! <%= pkg.title || pkg.name %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> - <%= pkg.author.name %> */\n';

  /**
   * List of dependence scripts. This scripts is merged and will be loaded last after jquery is loaded.
   */
  var jsPluginList = [
    pluginDir + 'avoidconsole.js',
    pluginDir + 'preloadjs-0.4.1.min.js',
    pluginDir + 'jquery.cookie.js',
    pluginDir + 'jquery.placeholder.js'
  ];

  var jsMain = [
  ];

  /**
   * List of independent scripts. This scripts is loaded as is from HTML DOM via <script> call. Although listed, these script are not necessarily need to be merged.
   */
  var jsVendorList = [
    vendorDir + 'enquire.min.js',
    vendorDir + 'jquery.min.js',
    vendorDir + 'media.match.min.js',
    vendorDir + 'modernizr.js'
  ];

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    jade: {
      compile: {
        options: {
          pretty: true,
        },
        files: [{
          expand: true,
          cwd: "html/jade/components",
          src: ["**/*.jade", "!_includes/*.jade", "!_patterns/*.jade"],
          dest: "html",
          ext: ".html"
        },
        {
          expand: true,
          cwd: "html/jade/pages",
          src: ["**/*.jade", "!layout.jade", "!_includes/*.jade"],
          dest: "html",
          ext: ".html"
        }]
      }
    },

    compass: {
      dist: {
        options: {
          config: 'config.rb',
          outputStyle: 'expanded'
        }
      }
    },

    autoprefixer: {
      options: {
        browsers: ['last 2 version']
      },
      single_file: {
        src: stylesDir + 'site.css',
        dest: stylesDir + 'site.prefixed.css'
      },
      docs_file: {
        src: stylesDir + 'docs.css',
        dest: stylesDir + 'docs.prefixed.css'
      },
      dist: {
        files: {
          '<%= autoprefixer.single_file.dest %>': ['<%= autoprefixer.single_file.src %>'],
          '<%= autoprefixer.docs_file.dest %>': ['<%= autoprefixer.docs_file.src %>']
        }
      }
    },

    csso: {
      compress: {
        options: {
          banner: bannerContent,
          report: 'gzip'
        },
        files: {
          'assets/css/site.min.css': ['<%= autoprefixer.single_file.src %>'],
          'assets/css/site.prefixed.min.css': ['<%= autoprefixer.single_file.dest %>']
        }
      }
    },

    // Clean files before replacement
    clean: {
      all: {
        src: [stylesDir + "site.min.css", stylesDir + "site.prefixed.min.css", scriptsDir + "site.min.js", stylesDir + "site.css", stylesDir + "site.prefixed.css", scriptsDir + "site.js"]
      },
      css: {
        src: [stylesDir + "site.min.css", stylesDir + "site.css", stylesDir + "site.prefixed.min.css", stylesDir + "site.prefixed.css"]
      },
      js: {
        src: [scriptsDir + "plugins/_plugins-concatenated.js"]
      }
    },

    concat: {
      // concatenate javascript plugins into single file.
      jsplugin: {
        src: jsPluginList,
        dest: scriptsDir + 'plugins/_plugins-concatenated.js'
      },

      // concatenate javascript plugin file with the main source file.
      jssource: {
        src: [
          scriptsDir + 'plugins/_plugins-concatenated.js',
          scriptsDir + 'src/plugins.js',

        ],
        dest: scriptsDir + 'site.js'
      }
    },

    uglify: {
      options: {
        banner: bannerContent
      },
      dist: {
        // use all files in js directory
        src: ['<%= concat.jssource.dest %>'],
        // place the result into the dist directory,
        // name variable contains template prepared in
        // previous section
        dest: scriptsDir + 'site.min.js'
      }
    },

    // image optimization
    imagemin: {
      dist: {
        options: {
          optimizationLevel: 7,
          progressive: true,
          interlaced: true
        },
        files: [{
          expand: true,
          cwd: imageDir,
          src: ['**/*.{png,jpg,gif}'],
          dest: imageDir
        }]
      }
    },

    watch: {
      options: {
        livereload: true
      },
      gruntfile: {
        files: 'Gruntfile.js',
        task: ["jshint"]
      },
      css: {
        files: [
          scssDir + "**/*.scss"
        ],
        tasks: ["compass", "autoprefixer", "csso"],
        options: {
          nospawn: true
        }
      },
      js: {
        files: [
          "<%= concat.jssource.src %>"
        ],
        tasks: ["concat:jssource", "uglify"],
        options: {
          nospawn: true
        }
      },
      jade: {
        files: ["html/jade/components/**/*.jade"],
        tasks: ["jade"]
      }
    }
  });

  // Load the pluigns that provide the tasks.
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-csso');
  grunt.loadNpmTasks('grunt-autoprefixer');
  // grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-contrib-imagemin');


  /**
   * grunt imagemin
   * Execute image optimization.
   */
  grunt.registerTask('imagemin', ["imagemin"]);

  /**
   * grunt
   * Execute build order for first time usage. Order of tasks below:
   * - compile all jade into HTML
   * - compile all SCSS into site.css using compass
   * - add vendor prefixes on site.css and create site.prefixed.css as result
   * - minify site.css and site.prefixed.css
   * - concatenate all javascript plugin and create plugin/_plugin-concatenated.js
   * - concatenate plugin/_plugin-concatenated.js and main javascript source into site.js
   * - minify the site.js and create site.min.js as result
   */
  grunt.registerTask('default', ["jade", "compass", "autoprefixer", "csso:compress", "concat:jsplugin", "concat:jssource", "uglify" ]);

  /**
   * grunt build
   * Execute build order for production or first time usage. Order of tasks below:
   * - compile all jade into HTML
   * - compile all SCSS into site.css using compass
   * - add vendor prefixes on site.css and create site.prefixed.css as result
   * - minify site.css and site.prefixed.css
   * - concatenate all javascript plugin and create plugin/_plugin-concatenated.js
   * - concatenate plugin/_plugin-concatenated.js and main javascript source into site.js
   * - remove plugin/_plugin-concatenated.js
   * - minify the site.js and create site.min.js as result
   */
  grunt.registerTask('build', ["jade", "compass", "autoprefixer", "csso:compress", "concat:jsplugin", "concat:jssource", "clean:js", "uglify" ]);

  /**
   * grunt dev
   * Will listen for any change in gruntfile, jade, scss, and javascript files and perform these task:
   * - compile all jade into HTML
   * - compile all SCSS into site.css using compass
   * - add vendor prefixes on site.css and create site.prefixed.css as result
   * - concatenate all javascript plugin and create plugin/_plugin-concatenated.js
   * - concatenate plugin/_plugin-concatenated.js and main javascript source into site.js
   */
  grunt.registerTask('dev', ["watch"]);

};