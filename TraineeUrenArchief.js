
//Loes: de api's
var apiUserId = "http://localhost:8082/api/trainee/"+sessionStorage.getItem("storedUserID");//+sessionStorage.getItem("storedUserID");
//trainee variabele 
var trainee;

// EMIEL - de geselecteerde maand
var theMonth = "";
// EMIEL - de maand van het uur in database
var uurInDBHemZeMonth;

//Bepalen huidige datum zodat er nooit een leeg datumveld wordt opgestuurd
var today = new Date();
var dd = today.getDate();
var mm = today.getMonth()+1; //As January is 0.
var yyyy = today.getFullYear();
if(dd<10) dd='0'+dd;
if(mm<10) mm='0'+mm;
today = yyyy+'-'+mm+'-'+dd ;




// EMIEL - De maand selecteren
function selectMonth(){
	var tableBody = document.getElementById("selectedMonth");
		theMonth = tableBody[tableBody.selectedIndex].value;
		console.log("theMonth: " + theMonth);
		GETUrenPerMaand(theMonth);
		}

// EMIEL - GET Uren per maand
function GETUrenPerMaand(theMonth){
	var table = document. getElementById("urenTabel");
	for(var i = table.rows.length - 1; i > 0; i--)
		{
		table. deleteRow(i);
		}
  var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
            trainee = JSON.parse(this.responseText);	
            trainee.uren.sort(function(a,b){return b.factuurDatum<a.factuurDatum?-1:1});
            for(var i = 0; i<trainee.uren.length; i++){
                uurInDBHemZeMonth = trainee.uren[i].factuurDatum.substring(5,7);
                    if(uurInDBHemZeMonth == theMonth) {
                        GETRowUrenTabel(trainee.uren[i]);
                    }	
            }
      }
    };
      xhttp.open("GET", apiUserId, true);
	    xhttp.setRequestHeader("Content-type", "application/json");
	    xhttp.send();	
}

//GET functie met opbouwen rijen urentabel
function GETRowUrenTabel(uur){
	var table = document.getElementById("urenTabel");
	var insertedRow = table.insertRow(1);
	insertedRow.id = uur.id;
    
    //datum
	var insertedCell = insertedRow.insertCell(0);
	var Datum = document.createElement("td");
		Datum.innerHTML = uur.factuurDatum.substring(8,10) + "/" + uur.factuurDatum.substring(5,7) +"/" + uur.factuurDatum.substring(0,4);
		insertedCell.appendChild(Datum);
    
    //soort uren
	var insertedCell1 = insertedRow.insertCell(1);
    var Soort = document.createElement("td");
		Soort.innerHTML = uur.waarde;
        insertedCell1.appendChild(Soort);

    //aantal uren
	var insertedCell2 = insertedRow.insertCell(2);   
    var AantalUur = document.createElement("td");
		AantalUur.innerHTML = uur.aantal;
				insertedCell2.appendChild(AantalUur);

		//akkoordstatus
	var insertedCell3 = insertedRow.insertCell(3);   
	var status = document.createElement("td");
	if(uur.accordStatus == "NIETINGEVULD"){
		statusAkkoord = "Opgeslagen";
	}if(uur.accordStatus == "TEACCODEREN"){
		statusAkkoord = "Te Accoderen";
	}if(uur.accordStatus == "GOEDGEKEURD"){
		statusAkkoord = "Goedgekeurd";
	}if(uur.accordStatus == "AFGEKEURD"){
		statusAkkoord = "Afgekeurd";
	}
	insertedCell3.innerHTML = statusAkkoord;
	insertedCell3.appendChild(status);
}

function Userlogout(){
	sessionStorage.clear();
}

