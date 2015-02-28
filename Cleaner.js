/*
    Check the folder to make sure you have all the files you need...

    Pass the chome client folder...

    DEBUG::::
    node-debug --web-port 9000 --debug-port 9005 --save-live-edit Cleaner.js

*/


var fs = require("fs");
var path = require("path");
var WalkFolder = require("./lib/WalkFolder");






var testFILE = 'RAWmanifest.json';

/*
    Wrapping everything up in this one object...
*/
var Cleaner = {
    CONFIG: {
        SourceFolder: __dirname + '/TESTFOLDER',
        // SourceFolder: '/media/johnrnelson/Work(Enc)/TekApp/ChromeApp',
        TargetFolder: __dirname + '/FINSIHME',
    },
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



WalkFolder.CompileCode('/media/johnrnelson/Work(Enc)/TekApp/ClientBuilder/TESTFOLDER/devtools/devtools.js',
    '/media/johnrnelson/Work(Enc)/TekApp/ClientBuilder/FINSIHME/OKJOHN--devtools--CHECKTHIS....js', {
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

/*
console.log('Starting Cleaner from :' + __dirname)

WalkFolder.BuildTargetFolders(Cleaner.CONFIG.TargetFolder);

WalkFolder.BuildScriptMap(Cleaner.CONFIG.SourceFolder, Cleaner.CONFIG.TargetFolder, function() {
    console.log('Finished coping files...');
    Cleaner.CLEAN.Manifest();
})
 
*/
