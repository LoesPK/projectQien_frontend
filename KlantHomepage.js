/**
 * 
 */

var apiKlant = "http://localhost:8082/api/klant/"+sessionStorage.getItem("storedUserID");
var apiUur = "http://localhost:8082/api/uur/";

//GET trainees voor vullen tabel
function getTrainees(){
  console.log("check in gettrainees");
  var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
      var klant = JSON.parse(this.responseText); 
      //onderstaande roept verschillende functies aan om de tabel te maken
      var table = document.createElement("table");
      addHtmlElement(table, traineeTableHeader());
      var body = document.createElement("tbody")
      var tbody = addHtmlElement(table, body);
      console.log(tbody)
      console.log(klant)
      console.log(klant.trainee.length);
      for(var i =0; i<klant.trainee.length; i++){
      console.log(klant.trainee[i]);
      console.log(klant.trainee[i].uren);
    
      addHtmlElement(tbody, traineeTableRow(klant.trainee[i]));
      
    }
    document.getElementById("traineelijst").appendChild(table);   

      }
    };
      xhttp.open("GET", apiKlant, true);
      xhttp.setRequestHeader("Content-type", "application/json");
      xhttp.send(); 
}


//tabelmaken
function traineeTableHeader() {
   var tableHeader = document.createElement("thead");
   var tr = addHtmlElement(tableHeader, document.createElement("tr"));
   addHtmlElementContent(tr, document.createElement("th"), "Voornaam");
   addHtmlElementContent(tr, document.createElement("th"), "Achternaam");
   addHtmlElementContent(tr, document.createElement("th"), "Aantal uren");
   addHtmlElementContent(tr, document.createElement("th"), "Akkoordstatus");
      addHtmlElementContent(tr, document.createElement("th"), "Accoderen");
   return tableHeader;
}

function addHtmlElementContent(parent, child, tekst) {
   parent.appendChild(child);
   child.innerHTML = tekst;
   return child;
}

function traineeTableRow(trainee) {
  var tr = document.createElement("tr");
   var akkoordstatus = "";
//   var uren = trainee.uren;
   var aantalUren = 0;
   console.log(trainee.uren.length);
   for(var i = 0; i<trainee.uren.length; i++){
      console.log(trainee.uren[i].accordStatus);
      if(trainee.uren[i].accordStatus == "TEACCODEREN"){
        akkoordstatus = trainee.uren[i].accordStatus;
          aantalUren += trainee.uren[i].aantal ;
          console.log(akkoordstatus);
      }
   }
   console.log(akkoordstatus);
   if(akkoordstatus == "TEACCODEREN"){
     
     addHtmlElementContent(tr, document.createElement("td"), trainee.voornaam, trainee.id);
     addHtmlElementContent(tr, document.createElement("td"), trainee.achternaam,trainee.id);
     addHtmlElementContent(tr, document.createElement("td"), aantalUren, trainee.id);
     addHtmlElementContent(tr, document.createElement("td"), akkoordstatus, trainee.id);
     addButton(tr, document.createElement("td"), document.createElement("select"), document.createElement("OPTION"), document.createElement("OPTION"), trainee.id);
     
   }

   return tr;
}

function addHtmlElement(parent, child) {
   parent.appendChild(child);
   return child;
}

function addHtmlElementContent(parent, child, tekst, id) {
  parent.id = id
   parent.appendChild(child);
   child.innerHTML = tekst;
   return child;
}

function addButton(parent, child, select, option1, option2, id){
  parent.id = id;
  parent.appendChild(child);
  select.appendChild(option1);
  option1.innerHTML = "goedkeuren";
  select.appendChild(option2);
  option2.innerHTML = "afkeuren";
  child.appendChild(select);
   return child;
}

function klantSendAccord(trainee){
  var uren = trainee.uren;
  
   for(var i = 0; i<uren.length; i++){
      var table = document.getElementById("traineelijst");
      var table = table.children[0];
      var body = table.children[1];
      var rows = body.children;
      var aantal = rows.length;
      // for(var i = 0; i<aantal; i++){
      var uur = {}
      uur.id = uren[i].id;
      var row = rows[0];
      var cellA = row.children[4];
      var cellAInhoud = cellA.children[0];
      if(cellAInhoud.value == "goedkeuren"){
        uur.accordStatus = "GOEDGEKEURD";
      }
      if(cellAInhoud.value == "afkeuren"){
        uur.accordStatus = "AFGEKEURD";
      }
      PUTHourAccordStatus(uur, uur.id);
  }

}

//PUT uren
function PUTHourAccordStatus(uur, rij){
  var xhttp = new XMLHttpRequest();

   xhttp.onreadystatechange = function () {
       if (this.readyState == 4) {
                  console.log(uur);
                    console.log(uur.accordStatus);
                    location.reload();
           if (this.status == 200) {

           } else {
             
           }
       }
   };

   xhttp.open("PUT", apiUur+rij+"/akkoordstatus/", true);
   xhttp.setRequestHeader("Content-type", "application/json");
   xhttp.send(JSON.stringify(uur));  
}


//GET uren voor tabel
function TraineeHourChange(){
  var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
      console.log(this.responseText);
      var klant = JSON.parse(this.responseText); 
      // console.log(trainee.uren.length);
      for(var i = 0; i<klant.trainee.length; i++)
              klantSendAccord(klant.trainee[i]);
      }
    };
      xhttp.open("GET", apiKlant, true);
      xhttp.setRequestHeader("Content-type", "application/json");
      xhttp.send(); 
}