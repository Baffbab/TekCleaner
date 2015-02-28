var COM = {};



/*
  Here we setup our actual grunt task...
*/
module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        watch: {
            scripts: {
                // files: ['**/*.js'],
                files: ['/media/johnrnelson/Work(Enc)/TekCleaner/TESTING/SOURCE/*.js'],
                // tasks: ['jshint'],
                options: {
                    spawn: false,
                    // event: ['added', 'deleted'],
                },
            },
            css: {
                files: ['/media/johnrnelson/Work(Enc)/TekCleaner/TESTING/SOURCE/*.css'],
                // tasks: ['jshint'],
                options: {
                    spawn: false,
                    // event: ['added', 'deleted'],
                },
            },

        }
    });

    // Load the plugins..
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Default task(s)...
    grunt.registerTask('default', ['watch']);   


    grunt.event.on('watch', function(action, filepath, target) {
        grunt.log.writeln('Target:' + target + '\r\nFilePath:' + filepath + '\r\nAction:' + action);
    });

};
