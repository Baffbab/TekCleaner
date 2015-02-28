var fs = require("fs");
var path = require("path");
// var ClosureCompiler = require("closurecompiler");

//If you did an 'npm upgrade' in this folder then you should have this bad boy...
var compressor = require('yuicompressor');


/*

*/



function CompileCode(SourceFile, TargetFile, Options, ReturnFunction) {
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
                    ReturnFunction('Compiled to '+data.length)
                }
            })
        }

    });

    /*
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

                if (result) {
                    // console.log(result);
                    ReturnFunction(result);
                    var saved = fs.writeFileSync(TargetFile, result, 'utf8');
                    // Write result to file
                    // Display error (warnings from stderr)
                } else {
                    // console.log(error);
                    throw error
                    // ReturnFunction(error);
                    // Display error...
                }
            }
        );
    */
}
exports.CompileCode = CompileCode;



var BuildTargetFolders = function(TargetFolder) {

    function deleteFolderRecursive(path) {
        if (fs.existsSync(path)) {
            fs.readdirSync(path).forEach(function(file, index) {
                var curPath = path + "/" + file;
                if (fs.lstatSync(curPath).isDirectory()) { // recurse
                    deleteFolderRecursive(curPath);
                } else { // delete file
                    fs.unlinkSync(curPath);
                }
            });
            fs.rmdirSync(path);
        }
    };
    deleteFolderRecursive(TargetFolder)

    fs.mkdirSync(TargetFolder);
};
exports.BuildTargetFolders = BuildTargetFolders;
//****************************



function BuildScriptMap(SourceFolder, TargetFolder, done) {
    var dead = false;

    // this flag will store the number of pending async operations
    var pending = 0;

    var fail = function(err) {
        if (!dead) {
            dead = true;
            done(err);
        }
    };

    var checkSuccess = function() {
        if (!dead && pending == 0) {
            done();
        }
    };
    // debugger;


    // this function will recursively explore one directory in the context defined by the variables above
    var dive = function(dir) {
        // path.sep
        //ns[]


        pending++; // async operation starting after this line
        fs.readdir(dir, function(err, list) {
            if (!dead) { // if we are already dead, we don't do anything
                if (err) {
                    fail(err); // if an error occured, let's fail
                } else { // iterate over the files

                    list.forEach(function(file) {
                        if (!dead) { // if we are already dead, we don't do anything
                            var currPath = dir + "/" + file;
                            // NameSpace[file] = file;
                            pending++; // async operation starting after this line
                            fs.stat(currPath, function(err, stat) {
                                if (!dead) { // if we are already dead, we don't do anything
                                    if (err) {
                                        fail(err); // if an error occured, let's fail
                                    } else {

                                        var targetDIR = currPath.replace(SourceFolder, TargetFolder);

                                        if (stat && stat.isDirectory()) {
                                            // console.log(' ** Create FOLDER:' + file);
                                            // console.log(TargetFolder + '/' + file);


                                            fs.mkdirSync(targetDIR);

                                            dive(currPath); // it's a directory, let's explore recursively
                                        } else {



                                            var fileTyle = path.extname(file);

                                            // debugger;;
                                            /*
                                                If this is a javascript file then compile it.. otherwise copy it...
                                            */
                                            switch (fileTyle) {
                                                case ".css":
                                                    console.log('OK compile this FILE:' + currPath);

                                                    CompileCode(currPath, targetDIR, {
                                                        //Compressor Options:
                                                        charset: 'utf8',
                                                        type: 'css',
                                                        nomunge: false,
                                                        // 'line-break': 80
                                                    }, function() {
                                                        console.log('Compiled:' + currPath);
                                                    });
                                                    break;
                                                case ".js":
                                                    console.log('OK compile this FILE:' + currPath);

                                                    CompileCode(currPath, targetDIR, {
                                                        //Compressor Options:
                                                        charset: 'utf8',
                                                        type: 'js',
                                                        nomunge: true,
                                                        // 'line-break': 80
                                                    }, function() {
                                                        console.log('Compiled:' + currPath);
                                                    });
                                                    break;

                                                default:
                                                    fs.writeFileSync(targetDIR, fs.readFileSync(currPath));
                                                    break;
                                            }


                                        }
                                        pending--;
                                        checkSuccess(); // async operation complete
                                    }
                                }
                            });
                        }
                    });
                    pending--;
                    checkSuccess(); // async operation complete
                }
            }
        });
    };



    // start exploration
    dive(SourceFolder);


};

exports.BuildScriptMap = BuildScriptMap;



// //FOR LOCL RUN ONLY
// BuildScriptMap(config.SourceFolder, function(ScriptMapJSON) {
//     // change true or false for compile!!!
//     // WriteScriptMap(ScriptMapJSON);
//     // console.log(ScriptMapJSON)
// })
