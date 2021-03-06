var apiUserId = "http://localhost:8082/api/trainee/"; //+sessionStorage.getItem("storedUserID");

//trainee variabele 
var trainee;

//Bepalen huidige datum zodat er nooit een leeg datumveld wordt opgestuurd
var today = new Date();
var dd = today.getDate();
var mm = today.getMonth()+1; //As January is 0.
var yyyy = today.getFullYear();
if(dd<10) dd='0'+dd;
if(mm<10) mm='0'+mm;
today = yyyy+'-'+mm+'-'+dd ;

// EMIEL - de geselecteerde maand
var theMonth = setCurrentMonth();

// Tim - de geselecteerde jaar
var theYear = yyyy;
//console.log(theYear + " theYear");

// EMIEL - de maand van het uur in database
var uurInDBHemZeMonth;

// Tim - de jaar 
var uurInDBHemZeYear;

// Tim - heeft kosten variable
var heeftkosten = 0;

// Tim - Totaal - Declaraties variables aanmaken
var OverigeKosten;
var OpenbaarVervoer;
var AutoKM;
var AutoEuro;
var Totaal;

// Tim - Per Trainee - variables aanmaken
var PerTraineeVoornaam = "";
var PerTraineeAchternaam = "";
var PerTraineeSoort = "";
var PerTraineeAutoKM = "";
var PerTraineeBedrag;
var perTraineeStatus="";
var AutoKMBedrag;
var PerTraineeOpmerking = "";

function setCurrentMonth(){
    //console.log(today.substring(5,7));
    var month = document.getElementById("selectedMonth");
    month.value = today.substring(5,7);
}

// Tim - De maand selecteren
function selectMonth(){
	var tableBody = document.getElementById("selectedMonth");
		theMonth = tableBody[tableBody.selectedIndex].value;
		//console.log("theMonth: "    + theMonth);
        GETKostenPerMaand(theMonth);
        GETKostenPerTrainee(theMonth);
}
//Tim - De jaar selecteren
function selectYear(){
    var tablebodyYear = document.getElementById("selectedYear");
    theYear = tablebodyYear[tablebodyYear.selectedIndex].value;
    //console.log(theYear + "SELECT YEAR");
    GETKostenPerMaand(theMonth);
    GETKostenPerTrainee(theMonth);
}
// Tim - GET alle kosten per trainee
function GETKostenPerTrainee(){
    //console.log("kosten per trainee GET")
    var table = document. getElementById("perTraineeTabel");
        // Tim - empty tables on month selection
        for(var i = table.rows.length - 1; i > 0; i--){
            table. deleteRow(i);
        }
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(){
        if (this.readyState == 4 && this.status == 200){
            //console.log("GET WORKS");
            trainee = JSON.parse(this.responseText);
            //trainee.kosten.sort(function(a,b){return a.factuurDatum<b.factuurDatum?-1:1});
            var tbody = addHtmlElement(table, document.createElement("tbody"));

            // Tim - Per Trainee loop
            for(var i = 0; i < trainee.length; i++){
                console.log(trainee[i].voornaam + " Trainee per loop");
                // Tim - Per kosten loop
                for(var k = 0; k < trainee[i].kosten.length; k++){
                    //console.log("Per kosten");
                    emptyPerTraineeVariables();
                    uurInDBHemZeMonth = trainee[i].kosten[k].factuurDatum.substring(5,7);
                    uurInDBHemZeYear = trainee[i].kosten[k].factuurDatum.substring(0,4);
                    //console.log(trainee[i].kosten[k].factuurDatum + " factuurDatum");
                    //console.log(uurInDBHemZeYear + " uurInDBHemZeYear");
                    //console.log(theYear + " the year");
                    // Tim - vergelijk de maand, jaar en status
                    if(uurInDBHemZeMonth == theMonth && uurInDBHemZeYear == theYear){
                        heeftkosten += 1;
                        //console.log( heeftkosten + " HEEFT KOSTEN")
                        PerTraineeVoornaam = trainee[i].voornaam;
                        PerTraineeAchternaam = trainee[i].achternaam;
                        PerTraineeSoort = trainee[i].kosten[k].soort;
                        perTraineeStatus = trainee[i].kosten[k].status;
                        PerTraineeOpmerking = trainee[i].kosten[k].opmerking;
                        switchPerTraineeKosten(trainee[i].kosten[k],trainee[i].kosten[k].soort);
                        addHtmlElement(tbody, PerTraineeKostenRow(trainee[i], trainee[i].kosten[k]));
                    } 
                }
                // Tim - als een trainee geen kosten heeft in de bepaalde maand is de "heeftkosten" counter 0
                if(heeftkosten == 0){
                    PerTraineeVoornaam = trainee[i].voornaam;
                    PerTraineeAchternaam = trainee[i].achternaam;
                    addHtmlElement(tbody, PerTraineeGeenKostenRow(trainee));
                }
                // Tim - reset kosten counter
                heeftkosten = 0;
            }
        }
        sortTable(1);
    }
    xhttp.open("GET", apiUserId, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send();	
}
// Tim - GET trainee en alle kosten van
function GETKostenPerMaand(theMonth){
    //console.log("GETKOSTEN");
    var pertraineetable = document. getElementById("declaratieTabel");
        // Tim - empty table on month selection
        for(var i = pertraineetable.rows.length - 1; i > 0; i--){
            pertraineetable.deleteRow(i);
        }
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(){
        if (this.readyState == 4 && this.status == 200){
            trainee = JSON.parse(this.responseText);
            //trainee.kosten.sort(function(a,b){return a.factuurDatum<b.factuurDatum?-1:1});
            var declaratietbody = addHtmlElement(pertraineetable, document.createElement("tbody"));
            // Tim - empty variables before the loops begin
            emptyTotaalKosten();
            // Tim - per trainee loop
            for(var i = 0; i < trainee.length; i++){
                //console.log(trainee[i].voornaam + " Per Trainee in Kosten loop");
                // Tim - per kosten loop
                for(var k = 0; k < trainee[i].kosten.length; k++){
                    //console.log("Per kosten in kosten loop");
                    uurInDBHemZeMonth = trainee[i].kosten[k].factuurDatum.substring(5,7);
                    uurInDBHemZeYear = trainee[i].kosten[k].factuurDatum.substring(0,4);
                    // Tim - check if it is the right month and yea
                    if(uurInDBHemZeMonth == theMonth && uurInDBHemZeYear == theYear){
                        //console.log("month in kosten loop");
                        switchTotaalKosten(trainee[i].kosten[k],trainee[i].kosten[k].soort);
                    }
                }
            }
            //Tim - Opbouwen van de body van de tabel
            addHtmlElement(declaratietbody, TotaalKostenRow(trainee));
        }
    }
    xhttp.open("GET", apiUserId, true);
	xhttp.setRequestHeader("Content-type", "application/json");
	xhttp.send();
}
// Tim - Per Trainee - Afhankelijk van het status 
function switchPerTraineeKosten(traineelijst,typeKosten){
    //console.log("The Switch");
        switch(typeKosten){
            case "Overige Kosten":
                PerTraineeBedrag = traineelijst.bedrag/100;
                //console.log(typeKosten);
                //console.log(PerTraineeBedrag);
                break
            case "Openbaar Vervoer":
                PerTraineeBedrag = traineelijst.bedrag/100;
                //console.log(PerTraineeBedrag);
                break
            case "Auto":
                PerTraineeAutoKM = traineelijst.aantalKM;
                AutoKMBedrag = traineelijst.aantalKM*traineelijst.bedrag;
                PerTraineeBedrag = AutoKMBedrag/100;
                //console.log(PerTraineeBedrag);
                break
        }
}
// Tim - Totaal kosten - Afhankelijk van het status 
function switchTotaalKosten(traineelijst,typeKosten){
    
        switch(typeKosten){
            case "Overige Kosten":
                OverigeKosten += traineelijst.bedrag;
                Totaal += traineelijst.bedrag;
                break
            case "Openbaar Vervoer":
                OpenbaarVervoer += traineelijst.bedrag;
                Totaal += traineelijst.bedrag;
                break
            case "Auto":
                AutoKM += traineelijst.aantalKM;
                break
        }
    
}
// Tim - Kosten Tabel Rij aanmaken
function TotaalKostenRow(traineelijst) {
    var tr = document.createElement("tr");
    addHtmlElementContent(tr, document.createElement("td"), OverigeKosten/100);
    addHtmlElementContent(tr, document.createElement("td"), OpenbaarVervoer/100);
    addHtmlElementContent(tr, document.createElement("td"), AutoKM);
    var autobedragtotaal;
    autobedragtotaal = AutoKM*19;
    var autobedrag = AutoKM*19/100;
    addHtmlElementContent(tr, document.createElement("td"), autobedrag);
    
    Totaal += autobedragtotaal;
    var Totaalweergeven = Totaal/100;
    addHtmlElementContent(tr, document.createElement("td"), Totaalweergeven);

    return tr;
}
// Tim - Per Trainee Tabel Rij aanmaken
function PerTraineeKostenRow(traineelijst, kosten) {
    var tr = document.createElement("tr");
    addHtmlElementContent(tr, document.createElement("td"), PerTraineeVoornaam);
    addHtmlElementContent(tr, document.createElement("td"), PerTraineeAchternaam);
    addHtmlElementContent(tr, document.createElement("td"), PerTraineeSoort);
    addHtmlElementContent(tr, document.createElement("td"), PerTraineeAutoKM);
    addHtmlElementContent(tr, document.createElement("td"), PerTraineeBedrag);
    console.log(kosten.status + " de kosten status voor de if");
    addHtmlElementContentPlusAwesome(tr, document.createElement("td"), perTraineeStatus);
    if(kosten.status == "Opgeslagen"){
        console.log(" kosten is opgeslagen if");
        var checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = "checkbox"+
        checkbox.addEventListener('change', (event) => {
            if (event.target.checked) {
                if(kosten.status = "Opgeslagen"){
                    kosten.status = "Uitbetaald";
                    //console.log(kosten.status + " kosten.status");
                    //console.log(traineelijst.id);
                    traineelijst.kosten.push(kosten);
                    PUTTrainee(traineelijst);
                }
            } else {
                //onsole.log(kosten.status + " kosten.status");
            }
        })
        addHtmlCheckbox(tr, document.createElement("td"), checkbox);
    }else if (kosten.status == "Uitbetaald"){
        console.log(" kosten is Uitbetaald if");
        addHtmlElementContent(tr, document.createElement("td"), "");
    }
    
    var Opmerkingveld = document.createElement("td");
    Opmerkingveld.width = "300";
    addHtmlElementContent(tr, Opmerkingveld, PerTraineeOpmerking);

    

    return tr;
}

function addHtmlElementContentPlusAwesome(parent, child, tekst) {
    parent.appendChild(child);
    child.innerHTML = tekst;
   // child.style.display="inline-block";
    
    return child;
}

function addHtmlCheckbox(parent, child, checkbox){
    parent.appendChild(child);
    child.appendChild(checkbox);
    return child;
}


// Tim - Per Trainee Tabel Rij aanmaken
function PerTraineeGeenKostenRow(traineelijst) {
    var tr = document.createElement("tr");
    addHtmlElementContent(tr, document.createElement("td"), PerTraineeVoornaam);
    addHtmlElementContent(tr, document.createElement("td"), PerTraineeAchternaam);
    addHtmlElementContent(tr, document.createElement("td"), "-");
    addHtmlElementContent(tr, document.createElement("td"), "-");
    addHtmlElementContent(tr, document.createElement("td"), "-");


    addHtmlElementContent(tr, document.createElement("td"), "-");
    addHtmlElementContent(tr, document.createElement("td"), "-");
    addHtmlElementContent(tr, document.createElement("td"), "-");
    return tr;
}
// EMIEL - elementen toevoegen in tabel
function addHtmlElement(parent, child) {
    parent.appendChild(child);
    return child;
}
// EMIEL - element invullen
function addHtmlElementContent(parent, child, tekst) {
    parent.appendChild(child);
    child.innerHTML = tekst;
    return child;
}
// Tim - empty totaal kosten variables
function emptyTotaalKosten(){
    //console.log("emptykostenvariables");
    OverigeKosten = 0;
    OpenbaarVervoer = 0;
    AutoKM = 0;
    AutoEuro = 0;
    Totaal = 0;
}
// Tim - empty - per trainee variables
function emptyPerTraineeVariables(){
    //console.log("emptykostenvariablesPERTRAINEE");
    PerTraineeVoornaam = "";
    PerTraineeAchternaam = "";
    PerTraineeSoort = "";
    PerTraineeAutoKM = "";
    PerTraineeBedrag = 0;
    AutoKMBedrag = 0;
    perTraineeStatus = "";
}

//PUT kosten
function PUTTrainee(trainee){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4)
        if(this.status == 200) { 
        trainee = JSON.parse(this.responseText);
        GETKostenPerTrainee();
          }
          else{
            alert("HELP!" + this.status);
          }
    };
    xhttp.open("PUT", apiUserId + trainee.id, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(trainee));
}


function export_table_to_csv(filename) {
  var csv = [];
  var table = document.getElementById("pertraineeUren");
  var rows = document.querySelectorAll(".pertraineeUren tr");
  
    for (var i = 0; i < rows.length; i++) {
    var row = [], cols = rows[i].querySelectorAll("td, th");
    
        for (var j = 0; j < cols.length; j++) 
            row.push(cols[j].innerText);
        
    csv.push(row.join(","));    
  }

    // Download CSV
    download_csv(csv.join("\n"), filename);
}

//Tabel sorteren door op de header van een kolom te klikken
function sortTable(n) {
    var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    table = document.getElementById("perTraineeTabel");
    switching = true;
    //Set the sorting direction to ascending:
    dir = "asc";
    /*Make a loop that will continue until
    no switching has been done:*/
    while (switching) {
      //start by saying: no switching is done:
      switching = false;
      rows = table.rows;
      /*Loop through all table rows (except the
      first, which contains table headers):*/
      for (i = 1; i < (rows.length - 1); i++) {
        //start by saying there should be no switching:
        shouldSwitch = false;
        /*Get the two elements you want to compare,
        one from current row and one from the next:*/
        x = rows[i].getElementsByTagName("TD")[n];
        y = rows[i + 1].getElementsByTagName("TD")[n];
        /*check if the two rows should switch place,
        based on the direction, asc or desc:*/
        if (dir == "asc") {
          if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
            //if so, mark as a switch and break the loop:
            shouldSwitch = true;
            break;
          }
        } else if (dir == "desc") {
          if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
            //if so, mark as a switch and break the loop:
            shouldSwitch = true;
            break;
          }
        }
      }
      if (shouldSwitch) {
        /*If a switch has been marked, make the switch
        and mark that a switch has been done:*/
        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
        switching = true;
        //Each time a switch is done, increase this count by 1:
        switchcount++;
      } else {
        /*If no switching has been done AND the direction is "asc",
        set the direction to "desc" and run the while loop again.*/
        if (switchcount == 0 && dir == "asc") {
          dir = "desc";
          switching = true;
        }
      }
    }
}



   //Downloaden CSV
    function download_csv(csv, filename) {
    var csvFile;
    var downloadLink;

    // CSV FILE
    csvFile = new Blob([csv], {type: "text/csv"});

    // Download link
    downloadLink = document.createElement("a");
    downloadLink.download = filename;
    downloadLink.href = window.URL.createObjectURL(csvFile);
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);

    
    downloadLink.click();
}

function export_table_to_csv(filename) {
  var csv = [];
  var table = document.getElementById("pertraineeKosten");
  var rows = document.querySelectorAll(".pertraineeKosten tr");
  
    for (var i = 0; i < rows.length; i++) {
    var row = [], cols = rows[i].querySelectorAll("td, th");
    
        for (var j = 0; j < cols.length; j++) 
            row.push(cols[j].innerText);
        
    csv.push(row.join(","));    
  }

    // Download CSV
    download_csv(csv.join("\n"), filename);
}

// document.querySelector("#exporting").addEventListener("click", function () {
// var html = document.querySelector(".pertraineeKosten").outerHTML;
// export_table_to_csv(html, "table.csv");
// });

