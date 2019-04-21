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

//GET functie met opbouwen rijen urentabel
function GETRowUrenTabel(trainee){
  var akkoordstatus = "";
  var aantalUren = 0;
  console.log(trainee.uren.length);
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


// insertedRow.addEventListener("click", function(){
//     var xhttp = new XMLHttpRequest();
//     xhttp.onreadystatechange = function() {
//       if (this.readyState == 4 && this.status == 200) {
//         var trainee = JSON.parse(this.responseText);   
//         console.log(trainee); 
        
        
//         var thead = document.createElement("tr");

//         var th1 = document.createElement("th");
//         th1.innerHTML = "Voornaam";
//         var th2 = document.createElement("th");
//         th2.innerHTML = "Achternaam";
//         var th3 = document.createElement("th");
//         th3.innerHTML = "Aantal Uren";
//         var th4 = document.createElement("th");
//         th4.innerHTML = "Datum";
//         var th5 = document.createElement("th");
//         th5.innerHTML = "Soort Uur";
//         // thead.style.display="block";
//         thead.appendChild(th1);
//         thead.appendChild(th2);
//         thead.appendChild(th3);
//         thead.appendChild(th4);
//         thead.appendChild(th5);
//         table.appendChild(thead);
//         var aantalRijenToegevoegd =0;
//     for(var j=0;j<trainee.uren.length;j++){
//         var tr = document.createElement("tr");
//         tr.id = "toegevoegd"+j;
//         var liVNaam = document.createElement("td");
//         liVNaam.innerHTML = trainee.voornaam;
//         var liANaam = document.createElement("td");
//         liANaam.innerHTML = trainee.achternaam;
//         tr.appendChild(liVNaam);
//         tr.appendChild(liANaam);
//         aantalRijenToegevoegd++;
//       //datum
//       var liDatum = document.createElement("td");
//       liDatum.innerHTML = trainee.uren[j].factuurDatum.substring(8,10) + "/" + trainee.uren[j].factuurDatum.substring(5,7) +"/" + trainee.uren[j].factuurDatum.substring(0,4);
//       //soort uur
//       var liSoort = document.createElement("td");
//       liSoort.innerHTML = trainee.uren[j].waarde;
//       //aantal uur
//       var liAantal = document.createElement("td");
//       liAantal.innerHTML = trainee.uren[j].aantal;
//       tr.appendChild(liAantal);
//       tr.appendChild(liDatum);
//       tr.appendChild(liSoort);
      
//       table.appendChild(tr);

//     }
//     thead.addEventListener("click", function(){
//         thead.style.display = "none";
//         console.log(aantalRijenToegevoegd);
//         for(var i =0; i<aantalRijenToegevoegd;i++){
//           console.log(tr[i]);
//           var deleterow = document.getElementById("toegevoegd"+i);
//           deleterow.style.display = "none";
//         }
//       })
//     }
//     };
//       xhttp.open("GET", apiTrainee + trainee.id, true);
//       xhttp.setRequestHeader("Content-type", "application/json");
//       xhttp.send(); 

//   });
    


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
   for(var i = 0; i<uren.length; i++){
    console.log(uren[i].accordStatus);
    if(uren[i].accordStatus == "TEACCODEREN"){
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

