
module.exports = function(grunt) {
    var pkg = grunt.file.readJSON('package.json');

    grunt.initConfig({
        pkg: pkg,

        mochaTest: {
            test: {
                options: {
                    reporter: 'spec'
                },

                src: ['test/**/*.test.js']
            }
        }
    });

    Object.keys(pkg.devDependencies).forEach(function (devDependency) {
        if (devDependency.match(/^grunt\-/)) {
            grunt.loadNpmTasks(devDependency);
        }
    });

    grunt.registerTask('default', [ "test" ]);
    grunt.registerTask('test',  [ "mochaTest" ]);
};