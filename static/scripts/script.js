//journal event handlers
document.getElementById("listEntries").addEventListener('click', populateEntry);
document.getElementById("btnDeleteEntry").addEventListener('click', deleteEntry);
document.getElementById("btnAddEntry").addEventListener('click', addEntry);
document.getElementById("btnUploadJournal").addEventListener('click', uploadJournal);

// initialise journal list
document.addEventListener("DOMContentLoaded", function(){
 console.log("calling getJournal");
 getJournalEntries();
});

//utility functions - DO NOT EDIT OR DELETE
function getUniqueKey(){
 return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
 (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
 );
};

function getJournalEntries(){
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
  console.log(this.readyState, this.status);
  if (this.readyState == 4 && this.status == 200) {
    console.log("success");
    let journalResult = JSON.parse(this.responseText);
    const jokes = [];
    for (let item of journalResult.jokes) {
      jokes.push([String(item.entryDate), String(item.author), String(item.joke), String(item.punchline)]);
    }
      console.log(jokes);
      jokes.sort(() => Math.random() - 0.5);
      for (let i = 0; i <= 5; i++) {
        document.getElementById("placeholder"+(i+1)).innerHTML = jokes[i];
      }
    }
   else{
      console.log("xhttp request problem occurred")
    }
  }
  xhttp.open("GET", "api/journal", true);
  xhttp.send();
}

function clearEntry(){
 document.getElementById("idEntry").value = "";
 document.getElementById("dateEntry").value = "";
 document.getElementById("namEntry").value = "";
 document.getElementById("txtNote").value = "";
}

function populateEntry(e){
clearEntry()
  let itemIndex = e.target.id
  let itemDate = e.target.getAttribute("dat");
  let itemName = e.target.getAttribute("name");
  let itemNote = e.target.getAttribute("note");
  document.getElementById("idEntry").value = itemIndex;
  document.getElementById("dateEntry").value = itemDate;
  document.getElementById("namEntry").value = itemName;
  document.getElementById("txtNote").value = itemNote;
}

function addEntry(){
  let uid = getUniqueKey();
  const dat = new Date();
  let newDate = dat.getDate() + "/" + dat.getMonth() + "/" + dat.getFullYear();
  let newName = document.getElementById("nameAdd").value;
  let newNote = document.getElementById("txtAdd").value;
  if(newName == "" || newNote == ""){
  alert("Please enter values in the name and the notes inputs.")
  }else{
    let newEntry = document.createElement('li');
    newEntry.id = uid;
    newEntry.setAttribute("dat", newDate)
    newEntry.setAttribute("name", newName);
    newEntry.setAttribute("note", newNote);
    newEntry.innerText = newDate;
    document.getElementById("listEntries").appendChild(newEntry)
    alert("Journal entry added to clientsdide list. Upload to save the list.")
    }
  }

function deleteEntry(){
 let idToDelete = document.getElementById("idEntry").value;
 if(idToDelete != ""){
   document.getElementById(idToDelete).remove();
   //remove deleted details from selected entry boxes
   clearEntry()
   alert("Journal entry deleted on clientside. Upload to save changes.")
  } else {
    alert("Please select an entry to delete.")
  }
}

function uploadJournal(){
  let uploadList = document.getElementById("listEntries");
  var entriesList = uploadList.getElementsByTagName("li")
  //console.log("entries no. " + entriesList.length)
  // make object to convert to JSON
  let uploadObject = {};
  uploadObject.journals = [];
  //list items and put into an array of objects
  //console.log(entriesList)
  for (let i = 0; i < entriesList.length ; i++){
    //console.log("upload entry " + entriesList[i].innerHTML);
    let objEntry = {}
    objEntry.date = entriesList[i].getAttribute("dat");
    objEntry.name = entriesList[i].getAttribute("name");
    objEntry.note = entriesList[i].getAttribute("note");
    uploadObject.journals.push(objEntry);
  }
  //console.log("upload Object:" + JSON.stringify(uploadObject));
  //console.log(uploadObject.journals[0])
  //convert object to JSON and PUT to api
  let xhttp = new XMLHttpRequest();
  let url = "/api/journal";
  xhttp.onreadystatechange = function() {
    let strResponse = "Error: no response";
    if (this.readyState == 4 && this.status == 200) {
      strResponse = JSON.parse(this.responseText);
      alert(strResponse.message)
    }
  };
  xhttp.open("PUT", url, true);
  var data = JSON.stringify(uploadObject)
  xhttp.setRequestHeader("Content-Type", "application/json");
  xhttp.send(data);
}