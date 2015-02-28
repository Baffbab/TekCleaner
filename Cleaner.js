/*
    Check the folder to make sure you have all the files you need...

    Pass the chome client folder...

    DEBUG::::
    node-debug --web-port 9000 --debug-port 9005 --save-live-edit Cleaner.js

*/
/*
    Good docs on how to use this...
    https://developers.google.com/closure/compiler/docs/api-tutorial3
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
 */
console.log('Starting Cleaner from :' + __dirname)


function DoTeamDebugRun() {

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




            // console.log('Looping minified('+ScriptMap.minified.length+')...:');
            // for (var f in ScriptMap.minified) {
            //     var fileOBJ = ScriptMap.minified[f];
            //     console.log('file:', fileOBJ);
            //     Compiler.CompressCode(fileOBJ.Source,fileOBJ.Target,{},function(){

            //     })
            // }





            console.log('finsihed....');
        }
        // Cleaner.CLEAN.Manifest();
    });
};



function TestBuildBuilder() {
        var bldrConfigPath = '/media/johnrnelson/Work(Enc)/TekCleaner/TESTING/BulkBuilder/bulkbuilder.json';
        var fileContents = fs.readFileSync(bldrConfigPath, 'utf8');
        var bldConfig = JSON.parse(fileContents);
        // console.log(bldConfig);
        // console.log(bldConfig.files);

        // var filesList = [];


        var execFile = require('child_process').execFile;
        var fileExt;
        execFile('find', ['/media/johnrnelson/Work(Enc)/TekCleaner/TESTING/BulkBuilder/WHOLEFOLDER/'], function(err, stdout, stderr) {
            var FOUND_FILE_LIST = stdout.split('\n');
            /* now you've got a list with full path file names */
            debugger;
            // console.log(FOUND_FILE_LIST)
            FOUND_FILE_LIST.forEach(function(ITEM) {
                fileExt = path.extname(ITEM);
                if (fileExt == '.js') {
                    // console.log('--->' + ITEM);
                    bldConfig.files.push(ITEM)

                }

            })

            console.log('ok start building...');
            console.log(bldConfig.files);
            var finsihedFilePath = '/media/johnrnelson/Work(Enc)/TekCleaner/TESTING/BulkBuilder/MYENDSCRIPT.js'
            Compiler.CompileCodes(bldConfig.files, finsihedFilePath, {}, function(Response) {
                if (Response.Error) {
                    console.log(Response.Error)
                }else{
                    console.log('File was written:',finsihedFilePath)

                }
            })
        }); //end getting files..
    } //End testing...

TestBuildBuilder()
