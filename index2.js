const express = require("express");
var app = express();
const bodyparser = require("body-parser");
const fileUpload = require("express-fileupload");
const fs = require("fs");
const port = 5501;
app.use(bodyparser.json());
app.use(fileUpload());
app.use(express.urlencoded());

app.get("/", function(req, res) {
  return res.redirect("/public/index2.html");
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
  const name = req.body.name;
  const data = req.body.data;
  const destination = req.body.destination;
  const table = req.body.table;
  const database = req.body.database;
  const mode = req.body.mode;
  const seq = req.body.seq;
  const executors = req.body.executors;
  const driver = req.body.driver;
  const memory = req.body.memory;
  const cores = req.body.cores;
  const instances = req.body.instances;
  const shuffle = req.body.shuffle;
  const broadcast = req.body.broadcast;
  const addedOn = new Date().toLocaleString();
  //...
  console.log(name);

  let userData = {
    name: name,
    data: data,
    destination: destination,
    table: table,
    database: database,
    mode: mode,
    seq: seq,
    executors: executors,
    driver: driver,
    memory: memory,
    cores: cores,
    instances: instances,
    shuffle: shuffle,
    broadcast: broadcast,
    addedOn: addedOn
  };

  let file = "./users.json";

  fs.readFile(file, (err, data) => {
    console.log(userData);

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
        //   const fileData = JSON.parse(userData);
        const fileData = [];
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
