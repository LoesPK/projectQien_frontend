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
var theMonth = "";

// Tim - de geselecteerde jaar
var theYear = yyyy;
console.log(theYear + " theYear");

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
var AutoKMBedrag;



// Tim - De maand selecteren
function selectMonth(){
	var tableBody = document.getElementById("selectedMonth");
		theMonth = tableBody[tableBody.selectedIndex].value;
		//console.log("theMonth: " + theMonth);
        GETKostenPerMaand(theMonth);
        GETKostenPerTrainee(theMonth);
}
//Tim - De jaar selecteren
function selectYear(){
    var tablebodyYear = document.getElementById("selectedYear");
    theYear = tablebodyYear[tablebodyYear.selectedIndex].value;
    console.log(theYear + "SELECT YEAR");
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
                    console.log(trainee[i].kosten[k].factuurDatum + " factuurDatum");
                    console.log(uurInDBHemZeYear + " uurInDBHemZeYear");
                    console.log(theYear + " the year");
                    // Tim - vergelijk de maand, jaar en status
                    if(uurInDBHemZeMonth == theMonth && uurInDBHemZeYear == theYear){
                        heeftkosten += 1;
                        console.log( heeftkosten + " HEEFT KOSTEN")
                        PerTraineeVoornaam = trainee[i].voornaam;
                        PerTraineeAchternaam = trainee[i].achternaam;
                        PerTraineeSoort = trainee[i].kosten[k].soort;
                        switchPerTraineeKosten(trainee[i].kosten[k],trainee[i].kosten[k].soort);
                        addHtmlElement(tbody, PerTraineeKostenRow(trainee));
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
    if(traineelijst.status == "Opgeslagen"){
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
    //console.log(OverigeKosten + "Totaal Overige Kosten");
    //console.log(OpenbaarVervoer + "Totaal Openbaar Vervoer");
    //console.log(AutoKM + "Totaal Auto KM");
    //console.log(Totaal + "Totaal");
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
function PerTraineeKostenRow(traineelijst) {
    var tr = document.createElement("tr");
    addHtmlElementContent(tr, document.createElement("td"), PerTraineeVoornaam);
    addHtmlElementContent(tr, document.createElement("td"), PerTraineeAchternaam);
    addHtmlElementContent(tr, document.createElement("td"), PerTraineeSoort);
    addHtmlElementContent(tr, document.createElement("td"), PerTraineeAutoKM);
    addHtmlElementContent(tr, document.createElement("td"), PerTraineeBedrag);
    addHtmlElementContent(tr, document.createElement("td"), "");
    return tr;
}
// Tim - Per Trainee Tabel Rij aanmaken
function PerTraineeGeenKostenRow(traineelijst) {
    var tr = document.createElement("tr");
    addHtmlElementContent(tr, document.createElement("td"), PerTraineeVoornaam);
    addHtmlElementContent(tr, document.createElement("td"), PerTraineeAchternaam);
    addHtmlElementContent(tr, document.createElement("td"), "-");
    addHtmlElementContent(tr, document.createElement("td"), "-");
    addHtmlElementContent(tr, document.createElement("td"), "-");
    addHtmlElementContent(tr, document.createElement("td"), "");
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
}