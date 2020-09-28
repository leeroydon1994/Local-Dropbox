// Display the file information after choosing files
function myFunction() {
  let fileUpload = document.getElementById("fileUpload");
  let element = "";

  if (fileUpload.files) {
    // .files => the extra attribute of file input
    if (fileUpload.files.length != 0) {
      // If there is a file...

      let nameList = [];

      for (var i = 0; i < fileUpload.files.length; i++) {
        let file = fileUpload.files[i];
        let size = file.size;
        let space = "&nbsp&nbsp&nbsp";
        let unit;

        if (size / 1024 >= 1 && size / (1024 * 1024) < 1) {
          // File volume
          size /= 1024;
          unit = "KB";
        } else if (
          size / (1024 * 1024) >= 1 &&
          size / (1024 * 1024 * 1024) < 1
        ) {
          size /= 1024 * 1024;
          unit = "MB";
        } else {
          size /= 1024 * 1024 * 1024;
          unit = "GB";
        }

        nameList.push(file.name);
        element += `<p class="filesName">${i + 1}.${space}${
          file.name
        }${space}${space}${size.toFixed(2)}${unit}</p>`;
      }
      localStorage.setItem("nameList", JSON.stringify(nameList)); // Store the number of file to download(), used in another page, /download.html
    }
  } else {
    if (fileUpload.value == "") {
      // There is no input button...
      alert("Select one or more files.");
    } else {
      alert("The files property is not supported by your browser.");
    }
  }
  document.getElementById("file-info").innerHTML = element;
}

// Submit button
function submit() {
  let submit = document.getElementById("submit-button");
  submit.addEventListener("click", (e) => {
    // If there is no file chosen...
    if (fileUpload.files.length == 0) {
      e.preventDefault();
      alert("Select files to be uploaded first!");
    } else {
    }
  });
}

// Download button
function download() {
  let fileAmount = JSON.parse(localStorage.getItem("nameList")); // Parse the storage data
  console.log(fileAmount);
  for (i = 0; i < fileAmount.length; i++) {
    // Make buttons
    $("#download").append(
      `<a type="button" class="btn download-button btn-lg" href="http://localhost:8080/uploaded/${fileAmount[i]}" role="button" id="download-button-${i}">Download ${fileAmount[i]}</a>`
    );
  }
  // $("#download").click(() => {
  //   $.ajax({
  //     url: "/uploaded/",
  //   });
  // });

  // console.log(fileName);
  // for (var i = 0; i < fileName.length; i++) {
  //   let name = fileName[i];
  //   console.log(name);
  //   downloadElement += ;
  // }
}
