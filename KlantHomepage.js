var apiTrainee = "http://localhost:8082/api/trainee/";
var apiUur = "http://localhost:8082/api/uur/";

//GET trainees voor vullen tabel
function getTrainees(){
  var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
      // console.log(this.responseText);
      var trainee = JSON.parse(this.responseText); 
      //onderstaande roept verschillende functies aan om de tabel te maken
      var table = document.createElement("table");
      addHtmlElement(table, traineeTableHeader());
      var tbody = addHtmlElement(table, document.createElement("tbody"));
      for (var i=0; i<trainee.length; i++){ 
        addHtmlElement(tbody, traineeTableRow(trainee[i]));
      }
      document.getElementById("traineelijst").appendChild(table);
          
      }
    };
      xhttp.open("GET", apiTrainee, true); // hardcoded nu
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

function addHtmlElement(parent, child) {
  parent.appendChild(child);
  return child;
}

function addHtmlElementContent(parent, child, tekst) {
   parent.appendChild(child);
   child.innerHTML = tekst;
   return child;
}

function traineeTableRow(trainee) {
   var tr = document.createElement("tr");
   var akkoordstatus = "";
   var uren = trainee.uren;
   console.log(trainee);
   var aantalUren = 0;
   for(var i = 0; i<uren.length; i++){
      
      if(trainee.uren[i].accordStatus == "NIETINGEVULD"){
        akkoordstatus = "-";

      }else{
      akkoordstatus = trainee.uren[i].accordStatus;
      aantalUren += trainee.uren[i].aantal ;
    }
   }
   addHtmlElementContent(tr, document.createElement("td"), trainee.voornaam, trainee.id);
   addHtmlElementContent(tr, document.createElement("td"), trainee.achternaam,trainee.id);
   addHtmlElementContent(tr, document.createElement("td"), aantalUren, trainee.id);
   addHtmlElementContent(tr, document.createElement("td"), akkoordstatus, trainee.id);
   addButton(tr, document.createElement("td"), document.createElement("select"), document.createElement("OPTION"), document.createElement("OPTION"), trainee.id);
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
  console.log("in klantSendAccord")
  
   for(var i = 0; i<uren.length; i++){
    var table = document.getElementById("traineelijst");
    var table = table.children[0];
    var body = table.children[1];
    var rows = body.children;
    var aantal = rows.length;
    // Jordi: voor elke row:
    for(var r = 0; r<aantal; r++){
      console.log("r = " + r)
      var uur = {}
      uur.id = uren[i].id;
      var row = rows[i];
      // console.log("rows:")
      // console.log(rows);
      var cellA = row.children[4];
      console.log("cellA:")
      console.log(cellA);
      var cellAInhoud = cellA.children[0];
      // console.log("cellAInhoud");
      // console.log(cellAInhoud);
      if(cellAInhoud.value == "goedkeuren"){
        uur.accordStatus = 2;
      }
      if(cellAInhoud.value == "afkeuren"){
        uur.accordStatus = 3;
        // console.log("afgekeurd")
      }
      // console.log("uur");
      // console.log(uur);
      PUTHourAccordStatus(uur, uur.id);
    }
  }

}

//PUT uren
function PUTHourAccordStatus(uur, rij){
  var xhttp = new XMLHttpRequest();

   xhttp.onreadystatechange = function () {
       if (this.readyState == 4) {
                  // console.log(uur);
                  //   console.log(uur.accordStatus);
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
        // console.log(this.responseText);
        var trainee = JSON.parse(this.responseText); 
        // console.log(trainee.uren.length);
        for (var i=0; i<trainee.length; i++){
          klantSendAccord(trainee[i]);
        }
      }
    };
      xhttp.open("GET", apiTrainee, true);
      xhttp.setRequestHeader("Content-type", "application/json");
      xhttp.send(); 
}