const fs = require("fs");
const path = require("path");

const directoryPath = path.join(__dirname, "../src");
const fromExt = process.argv[2];
const toExt = process.argv[3];

function handleFile(filepath) {
  if (path.extname(filepath) === fromExt) {
    fs.rename(filepath, filepath.replace(fromExt, toExt), function (err) {
      if (err) console.log("ERROR: " + err);
    });
  }
}

function handleDirectory(directoryPath) {
  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      console.log("Unable to scan directory: " + err);
      return;
    }

    files.forEach((filename) => {
      const filepath = path.join(directoryPath, filename);
      fs.stat(filepath, function (err, stats) {
        if (err) {
          console.log(err);
          return;
        }
        if (stats.isDirectory()) {
          handleDirectory(filepath);
        } else {
          handleFile(filepath);
        }
      });
    });
  });
}

handleDirectory(directoryPath);
