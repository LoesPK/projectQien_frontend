var apiKlant = "http://localhost:8082/api/klant/"+sessionStorage.getItem("storedUserID");
var apiUur = "http://localhost:8082/api/uur/";
var apiTrainee = "http://localhost:8082/api/trainee/";
//trainee variabele 
var klant;



// EMIEL - GET Uren per maand
function GETUrenPerTrainee(){
  console.log ("huidige ingelogde user:")
  console.log(sessionStorage.getItem("storedUserID"));
  var table = document. getElementById("traineelijst");
  var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
            klant = JSON.parse(this.responseText);  
            for(var i=0; i<klant.trainee.length; i++){
              GETRowUrenTabel(klant.trainee[i]);
            }

    }
    };
      xhttp.open("GET", apiKlant, true);
      xhttp.setRequestHeader("Content-type", "application/json");
      xhttp.send(); 
}

//opbouwen van drop down menu
function GetKlant(){
  var xhttp = new XMLHttpRequest();
   var trainees = document.getElementById("selectedTrainee");
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        var arr = new Array;
            var klantTrainees = JSON.parse(this.responseText);  
            console.log(klantTrainees);
            for(var i =0; i<klantTrainees.trainee.length; i++){
              console.log(klantTrainees.trainee[i]);
              var p = klantTrainees.trainee[i].voornaam + " " + klantTrainees.trainee[i].achternaam;
              arr.push(klantTrainees.trainee[i]);
              
            }
            for(var i = 0; i<arr.length; i++){
                var option = document.createElement("OPTION"),
                txt = document.createTextNode(arr[i].voornaam + " " + arr[i].achternaam);           
                option.appendChild(txt);
                option.id = "option"+ arr[i].id;
                trainees.insertBefore(option,trainees.lastChild);
  }
    }
    };
      xhttp.open("GET", apiKlant, true);
      xhttp.setRequestHeader("Content-type", "application/json");
      xhttp.send(); 
}


//GET functie met opbouwen rijen urentabel
function GETRowUrenTabel(trainee){
  var akkoordstatus = "";
  var aantalUren = 0;
  console.log(sessionStorage.getItem("storedUserID"))
  console.log(trainee.uren.length);
  for(var i=0;i<trainee.uren.length;i++){
      console.log(trainee.uren[i].accordStatus);   
      
      if(trainee.uren[i].accordStatus == "TEACCORDEREN"&& trainee.uren[i].bijKlant == sessionStorage.getItem("storedUserID")){
        akkoordstatus = "Te Accorderen";
          aantalUren += trainee.uren[i].aantal ;
          console.log(akkoordstatus);
    }
  }
  if(akkoordstatus == "Te Accorderen"){
  var table = document.getElementById("traineelijst");
  var insertedRow = table.insertRow(0);



    


  insertedRow.id = trainee.id;
  
    //datum
  var insertedCell = insertedRow.insertCell(0); 
  insertedCell.innerHTML = trainee.voornaam;
  
    
    //soort uren
  var insertedCell1 = insertedRow.insertCell(1); 
    insertedCell1.innerHTML = trainee.achternaam;
    

    //aantal uren
  var insertedCell2 = insertedRow.insertCell(2);   
    insertedCell2.innerHTML = aantalUren;
     

    //akkoordstatus
  var insertedCell3 = insertedRow.insertCell(3);   
  var status = document.createElement("td");
  insertedCell3.innerHTML = akkoordstatus;
  insertedCell3.appendChild(status);

  var insertedCell4 = insertedRow.insertCell(4);
  var select = document.createElement("select"); 
  var option1 = document.createElement("OPTION"); 
  select.appendChild(option1);
  option1.innerHTML = "goedkeuren";
  var option2 = document.createElement("OPTION"); 
  select.appendChild(option2);
   option2.innerHTML = "afkeuren";  
   insertedCell4.appendChild(select); 
}
}

function selectTrainee(){
  var selectedTrainee = document.getElementById("selectedTrainee");
    gekozenTrainee = selectedTrainee[selectedTrainee.selectedIndex].value;
    console.log(selectedTrainee[selectedTrainee.selectedIndex].id);
    var id = selectedTrainee[selectedTrainee.selectedIndex].id.substring(6);
    getUrenPerTrainee(id);
}

//Jordi: uren van alleen de geselecteerde trainee 
function getUrenPerTrainee(traineeID){
  var oldTable = document.getElementById("UrenSpecificaties");
  console.log(oldTable);
  for(var i = oldTable.rows.length - 1; i > -1; i--){
    oldTable. deleteRow(i);
  }

  var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        var trainee = JSON.parse(this.responseText);    
            var table = document.getElementById("UrenSpecificaties");  

               // createNewTableHeader();
               addHtmlElement(table, UurSpecifiekTableHeader());
               var tbody = addHtmlElement(table, document.createElement("tbody"));
               for(var i = 0; i< trainee.uren.length; i++) {
                  if (trainee.uren[i].accordStatus == "TEACCORDEREN"){
                    addHtmlElement(tbody,  UurSpecifiekTableRow(trainee.voornaam, trainee.achternaam, trainee.uren[i]));
                  }
               }

               // document.getElementById("UrenSpecificaties").appendChild(table);
              
           } 
      
    };
      xhttp.open("GET", apiTrainee + traineeID, true);
      xhttp.setRequestHeader("Content-type", "application/json");
      xhttp.send(); 
}


function UurSpecifiekTableHeader() {
   var tableHeader = document.createElement("thead");
   var tr = addHtmlElement(tableHeader, document.createElement("tr"));
   addHtmlElementContent(tr, document.createElement("th"), "Voornaam");
   addHtmlElementContent(tr, document.createElement("th"), "Achternaam");
   addHtmlElementContent(tr, document.createElement("th"), "Datum");
   addHtmlElementContent(tr, document.createElement("th"), "Soort Uur");
   addHtmlElementContent(tr, document.createElement("th"), "Aantal Uren");
   return tableHeader;
}

function UurSpecifiekTableRow(voornaam, achternaam, uur) {
   var tr = document.createElement("tr");
   addHtmlElementContent(tr, document.createElement("td"), voornaam);
   addHtmlElementContent(tr, document.createElement("td"), achternaam);
   addHtmlElementContent(tr, document.createElement("td"), uur.factuurDatum);
   addHtmlElementContent(tr, document.createElement("td"), uur.waarde);
   addHtmlElementContent(tr, document.createElement("td"), uur.aantal);
   return tr;
}

function NaamTraineeRow(trainee){
  var tr = document.createElement("tr");
  addHtmlElementContent(tr, document.createElement("td"), trainee.voornaam);
  addHtmlElementContent(tr, document.createElement("td"), trainee.achternaam);
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


function klantSendAccord(trainee){
console.log(trainee.uren);
var row = document.getElementById(trainee.id);
console.log(row);
  var uren = trainee.uren;
  console.log(uren);
   for(var i = 0; i<uren.length; i++){

    console.log(uren[i].accordStatus);
    if(uren[i].accordStatus == "TEACCORDEREN"){
         var uur = {}
    uur.id = uren[i].id;
    console.log(uur.id);
    console.log(row);
    var cellA = row.children[4];
    console.log(cellA);
      // for(var i = 0; i<aantal; i++){
      
      var cellAInhoud = cellA.children[0];
      console.log(cellAInhoud);
      if(cellAInhoud.value == "goedkeuren"){
        uur.accordStatus = "GOEDGEKEURD";
      }
      if(cellAInhoud.value == "afkeuren"){
        uur.accordStatus = "AFGEKEURD";
      }

      PUTHourAccordStatus(uur, uur.id);
    }
  }

}

//PUT uren
function PUTHourAccordStatus(uur, rij){
  var xhttp = new XMLHttpRequest();
   xhttp.onreadystatechange = function () {
       if (this.readyState == 4) {  
       location.reload();     
           if (this.status == 200) { 
           
         }
       }
   };

   xhttp.open("PUT", apiUur+rij+"/akkoordstatus/", true);
   xhttp.setRequestHeader("Content-type", "application/json");
   xhttp.send(JSON.stringify(uur));  
}

//GET uren voor tabel
function TraineeHourChange(){
  var body = document.getElementById("traineelijst");
  var rows = body.children;
  var aantal = rows.length;
  for(var i = 0; i<aantal; i++){
      var row = rows[i];
    var trainee = {}
    trainee.id = row.id;
    GETtrainee(trainee.id);
  }
}

function GETtrainee(traineeID){
  var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        var trainee = JSON.parse(this.responseText);    
        klantSendAccord(trainee);
      }
    };
      xhttp.open("GET", apiTrainee + traineeID, true);
      xhttp.setRequestHeader("Content-type", "application/json");
      xhttp.send(); 
}

function Userlogout(){
  sessionStorage.clear();
}

