/**
 * 
 */

var IDCell = 1;
var selectID = 0;
var dateID = 0;
var aantalID = 0;
//Loes: onderstaande is het javascript datum opject
var date = new Date();
//Loes: de twee api's
var apiCosts = "http://localhost:8082/api/kosten/";
var apiUserId = "http://localhost:8082/api/trainee/"+sessionStorage.getItem("storedUserID");
// var tijdsform = getData();
var lijst = new Array();
//bedrag per kilometer
var bedragPerKm = 19;
var trainee;
var totaleKosten = 0;

//Bepalen huidige datum zodat er nooit een leeg datumveld wordt opgestuurd (was een bug)
var today = new Date();
var dd = today.getDate();
var mm = today.getMonth()+1; //As January is 0.
var yyyy = today.getFullYear();
if(dd<10) dd='0'+dd;
if(mm<10) mm='0'+mm;
today = yyyy+'-'+mm+'-'+dd ;
console.log(today + "date");


//Dropdown menu opbouwen
function traineeKostenDropDownMenu(selectID){
  var select = document.getElementById("select"+selectID),
  arr = ["Overige Kosten", "Auto"];
  for(var i = 0; i<arr.length; i++){
    var option = document.createElement("OPTION"),
    txt = document.createTextNode(arr[i]);
    option.appendChild(txt);
    select.insertBefore(option,select.lastChild);
  }
}

// GET trainee
function GETTrainee(){
  var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
      trainee = JSON.parse(this.responseText);  
      trainee.kosten.sort(function(a,b){return a.factuurDatum<b.factuurDatum?-1:1});
      for(var i = 0; i<trainee.kosten.length; i++){
        console.log(trainee.kosten[i].status + "DE STATUSSS");
        if(trainee.kosten[i].status == "Opgeslagen"){

          GETRowKostenTabel(trainee.kosten[i]);
            if(trainee.kosten[i].soort == "Auto"){
              bedragAuto = trainee.kosten[i].aantalKM * trainee.kosten[i].bedrag;
              totaleKosten += bedragAuto;
            }else{
              totaleKosten += trainee.kosten[i].bedrag;
            }//end if else

        }

      }//end for
      calcTotaal(totaleKosten);
      }
    };
      xhttp.open("GET", apiUserId, true);
      xhttp.setRequestHeader("Content-type", "application/json");
      xhttp.send(); 
}

//GET functie met opbouwen rijen urentabel
function GETRowKostenTabel(kosten){
  var table = document.getElementById("kostenTabel");
  var insertedRow = table.insertRow(1);
  insertedRow.id = kosten.id;

  var insertedCell = insertedRow.insertCell(0);
  insertedCell.innerHTML = kosten.status;
  //datum
  var insertedCell = insertedRow.insertCell(1);
    var Datum = document.createElement("input");
    Datum.type = "date";
    Datum.value = kosten.factuurDatum.substring(0,10);
    Datum.setAttribute("max", today);
    insertedCell.appendChild(Datum);
  
  //soort kosten
  var insertedCell1 = insertedRow.insertCell(2); 
  var arr = ["Openbaar Vervoer", "Overige Kosten", "Auto"];
  var SoortKosten = document.createElement("select");
    SoortKosten.id = kosten.id;
  for(var i = 0; i<arr.length; i++){
    var option = document.createElement("OPTION"),
    txt = document.createTextNode(arr[i]);
    option.appendChild(txt);
    option.value = arr[i];
    SoortKosten.insertBefore(option,SoortKosten.lastChild);
    console.log(kosten.soort);
    if(arr[i] === kosten.soort){
      SoortKosten.value = kosten.soort;
    }
    insertedCell1.appendChild(SoortKosten);
    insertedCell1.addEventListener("change", function(){
        console.log(SoortKosten[SoortKosten.selectedIndex]);
        var choice = SoortKosten[SoortKosten.selectedIndex];
        console.log(choice.innerHTML == "Auto");
        if(choice.innerHTML == "Auto"){
        
          Bedrag.value = 0.19;
          Bedrag.setAttribute("disabled", "disabled");
          km.removeAttribute("disabled");
        }if(choice.innerHTML == "Openbaar Vervoer" || choice.innerHTML == "Overige Kosten" ){
            
            km.value = 0;
            Bedrag.removeAttribute("disabled");
         km.setAttribute("disabled", "disabled");
          }
      })
  }
  
  
  //bedrag kosten
  var insertedCell2 = insertedRow.insertCell(3);
    var Bedrag = document.createElement("input");
    Bedrag.type = "number";
    Bedrag.value = kosten.bedrag/100;
    insertedCell2.appendChild(Bedrag);

  
    
  //aantal KM
    var insertedCell3 = insertedRow.insertCell(4);
    var km = document.createElement("input");
    km.type = "number";
    km.value = kosten.aantalKM;
    insertedCell3.appendChild(km);
    if(kosten.soort == "Auto"){
        Bedrag.setAttribute("disabled", "disabled");
        km.removeAttribute("disabled");
     }if(kosten.soort == "Openbaar Vervoer" || kosten.soort == "Overige Kosten" ){    
       Bedrag.removeAttribute("disabled");
       km.setAttribute("disabled", "disabled");
        }

  // Opmerking
  var insertedCell5 = insertedRow.insertCell(5);
  var Opmerking1 = document.createElement("input");
  Opmerking1.maxLength = 150;
  Opmerking1.type = "string";
  Opmerking1.value = kosten.opmerking;
  insertedCell5.appendChild(Opmerking1);


    var VerwijderKnop  = document.createElement("span");
    VerwijderKnop.className = "fas fa-trash-alt";
    VerwijderKnop.addEventListener("click", function(){
    var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          insertedRow.parentNode.removeChild(insertedRow);
        }
    };
      xhttp.open("DELETE", apiCosts+kosten.id, true);
      xhttp.send();});
  insertedCell5.appendChild(VerwijderKnop);
  
     

}
//functie om rijen toe te voegen aan de tabel
function addRowKostenTabel(){
  
  table = document.getElementById("kostenTabel");

    var insertedRow = table.insertRow(1);
  insertedRow.id = "0";
          
//voor de eerste cel (cel 0(i=0)): voeg het status inputveld toe
        var insertedCell0 = insertedRow.insertCell(0);
        var temp1 = document.createElement("td");
        temp1.innerHTML = "Open";
        insertedCell0.appendChild(temp1);

//voor de eerste cel (cel 0(i=0)): voeg het datum inputveld toe
        var insertedCell1 = insertedRow.insertCell(1);
        dateID++;
        var temp2 = document.createElement("input");
        temp2.type = "date";
        temp2.id = "datum"+dateID; 
        temp2.setAttribute("max", today);
        temp2.value = today;
        insertedCell1.appendChild(temp2);
//voor de eerste cel (cel 1(i=1)): voeg het dropdownmenu toe
      var insertedCell2 = insertedRow.insertCell(2);
        selectID++;
        var temp3 = document.createElement("select");
        temp3.id = "select"+selectID;
        var temp4 = document.createElement("OPTION");
        temp4.innerHTML = "Openbaar Vervoer"
        temp3.appendChild(temp4);
        insertedCell2.appendChild(temp3);
        insertedCell2.addEventListener("change", function(){
          console.log(temp3[temp3.selectedIndex]);
          var choice = temp3[temp3.selectedIndex];
          console.log(choice.innerHTML == "Auto");
          if(choice.innerHTML == "Auto"){
          
            temp5.value = 0.19;
            temp5.setAttribute("disabled", "disabled");
            temp6.removeAttribute("disabled");
          }if(choice.innerHTML == "Openbaar Vervoer" || choice.innerHTML == "Overige Kosten" ){
              
              temp5.value = 0;
              temp5.removeAttribute("disabled");
              temp6.setAttribute("disabled", "disabled");
            }
        })
//voor de eerste cel (cel 2 (i=2)): voeg het bedrag inputveld toe
      var insertedCell3 = insertedRow.insertCell(3);
        aantalID++;
        var temp5 = document.createElement("input");
        temp5.type = "number";
        temp5.value = 0;
        temp5.id = "aantal"+aantalID; 
        
        insertedCell3.appendChild(temp5);
      var insertedCell4 = insertedRow.insertCell(4);
      var temp6 = document.createElement("input");
            temp6.type = "number";
            temp6.value = 0;
            temp6.setAttribute("disabled", "disabled");
            insertedCell4.appendChild(temp6);

    // Opmerking
  var insertedCell5 = insertedRow.insertCell(5);
  var Opmerking2 = document.createElement("input");
  Opmerking2.maxLength = 150;
  Opmerking2.type = "string";
  Opmerking2.value = "";
  insertedCell5.appendChild(Opmerking2);

    //verwijderknop
    var VerwijderKnop  = document.createElement("span");
    VerwijderKnop.className = "fas fa-trash-alt";
    VerwijderKnop.addEventListener("click", function(){

          insertedRow.parentNode.removeChild(insertedRow);
});
  insertedCell5.appendChild(VerwijderKnop);
  

    traineeKostenDropDownMenu(selectID);
}

//POST kosten opslaan functie
function KostenOpslaan(){
  var kostenlijst = new Array();
  console.log("in kostenopslaan");
  var table = document.getElementById("kostenTabel");
  var tablebody = table.children[0]; 
  console.log(table);
  console.log(tablebody);
  var aantal = tablebody.children.length;
  console.log(aantal);
   for(var i = 1; i<aantal; i++){
    var kosten = {}
    var tablerow = tablebody.children[i];
    kosten.id = tablerow.id;
    var c = tablerow.children;
    console.log(c);
    var ch2 = c[3];
    var chi2 = ch2.children[0];

    // ------- datumveld -------//
  var ch0 = c[1];
  var chi0 = ch0.children[0];
  
  // ------- soort kosten veld -------//
  var ch = c[2];
  var chi = ch.children[0];
  var chiVal = chi.value;

  // ------- bedrag -------//
  var ch2 = c[3];
  var chi2 = ch2.children[0];

  // ------ aantal KM ------//
    var ch3 = c[4];
    //console.log(ch3);
    var ch3input = ch3.children[0]
    //console.log(ch3input.value);

  // ------ Opmerking ------//
  var ch5 = c[5];
  var chOpmerking = ch5.children[0]
  //console.log( chOpmerking.value + "chOpmerking");




    kosten.waarde = chiVal;
    kosten.bedrag = chi2.value*100; 
    var d = new Date(chi0.value);
    kosten.factuurDatum = d;
    kosten.status = "Opgeslagen";
    kosten.aantalKM = ch3input.value;
    kosten.opmerking = chOpmerking.value;
    console.log(kosten);
    kostenlijst.push(kosten);
    }
    console.log(kostenlijst);
    console.log(trainee);
    trainee.kosten = kostenlijst;
    console.log(trainee.kosten);

    PUTTrainee(trainee);
    
}

// EMIEL - Totaal te declareren kosten weergeven
function calcTotaal(bedragTotaal){
  bedragTotaal = (Math.round(bedragTotaal))/100;
  tableTotaal = document.getElementById("kostenDeclaTotaalTabelBody");
  tableTotaal.innerHTML = bedragTotaal;
      
}//end calTotaal

//PUT uren
function PUTTrainee(trainee){
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4)
      if(this.status == 200) { 
      trainee = JSON.parse(this.responseText);
      document.location.reload(true);
        }
        else{
          alert("HELP!" + this.status);
        }
  };
  xhttp.open("PUT", apiUserId, true);
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.send(JSON.stringify(trainee));
}

function setsubjectline(){
  var subjectline = "string";
  subjectline = "subject function works";
  return subjectline;
}