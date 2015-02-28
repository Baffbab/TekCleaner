var fs = require("fs");
var path = require("path");




var DeleteTargetFolders = function(TargetFolder) {

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
    console.log('Target folder is now empty. Path:' + TargetFolder);
};
exports.DeleteTargetFolders = DeleteTargetFolders;
//****************************



function BuildScriptMap(ScriptConfig, done) {
    var dead = false;
    var SourceFolder = ScriptConfig.SourceFolder;
    var TargetFolder = ScriptConfig.TargetFolder;
    var ignoreCompiles = ScriptConfig.COMPILER.Ignore;


    /*
        Quick function to check our paths and strip out ignored files...
    */
    function isIgnoredFileorFolder(Path, AmIgnoring) {
        var igPath = Path.toLowerCase();
        var pLen = Path.length;
        var returnValue = false;
        var isFound = -1,
            itmLC;
        // debugger;
        ignoreCompiles.forEach(function(ITEM) {
            itmLC = ITEM.toLowerCase();
            var isFound = igPath.indexOf(itmLC);
            if (isFound > -1) {
                returnValue = true;
            }
        });
        AmIgnoring(returnValue);
    };

    // this flag will store the number of pending async operations
    var pending = 0;

    var FileLists = {
        copied: [], //everything else...
        compiled: [], //js
        minified: [], //css
    };

    var fail = function(err) {
        if (!dead) {
            dead = true;
            console.log('\r\n\r\n\t ** ERROR in COMPILE!! ** ');
            console.log(err);
            done(null);
        }
    };

    var checkSuccess = function() {
        if (!dead && pending == 0) {
            // debugger;
            // console.log(FileLists)

            done(FileLists);
        }
    };
    // var fileTyle;

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
                                            var fileObj = {
                                                    Source: currPath,
                                                    Target: targetDIR
                                                }
                                                // var isignored=isIgnoredFileorFolder(currPath);
                                            isIgnoredFileorFolder(currPath, function(ShouldIgnore) {
                                                if (ShouldIgnore) {
                                                    fileObj.fileTyle = 'ignored';
                                                    // debugger;;

                                                } else {
                                                    fileObj.fileTyle = path.extname(file)

                                                }


                                                switch (fileObj.fileTyle) {
                                                    case ".css":

                                                        FileLists.minified.push(fileObj);
                                                        break;
                                                        /*
                                                            If this is a javascript file then compile it.. otherwise copy it...
                                                        */
                                                    case ".js":

                                                        FileLists.compiled.push(fileObj);

                                                        break;

                                                    default:
                                                        // debugger;
                                                        FileLists.copied.push(fileObj);
                                                        break;
                                                }; //end switch
                                            }); //end isIgnore...
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
