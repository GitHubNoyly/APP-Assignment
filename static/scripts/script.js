//event handlers for jokes
document.getElementById("jokeEntries").addEventListener('click', populateEntry);
document.getElementById("btnDeleteEntry").addEventListener('click', deleteEntry);
document.getElementById("btnAddEntry").addEventListener('click', addEntry);
document.getElementById("btnUploadJokes").addEventListener('click', uploadJournal);

// initialise jokes list
document.addEventListener("DOMContentLoaded", function(){
    console.log("calling getJokes")
    getJokes();
});

//utility functions - DO NOT EDIT OR DELETE
function getUniqueKey(){
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
};

function getJokes(){
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) { 
      let jokeResult = JSON.parse(this.responseText);
      let jokeList = "";
      for (let item of jokeResult.jokes) {
        jokeList = jokeList + "<li dat='" + String(item.date) +  "' joke='" + String(item.joke) + "' punchline='" + String(item.punchline) + "' id='joke " + jokeResult.jokes.indexOf(item) + "'>" + String(item.date) + "</li>";
      }
     
    document.getElementById("jokeEntries").innerHTML = jokeList;
    
    }
    else{
      console.log("xhttp request problem occurred")
    }
  }
  xhttp.open("GET", "api/jokes", true);
  xhttp.send();
}

function clearEntry(){
    document.getElementById("idEntry").value = "";
    document.getElementById("dateEntry").value = "";
    document.getElementById("jokeEntry").value = "";
    document.getElementById("punchlineEntry").value = "";
}

function populateEntry(e){
    //clear old entry
    clearEntry()
    //console.log("item: " + e.target);
    let itemIndex = e.target.id
    let itemDate = e.target.getAttribute("dat");
    let itemJoke = e.target.getAttribute("joke");
    let itemPunchline = e.target.getAttribute("punchline");
    document.getElementById("idEntry").value = itemIndex;
    document.getElementById("dateEntry").value = itemDate;
    document.getElementById("jokeEntry").value = itemJoke;
    document.getElementById("punchlineEntry").value = itemPunchline;
}

function addEntry(){
  let uid = getUniqueKey();
  console.log("uid: " + uid)
  const d = new Date();
  let newDate = d.getDate() + "/" + d.getMonth() + "/" + d.getFullYear() + " " + d.getHours() + ":" + d.getMinutes();
  console.log("date: " + newDate);
  let newJoke = document.getElementById("jokeAdd").value;
  let newPunchine = document.getElementById("punchlineAdd").value;
  if(newJoke == "" || newPunchine == ""){
    alert("Please enter values in the name and the notes inputs.")
  }else{
    //create new li item
    let newEntry = document.createElement('li');
    newEntry.id = uid;
    newEntry.setAttribute("dat", newDate)
    newEntry.setAttribute("joke", newJoke);
    newEntry.setAttribute("punchline", newPunchine);
    newEntry.innerText = newDate;
    document.getElementById("jokeEntries").appendChild(newEntry)
    alert("joke has now been added to the list above. Upload to save the list.")
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
  //get list 
  let uploadList = document.getElementById("jokeEntries");
  var entriesList = uploadList.getElementsByTagName("li")
  //console.log("entries no. " + entriesList.length)
  // make object to convert to JSON
  let uploadObject = {};
  uploadObject.jokes = [];
  //list items and put into an array of objects
  //console.log(entriesList)
  for (let i = 0; i < entriesList.length ; i++){
    //console.log("upload entry " + entriesList[i].innerHTML);
    let objEntry = {}
    objEntry.date = entriesList[i].getAttribute("dat");
    objEntry.joke = entriesList[i].getAttribute("joke");
    objEntry.punchline = entriesList[i].getAttribute("punchline");
    uploadObject.jokes.push(objEntry);
  }
  //console.log("upload Object:" + JSON.stringify(uploadObject));
  //console.log(uploadObject.journals[0])

  //convert object to JSON and put to api
  let xhttp = new XMLHttpRequest();
  let url = "/api/jokes"
  
    xhttp.onreadystatechange = function() {
      let strResponse = "Error: no response";
      if (this.readyState == 4 && this.status == 200) {
        strResponse = JSON.parse(this.responseText);
        alert(strResponse.message)
      }
      //document.getElementById(elResponse).setAttribute("value",  strResponse.result);
      
    };
    xhttp.open("PUT", url, true);
    // Converting JSON data to string
    var data = JSON.stringify(uploadObject)
    // Set the request header i.e. which type of content you are sending
    xhttp.setRequestHeader("Content-Type", "application/json");
    //send it
    xhttp.send(data);

}