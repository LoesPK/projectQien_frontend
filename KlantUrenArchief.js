var apiKlant = "http://localhost:8082/api/klant/"+sessionStorage.getItem("storedUserID");
var klant;
var theMonth;

// EMIEL - De maand selecteren
function selectMonth(){
	var tableBody = document.getElementById("selectedMonth");
		theMonth = tableBody[tableBody.selectedIndex].value;
		GETUrenPerMaand(theMonth);
		}

// EMIEL - GET Uren per maand
function GETUrenPerMaand(theMonth){
	var table = document. getElementById("traineelijst");
	if(table.rows.length > 0){
	for(var i = table.rows.length - 1; i > 0; i--)
		{
		table. deleteRow(i);
		}
	}
  var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
           var klant = JSON.parse(this.responseText);
           //eerst alle trainees van de klant ophalen	
			for(var j = 0; j<klant.trainee.length; j++){
				var akkoordstatusPerMaand = "";
				var aantalUrenPerMaand = 0;
				klant.trainee[j].akkoordstatus = "" ;
            	//dan per trainee de akkoordstatus en aantal uren bepalen
            	for(var i = 0; i<klant.trainee[j].uren.length; i++){ //--> hier per trainee naar alle uren kijken
            		if(theMonth == klant.trainee[j].uren[i].factuurDatum.substring(5,7)){
            			aantalUrenPerMaand += klant.trainee[j].uren[i].aantal;
            			klant.trainee[j].akkoordstatus = klant.trainee[j].uren[i].accordStatus;
            		}//end if
            	}//end forloop trainee.uren
            	if(klant.trainee[j].akkoordstatus == "GOEDGEKEURD" || klant.trainee[j].akkoordstatus == "AFGEKEURD" ){
            		GETRowUrenTabel(aantalUrenPerMaand, klant.trainee[j].akkoordstatus, klant.trainee[j]);
            	}//end if waarin rijen worden aangeroepen
	      	}//end forloop trainees
      }//end if readystate
   };//end xhttp functie
    xhttp.open("GET", apiKlant, true);
	xhttp.setRequestHeader("Content-type", "application/json");
	xhttp.send();	
}//end GETurenpermaand functie

//GET functie met opbouwen rijen urentabel
function GETRowUrenTabel(aantalUren, akkoordstatus, trainee){

	var body = document.getElementById("KlantUrenArchiefBodyTable");
	var insertedRow = body.insertRow(0);
	insertedRow.id = trainee.id;
    
    //Voornaam
	var insertedCell = insertedRow.insertCell(0);
		insertedCell.innerHTML = trainee.voornaam;
    
    //Achternaam
	var insertedCell1 = insertedRow.insertCell(1);
    insertedCell1.innerHTML = trainee.achternaam;;

    //aantal uren
	var insertedCell2 = insertedRow.insertCell(2);   
	insertedCell2.innerHTML = aantalUren;


	//akkoordstatus
	var insertedCell3 = insertedRow.insertCell(3);   
	var statusAkkoord;
	if(akkoordstatus == "GOEDGEKEURD"){
		statusAkkoord = "Goedgekeurd";
	}if(akkoordstatus == "AFGEKEURD"){
		statusAkkoord = "Afgekeurd";
	}
	insertedCell3.innerHTML = statusAkkoord;
}

function Userlogout(){
	sessionStorage.clear();
}