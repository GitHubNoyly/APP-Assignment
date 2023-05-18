//event handlers for the buttons on the homepage as well as the li tags
//event handler for li tags
document.getElementById("jokeEntries").addEventListener('click', populateEntry);
//event handler for deleting the entry, seperate from the random entry
document.getElementById("btnDeleteEntry").addEventListener('click', deleteEntry);
//event handler for deleting the random entry
document.getElementById("btnDeleteRandomEntry").addEventListener('click', deleteRandomEntry);
//event handler for loading another random joke entry when button is pressed
document.getElementById("btnLoadRandomEntry").addEventListener('click', randomJokeEntry);
//event handler for adding a joke entry to the list
document.getElementById("btnAddEntry").addEventListener('click', addEntry);
//event handler for uploading all off the current items within the list into the json file
document.getElementById("btnUploadJokes").addEventListener('click', uploadJournal);

// initialise jokes list
document.addEventListener("DOMContentLoaded", function(){
    console.log("calling getJokes")
    getJokes();
});

//utility functions - DO NOT EDIT OR DELETE
//this is used to create a random ID for newly added jokes
function getUniqueKey(){
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
};

//this function calls all items from the json file and presenting them onto the homepage
//jokes are displayed as list items using li tags
function getJokes(){
  //this creates a XMLHttp object which will be used to communicate to the flask server
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    //this checks to see if the connection is succesful
    //if successful, it wil grab all of the jokes from the json file and added to the jokeList variable as a li tag with it's own attributes used to call upon it later on
    if (this.readyState == 4 && this.status == 200) { 
      let jokeResult = JSON.parse(this.responseText);
      let jokeList = "";
      //goes through each item within the json file and creates an li tag for them with their own attributes such as id, date, joke, and punchline
      for (let item of jokeResult.jokes) {
        jokeList = jokeList + "<li dat='" + String(item.date) +  "' joke='" + String(item.joke) + "' punchline='" + String(item.punchline) + "' id='joke " + jokeResult.jokes.indexOf(item) + "'>" + String(item.date) + "</li>";
      }
     //this will display all of the items within the jokeList variable onto the homepage. only the date and time of submission is shown for each entry to save, otherwise too much informaton will be shown on the page
    document.getElementById("jokeEntries").innerHTML = jokeList;
    //this calls upon the randomEntry function which displays a random joke selected from the list and displays it on the page
    randomJokeEntry();
    
    }
    else{
      //if the connection to the server fails, an error message is shown
      console.log("xhttp request problem occurred")
    }
  }
  //using the GET method, we are able retrieve information from the server
  xhttp.open("GET", "api/jokes", true);
  xhttp.send();
}

//this function list is used to clear the text boxes that will display the selected joke
function clearEntry(){
    document.getElementById("idEntry").value = "";
    document.getElementById("dateEntry").value = "";
    document.getElementById("jokeEntry").value = "";
    document.getElementById("punchlineEntry").value = "";
}

//this function is used to display a random jokes selected from the list onto the page
function randomJokeEntry() {
  //this variable collects every item with the tag name "li"
  const jokes = document.getElementsByTagName("li");
  //this variable is used to randomly select an item with the tag name "li"
  //usng Math.floor, Math.random and jokes.length to randomly select an li tag within the range of the total li tags on the page
  const randomJoke = document.getElementsByTagName("li")[Math.floor(Math.random() * jokes.length)];
  console.log(randomJoke);
  //these variables will get the data within each attribute found within the li tag and assign it to the variable
  let itemIndex = randomJoke.getAttribute("id");
  let itemDate = randomJoke.getAttribute("dat");
  let itemJoke = randomJoke.getAttribute("joke");
  let itemPunchline = randomJoke.getAttribute("punchline");
  //this section displays the variables with the information from the attributes found in the li tag
  //this informaion will be displayed in the randomJokeEntry section
  document.getElementById("randomIdEntry").value = itemIndex;
  document.getElementById("randomDateEntry").value = itemDate;
  document.getElementById("randomJokeEntry").value = itemJoke;
  document.getElementById("randomPunchlineEntry").value = itemPunchline;
}

function populateEntry(e){
  //clear old entry
  clearEntry()
  //these variables will get the data within each attribute found within the li tag and assign it to the variable
  let itemIndex = e.target.id;
  let itemDate = e.target.getAttribute("dat");
  let itemJoke = e.target.getAttribute("joke");
  let itemPunchline = e.target.getAttribute("punchline");
  //this section displays the variables with the information from the attributes found in the li tag
  //this information will be displayed in the selectedJokeEntry section
  document.getElementById("idEntry").value = itemIndex;
  document.getElementById("dateEntry").value = itemDate;
  document.getElementById("jokeEntry").value = itemJoke;
  document.getElementById("punchlineEntry").value = itemPunchline;
}

function addEntry(){
  //this variable calls upon the getUniqueKey function to create a unique identifier for the added joke entry
  let uid = getUniqueKey();
  console.log("uid: " + uid)
  //this variable is used to call upon the Date object so that the date and time can be displayed
  const d = new Date();
  let newDate = d.getDate() + "/" + d.getMonth() + "/" + d.getFullYear() + " " + d.getHours() + ":" + d.getMinutes();
  console.log("date: " + newDate);
  //these two variables grab the values from the input fields and assign them to the following variables
  let newJoke = document.getElementById("jokeAdd").value;
  let newPunchine = document.getElementById("punchlineAdd").value;
  //if the input fields are empty, then an alert is shown to the user telling them to add something to the entry fields
  if(newJoke == "" || newPunchine == ""){
    alert("Please enter values in the name and the notes inputs.")
  }else{
    //create new li item with the same attributes as the other list items so that they can be selected for deleting and being shown
    let newEntry = document.createElement('li');
    //this section sets the attributes with the data from before the if statement into the li tag
    newEntry.id = uid;
    newEntry.setAttribute("dat", newDate)
    newEntry.setAttribute("joke", newJoke);
    newEntry.setAttribute("punchline", newPunchine);
    //this is the text that will be displayed onto the list of other jokes on the homepage
    newEntry.innerText = newDate;
    //this adds to the list of li tags with the new added joke that has just been made
    document.getElementById("jokeEntries").appendChild(newEntry)
    //user is shown an alert to notify them that the joke has been added
    alert("joke has now been added to the list above. Upload to save the list.")
  }
}

//this function is used to deleted the selected joke entry from the list of li tags shown on the homepage
function deleteEntry(){
  //this variable gets assigned the value of idEntry
  let idToDelete = document.getElementById("idEntry").value; 
  //if the variable from before is not empty then it will remove the details from the selected list
  if(idToDelete != ""){
    document.getElementById(idToDelete).remove();
    //this clears the textboxes for the selected joke area
    clearEntry();
    //an alert is shown to the user notifying them that entry has been deleted
    alert("Joke entry has been deleted on clientside. Upload to save changes.");
  } else {
    //if the selected joke is empty then the user is shown an alert letting them know they must select a joke entry
    alert("Please select an entry to delete.");
  }
 

}

//tihs function does the same as the deleteEntry function, however, for the randomEntry section
function deleteRandomEntry(){
  let idToDelete = document.getElementById("randomIdEntry").value; 
  if(idToDelete != ""){
    document.getElementById(idToDelete).remove(); 
    //remove deleted details from selected entry boxes
    clearRandomEntry();
    alert("Joke entry has been deleted on clientside. Upload to save changes. Loading new funny joke");
    randomJokeEntry();
  } else {
    alert("Please select an entry to delete.");
  }
 

}

//this function is used to upload all of the li tags containing the jokes onto the json file as text
function uploadJournal(){
  //get all li tags and saves them to the entriesList vairable
  let uploadList = document.getElementById("jokeEntries");
  var entriesList = uploadList.getElementsByTagName("li")
  // make object to convert to JSON
  let uploadObject = {};
  uploadObject.jokes = [];
  //goes through all of the items within the entriesList variable using a for loop
  //it will then grab each important data from the attribues and assign them to the object values such as date, joke, and punchline
  for (let i = 0; i < entriesList.length ; i++){
    //console.log("upload entry " + entriesList[i].innerHTML);
    let objEntry = {}
    objEntry.date = entriesList[i].getAttribute("dat");
    objEntry.joke = entriesList[i].getAttribute("joke");
    objEntry.punchline = entriesList[i].getAttribute("punchline");
    //it will then uplaoad the data to the json file
    uploadObject.jokes.push(objEntry);
  }
  
  //convert object to JSON and put to api
  //creates an XMLHttpRequest to communicate to the server
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

    //using the PUT method we are able to add data to the json file
    xhttp.open("PUT", url, true);
    // Converting JSON data to string
    var data = JSON.stringify(uploadObject)
    // Set the request header i.e. which type of content you are sending
    xhttp.setRequestHeader("Content-Type", "application/json");
    //send it
    xhttp.send(data);

}