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

// Jordi
// Checkt of de aangeklikte dag declarabel is (dus geen weekend of vrije feestdag)
function isDeclarabeleDag(e){
	var dagvdWeek = new Date( e.target.value ).getUTCDay() + 1; // telt nu van 1-7 (begin bij zondag)

	var jaar = new Date( e.target.value ).getUTCFullYear();
	var maand = new Date( e.target.value ).getUTCMonth() + 1; // nu 1-12 (januari = 1)
	var dag = new Date( e.target.value ).getUTCDate(); // 1-31 (dag vd maand)

	var pasen = new Date (jaar, EasterMaand(jaar)-1, EasterDag(jaar)); //-1 omdat gewoon zomaar

	var hemelvaart = new Date(jaar, pasen.getUTCMonth(), pasen.getUTCDate());
	hemelvaart.setDate(pasen.getUTCDate() + 40);

	var pinksteren = new Date(jaar, pasen.getUTCMonth(), pasen.getUTCDate());
	pinksteren.setDate(pasen.getUTCDate() + 50);

	console.log("jaar: " + jaar + ", maand: " + maand + ", dag: " + dag);
	console.log("pasen:");
	console.log(pasen);
	console.log("hemelvaart:");
	console.log(hemelvaart);
	console.log(hemelvaart.getUTCMonth());
	console.log(hemelvaart.getUTCDate());
	console.log("pinksterdag 1:");
	console.log(pinksteren);
	console.log(pinksteren.getUTCMonth());
	console.log(pinksteren.getUTCDate());

	// Is het weekend?
	if(dagvdWeek == 1 || dagvdWeek == 7){
		alert("Let op, deze dag is niet declarabel");
	}

	// nieuwjaar
	else if(maand == 1 && dag == 1){
		alert("Let op, deze dag is niet declarabel");
	}
	// koningsdag (als het op zondag valt wordt het een dag eerder gevierd, maar zaterdag valt al onder weekend check)
	else if(maand == 4 && dag == 27){
		// if (!(koningsdag.getUTCDay + 1) == 1){
			alert("Let op, deze dag is niet declarabel");
		// }
	}
	// kerstdagen
	else if(maand == 12 && dag == 25){
		alert("Let op, deze dag is niet declarabel");
	}
	else if(maand == 12 && dag == 26){
		alert("Let op, deze dag is niet declarabel");
	}

	// niet-vaste vrije dagen:
	// paasdagen
	// 1e
	else if(maand == EasterMaand(jaar) && dag == EasterDag(jaar)){
		alert("Let op, deze dag is niet declarabel");
	}
	// 2e
	else if(maand == EasterMaand(jaar) && dag == EasterDag(jaar)+1){
		alert("Let op, deze dag is niet declarabel");
	}
	// hemelvaart
	else if(maand == hemelvaart.getUTCMonth()+1 && dag == hemelvaart.getUTCDate()+1){
		alert("Let op, deze dag is niet declarabel");
	}

	// pinksterdagen
	// 1e
	else if(maand == pinksteren.getUTCMonth()+1 && dag == pinksteren.getUTCDate()+1){
		alert("Let op, deze dag is niet declarabel");
	}
	// 2e
	else if(maand == pinksteren.getUTCMonth()+1 && dag == pinksteren.getUTCDate()+1+1){
		alert("Let op, deze dag is niet declarabel");
	}

}

// kant en klare berekening, returnt de maand (M) en de dag (D) van pasen van het meegegeven jaar (Y)
function EasterMaand(Y) {
	var C = Math.floor(Y/100);
	var N = Y - 19*Math.floor(Y/19);
	var K = Math.floor((C - 17)/25);
	var I = C - Math.floor(C/4) - Math.floor((C - K)/3) + 19*N + 15;
	I = I - 30*Math.floor((I/30));
	I = I - Math.floor(I/28)*(1 - Math.floor(I/28)*Math.floor(29/(I + 1))*Math.floor((21 - N)/11));
	var J = Y + Math.floor(Y/4) + I + 2 - C + Math.floor(C/4);
	J = J - 7*Math.floor(J/7);
	var L = I - J;
	var M = 3 + Math.floor((L + 40)/44);
	var D = L + 28 - 31*Math.floor(M/4);
	return M;
}
function EasterDag(Y) {
	var C = Math.floor(Y/100);
	var N = Y - 19*Math.floor(Y/19);
	var K = Math.floor((C - 17)/25);
	var I = C - Math.floor(C/4) - Math.floor((C - K)/3) + 19*N + 15;
	I = I - 30*Math.floor((I/30));
	I = I - Math.floor(I/28)*(1 - Math.floor(I/28)*Math.floor(29/(I + 1))*Math.floor((21 - N)/11));
	var J = Y + Math.floor(Y/4) + I + 2 - C + Math.floor(C/4);
	J = J - 7*Math.floor(J/7);
	var L = I - J;
	var M = 3 + Math.floor((L + 40)/44);
	var D = L + 28 - 31*Math.floor(M/4);
	return D;
}

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
					if (trainee.uren[i].accordStatus == "NIETINGEVULD" || trainee.uren[i].accordStatus == "TEACCORDEREN" || trainee.uren[i].accordStatus == "AFGEKEURD") { 
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
	var body = document.getElementById("urenTabel");
	var aantal = body.children.length;
   for(var i = 0; i<aantal; i++){
	var uur = {}
	var tablerow = body.children[i];
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
	var body = document.getElementById("urenTabel");
	var aantal = body.children.length;

   for(var i = 0; i<aantal; i++){
 	var uur = {}
   	var tablerow = body.children[i];
   	console.log(tablerow);
   	uur.id = tablerow.id;
	var c = tablerow.children;
	console.log(c);
	// ------- soort uren veld -------//
	var ch = c[1];
	console.log(c[1])
	var chi = ch.children[0];
	var chiVal = chi.value;
	console.log(chiVal);
	// ------- datumveld -------//
	var ch0 = c[0];
	var chi0 = ch0.children[0];
	// ------- aantal urenveld -------//
	var ch2 = c[2];
	var chi2 = ch2.children[0];

 	uur.waarde = chiVal;
	uur.aantal = chi2.value; 
	var d = new Date(chi0.value);
	console.log("hier misschien die functie?"); // Jordi
	uur.factuurDatum = d;
	uur.bijKlant = trainee.klant.id;
	console.log("KlanvhUur: ")
	console.log(uur.bijKlant)
  	urenlijst.push(uur);
	}
	trainee.uren = urenlijst;
	console.log(trainee.klant.id + "Traineeee");
	PutTrainee(trainee);
	enableverzenden();
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
	var body = document.getElementById("urenTabel");
	var insertedRow = body.insertRow(0);
	insertedRow.id = uur.id;
	insertedRow.style.borderBottom = "dotted 1px darkslategrey"
	//datum

	var insertedCell = insertedRow.insertCell(0);
	console.log(uur.accordStatus);
	if(uur.accordStatus == "TEACCORDEREN" || uur.accordStatus == "GOEDGEKEURD"){
		console.log("in if");
		insertedCell.innerHTML = uur.factuurDatum.substring(8,10) + "/" + uur.factuurDatum.substring(5,7) +"/" + uur.factuurDatum.substring(0,4)

		document.getElementById("addButton").setAttribute("disabled", "disabled");
		document.getElementById("buttonopslaan").setAttribute("disabled", "disabled");
		document.getElementById("sendHours").setAttribute("disabled", "disabled");
		var but = document.getElementsByClassName("fas fa-trash-alt");
		console.log(but);

		// Jordi
		// console.log(uur.factuurDatum);
		// isDeclarabeleDag(uur.factuurDatum); 
		// console.log("De dag " + uur.factuurDatum + " is declarabel: " + isDeclarabeleDag(uur.factuurDatum));
	}
	else if(uur.accordStatus == "AFGEKEURD"){
			var Datum = document.createElement("input");
			Datum.className = "form-control"
			Datum.type = "date";
			Datum.value = uur.factuurDatum.substring(0,10);
			Datum.setAttribute("max", today);
			document.getElementById("addButton").setAttribute("disabled", "disabled");
			// document.getElementById("buttonopslaan").setAttribute("disabled", "disabled");
			var but = document.getElementsByClassName("fas fa-trash-alt");
			insertedCell.appendChild(Datum);
	}else{
		var Datum = document.createElement("input");
		Datum.className = "form-control"
		Datum.type = "date";
		Datum.value = uur.factuurDatum.substring(0,10);
		Datum.setAttribute("max", today);
		insertedCell.appendChild(Datum);
	}
	//soort uren
	var insertedCell1 = insertedRow.insertCell(1);
	
	if(uur.accordStatus == "TEACCORDEREN" || uur.accordStatus == "GOEDGEKEURD"){
			insertedCell1.innerHTML = uur.waarde;
		}
	else{
	var arr = ["Gewerkte Uren", "Overuren 100%", "Overuren 125%", "Verlof Uren", "Ziekte Uren"];
	var div = document.createElement("div");
	div.className = "form-group";
	var SoortUur = document.createElement("select");
	SoortUur.className = "form-control";
	SoortUur.style.width = "auto";
	SoortUur.id = uur.id;
		
	for(var i = 0; i<arr.length; i++){

		var option = document.createElement("OPTION"),
		txt = document.createTextNode(arr[i]);
		option.value=txt;
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
	if(uur.accordStatus == "TEACCORDEREN" || uur.accordStatus == "GOEDGEKEURD"){
		insertedCell2.innerHTML = uur.aantal;
	}
	else{
		var AantalUur = document.createElement("input");
		AantalUur.type = "number";
		AantalUur.value = uur.aantal;
		AantalUur.className = "form-control";
		insertedCell2.appendChild(AantalUur);
		
	}
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
  		insertedCell3.innerHTML = statusAkkoord;
	insertedCell3.appendChild(VerwijderKnop);
				

	

}

//functie om rijen toe te voegen aan de tabel
function addRowUrenTabel(){
	var body = document.getElementById("urenTabel");
	var insertedRow = body.insertRow(0);

	insertedRow.id = "0";
	for(var i = 0; i<4; i++){
		var insertedCell = insertedRow.insertCell(i);
		insertedCell.id = IDCell++;
		//voor de eerste cel (cel 0(i=0)): voeg het datum inputveld toe
			if (i == 0) {
				dateID++;
				var temp1 = document.createElement("input");
				temp1.type = "date";
				temp1.className = "form-control"
				temp1.id = "datum"+dateID; 
				temp1.setAttribute("max", today);
				temp1.value = today;
				insertedCell.appendChild(temp1);

				//Jordi
				var datumSelector = document.querySelector('[type=date]');
				ds = document.getElementById(temp1.id);
				// console.log(datumSelector);
				datumSelector.addEventListener('input', isDeclarabeleDag);
				// ds.onchange = alert("yo");
			}
			//voor de eerste cel (cel 1(i=1)): voeg het dropdownmenu toe
			if (i == 1) {
				selectID++;
				var temp1 = document.createElement("select");
				temp1.id = "select"+selectID;
				temp1.className = "form-control";
				temp1.style.width="auto";
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
				temp1.className = "form-control"
				temp1.min = 0;
				temp1.max = 24;
				temp1.value = 8;
				temp1.id = "aantal"+aantalID; 
				// var temp2 = document.createElement("span");
				// temp2.className = "fas fa-trash-alt";
				// temp2.addEventListener("click", function(){
				// 	var tr = event.target.parentNode;
				// 	var td = tr.parentNode;
				// 	td.parentNode.removeChild(td);
				// 	});
				insertedCell.appendChild(temp1);
				// insertedCell.appendChild(temp2);		
			}
			if(i == 3){
				insertedCell.innerHTML = "Nieuw";
				var temp2 = document.createElement("span");
				temp2.className = "fas fa-trash-alt";
				temp2.addEventListener("click", function(){
					var tr = event.target.parentNode;
					var td = tr.parentNode;
					td.parentNode.removeChild(td);
					});
				insertedCell.appendChild(temp2);		
			}
	}
	traineeDropDownMenu(selectID);
	disableverzenden();
}


function Userlogout(){
	sessionStorage.clear();
}

function disableverzenden() {
  document.getElementById("sendHours").disabled = true;
}

function enableverzenden() {
  document.getElementById("sendHours").disabled = false;
}
