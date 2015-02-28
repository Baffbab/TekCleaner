var fs = require("fs");



//If you did an 'npm upgrade' in this folder then you should have these bad boys...
var compressor = require('yuicompressor');
var ClosureCompiler = require("closurecompiler"); //https://github.com/dcodeIO/ClosureCompiler.js


function ManageList(FileList) {
    var cntr = 0;
    // debugger;
    for (var f in FileList) {
        cntr += 1;
 
        var fileOBJ = FileList[f];
        // console.log('file:', fileOBJ);

        function sleep(time, callback) {
            var stop = new Date().getTime();
            while (new Date().getTime() < stop + time) {;
            }
            callback();
        }


        function OkCompileIt(File2Compile, Finished) {
            CompileCode(File2Compile.Source,
                File2Compile.Target, {
                    //Compressor Options:
                    charset: 'utf8',
                    type: 'js',
                    nomunge: true,
                    // 'line-break': 80
                }, Finished);
        };
        //Simple way to give it time to compile. Each request adds a lil bit to wait...
        sleep(cntr*2500, function() {
            console.log('Starting compile for:', fileOBJ.Source);
            // executes after one second, and blocks the thread
            OkCompileIt(fileOBJ, function(Response) {
                // body...
                // debugger;
                if (Response.error) {
                    console.log('ERROR!!', Response.error);
                } else {

                    console.log('finsihed compiling ' + Response.Source, Response.Target);

                }
            });
        });

    }
}
exports.ManageList = ManageList;



function CompileCode(SourceFile, TargetFile, Options, ReturnFunction) {


    ClosureCompiler.compile(
        // ['file1.js', 'file2.js'],
        [SourceFile], {
            // Options in the API exclude the "--" prefix
            // compilation_level: "ADVANCED_OPTIMIZATIONS",
            compilation_level: "SIMPLE_OPTIMIZATIONS",

            // Capitalization does not matter 
            Formatting: "PRETTY_PRINT",

            // create_source_map: "mymaptest",
            language_in: "ECMASCRIPT5",
            // output_manifest:"themainfestfile"


            // If you specify a directory here, all files inside are used
            // externs: ["externs/file3.js", "externs/contrib/"],

            // ^ As you've seen, multiple options with the same name are
            //   specified using an array.
            // ...
        },
        function(error, result) {
            // fs.unlinkSync(FilePath);
            var returnValue = {
                Source: SourceFile,
                Target: TargetFile
            }

            if (result) {
                // console.log(result);
                var saved = fs.writeFileSync(TargetFile, result, 'utf8');
            } else {
                // throw error
                returnValue.error = error;
            }
            ReturnFunction(returnValue);
        }
    );

}
exports.CompileCode = CompileCode;















function CompileCodes(SourceFiles,TargetFile, Options, ReturnFunction) {
debugger;

    ClosureCompiler.compile(
        // ['file1.js', 'file2.js'],
        SourceFiles, {
            // Options in the API exclude the "--" prefix
            // compilation_level: "ADVANCED_OPTIMIZATIONS",
            compilation_level: "SIMPLE_OPTIMIZATIONS",

            // Capitalization does not matter 
            Formatting: "PRETTY_PRINT",

            // create_source_map: "mymaptest",
            // language_in: "ECMASCRIPT5",
            // output_manifest:"themainfestfile"


            // If you specify a directory here, all files inside are used
            // externs: ["externs/file3.js", "externs/contrib/"],
            // externs:SourceFolders

            // ^ As you've seen, multiple options with the same name are
            //   specified using an array.
            // ...
        },
        function(error, result) {
            // fs.unlinkSync(FilePath);

            if (result) {
                // console.log(result);
                var saved = fs.writeFileSync(TargetFile, result, 'utf8');
            }
            var returnValue = {
                Error:error,
                Files: SourceFiles,
                Target:TargetFile,
                Saved:saved
            }

            ReturnFunction(returnValue);
        }
    );

}
exports.CompileCodes = CompileCodes;







/*

*/
// function CompressCode(SourceFile, TargetFile, Options, ReturnFunction) {
function CompressCode(SourceFile, TargetFile, Options, ReturnFunction) {
    var myOptions = Options;

    compressor.compress(SourceFile, myOptions, function(err, data, extra) {
        // debugger;

        //err   If compressor encounters an error, it's stderr will be here
        if (err) {
            console.log('Error in file..', SourceFile);
            debugger;;
        } else {
            if (data.length < 1) {
                console.log('Empty Length!!!!!! ERROR', SourceFile, TargetFile, myOptions)
                debugger;;
            }

            //data  The compressed string, you write it out where you want it
            //extra The stderr (warnings are printed here in case you want to echo them
            console.log('');
            console.log(TargetFile, 'Compiled Length:' + data.length, extra);
            fs.writeFile(TargetFile, data, function(err) {
                if (err) {

                    throw err;
                    ReturnFunction(err);
                } else {
                    ReturnFunction('Compiled to ' + data.length)
                }
            })
        }

    });
}
