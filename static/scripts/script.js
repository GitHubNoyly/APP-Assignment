
// initialise joke list
document.addEventListener("DOMContentLoaded", function(){
 console.log("calling getJoke");
 getJokeEntries();
});

//utility functions - DO NOT EDIT OR DELETE
function getUniqueKey(){
 return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
 (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
 );
};

function getJokeEntries(){
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
  console.log(this.readyState, this.status);
    
  if (this.readyState == 4 && this.status == 200) {
    console.log("success");
    let jokeResult = JSON.parse(this.responseText);
    const jokes = [];
    for (let item of jokeResult.jokes) {
      jokes.push([String(item.joke) + " " + String(item.punchline)]);
    }
      jokes.sort(() => Math.random() - 0.5);
      for (let i = 0; i <= 5; i++) {
        console.log(jokes[i]);
        document.getElementById("placeholder"+(i+1)).innerHTML = jokes[i];
      }
    }
   else{
      console.log("xhttp request problem occurred")
    }
  }
  xhttp.open("GET", "/api/jokes", true);
  xhttp.send();
}

