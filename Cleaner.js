/*
    Check the folder to make sure you have all the files you need...

    Pass the chome client folder...

    DEBUG::::
    node-debug --web-port 9000 --debug-port 9005 --save-live-edit Cleaner.js

*/


var fs = require("fs");
var path = require("path");

var WalkFolder = require("./lib/Walker");
var Compiler = require("./lib/Compiler");



/*
    Wrapping everything up in this one object...
*/
var Cleaner = {
    CONFIG: {
        SourceFolder: __dirname + '/TESTING/TESTFOLDER',
        // SourceFolder: '/media/johnrnelson/Work(Enc)/TekApp/ChromeApp',
        TargetFolder: __dirname + '/TESTING/dest',
        COMPILER: {
            Ignore: [
                // '/media/johnrnelson/Work(Enc)/TekCleaner/TESTING/SOURCE/EXTJS/ext-5.1.0',
                // '/media/johnrnelson/Work(Enc)/TekCleaner/TESTING/SOURCE/EXTJS/',
                // '/media/johnrnelson/Work(Enc)/TekCleaner/TESTING/SOURCE/resources/styles/ext-gray-5.0.1',
                // '/media/johnrnelson/Work(Enc)/TekCleaner/TESTING/SOURCE/Views',
                // '/media/johnrnelson/Work(Enc)/TekCleaner/TESTING/SOURCE/devtools'
            ]
        },
    },
    ///

    __IO: {
        ReadManifest: function(FilePath) {
            var fileContents = fs.readFileSync(FilePath, 'utf8');
            var fileJSON = JSON.parse(fileContents);
            return fileJSON;
        },
        WriteManifestFile: function(FilePath, fileContents) {
            fs.writeFile(FilePath, fileContents, function(err) {
                if (err) throw err;
            })
        },
    },

    CLEAN: {
        Manifest: function() {
            var MANIFEST = Cleaner.__IO.ReadManifest(Cleaner.CONFIG.TargetFolder + '/manifest.json');
            // console.log(MANIFEST)
            /*
                DEV: 554095947893-f9f5hrbrb7acotk6rcocj0t58dg0hk0r.apps.googleusercontent.com
                PROD:554095947893-ll5phsct8r3ohqtmpcsgca1snvp54gjo.apps.googleusercontent.com
            */
            var vDate = new Date();
            var version = vDate.getUTCFullYear() + '.' + (vDate.getUTCMonth() + 1) + '.' + vDate.getUTCDate();
            debugger;
            console.log(MANIFEST.oauth2.client_id);
            console.log(MANIFEST.version);
            console.log(version);
            MANIFEST.version = version;
            // MANIFEST.oauth2.client_id = '554095947893-ll5phsct8r3ohqtmpcsgca1snvp54gjo.apps.googleusercontent.com';
            Cleaner.__IO.WriteManifestFile(Cleaner.CONFIG.TargetFolder + '/manifest.json', JSON.stringify(MANIFEST, null, '\t'));
        }
    },
}

//fucks..
Cleaner.CONFIG.SourceFolder = '/media/johnrnelson/Work(Enc)/TekCleaner/TESTING/SOURCE';
Cleaner.CONFIG.TargetFolder = '/media/johnrnelson/Work(Enc)/TekCleaner/TESTING/dest';
/*
Compiler.CompileCode(srcFolder+'/devtools/devtools.js',
    destFolder+'/testme.js', {
        //Compressor Options:
        charset: 'utf8',
        type: 'js',
        nomunge: true,
        // 'line-break': 80
    },
    function(argument) {
        // body...
        console.log(argument)
    });
*/
/*
 */
console.log('Starting Cleaner from :' + __dirname)

WalkFolder.DeleteTargetFolders(Cleaner.CONFIG.TargetFolder);

WalkFolder.BuildScriptMap(Cleaner.CONFIG, function(ScriptMap) {
    // Cleaner.CONFIG.TargetFolder

    if (!ScriptMap) {
        console.log('Error in building the script map...');
    } else {
        console.log('Finished building Script Map...');

        // console.log('Looping Copied('+ScriptMap.copied.length+')...:');
        // for (var f in ScriptMap.copied) {
        //     var fileOBJ = ScriptMap.copied[f];
        //     // console.log('file:', fileOBJ);
        //     console.log(fileOBJ.Source, fileOBJ.Target);
        //     // debugger;;
        //     fs.writeFileSync(fileOBJ.Target, fs.readFileSync(fileOBJ.Source));
        // }


        // console.log('Looping Compiled(' + ScriptMap.compiled.length + ')...:');
        // debugger;
        // Compiler.ManageList(ScriptMap.compiled, function(AmDone) {
        //     console.log('mmmmm')
        // });




        console.log('Looping minified('+ScriptMap.minified.length+')...:');
        for (var f in ScriptMap.minified) {
            var fileOBJ = ScriptMap.minified[f];
            console.log('file:', fileOBJ);
            Compiler.CompressCode(fileOBJ.Source,fileOBJ.Target,{},function(){
                
            })
        }





        console.log('finsihed....');
    }
    // Cleaner.CLEAN.Manifest();
})
