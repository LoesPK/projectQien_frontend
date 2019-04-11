var api = "http://localhost:8082/api/trainee/";

//GET
function GETTrainee(){
  var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
    	var trainee = JSON.parse(this.responseText);	
  		var table = document.createElement("table");
      addHtmlElement(
        table,
        traineeTableHeader());
      var tbody = addHtmlElement(table, document.createElement("tbody"));
      for(var i = 0; i< trainee.length; i++){
        addHtmlElement(tbody, traineeTableRow(trainee[i]));
      }
      document.getElementById("traineelijst").appendChild(table);		
      }
    };
      xhttp.open("GET", api, true);
	    xhttp.setRequestHeader("Content-type", "application/json");
	    xhttp.send();	
}
//DELETE
function AdminGetTraineeNumberToDelete(){
  var numb = document.getElementById("numberToDelete").value;
  DeleteTrainee(numb);
}
function DeleteTrainee(numb) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
    document.location.reload(true)
    alert("Trainee is verwijderd!");    
    }
  };
  xhttp.open("DELETE", api+numb, true);
  xhttp.send();
}

//PUT
function AdminShowTrainee(){
  var numberChange = document.getElementById("numberToChange").value;
  GETTraineeById(numberChange);
  return numberChange;
}
//GET by id
function GETTraineeById(id){
  var xhttp = new XMLHttpRequest();
   xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
    var trainee = JSON.parse(this.responseText);  
     voegTraineeToe("traineeIndividu", trainee); 
            }
    };
     xhttp.open("GET", api+id, true);
      xhttp.setRequestHeader("Content-type", "application/json");
      xhttp.send(); 
}
var huidigeTrainee;
function voegTraineeToe(element, trainee){
  huidigeTrainee = trainee;
  var tID = trainee.id;
  var e = document.getElementById(element);
  var t = document.createElement("input");
  t.value = trainee.voornaam;
  t.id = "voornaam"+tID;
  e.appendChild(t);
  t = document.createElement("input");
  t.value = trainee.achternaam;
  t.id = "achternaam"+tID;
  e.appendChild(t);
  t = document.createElement("input");
  t.value = trainee.username;
  t.id = "username"+tID;
  e.appendChild(t);
  t = document.createElement("input");
  t.value = trainee.wachtwoord;
  t.id = "wachtwoord"+tID;
  e.appendChild(t);
  t = document.createElement("input");
  t.value = trainee.loon;
  t.id = "loon"+tID;
  e.appendChild(t);
  t = document.createElement("input");
  t.value = trainee.type;
  t.id = "type"+tID;
  e.appendChild(t);
  t = document.createElement("input");

}
function changeTrainee(){
  var currentID = huidigeTrainee.id;
  huidigeTrainee.voornaam = document.getElementById("voornaam" + currentID).value;
  huidigeTrainee.achternaam = document.getElementById("achternaam" + currentID).value;
  huidigeTrainee.username = document.getElementById("username" + currentID).value;
  huidigeTrainee.wachtwoord = document.getElementById("wachtwoord" + currentID).value;
  huidigeTrainee.loon = document.getElementById("loon" + currentID).value;
  huidigeTrainee.type = document.getElementById("type" + currentID).value;
  console.log(huidigeTrainee);
  var xhttp = new XMLHttpRequest();
   xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      alert("trainee is gewijzigd!");
      // document.location.reload(true)  
    }
  };
  xhttp.open("PUT", api+currentID, true); // let op dat je achter users zet welk element je wil hebben hier

    xhttp.setRequestHeader("Content-type", "application/json"); // moet bij PUT er altijd bij staan, bij GET hoeft het niet

    xhttp.send(JSON.stringify(huidigeTrainee));  // kan niet als object worden meegestuurd, moet als string, vandaar stringify
}

function addHtmlElement(parent, child) {
  parent.appendChild(child);
  return child;
}

function addHtmlElementContent(parent, child, tekst) {
   parent.appendChild(child);
   child.innerHTML = tekst;
   return child;
}
function traineeTableHeader() {
   var tableHeader = document.createElement("thead");
   var tr = addHtmlElement(tableHeader, document.createElement("tr"));
   addHtmlElementContent(tr, document.createElement("th"), "id");
   addHtmlElementContent(tr, document.createElement("th"), "Voornaam");
   addHtmlElementContent(tr, document.createElement("th"), "Achternaam");
   addHtmlElementContent(tr, document.createElement("th"), "Username");
   addHtmlElementContent(tr, document.createElement("th"), "Wachtwoord");
   addHtmlElementContent(tr, document.createElement("th"), "Loon");
   addHtmlElementContent(tr, document.createElement("th"), "Uren");
   return tableHeader;
}

function traineeTableRow(trainee) {
   var tr = document.createElement("tr");
   addHtmlElementContent(tr, document.createElement("td"), trainee.id);
   addHtmlElementContent(tr, document.createElement("td"), trainee.voornaam);
   addHtmlElementContent(tr, document.createElement("td"), trainee.achternaam);
   addHtmlElementContent(tr, document.createElement("td"), trainee.username);
   addHtmlElementContent(tr, document.createElement("td"), trainee.wachtwoord);
   addHtmlElementContent(tr, document.createElement("td"), trainee.loon);
   addHtmlElementContent(tr, document.createElement("td"), "uren trainee hier");
   return tr;
}

function addHtmlElement(parent, child) {
   parent.appendChild(child);
   return child;
}

function addHtmlElementContent(parent, child, tekst) {
   parent.appendChild(child);
   child.innerHTML = tekst;
   return child;
}
//Downloaden CSV
function download_csv(csv, filename) {
    var csvFile;
    var downloadLink;

    // CSV FILE
    csvFile = new Blob([csv], {type: "text/csv"});

    // Download link
    downloadLink = document.createElement("a");
    downloadLink.download = filename;
    downloadLink.href = window.URL.createObjectURL(csvFile);
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);

    
    downloadLink.click();
}

function export_table_to_csv(filename) {
  var csv = [];
  var rows = document.querySelectorAll("table tr");
  
    for (var i = 0; i < rows.length; i++) {
    var row = [], cols = rows[i].querySelectorAll("td, th");
    
        for (var j = 0; j < cols.length; j++) 
            row.push(cols[j].innerText);
        
    csv.push(row.join(","));    
  }

    // Download CSV
    download_csv(csv.join("\n"), filename);
}

document.querySelector("#exporting").addEventListener("click", function () {
    var html = document.querySelector("table").outerHTML;
  export_table_to_csv(html, "table.csv");
});
