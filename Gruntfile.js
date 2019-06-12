'use strick';

module.exports = function(grunt) {

    require('time-grunt')(grunt);

    require('jit-grunt')(grunt, {
        useminPrepare: 'grunt-usemin'
    });

    grunt.initConfig({
        sass: {
            dist: {
                files: {
                    'css/styles.css': 'css/styles.scss'
                }
            }
        },
        watch: {
            files: 'css/*.scss',
            tasks: ['sass']
        },
        browserSync: {
            dev: {
                bsFiles: {
                    src:  [
                        'css/*.css',
                        '*.html',
                        'js/*.js'
                    ]
                },
                options: {
                    watchTask: true,
                    server: {
                        baseDir: './'
                    }
                }
            }
        },
        copy: {
            html: {
                files: [{
                    // for html
                    expand: true,
                    dot: true,
                    cwd: './',
                    src: ['*.html'],
                    dest: 'dist'
                }]
            },
            fonts: {
                files: [{
                    // for font-awesome
                    expand: true,
                    dot: true,
                    cwd: 'node_modules/font-awesome',
                    src: ['fonts/*.*'],
                    dest: 'dist'
                }]
            }
        },
        clean: {
            build: {
                src: ['dist/']
            }
        },
        imagemin: {
            dynamic: {
                files: [{
                    expand: true, // Enable dynamic expansion
                    cwd: './',  // src matches are relative to this path
                    src: ['img/*.{png,jpg,gif}'],   // actual patterns to match
                    dest: 'dist/'   //destination path prefix
                }]
            }
        },
        useminPrepare: {
            foo: { // name doesnt matter
                dest: 'dist',
                src: ['contactus.html','aboutus.html','index.html']
            },
            options: {
                flow: {
                    steps: {
                        css: ['cssmin'],
                        js: ['uglify']
                    },
                    posts: {
                        css: [{
                            name: 'cssmin', // next part fixes font-awesome
                            createConfig: function (context, block) {
                                var generated = context.options.generated;
                                generated.options = {
                                    keepSpecialComments: 0, rebase: false
                                };
                            }
                        }]
                    }
                }
            }
        },
        // concatination
        concat: {
            options: {
                separator: ';'
            },
            // dist configuration is provided by usminPrepare
            dist: {}
        },
        

        // these must be specificed or else usemin task wont run correctly

        // uglify
        uglify: {
            // dist configuration is provided by useminPreprae
            dist: {}
        },

        cssmin: {
            dist: {}
        },

        // Filerev: adds additional extension to main name so
        // when we prepare a new version of the website. if someone
        // has a cached version of the old website, it will not redownloaded
        // unchanged files (main css and main js files)
        // so filerev adds the version to the extension
        filerev: {
            options: {
                encoding: 'utf8',
                algorithm: 'md5',
                length: 20
            },
            release: {
                // filerev:release hashes(md5) all assets (images, js, and css)
                // in dist directory
                files: [{
                    src: [
                        'dist/js/*.js',
                        'dist/css/*.css',
                    ]
                }]
            }
        },

        // Usemin: replaces all assets with their revved version in html
        // and css files. options.assetDirs contains the directories for
        // finding the assets according to their relative paths
        usemin: {
            html: ['dist/conctactus.html','dist/aboutus','dist/index.html'],
            options: {
                assetDirs: ['dist', 'dist/css', 'dist/js']
            }
        },

        htmlmin: { // task
            dist: { //Target
                options: {  // Target Options
                    collapseWhitespace: true
                },
                file: { // Dictionary of Files
                    'dist/index.html': 'dist/index.html', // 'destination' : 'source'
                    'dist/contactus.html': 'dist/contactus.html',
                    'dist/aboutus.html': 'dist/aboutus.html',
                }
            }
        }
    });

    grunt.registerTask('css',['sass']);
    grunt.registerTask('default', ['browserSync','watch']);
    grunt.registerTask('build', [
        'clean',
        'copy',
        'imagemin',
        'useminPrepare',
        'concat',
        'cssmin',
        'uglify',
        'filerev',
        'usemin',
        'htmlmin'
    ]);
};