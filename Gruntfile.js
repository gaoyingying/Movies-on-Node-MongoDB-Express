module.exports=function(grunt){
    grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      public: {
        files: {
          'public/<%= pkg.name %>.min.js': ['public/js/*.js']
        }
      }
    },
    jshint:{
        files:['public/js/*.js'],
        options:{
            '-W033':true,  
        }
    },
    watch:{
        js:{
            files:['<%= jshint.files %>'],
            task:['jshint','uglify'],
            options:{
            spawn:false,
            livereload:true
        }
        },
        jade:{
            files:['views/**'],
            options:{
                livereload:true
            }
        }
    },
    
    nodemon: {
     dev: {
          script: 'app.js',
          options: {
                args:[],
                ignoredFiles:['node_modules/**','DS_store'],
                watchedExtensions:['js'],
                watchedFolders:['./'],
                debug:true,
                delayTime:1,
                env:{
                    PORT:3000
                },
                cwd:__dirname
     }
     }
},
    concurrent:{
        tasks:['nodemon','watch'],
        options:{
            logConcurrentOutput:true
        }
    }
    });
    
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-nodemon');
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.option('force',true)
    grunt.registerTask('default',['concurrent']);
};
