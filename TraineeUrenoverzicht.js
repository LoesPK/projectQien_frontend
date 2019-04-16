//Loes: een paar variabelen 
var IDCell = 1;
var selectID = 0;
var dateID = 0;
var aantalID = 0;
//Loes: de twee api's
var apiHour = "http://localhost:8082/api/uur/";
var apiUserId = "http://localhost:8082/api/trainee/"+sessionStorage.getItem("storedUserID");
//trainee variabele 
var trainee;
var statusAkkoord;

//Bepalen huidige datum zodat er nooit een leeg datumveld wordt opgestuurd
var today = new Date();
var dd = today.getDate();
var mm = today.getMonth()+1; //As January is 0.
var yyyy = today.getFullYear();
if(dd<10) dd='0'+dd;
if(mm<10) mm='0'+mm;
today = yyyy+'-'+mm+'-'+dd ;

//Dropdown menu opbouwen
function traineeDropDownMenu(selectID){
	var select = document.getElementById("select"+selectID),
	arr = ["Overuren 100%", "Overuren 125%", "Verlof Uren", "Ziekte Uren"];
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
				trainee.uren.sort(function(a,b){return a.factuurDatum<b.factuurDatum?-1:1});
				for(var i = 0; i<trainee.uren.length; i++){
					
					//De dag, maand en jaar van het uur apart in een variabele
					var uurInDBHemZeMonth = trainee.uren[i].factuurDatum.substring(5,7);
					var uurInDBHemZeDay = trainee.uren[i].factuurDatum.substring(8,10);
					var uurInDBHemZeYear = trainee.uren[i].factuurDatum.substring(0,4);
					
					//Check op status vd uren zodat alleen de uren die niet ingevuld of teaccorderen zijn worden weergegeven
					if (trainee.uren[i].accordStatus == "NIETINGEVULD" || trainee.uren[i].accordStatus == "TEACCODEREN") { 
						GETRowUrenTabel(trainee.uren[i]);
						
						//voorwaarden wanneer een uur toegestaan is: anders wordt het uur roodgekleurd en moet de trainee deze (zelf) verwijderen
						if(uurInDBHemZeDay <= dd && uurInDBHemZeMonth == mm && uurInDBHemZeYear == yyyy ||
								uurInDBHemZeMonth == (mm-1) && uurInDBHemZeYear == yyyy || 
									mm == 1 && uurInDBHemZeMonth == 12 && uurInDBHemZeYear == (yyyy-1)){
//						console.log("Voorwaarde werkt!")
								}else{
							var id = trainee.uren[i].id;
							document.getElementById(id).style.background = "red";
//						console.log("Datum: " + dd)
						}//end ifelse
				}//end 2e if 		
			}//end for
		}//end 1e if
	}//end http function;
      xhttp.open("GET", apiUserId, true);
	    xhttp.setRequestHeader("Content-type", "application/json");
	    xhttp.send();	
}//end GETTrainee

function UrenVerzenden(){
	var table = document.getElementById("urenTabel");
	var tablebody = table.children[0];
	var aantal = tablebody.children.length;
   for(var i = 1; i<aantal; i++){
	var uur = {}
	var tablerow = tablebody.children[i];
   	uur.id = tablerow.id;
	uur.accordStatus = 1;
	akkoordUur(uur, uur.id);
	}
};

// PUT uren
function akkoordUur(uur, i) {
   var xhttp = new XMLHttpRequest();
   xhttp.onreadystatechange = function () {
       if (this.readyState == 4) {
           if (this.status == 200) {
           	document.location.reload(true);
           } else {
               alert(this.statusText)
           }
       }
   };
   xhttp.open("PUT", apiHour+i+"/akkoordstatus", true);
   xhttp.setRequestHeader("Content-type", "application/json");
   xhttp.send(JSON.stringify(uur));  
}


//Uren Opslaan functie
function HourSave(){
	var urenlijst = new Array();
	var table = document.getElementById("urenTabel");
	var tablebody = table.children[0];
	var aantal = tablebody.children.length;

   for(var i = 1; i<aantal; i++){
 	var uur = {}
   	var tablerow = tablebody.children[i];
   	uur.id = tablerow.id;
	var c = tablerow.children;
	// ------- soort uren veld -------//
	var ch = c[1];
	var chi = ch.children[0];
	var chiVal = chi.value;
	// ------- datumveld -------//
	var ch0 = c[0];
	var chi0 = ch0.children[0];
	// ------- aantal urenveld -------//
	var ch2 = c[2];
	var chi2 = ch2.children[0];

 	uur.waarde = chiVal;
	uur.aantal = chi2.value; 
	var d = new Date(chi0.value);
	uur.factuurDatum = d;
  	urenlijst.push(uur);
	}
	trainee.uren = urenlijst;
	PutTrainee(trainee);
}

//PUT uren
function PutTrainee(trainee){
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

//GET functie met opbouwen rijen urentabel
function GETRowUrenTabel(uur){
	var table = document.getElementById("urenTabel");
	var insertedRow = table.insertRow(1);
	insertedRow.id = uur.id;
	//datum

	var insertedCell = insertedRow.insertCell(0);
	console.log(uur.accordStatus);
	console.log(uur.accordStatus == "NIETINGEVULD");
	if(uur.accordStatus == "TEACCODEREN" || uur.accordStatus == "GOEDGEKEURD" || uur.accordStatus == "AFGEKEURD"){
		console.log("in if");
		insertedCell.innerHTML = uur.factuurDatum.substring(0,10);
		document.getElementById("addButton").setAttribute("disabled", "disabled");
		document.getElementById("buttonopslaan").setAttribute("disabled", "disabled");
		document.getElementById("sendHours").setAttribute("disabled", "disabled");
		var but = document.getElementsByClassName("fas fa-trash-alt");
		console.log(but);

	}else{
		var Datum = document.createElement("input");
		Datum.type = "date";
		Datum.value = uur.factuurDatum.substring(0,10);
		Datum.setAttribute("max", today);
		insertedCell.appendChild(Datum);
	}
	//soort uren
	var insertedCell1 = insertedRow.insertCell(1);
	
	if(uur.accordStatus == "TEACCODEREN" || uur.accordStatus == "GOEDGEKEURD" || uur.accordStatus == "AFGEKEURD"){
			insertedCell1.innerHTML = uur.waarde;
		}
	else{
	var arr = ["Gewerkte Uren", "Overuren 100%", "Overuren 125%", "Verlof Uren", "Ziekte Uren"];
	var SoortUur = document.createElement("select");
		SoortUur.id = uur.id;
	for(var i = 0; i<arr.length; i++){
		var option = document.createElement("OPTION"),
		txt = document.createTextNode(arr[i]);
		option.appendChild(txt);
		option.value = arr[i];
		SoortUur.insertBefore(option,SoortUur.lastChild);
		if(arr[i] === uur.waarde){
			SoortUur.value = uur.waarde;
		}
	insertedCell1.appendChild(SoortUur);
	}
	}
	
	//aantal uren
	var insertedCell2 = insertedRow.insertCell(2);
	if(uur.accordStatus == "TEACCODEREN" || uur.accordStatus == "GOEDGEKEURD" || uur.accordStatus == "AFGEKEURD"){
		insertedCell2.innerHTML = uur.aantal;
	}
	else{
		var AantalUur = document.createElement("input");
		AantalUur.type = "number";
		AantalUur.value = uur.aantal;
		insertedCell2.appendChild(AantalUur);
		var VerwijderKnop = document.createElement("span");
		VerwijderKnop.className = "fas fa-trash-alt";
		VerwijderKnop.addEventListener("click", function(){
		var xhttp = new XMLHttpRequest();
	  	xhttp.onreadystatechange = function() {
	    	if (this.readyState == 4 && this.status == 200) {
					insertedRow.parentNode.removeChild(insertedRow);
    		}
 	 	};
  		xhttp.open("DELETE", apiHour+uur.id, true);
  		xhttp.send();});
	insertedCell2.appendChild(VerwijderKnop);
	}
	var insertedCell3 = insertedRow.insertCell(3);
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

}

//functie om rijen toe te voegen aan de tabel
function addRowUrenTabel(){
	table = document.getElementById("urenTabel");
	var insertedRow = table.insertRow(1);
	insertedRow.id = "0";
	for(var i = 0; i<4; i++){
		var insertedCell = insertedRow.insertCell(i);
		insertedCell.id = IDCell++;
		//voor de eerste cel (cel 0(i=0)): voeg het datum inputveld toe
			if (i == 0) {
				dateID++;
				var temp1 = document.createElement("input");
				temp1.type = "date";
				temp1.id = "datum"+dateID; 
				temp1.setAttribute("max", today);
				temp1.value = today;
				insertedCell.appendChild(temp1);
			}
			//voor de eerste cel (cel 1(i=1)): voeg het dropdownmenu toe
			if (i == 1) {
				selectID++;
				var temp1 = document.createElement("select");
				temp1.id = "select"+selectID;
				var temp2 = document.createElement("OPTION");
				temp2.innerHTML = "Gewerkte Uren"
				temp1.appendChild(temp2);
				insertedCell.appendChild(temp1);
			}
			//voor de eerste cel (cel 2 (i=2)): voeg het aantal inputveld toe
			if (i == 2) {
				aantalID++;
				var temp1 = document.createElement("input");
				temp1.type = "number";
				temp1.min = 0;
				temp1.max = 24;
				temp1.value = 8;
				temp1.id = "aantal"+aantalID; 
				var temp2 = document.createElement("span");
				temp2.className = "fas fa-trash-alt";
				temp2.addEventListener("click", function(){
					var tr = event.target.parentNode;
					var td = tr.parentNode;
					td.parentNode.removeChild(td);
					});
				insertedCell.appendChild(temp1);
				insertedCell.appendChild(temp2);		
			}
			if(i == 3){
				insertedCell.innerHTML = "Nieuw";
			}
	}
	traineeDropDownMenu(selectID);
}


function Userlogout(){
	sessionStorage.clear();
}

