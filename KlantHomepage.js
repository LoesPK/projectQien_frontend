/**
 * 
 */

//Loes: de api's
var apiKlant = "http://localhost:8082/api/klant/"+sessionStorage.getItem("storedUserID");
var apiUur = "http://localhost:8082/api/uur/";
var apiTrainee = "http://localhost:8082/api/trainee/";
//trainee variabele 
var klant;

// EMIEL - De maand selecteren

// EMIEL - GET Uren per maand
function GETUrenPerTrainee(){
  var table = document. getElementById("traineelijst");
  var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
            klant = JSON.parse(this.responseText);  
//            trainee.uren.sort(function(a,b){return b.factuurDatum<a.factuurDatum?-1:1});

            for(var i=0; i<klant.trainee.length; i++){
              GETRowUrenTabel(klant.trainee[i]);
            }

    }
    };
      xhttp.open("GET", apiKlant, true);
      xhttp.setRequestHeader("Content-type", "application/json");
      xhttp.send(); 
}

//GET functie met opbouwen rijen urentabel
function GETRowUrenTabel(trainee){
  console.log(trainee);
  var akkoordstatus = "";
  var aantalUren = 0;
  for(var i=0;i<trainee.uren.length;i++){
      console.log(trainee.uren[i].accordStatus);
      if(trainee.uren[i].accordStatus == "TEACCODEREN"){
        akkoordstatus = "Te Accoderen";
          aantalUren += trainee.uren[i].aantal ;
          console.log(akkoordstatus);
    }
  }
  if(akkoordstatus == "Te Accoderen"){
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


function klantSendAccord(trainee){
console.log(trainee.uren);
var row = document.getElementById(trainee.id);
  var uren = trainee.uren;
  console.log("in klantSendAccord")
  
   for(var i = 0; i<uren.length; i++){
         var uur = {}
    uur.id = uren[i].id;
    console.log(row);
    var cellA = row.children[4];
    console.log(cellA);
      // for(var i = 0; i<aantal; i++){
      
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
                    // location.reload();
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
  var body = document.getElementById("traineelijst");
  var rows = body.children;
  console.log(rows);

  var aantal = rows.length;
  for(var i = 0; i<aantal; i++){
      var row = rows[i];
    var trainee = {}
    console.log(row.id);
    trainee.id = row.id;
    GETtrainee(trainee.id);
  }
}

function GETtrainee(traineeID){
  console.log(apiTrainee + traineeID);
  var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
      console.log(this.responseText);
      var trainee = JSON.parse(this.responseText); 
      console.log(trainee.uren.length);
      
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

