
//Loes: de api's
var apiUserId = "http://localhost:8082/api/trainee/"+sessionStorage.getItem("storedUserID");//+sessionStorage.getItem("storedUserID");
var apiKlant = "http://localhost:8082/api/klant/";
//trainee variabele 
var trainee;


// EMIEL - de maand van het uur in database en het jaar van het uur in database
var uurInDBHemZeMonth;
var uurInDBHemZeJaar;

//Bepalen huidige datum zodat er nooit een leeg datumveld wordt opgestuurd
var today = new Date();
var dd = today.getDate();
var mm = today.getMonth()+1; //As January is 0.
var yyyy = today.getFullYear();
if(dd<10) dd='0'+dd;
if(mm<10) mm='0'+mm;
today = yyyy+'-'+mm+'-'+dd ;

// EMIEL - de geselecteerde maand en het jaar
var theMonth = setCurrentMonth();
var theYear = setCurrentJaar();


function setCurrentMonth(){
	console.log(today.substring(5,7));
	var month = document.getElementById("selectedMonth");
	month.value = mm
	console.log(month.value)
}

function setCurrentJaar(){
	console.log(today.substring(0,5));
	var year = document.getElementById("selectedYear");
	year.value = yyyy;
	console.log(year.value)
}


// EMIEL - De maand selecteren
function selectMonth(){
	var tableBody = document.getElementById("selectedMonth");
		theMonth = tableBody[tableBody.selectedIndex].value;
		console.log("theMonth: " + theMonth);
		GETUrenPerMaand(theMonth);
		}

//Tim - Het jaar selecteren
function selectYear(){
	var tablebodyYear = document.getElementById("selectedYear");
	theYear = tablebodyYear[tablebodyYear.selectedIndex].value;
	console.log("theYear : " + theYear)
	selectMonth();
}

// EMIEL - GET Uren per maand
function GETUrenPerMaand(theMonth){
	var table = document. getElementById("urenTabel");
	
	for(var i = table.rows.length -1; i >= 0; i--)
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
								uurInDBHemZeJaar = trainee.uren[i].factuurDatum.substring(0,4);
								console.log("datum in de uren")
								console.log(uurInDBHemZeMonth)
								console.log(uurInDBHemZeJaar)
								
                    if(uurInDBHemZeMonth == theMonth && uurInDBHemZeJaar == theYear) {

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
	var body = document.getElementById("urenTabel");
	var insertedRow = body.insertRow(0);
	console.log(insertedRow);

	insertedRow.id = uur.id;
	insertedRow.className = "table-striped"
    //datum
	var insertedCell = insertedRow.insertCell(0);
		insertedCell.innerHTML = uur.factuurDatum.substring(8,10) + "/" + uur.factuurDatum.substring(5,7) +"/" + uur.factuurDatum.substring(0,4);
    
    //soort uren
	var insertedCell1 = insertedRow.insertCell(1);
        insertedCell1.innerHTML = uur.waarde;

    //aantal uren
	var insertedCell2 = insertedRow.insertCell(2);   
		insertedCell2.innerHTML = uur.aantal;
	var statusAkkoord = "";
		//akkoordstatus
	var insertedCell3 = insertedRow.insertCell(3);   
	if(uur.accordStatus == "NIETINGEVULD"){
		statusAkkoord = "Opgeslagen";
	}if(uur.accordStatus == "TEACCORDEREN"){
		statusAkkoord = "Te Accorderen";
	}if(uur.accordStatus == "GOEDGEKEURD"){
		statusAkkoord = "Goedgekeurd";
	}if(uur.accordStatus == "AFGEKEURD"){
		statusAkkoord = "Afgekeurd";
	}
	insertedCell3.innerHTML = statusAkkoord;


	var insertedCell5 = insertedRow.insertCell(4);
		console.log("insertedCell5:");
		console.log(insertedCell5);   
		// var klant = document.createElement("td");

		GetKlant(uur.bijKlant, insertedCell5);
				// insertedCell5.appendChild(klant);
				// console.log("klant:");
				// console.log(klant);
				// insertedCell5.innerHTML = klant;
}

// EMIEL - GET de klant van het uur
function GetKlant(uurBijKlantId, klant){
  var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
            klantDB = JSON.parse(this.responseText);	
						console.log(klantDB.bedrijf);	
						klant.innerHTML = klantDB.bedrijf;
      }//end if
		};//end function
		
      xhttp.open("GET", apiKlant+ uurBijKlantId, true);
	    xhttp.setRequestHeader("Content-type", "application/json");
	    xhttp.send();	
}//end GetKlant


function Userlogout(){
	sessionStorage.clear();

}

