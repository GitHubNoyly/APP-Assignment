
// initialise joke list
document.addEventListener("DOMContentLoaded", function(){
 console.log("calling getJoke");
 getJokeEntries();
});

function getJokeEntries(){
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
  console.log(this.readyState, this.status);
    
  if (this.readyState == 4 && this.status == 200) {
    console.log("success");
    let jokeResult = JSON.parse(this.responseText);
    const displayJokes = [];;
    for (let item of jokeResult.jokes) {
      displayJokes.push([[String(item.entryDate)], [String(item.author)], [String(item.joke)],[String(item.punchline)]]);
    }
      makeJokeTable(displayJokes);
    }
   else{
      console.log("xhttp request problem occurred")
    }
  }
  xhttp.open("GET", "/api/jokes", true);
  xhttp.send();
}

function makeJokeTable(displayJokes) {

  // creates a <table> element and a <tbody> element
  const tbl = document.createElement("table");
  const tblBody = document.createElement("tbody");

  // creating all cells
  for (let i = 0; i < displayJokes.length; i++) {
    // creates a table row
    const row = document.createElement("tr");

    for (let j = 0; j < 4; j++) {
      // Create a <td> element and a text node, make the text
      // node the contents of the <td>, and put the <td> at
      // the end of the table row
      const cell = document.createElement("td");
      const cellText = document.createTextNode(displayJokes[i][j]);
      cell.appendChild(cellText);
      row.appendChild(cell);
    }

    // add the row to the end of the table body
    tblBody.appendChild(row);
  }

  // put the <tbody> in the <table>
  tbl.appendChild(tblBody);
  // appends <table> into <body>
  document.body.appendChild(tbl);
  // sets the border attribute of tbl to '2'
  tbl.setAttribute("border", "2");
  tbl.classList.add("unSelectedRow");

   tableLoad(displayJokes);
  
  displayJokes.sort(() => Math.random() - 0.5);
  for (let i = 0; i <= 5; i++) {
    console.log(displayJokes[i]);
    document.getElementById("placeholder"+(i+1)).innerHTML = displayJokes[i][2] + "  " + displayJokes[i][3];
  }
}


function tableLoad(displayJokes){
  var myTable = document.getElementsByTagName("tr");
  console.log(myTable[0])
  function selectJokeRow(joke) {
    console.log("a row has been selected");
    var rowElement = joke.target.parentElement;
    if (rowElement.className == "selectedRow") {
       rowElement.classList.remove("selectedRow");
       rowElement.classList.add("unSelectedRow");
    }
    else if (rowElement.id !== "pop_table" || rowElement.tagName !== "body") {
       rowElement.classList.remove("unSelectedRow");
       rowElement.classList.add("selectedRow");
    }
  }
  for (let i = 0; i < displayJokes.length; i++) {
      myTable[i].addEventListener("click", selectJokeRow, false);
  }

}

function uploadJokes(){
  //get list 
  let uploadList = document.getElementById("add_joke_inputs");
  var entriesList = document.getElementsByTagName("input");
  //console.log("entries no. " + entriesList.length);
  // make object to convert to JSON
  let uploadObject = {};
  uploadObject.jokes = [];
  //list items and put into an array of objects
  console.log(entriesList);
  
  let objEntry = {};
  objEntry.entryDate = document.getElementById("entry_date").innerHTML;
  objEntry.author = document.getElementById("author").innerHTML;
  objEntry.joke = document.getElementById("joke").innerHTML;
  objEntry.punchline = document.getElementById("punchline").innerHTML;
  uploadObject.jokes.push(objEntry);
  
  console.log("upload Object:" + JSON.stringify(uploadObject));
  //console.log(uploadObject.journals[0]);

  //convert object to JSON and put to api
  let xhttp = new XMLHttpRequest();
  let url = "/api/jokes";
  
    xhttp.onreadystatechange = function() {
      let strResponse = "Error: no response";
      if (this.readyState == 4 && this.status == 200) {
        strResponse = JSON.parse(this.responseText);
        alert(strResponse.message);
      }
      //document.getElementById(elResponse).setAttribute("value",  strResponse.result);
      
    };
    xhttp.open("PUT", url, true);
    // Converting JSON data to string
    var data = JSON.stringify(uploadObject);
    // Set the request header i.e. which type of content you are sending
    xhttp.setRequestHeader("Content-Type", "application/json");
    //send it
    xhttp.send(data);

}