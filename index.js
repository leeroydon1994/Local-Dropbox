// Require node modules
const express = require("express");
const bodyParser = require("body-parser");
const expressFileUpload = require("express-fileupload");

// Native node modules
const fs = require("fs");
const path = require("path");

// Set up the packages that we have just required
const app = express();

// Set up application level middleware
app.use(bodyParser.urlencoded({ extended: false })); // URL
app.use(expressFileUpload()); //

// Server the uploaded folder to the server, allowing the users to download cached information.
app.use(express.static("Uploads"));
// Static website
app.use(express.static("Pages"));

// Set up object cache
let caches = {};

const directory = __dirname + path.sep + "Uploads";

// Set up promise functions
// fsReadFile + fsWriteFile (But why? Doesn't the reading process start first?)
function writeFile(name, body) {
  return new Promise((resolve, reject) => {
    fs.writeFile(directory + path.sep + name, body, (err) => {
      if (err) {
        return reject(err);
      } else {
        console.log(`Successful write: ${name}`);
        resolve(name);
      }
    });
  }).then(readFile);
}

function readFile(fileName) {
  return new Promise((resolve, reject) => {
    fs.readFile(directory + path.sep + fileName, (err, body) => {
      if (err) {
        reject(err);
      } else {
        resolve(body);
      }
    });
  });
}

// Middleware for checking the request type
app.use("/", (req, res, next) => {
  // console.log(req.url);
  console.log(req.method);
  next();
});

// Route handler
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/Pages/index.html");
});

/* ==================================== */

console.log(`Caches: ${caches}`);

app.post("/files", (req, res) => {
  // after the request path upload.single('upload'),
  // The case if the upload file is in the form of the array prototype (???)
  if (req.files.upload instanceof Array) {
    for (var i = 0; i < req.files.upload.length; i++) {
      let file = req.files.upload[i].name;
      let data = req.files.upload[i].data;
      caches[file] = writeFile(file, data);
      // console.log(caches);
      caches[file]
        .then(() => res.sendFile(__dirname + "/Pages/download.html"))
        .catch((error) => {
          console.log(error);
          res.end(error);
        });
    }
  } else {
    // The case if the upload file is in the form of the object (???)

    console.log(req.files);

    let file = req.files.upload.name;
    let data = req.files.upload.data;

    caches[file] = writeFile(file, data); //IMPORTANT

    caches[file]
      .then(() =>
        // After writing the file...
        res.sendFile(__dirname + "/Pages/download.html")
      ) // Display the hint
      .catch((e) => res.status(500).send(e.message)); // Display error message if fails
  }
});

app.get("/uploaded/:name", (req, res) => {
  console.log(req.params.name);
  if (caches[req.params.name] == null) {
    console.log("reading from folder");
    caches[req.params.name] = readFile(req.params.name);
  }
  console.log(caches);
  console.log(caches[req.params.name]);

  caches[req.params.name]
    .then((body) => {
      console.log(body);
      res.send(body);
    })
    .catch((e) => res.status(500).send(e.message));
});

/* ==================================== */

// app.post("/data/:name", (req, res) => {
//   cache[req.params.name] = req.body.data;
//   res.send(cache);
// });

// Listening at port 8080
app.listen(8080, () => {
  console.log("Application listening to port 8080");
});
