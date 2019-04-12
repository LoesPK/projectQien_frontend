var IDCell = 1;
var selectID = 0;
var dateID = 0;
var aantalID = 0;
//Loes: onderstaande is het javascript datum opject
var date = new Date();
//Loes: de twee api's
var apikosten = "http://localhost:8082/api/kosten/";
// Jordi: api voor de ingelogde user
var apiUserId = "http://localhost:8082/api/trainee/"+sessionStorage.getItem("storedUserID");
// var tijdsform = getData();
var lijst = new Array();
//bedrag per kiloter
var bedragPerKm = 19;

//Bepalen huidige datum zodat er nooit een leeg datumveld wordt opgestuurd (was een bug)
var today = new Date();
var dd = today.getDate();
var mm = today.getMonth()+1; //As January is 0.
var yyyy = today.getFullYear();
if(dd<10) dd='0'+dd;
if(mm<10) mm='0'+mm;
today = yyyy+'-'+mm+'-'+dd ;
function setCurrentDate(){
    //Datum bij de OV kosten
        var datumveld = document.getElementById("datum0");
        datumveld.value = today;
    //Datum bij de Auto kosten
        var datumveld1 = document.getElementById("datum1");
        datumveld1.value = today;
    }

//Bepalen huidige datum voor restrictie op het invullen van kosten
var maxDate = new Date();
var mm = (new Date().getMonth()+1)%12 + 1; //January is 0!
var yyyy = maxDate.getFullYear();
    if(mm<10){
        mm='0'+mm
    } 
maxDate = (yyyy+'-'+mm+'-'+'01');
function setMaxDatum(){
	var datumveld = document.getElementById("datum0");
    datumveld.setAttribute("max", maxDate);
    var datumveld1 = document.getElementById("datum1");
	datumveld1.setAttribute("max", maxDate);
}

//Kosten dropdown menu opbouwen
function dropkosten(selectID){
	var select = document.getElementById("select"+selectID),
	arr = ["Overige Kosten"];
	for(var i = 0; i<arr.length; i++){
		var option = document.createElement("OPTION"),
		txt = document.createTextNode(arr[i]);
		option.appendChild(txt);
		select.insertBefore(option,select.lastChild);
    }
    //console.log("drop methode");
}

// Jordi: GET trainee (kosten)
// Naamgeving zou nog wat beter kunnen
function GETTrainee(){
    var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          trainee = JSON.parse(this.responseText);	
          trainee.kosten.sort(function(a,b){return a.factuurDatum<b.factuurDatum?-1:1});
           for(var i = 0; i<trainee.kosten.length; i++){
               console.log("trainee.kosten," + "i = " + i);
               console.log(trainee.kosten);
               GETRowKostenTabel(trainee.kosten[i]);
           }
        }
      };
        xhttp.open("GET", apiUserId, true);
          xhttp.setRequestHeader("Content-type", "application/json");
          xhttp.send();	
  }

//Bepalen huidige datum voor restrictie op het invullen van uren //Jordi: hier voor kosten dus?
var maxDate = new Date();
var mm = (new Date().getMonth()+1)%12 + 1; //January is 0!
var yyyy = maxDate.getFullYear();
    if(mm<10){
        mm='0'+mm
    } 
    maxDate = (yyyy+'-'+mm+'-'+'01');
    function setMaxDatum(){
	var datumveld = document.getElementById("datum0");
    datumveld.setAttribute("max", maxDate);
    //console.log("setMaxDatum methode");
}

//voegt 1 nieuwe rij toe aan de tabel
function addRowKostenTabel(){
	console.log("in addRowKostenTabel()")
    var table = document.getElementById("kostenTabel");
    console.log("table:");
    console.log(table);
    // console.log("tabl children length: " + table.children.children.length); // kan niet length van de children.children
    console.log("table.children[1]:");
    console.log(table.children[1]);
    var insertedRow = table.children[1].insertRow(0); //oud: zonder children, en insertRow(1)
	insertedRow.id = "0";
    // insertedRow.className = "kostenRow";
	for(var i = 0; i<4; i++){
		var insertedCell = insertedRow.insertCell(i);
        insertedCell.id = IDCell++;
        
        //voor de eerste cel (cel 0(i=0)): voeg het status inputveld toe
        if (i == 0) {
            var temp1 = document.createElement("td");
            temp1.innerHTML = "Open";
            insertedCell.appendChild(temp1);
        }
        //voor de eerste cel (cel 0(i=0)): voeg het datum inputveld toe
        if (i == 1) {
            dateID++;
            var temp1 = document.createElement("input");
            temp1.type = "date";
            temp1.id = "datum"+dateID; 
            temp1.setAttribute("max", maxDate);
            temp1.value = today;
            //console.log(temp1.value)
            // temp1.required = "required";
            insertedCell.appendChild(temp1);
        }
        //voor de eerste cel (cel 1(i=1)): voeg het dropdownmenu toe
        if (i == 2) {
            selectID++;
            var temp1 = document.createElement("select");
            temp1.id = "select"+selectID;
            var temp2 = document.createElement("OPTION");
            temp2.innerHTML = "Openbaar Vervoer"
            temp1.appendChild(temp2);
            insertedCell.appendChild(temp1);
        }
        //voor de eerste cel (cel 2 (i=2)): voeg het bedrag inputveld toe
        if (i == 3) {
            aantalID++;
            var temp1 = document.createElement("input");
            temp1.type = "number";
            temp1.value = 0;
            temp1.id = "aantal"+aantalID; 
            
            insertedCell.appendChild(temp1);
        }
	}
    dropkosten(selectID);
}

// JORDI: bug oplossen START #################################################################################################################
//POST kosten opslaan functie
// roept ook PUTTrainee en POSTDataKosten aan
function KostenOpslaan(){
    console.log("in kosten opslaan");
    var kostenlijst = new Array();
    var table = document.getElementById("kostenTabel");
    console.log("table:");
    console.log(table);
    console.log("table children:");
    console.log(table.children);
    // var tablebody = table.children[2];
    // console.log("tablebody:");
    // console.log(tablebody);
    // var aantal = tablebody.children.length; // hij denkt dat alleen de onderste rij bestaat
    // console.log("aantal:" + aantal);

    var nieuwekosten = trainee.kosten;
    // voor elke rij (i is een rij)
    for(var rij = 0; rij<2; rij++){
        console.log("we kijken nu naar rij:" + rij);
        var kosten = {};
        var tablerow = table.children[0].children[rij]; //var tablerow = tablebody.children[rij];
        kosten.id = tablerow.id;
        var c = tablerow.children;

        var ch2 = c[3];
        var chi2 = ch2.children[0];
        // Als het bedrag <=0 is dan slaat het deze rij over en slaat hem niet op.
        if(chi2.value <= 0){
            console.log("continue");
            continue;
        }

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

        kosten.soort = chiVal;
        kosten.bedrag = chi2.value*100; 
        var d = new Date(chi0.value);
        kosten.factuurDatum = d;
        kosten.status = "Opgeslagen";
        kostenlijst.push(kosten);
        console.log("kostenlijst:");
        console.log(kostenlijst);

        nieuwekosten.push(kosten)
        console.log("nieuwe kosten:");
        console.log(nieuwekosten);
       
        //POST alleen als het id van uren 0 is, ofwel, alleen als de uren nieuw zijn toegevoegd. alle id's die hoger zijn dan 0 staan al in de database.
        if(tablerow.id == 0){
            //console.log(tablerow.id + "tablerow.id");
            var test = JSON.stringify(kosten),tablerow;
            //console.log(test + " JSON Test");
            // PostDataKosten(JSON.stringify(kosten),tablerow);	
        }
        //PUT alleen als het id van uren geen 0 is (ofwel, hij staat al in de database) en als de waarde daadwerkelijk anders is geworden.
        // CHANGESTUFFHERE
        else{
            if(chi0.value != kosten.factuurDatum){
                console.log("niet gelijk datum");
                console.log("Nu zou PUTwijzigkosten(kosten) aangeroepen worden - niet gelijk datum");
                // PUTwijzigkosten(kosten);
            }
            if(chiVal != kosten.soort){
                console.log("niet gelijk kosten soort");
                console.log("Nu zou PUTwijzigkosten(kosten) aangeroepen worden - niet gelijk soort");
                // PUTwijzigkosten(kosten);
            }
            if(chi2.value != kosten.bedrag){
                console.log("niet gelijk kosten bedrag");
                console.log("Nu zou PUTwijzigkosten(kosten) aangeroepen worden - niet gelijk bedrag");
                // PUTwijzigkosten(kosten);
            }
        }	
    }
    // CHANGESTUFFHERE
    // Jordi: let op dat je de uiteindelijke nieuwe kosten BUITEN de for loop toewijst (tenzij je het fatsoenlijk weet toe te voegen in elke loop)
    
    // for (var j=0; j<kostenlijst.length; j++){
    //     console.log("loop " + j);
    //     // nieuwekosten.push(kostenlijst[i]);
    // }
    console.log("nieuwe kosten:");
    console.log(nieuwekosten);
    PutTrainee(trainee);
}

function kostenOpslaanJordi(){
    var kosten;
    var kostenTabel = document.getElementById("kostenTabel");
    var kostenTabelBody = kostenTabel.children[1];
    var aantalChildren = kostenTabelBody.children.length;
    // console.log("kostenTabelBody.children[0]:");
    // console.log(kostenTabelBody.children[0]);
    // console.log("aantal children tabel: " + aantalChildren);
    // voor elke rij
    // rij is het getal van de rij
    // huidigeRij is het object dat alle children van die rij bevat
    for(var rij = 0; rij<aantalChildren; rij++){
        var kost = {};
        var huidigeRij = kostenTabelBody.children[rij];
        // console.log("huidige rij value: ")
        // console.log(huidigeRij.value);
        // console.log("kostenTabel:");
        // console.log(kostenTabel);
        // console.log("huidigeRij:");
        // console.log(huidigeRij);

        if (huidigeRij.id == 0){
            console.log("rij " + rij + " is een nieuw toegevoegde rij (met id 0 dus)");
        }else{
            console.log("rij " + rij + " heeft niet id 0");
        }
        // voor elke cell
        // for (var cell = 0; cell<huidigeRij.children.length; cell++){
        //     var huidigeCell = huidigeRij.children[cell];

        //     console.log("huidige cell value: " + huidigeCell.value);
        //     //stuff
        // }   
        kost.id = rij+100; //test, misschien dom idee
        kost.status = huidigeRij.children[0].children[0].innerHTML;
        kost.factuurDatum = huidigeRij.children[1].children[0].value;
        kost.soort = huidigeRij.children[2].children[0].value;
        kost.bedrag = huidigeRij.children[3].children[0].value;
        // console.log("KIJK HIER");
        // console.log(huidigeRij.children[0].children[0].innerHTML);
        // console.log("kost.id")
        // console.log(kost.id)
        // console.log("kost.status")
        // console.log(kost.status)
        // console.log("kost.factuurDatum")
        // console.log(kost.factuurDatum)
        // console.log("kost.soort")
        // console.log(kost.soort)
        // console.log("kost.bedrag")
        // console.log(kost.bedrag)

        trainee.kosten.push(kost);
        // console.log("trainee.kosten:");
        // console.log(trainee.kosten);
    }
    PutTrainee(trainee);
}

//VERZENDEN
function KostenVerzenden(){
    console.log("in KostenVerzenden()");
    var kostenlijst = new Array();
	var table = document.getElementById("kostenTabel");
	var tablebody = table.children[2];
	var aantal = tablebody.children.length;

   for(var i = 0; i<aantal; i++){
 	var kosten = {}
   	var tablerow = tablebody.children[i];
   	kosten.id = tablerow.id;
    var c = tablerow.children;

    var ch2 = c[3];
    var chi2 = ch2.children[0];

// Als het bedrag <=0 is dan slaat het deze rij over en slaat hem niet op.
    if(chi2.value <= 0){
        console.log("continue");
        continue;
    }

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

    kosten.soort = chiVal;
	kosten.bedrag = chi2.value*100; 
	var d = new Date(chi0.value);
    kosten.factuurDatum = d;
    kosten.status = "Opgeslagen";
    console.log("kosten:");
    console.log(kosten);

    kostenlijst.push(kosten);

    console.log("kostenlijst:");
    console.log(kostenlijst);


        //POST alleen als het id van kosten 0 is, ofwel, alleen als de uren nieuw zijn toegevoegd. alle id's die hoger zijn dan 0 staan al in de database.
	 	if(tablerow.id == 0){
          continue;	
        }
        //PUT alleen als het id van kosten geen 0 is (ofwel, hij staat al in de database "opgeslagen") en als de waarde daadwerkelijk anders is geworden.
		if(tablerow.id !=0){
            kosten.status = "Verzonden";
            console.log("Nu zou PUTwijzigkosten(kosten) aangeroepen worden");
		 	// PUTwijzigkosten(kosten);
        }
    }
    // Jordi
    // trainee.kosten = kostenlijst;
    // Put de kosten opnieuw naar de trainee, nu als verzonden kosten
    PutTrainee(trainee);
   // window.location.reload();
}

//PUT uren
function PutTrainee(trainee){
    console.log("in PutTrainee");
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4)
          if(this.status == 200) {
                  console.log("PutTrainee, this.responseText:"); 
                  console.log(this.responseText); 
          trainee = JSON.parse(this.responseText);
        //   document.location.reload(true); tijdelijk geuitcomment
          }
          else{
              alert("HELP! status:" + this.status);
          }
    };
    xhttp.open("PUT", apiUserId, true);
      xhttp.setRequestHeader("Content-type", "application/json");
      xhttp.send(JSON.stringify(trainee));
  }

// //PUT kosten bij opslaan
// Jordi: vanaf nu PUTten we alleen nog trainees, geen losse kosten
// function PUTwijzigkosten(kosten) {
//     console.log("in PUTwijzigkosten()");
//     var xhttp = new XMLHttpRequest();
 
//     xhttp.onreadystatechange = function () {
//         if (this.readyState == 4) {
//             if (this.status == 200) {
//                 // window.location.reload(); test uitgecomment
//             } else {
//                 alert(this.statusText)
//             }
//         }
//     };
//     xhttp.open("PUT", apikosten+kosten.id, true);
//     xhttp.setRequestHeader("Content-type", "application/json");
//     xhttp.send(JSON.stringify(kosten));  
//  }

//POST kosten bij opslaan
// roept maakverzondenkostentabel() aan
// Jordi: we posten geen kosten meer

// function PostDataKosten(data, rij){
//   var xhttp = new XMLHttpRequest();
//   xhttp.onreadystatechange = function() {
//     if (this.readyState == 4 && this.status == 200) {
//     	//console.log("POST" + this.responseText + this.status);
//     	var kosten = JSON.parse(this.responseText);
//     	rij.id = kosten.id;
//         //console.log(rij.id);
//         maakverzondenkostentabel();
//         // window.location.reload(); test uitgecomment
//         }
//     }
//     xhttp.open("POST", apikosten, true);
//     xhttp.setRequestHeader("Content-type", "application/json");
// 	xhttp.send(data);
// }
// JORDI: bug oplossen STOP #################################################################################################################

// TIM - het maken van de tabel
function maakverzondenkostentabel(){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
          document.getElementById("kostenlijst").innerHTML = "";
          var kosten = JSON.parse(this.responseText);

          var table = document.createElement("table");
          addHtmlElement(table,kostentabelheader());

          var tbody = addHtmlElement(table, document.createElement("tbody"));
          addHtmlElement(tbody, totaalbedrag(kosten));
            

          for(var i = 0; i< kosten.length; i++) {
              //console.log(kosten[i].status + "KOSTENSTATUS");
              if(kosten[i].status == "Verzonden"){
              addHtmlElement(tbody, autoTableRow(kosten[i]));
            }
          }
          document.getElementById("kostenlijst").appendChild(table);
      }
  }
      xhttp.open("GET", apikosten, true);
      xhttp.setRequestHeader("Content-type", "application/json");
      xhttp.send();
}

//TIM - het maken van de tabel header
function kostentabelheader(){
  var tableHeader = document.createElement("thead");
 var tr = addHtmlElement(tableHeader, document.createElement("tr"));
 //addHtmlElementContent(tr, document.createElement("th"), "Id");
 addHtmlElementContent(tr, document.createElement("th"), "Datum");
 addHtmlElementContent(tr, document.createElement("th"), "Kosten Soort");
 addHtmlElementContent(tr, document.createElement("th"), "Aantal KM");
 addHtmlElementContent(tr, document.createElement("th"), "Bedrag €");
 addHtmlElementContent(tr, document.createElement("th"), "Bijlage");

 return tableHeader;
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

//TIM - het maken van de tabel body
function autoTableRow(kosten) {
  var tr = document.createElement("tr");
  //addHtmlElementContent(tr, document.createElement("td"), kosten.id);
    var datum = kosten.factuurDatum.substring(0,10);
  addHtmlElementContent(tr, document.createElement("td"), datum);
  addHtmlElementContent(tr, document.createElement("td"), kosten.soort);
    if(kosten.aantalKM == 0){
        var leeg = "";
        addHtmlElementContent(tr, document.createElement("td"), leeg);
    }else{
        addHtmlElementContent(tr, document.createElement("td"), kosten.aantalKM);
    }
    
    addHtmlElementContent(tr, document.createElement("td"), (kosten.bedrag/100));
    addHtmlElementContent(tr, document.createElement("td"), "");


  return tr;
}

function addHtmlElementContent(parent, child, tekst) {
  parent.appendChild(child);
  child.innerHTML = tekst;
  return child;
}

//TIM - het maken van de totaalbedrag en toevoegen aan de tabel body
function totaalbedrag(kosten) {
   var bedrag = 0;
   var aantalkm = 0;
   for(i=0; i<kosten.length; i++){
       if(kosten[i].status == "Opgeslagen"){
           bedrag += 0;
           aantalkm += 0;
       }else{
       bedrag += kosten[i].bedrag;
       aantalkm += kosten[i].aantalKM;
       }
   }
  
   var tr = document.createElement("tr");
  // addHtmlElementContent(tr, document.createElement("td"), "");
    addHtmlElementContent(tr, document.createElement("td"), "");
    addHtmlElementContent(tr, document.createElement("td"), "Totaal");
    addHtmlElementContent(tr, document.createElement("td"), aantalkm);
    addHtmlElementContent(tr, document.createElement("td"), bedrag/100);
    addHtmlElementContent(tr, document.createElement("td"), "");
   return tr;
}

// Jordi: uitgecomment //GET kosten
// function getKosten(){
//     var xhttp = new XMLHttpRequest();
//     xhttp.onreadystatechange = function() {
//         if (this.readyState == 4 && this.status == 200) {
//             //console.log(this.responseText);
//             var kosten = JSON.parse(this.responseText);	

//             //console.log(kosten + "kosten in getkosten");

//             for(var i = 0; i<kosten.length; i++){
//             GETRowKostenTabel(kosten[i]);
//             }
//             return kosten;
//         }
//     }
//     xhttp.open("GET", apikosten, true);
//     xhttp.setRequestHeader("Content-type", "application/json");
//     xhttp.send();	
// };

// oud
// //GET functie met opbouwen rijen kostentabel
function GETRowKostenTabel(kosten){
    //console.log(kosten.status + "KOSTEN>STATUS");
    if(kosten.status != "Verzonden"){
        if(kosten.waarde != "Auto"){

	var table = document.getElementById("kostenTabel");
	var insertedRow = table.insertRow(3);
    insertedRow.id = kosten.id;
    
    //status
	var insertedCell2 = insertedRow.insertCell(0);
	var emp3 = document.createElement("td");
    emp3.innerHTML = kosten.status;
    //console.log(emp3 + "emp3");
	insertedCell2.appendChild(emp3);

	//datum
	var insertedCell = insertedRow.insertCell(1);
	var elm = document.createElement("input");
	elm.type = "date";
	//console.log(kosten.factuurDatum);
	elm.value = kosten.factuurDatum.substring(0,10);
	elm.setAttribute("max", maxDate);
	//console.log(elm);
    insertedCell.appendChild(elm);
    
	//soort kosten
	var insertedCell1 = insertedRow.insertCell(2);
	var elm1 = document.createElement("select");
	elm1.id = kosten.id;
	var arr = ["Openbaar Vervoer", "Overige Kosten"];
	for(var i = 0; i<arr.length; i++){
		var option = document.createElement("OPTION"),
		txt = document.createTextNode(arr[i]);
		option.appendChild(txt);
		option.value = arr[i];
		elm1.insertBefore(option,elm1.lastChild);
		    if(arr[i] === kosten.waarde){
			    elm1.value = kosten.waarde;
		    }
	}
	//console.log(elm1.value);
    insertedCell1.appendChild(elm1);
    
	//bedrag
	var insertedCell2 = insertedRow.insertCell(3);
	var emp3 = document.createElement("input");
	emp3.type = "number";
	emp3.value = kosten.bedrag/100;
	insertedCell2.appendChild(emp3);
    //console.log(insertedCell1);
    }
} // what the fuck is deze indenting >:@
}

// Loes der ding
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
      if(arr[i] === kosten.soort){
        SoortKosten.value = kosten.soort;
      }
    insertedCell1.appendChild(SoortKosten);
    }
    
    //bedrag kosten
    var insertedCell2 = insertedRow.insertCell(3);
      var Bedrag = document.createElement("input");
      Bedrag.type = "number";
      Bedrag.value = kosten.bedrag;
      insertedCell2.appendChild(Bedrag);
      var VerwijderKnop = document.createElement("span");
      VerwijderKnop.className = "fas fa-trash-alt";
      VerwijderKnop.addEventListener("click", function(){
      var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
          if (this.readyState == 4 && this.status == 200) {
            insertedRow.parentNode.removeChild(insertedRow);
          }
      };
        xhttp.open("DELETE", apikosten+kosten.id, true);
        xhttp.send();});
    insertedCell2.appendChild(VerwijderKnop);
    //aantalKM
    var insertedCell3 = insertedRow.insertCell(4);
    var aantalkm = document.createElement("input");
    aantalkm.value = kosten.aantalKM;
    insertedCell3.appendChild(aantalkm);
  
    }
  
  // oud bla bla
//   //functie om rijen toe te voegen aan de tabel
//   function addRowKostenTabel(){
      
//       table = document.getElementById("kostenTabel");
  
//       var insertedRow = table.insertRow(1);
//       insertedRow.id = "0";
              
//   //voor de eerste cel (cel 0(i=0)): voeg het status inputveld toe
//           var insertedCell0 = insertedRow.insertCell(0);
//           var temp1 = document.createElement("td");
//           temp1.innerHTML = "Open";
//           insertedCell0.appendChild(temp1);
  
//   //voor de eerste cel (cel 0(i=0)): voeg het datum inputveld toe
//           var insertedCell1 = insertedRow.insertCell(1);
//                   dateID++;
//                   var temp2 = document.createElement("input");
//                   temp2.type = "date";
//                   temp2.id = "datum"+dateID; 
//                   temp2.setAttribute("max", today);
//                   temp2.value = today;
//                   insertedCell1.appendChild(temp2);
//   //voor de eerste cel (cel 1(i=1)): voeg het dropdownmenu toe
//               var insertedCell2 = insertedRow.insertCell(2);
//                   selectID++;
//                   var temp3 = document.createElement("select");
//                   temp3.id = "select"+selectID;
//                   var temp4 = document.createElement("OPTION");
//                   temp4.innerHTML = "Openbaar Vervoer"
//                   temp3.appendChild(temp4);
//                   insertedCell2.appendChild(temp3);
//           insertedCell2.addEventListener("change", function(){
//             console.log(temp3[temp3.selectedIndex]);
//             var choice = temp3[temp3.selectedIndex];
//             console.log(choice.innerHTML == "Auto");
//             if(choice.innerHTML == "Auto"){
            
//               temp5.value = 0.19;
//               temp5.setAttribute("disabled", "disabled");
//               temp6.removeAttribute("disabled");
//             }
//           })
//   //voor de eerste cel (cel 2 (i=2)): voeg het bedrag inputveld toe
//               var insertedCell3 = insertedRow.insertCell(3);
//                   aantalID++;
//                   var temp5 = document.createElement("input");
//                   temp5.type = "number";
//                   temp5.value = 0;
//                   temp5.id = "aantal"+aantalID; 
                  
//                   insertedCell3.appendChild(temp5);
//               var insertedCell4 = insertedRow.insertCell(4);
//         var temp6 = document.createElement("input");
//               temp6.type = "number";
//               temp6.value = 0;
//               temp6.setAttribute("disabled", "disabled");
//               insertedCell4.appendChild(temp6);
//       traineeKostenDropDownMenu(selectID);
//   }
  

// function addRowAutoKostenTabel(){
	
// 	table = document.getElementById("AutoKostenTabel");
//     var insertedRow = table.insertRow(2);
// 	insertedRow.id = "0";
// // insertedRow.className = "kostenRow";
// 	for(var i = 0; i<5; i++){
// 		var insertedCell = insertedRow.insertCell(i);
//         insertedCell.id = IDCell++;
        
// //voor de eerste cel (cel 0(i=0)): voeg het status inputveld toe
//             if (i == 0) {
//                 var temp1 = document.createElement("td");
//                 temp1.innerHTML = "Open";
//                 insertedCell.appendChild(temp1);
//             }
// //voor de eerste cel (cel 0(i=0)): voeg het datum inputveld toe
// 			if (i == 1) {
// 				dateID++;
// 				var temp1 = document.createElement("input");
// 				temp1.type = "date";
// 				temp1.id = "datum"+dateID; 
// 				temp1.setAttribute("max", maxDate);
// 				temp1.value = today;
// 				//console.log(temp1.value)
// 				// temp1.required = "required";
// 				insertedCell.appendChild(temp1);
// 			}
// //voor de eerste cel (cel 1(i=1)): voeg het kostensoort toe
// 			if (i == 2) {
// 				var temp1 = document.createElement("td");
//                 temp1.innerHTML = "Auto";
//                 insertedCell.appendChild(temp1);
// 			}
// //voor de eerste cel (cel 2 (i=2)): voeg het aantalKM inputveld toe
// 			if (i == 3) {
// 				aantalID++;
// 				var temp1 = document.createElement("input");
// 				temp1.type = "number";
// 				temp1.value = 0;
// 				temp1.id = "aantal"+aantalID; 
				
// 				insertedCell.appendChild(temp1);
//             }
// //voor de eerste cel (cel 1(i=1)): voeg het bedrag veld toe
// 			if (i == 4) {
// 				var temp1 = document.createElement("td");
//                 temp1.innerHTML = "";
//                 insertedCell.appendChild(temp1);
// 			}
// 	}
// }

// //POST kosten opslaan functie
// function AutoKostenOpslaan(){
//     var kostenlijst = new Array();
//     //console.log(kostenlijst);
// 	var table = document.getElementById("AutoKostenTabel");
//     //console.log(table + "table");
    
// 	// var aantal = table.children[2];
// 	var tablebody = table.children[2];
//     //console.log(tablebody + "tablebody");
    
// 	var aantal = tablebody.children.length;
//     //console.log("Start loop" + aantal);

//    for(var i = 0; i<aantal; i++){
//  	var kosten = {}
//    	var tablerow = tablebody.children[i];
//    	kosten.id = tablerow.id;
//     var c = tablerow.children;

//     var ch2 = c[3];
//     var chi2 = ch2.children[0];
//     console.log(c[3] + "ch2");
//     console.log(chi2.value + "chi2 value");
// // Als het aantal KM <=0 is dan slaat het deze rij over en slaat hem niet op.
//         if(chi2.value <= 0){
//             console.log("continue");
//             continue;
//         }

//     // ------- datumveld -------//
// 	var ch0 = c[1];
//     //console.log(ch0 + " ch0");
// 	var chi0 = ch0.children[0];
// 	//console.log(chi0 + "chi0");
//     //console.log(chi0.value + "chi0.value");

// 	// // ------- soort kosten veld -------//
// 	// var ch = c[2];
//     // //console.log(ch + " ch");
// 	// var chi = ch.children[0];
//     // var chiVal = chi.value;
//     // //console.log(chiVal + " chiVal");

// 	// ------- Aantal KM -------//
//     var ch2 = c[3];
//     //console.log(ch2 + "ch2");
// 	var chi2 = ch2.children[0];
// 	//console.log(chi2.value + " chi2.value");

//     kosten.waarde = "Auto";
// 	kosten.aantalKM = chi2.value; 
// 	var d = new Date(chi0.value);
//     kosten.factuurDatum = d;
//     kosten.status = "Opgeslagen";
//     kosten.bedrag = (kosten.aantalKM*bedragPerKm);
//     //console.log(kosten);

//       kostenlijst.push(kosten);
//       //console.log(kostenlijst);
//     // Jordi
//     trainee.kosten = kostenlijst;
//     PutTrainee(trainee);

// //POST alleen als het id van uren 0 is, ofwel, alleen als de uren nieuw zijn toegevoegd. alle id's die hoger zijn dan 0 staan al in de database.
// 	 	if(tablerow.id == 0){
//             //console.log(tablerow.id + "tablerow.id");
//             var test = JSON.stringify(kosten),tablerow;
//             //console.log(test + " JSON Test");
// 			PostDataKosten(JSON.stringify(kosten),tablerow);	
//         }
// //PUT alleen als het id van uren geen 0 is (ofwel, hij staat al in de database) en als de waarde daadwerkelijk anders is geworden.
// 		if(tablerow.id !=0){
//             if(chi0.value != kosten.factuurDatum){
//                 console.log("niet gelijk datum");
//                 wijzigkosten(kosten);
//             }
//             //Dit is voor soort kosten maar het kan alleen Auto zijn in deze kolom

//             // if(chiVal != kosten.waarde){
//             //     console.log("niet gelijk uurwaarde");
//             //     wijzigkosten(kosten);
//             // }
//             if(chi2.value != kosten.aantalKM){
//                 console.log("niet gelijk aantal");
//                 wijzigkosten(kosten);
//             }
//         }
//     }
//    // window.location.reload();
// }

// //GET autokosten
// function getAutoKosten(){
//     var xhttp = new XMLHttpRequest();
//     xhttp.onreadystatechange = function() {
//         if (this.readyState == 4 && this.status == 200) {
//             //console.log(this.responseText);
//             var kosten = JSON.parse(this.responseText);	

//             //console.log(kosten + "kosten in getkosten");

//             for(var i = 0; i<kosten.length; i++){
//             GETRowAutoKostenTabel(kosten[i]);
//             }
//             return kosten;
//         }
//     }
//     xhttp.open("GET", apikosten, true);
//     xhttp.setRequestHeader("Content-type", "application/json");
//     xhttp.send();	
// };

// //GET functie met opbouwen rijen autokostentabel
// function GETRowAutoKostenTabel(kosten){
//     //console.log(kosten.status + "KOSTEN>STATUS");
//     if(kosten.status != "Verzonden"){
//         if(kosten.waarde == "Auto"){

// 	var table = document.getElementById("AutoKostenTabel");
// 	var insertedRow = table.insertRow(3);
//     insertedRow.id = kosten.id;
    
//     //status
// 	var insertedCell2 = insertedRow.insertCell(0);
// 	var emp3 = document.createElement("td");
//     emp3.innerHTML = kosten.status;
//     //console.log(emp3 + "emp3");
// 	insertedCell2.appendChild(emp3);

// 	//datum
// 	var insertedCell = insertedRow.insertCell(1);
// 	var elm = document.createElement("input");
// 	elm.type = "date";
// 	//console.log(kosten.factuurDatum);
// 	elm.value = kosten.factuurDatum.substring(0,10);
// 	elm.setAttribute("max", maxDate);
// 	//console.log(elm);
//     insertedCell.appendChild(elm);
    
// 	//soort kosten
// 	var insertedCell2 = insertedRow.insertCell(2);
// 	var emp4 = document.createElement("td");
//     emp4.innerHTML = kosten.waarde;
//     //console.log(emp3 + "emp3");
// 	insertedCell2.appendChild(emp4);
    
// 	//Aantal KM
// 	var insertedCell2 = insertedRow.insertCell(3);
// 	var emp5 = document.createElement("input");
// 	emp5.type = "number";
// 	emp5.value = kosten.aantalKM;
// 	insertedCell2.appendChild(emp5);
//     //console.log(insertedCell1);

//     //Bedrag
// 	var insertedCell2 = insertedRow.insertCell(4);
// 	var emp9 = document.createElement("td");
//     emp9.innerHTML = kosten.bedrag/100;
//     //console.log(emp3 + "emp3");
// 	insertedCell2.appendChild(emp9);
//         }
//     }
// }

// //POST Autokosten verzenden functie
// function AutoKostenVerzenden(){
//     var kostenlijst = new Array();
//     //console.log(kostenlijst);
// 	var table = document.getElementById("AutoKostenTabel");
//     //console.log(table + "table");
    
// 	// var aantal = table.children[2];
// 	var tablebody = table.children[2];
//     //console.log(tablebody + "tablebody");
    
// 	var aantal = tablebody.children.length;
//     //console.log("Start loop" + aantal);

//    for(var i = 0; i<aantal; i++){
//  	var kosten = {}
//    	var tablerow = tablebody.children[i];
//    	kosten.id = tablerow.id;
//     var c = tablerow.children;

//     var ch2 = c[3];
//     var chi2 = ch2.children[0];
//     console.log(c[3] + "ch2");
//     console.log(chi2.value + "chi2 value");
// // Als het aantal KM <=0 is dan slaat het deze rij over en slaat hem niet op.
//         if(chi2.value <= 0){
//             console.log("continue");
//             continue;
//         }

//     // ------- datumveld -------//
// 	var ch0 = c[1];
//     //console.log(ch0 + " ch0");
// 	var chi0 = ch0.children[0];
// 	//console.log(chi0 + "chi0");
//     //console.log(chi0.value + "chi0.value");

//     //Heb je niet nodig in deze tabel, de soort is alijd Auto
// 	// // ------- soort kosten veld -------//
// 	// var ch = c[2];
//     // //console.log(ch + " ch");
// 	// var chi = ch.children[0];
//     // var chiVal = chi.value;
//     // //console.log(chiVal + " chiVal");

// 	// ------- Aantal KM -------//
//     var ch2 = c[3];
//     //console.log(ch2 + "ch2");
// 	var chi2 = ch2.children[0];
// 	//console.log(chi2.value + " chi2.value");

//     kosten.waarde = "Auto";
// 	kosten.aantalKM = chi2.value; 
// 	var d = new Date(chi0.value);
//     kosten.factuurDatum = d;
//     kosten.status = "Opgeslagen";
//     kosten.bedrag = (kosten.aantalKM*bedragPerKm);
//     //console.log(kosten);

//     kostenlijst.push(kosten);
//     //console.log(kostenlijst);
//     // Jordi
//     trainee.kosten = kostenlijst;
//     PutTrainee(trainee);

// //POST alleen als het id van kosten 0 is, ofwel, alleen als de uren nieuw zijn toegevoegd. alle id's die hoger zijn dan 0 staan al in de database.
// 	 	if(tablerow.id == 0){
//             continue;	
//           }
// //PUT alleen als het id van kosten geen 0 is (ofwel, hij staat al in de database "opgeslagen") en als de waarde daadwerkelijk anders is geworden.
//           if(tablerow.id !=0){
//               kosten.status = "Verzonden";
//                wijzigkosten(kosten);
//           }

//     }
//    // window.location.reload();
// }
