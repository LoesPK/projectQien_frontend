
//Loes: onderstaande is het javascript datum object
var date = new Date();
//Loes: de api
var apiUserId = "http://localhost:8082/api/trainee/"+sessionStorage.getItem("storedUserID");

//Bepalen huidige datum zodat er nooit een leeg datumveld wordt opgestuurd (was een bug)
var today = new Date();
var dd = today.getDate();
var mm = today.getMonth()+1; //As January is 0.
var yyyy = today.getFullYear();
if(dd<10) dd='0'+dd;
if(mm<10) mm='0'+mm;
today = yyyy+'-'+mm+'-'+dd ;

var theMonth = setCurrentMonth();//tableBody[tableBody.selectedIndex].value; // Jordi

function setCurrentMonth(){
  console.log("today.substring(5,7):")
	console.log(today.substring(5,7));
	var month = document.getElementById("selectedMonth");
	month.value = mm
  console.log("month.value:")
  console.log(month.value)
}

// EMIEL - De maand selecteren
function selectMonth(){
	var tableBody = document.getElementById("selectedMonth");
        // var theMonth = tableBody[tableBody.selectedIndex].value;
        var table = document.getElementById("kostenTabel");
            for(var i = table.rows.length - 1; i > 0; i--){
                if(i !=0){
                    console.log(i);     
                    table.deleteRow(i);
                }//end if
            }//end for
        console.log("theMonth: " + theMonth);
        console.log(sessionStorage.getItem("storedUserID"))
		GETDeclaratiesPerMaand(theMonth);
		}

// EMIEL - GET trainee en de kosten
function GETDeclaratiesPerMaand(theMonth){
    //variabele voor totaal
    var totaleKosten = 0; 
    
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var trainee = JSON.parse(this.responseText);  
            trainee.kosten.sort(function(a,b){return a.factuurDatum<b.factuurDatum?-1:1});
            for(var i = 0; i<trainee.kosten.length; i++){
                kostenInDBHemZeMonth = trainee.kosten[i].factuurDatum.substring(5,7);
                if(kostenInDBHemZeMonth == theMonth) {
                    console.log(trainee.kosten[i].status)	
                    console.log(trainee.kosten[i])
                    BuildRowKostenTabel(trainee.kosten[i]);
                    
                    
                    console.log(totaleKosten)
                    if(trainee.kosten[i].soort == "Auto"){
                        bedragAuto = trainee.kosten[i].aantalKM * trainee.kosten[i].bedrag;
                        totaleKosten += bedragAuto;
                      }else{
                        totaleKosten += trainee.kosten[i].bedrag;
                      }//end if else
                }//end if
            }//end for
            calcTotaal(totaleKosten);
        }//end if
    };//end function
    xhttp.open("GET", apiUserId, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(); 
}

//EMIEL - Opbouwen rijen urentabel
function BuildRowKostenTabel(kosten){
  var table = document.getElementById("kostenTabel");
  
  var insertedRow = table.insertRow(1);
  
  var insertedCell = insertedRow.insertCell(0);
  insertedCell.innerHTML = kosten.status;
  //datum
  var insertedCell = insertedRow.insertCell(1);
    insertedCell.innerHTML = kosten.factuurDatum.substring(8,10)+ "/"+kosten.factuurDatum.substring(5,7)+"/"+ kosten.factuurDatum.substring(0,4);
  //soort kosten
  var insertedCell2 = insertedRow.insertCell(2);
  insertedCell2.innerHTML = kosten.soort;

  //bedrag kosten
  var insertedCell3 = insertedRow.insertCell(3);
  if(kosten.soort == "Auto"){
    insertedCell3.innerHTML = (kosten.bedrag*kosten.aantalKM)/100;
    }else{
      insertedCell3.innerHTML = kosten.bedrag/100;
    }//end if else  
  
    //Aantal KM als de kosten soort auto is
    var insertedCell4 = insertedRow.insertCell(4);
    if(kosten.soort == "Auto"){
    insertedCell4.innerHTML = kosten.aantalKM;}
    else {insertedCell4.innerHTML = "-"}

    // Opmerking veld
    var insertedCell5 = insertedRow.insertCell(5);
    insertedCell5.width = "300";
    insertedCell5.innerHTML = kosten.opmerking;


    
}//end BuildRowKostenTabel    
    
  // EMIEL - Totaal te declareren kosten weergeven
function calcTotaal(totaleKosten){
    totaleKosten = (Math.round(totaleKosten))/100;
    tableTotaal = document.getElementById("kostenDeclaArchTotaalTabelBody");
    tableTotaal.innerHTML = totaleKosten;
   
    //insertedCell0.appendChild(temp1);
  }//end calTotaal