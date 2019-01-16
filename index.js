//const mysql = require("mysql");
const express = require("express");
var app = express();
const bodyparser = require("body-parser");
const fileUpload = require("express-fileupload");
const fs = require("fs");
const port = 5500;
app.use(bodyparser.json());
app.use(fileUpload());
app.use(express.urlencoded());

app.get("/", function(req, res) {
  return res.redirect("/public/index.html");
});

app.use("/public", express.static(__dirname + "/public"));

app.post("/upload", function(req, res) {
  let sampleFile;
  let uploadPath;

  if (Object.keys(req.files).length == 0) {
    res.status(400).send("No files were uploaded.");
    return;
  }
  sampleFile = req.files.sampleFile;
  uploadPath = __dirname + "/uploads/" + sampleFile.name;

  sampleFile.mv(uploadPath, function(err) {
    if (err) {
      return res.status(500).send(err);
    }

    res.send("File uploaded to " + uploadPath);
  });
});

app.post("/submit-form", (req, res) => {
  const fullName = req.body.fullName;
  const age = req.body.age;
  const bioData = req.body.bioData;
  const gender = req.body.gender;
  const addedOn = new Date().toLocaleString();
  //...
  console.log(fullName);

  let userData = {
    fullName: fullName,
    age: age,
    gender: gender,
    bioData: bioData,
    addedOn: addedOn
  };

  let file = "users.json";

  fs.readFile(file, (err, data) => {
    if (err && err.code === "ENOENT") {
      return fs.writeFile(
        file,
        JSON.stringify([userData]),
        error => console.error
      );
    } else if (err) {
      console.error(err);
    } else {
      try {
        // Test
        const fileData = JSON.parse(data);
        fileData.push(userData);
        fs.writeFile(file, JSON.stringify(fileData), err => {
          if (err) throw err;
          res.json({
            success: true,
            message: "Data saved successfully!"
          });
          console.log("Data written to file");
        });
      } catch (exception) {
        console.error(exception);
      }
    }
  });
});

app.listen(port, function() {
  console.log(`App listening on port ${port}`);
});
