var fs = require('fs');


exports.readFiles = function ( configDir ) {

    fs.readdir(configDir, function(err, files) {
        for (var index in files) {
            var file = files[index],
                oldPath = configDir + "/" + file,
                newPath = configDir + "/processed/" + file;
            console.log("Moving file from: " + oldPath + " to " + newPath);

            if (file.indexOf(".txt") !== -1) {
                fs.rename(oldPath, newPath);
            }
        }
    })

}
