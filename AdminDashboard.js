var apiUserId = "http://localhost:8082/api/trainee/"; //+sessionStorage.getItem("storedUserID");

//trainee variabele 
var trainee;

// EMIEL - de geselecteerde maand
var theMonth = "";

// EMIEL - de maand van het uur in database
var uurInDBHemZeMonth;

// Tim - Variabelen aanmaken om de totale uren in bij elkaar op te tellen
var AantalGewerkteUren = 0;
var AantalOver100Uren = 0;
var AantalOver125Uren = 0;
var AantalVerlofUren = 0;
var AantalZiekteUren = 0;
var AantalTotaalUren = 0;

// Tim - Variabelen aanmaken om de totale goedgekeurde uren in bij elkaar op te tellen
var GoedgekeurdGewerkteUren = 0; 
var GoedgekeurdOver100Uren = 0;
var GoedgekeurdOver125Uren = 0;
var GoedgekeurdVerlofUren = 0;
var GoedgekeurdZiekteUren = 0;
var GoedgekeurdTotaalUren = 0;

// Tim - Variabelen aanmaken om de totale afgekeurde uren in bij elkaar op te tellen
var AfgekeurdGewerkteUren = 0; 
var AfgekeurdOver100Uren = 0;
var AfgekeurdOver125Uren = 0;
var AfgekeurdVerlofUren = 0;
var AfgekeurdZiekteUren = 0;
var AfgekeurdTotaalUren = 0;

// Tim - Variabelen aanmaken om de totale teaccoderen uren in bij elkaar op te tellen
var teaccoderenGewerkteUren = 0; 
var teaccoderenOver100Uren = 0;
var teaccoderenOver125Uren = 0;
var teaccoderenVerlofUren = 0;
var teaccoderenZiekteUren = 0;
var teaccoderenTotaalUren = 0;

// Tim Declaraties variables aanmaken
var OverigeKosten;
var OpenbaarVervoer;
var AutoKM;
var AutoEuro;
var Totaal;

//Bepalen huidige datum zodat er nooit een leeg datumveld wordt opgestuurd
var today = new Date();
var dd = today.getDate();
var mm = today.getMonth()+1; //As January is 0.
var yyyy = today.getFullYear();
if(dd<10) dd='0'+dd;
if(mm<10) mm='0'+mm;
today = yyyy+'-'+mm+'-'+dd ;

// Tim - De maand selecteren
function selectMonth(){
	var tableBody = document.getElementById("selectedMonth");
		theMonth = tableBody[tableBody.selectedIndex].value;
		//console.log("theMonth: " + theMonth);
        GETUrenPerMaand(theMonth);
        GETKostenPerMaand(theMonth);
}
//Tim - GET trainee en alle kosten van
function GETKostenPerMaand(theMonth){
    //console.log("Getkosten");
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
                console.log(trainee[i].voornaam + " Per Trainee in Kosten loop");
                // Tim - per kosten loop
                for(var k = 0; k < trainee[i].kosten.length; k++){
                    //console.log("Per kosten in kosten loop");
                    uurInDBHemZeMonth = trainee[i].kosten[k].factuurDatum.substring(5,7);

                    // Tim - check if it is the right month
                    if(uurInDBHemZeMonth == theMonth){
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
// Tim - GET trainees en alle uren van
function GETUrenPerMaand(theMonth){
    var table = document. getElementById("urenTabel");
        // Tim - empty table on month selection
        for(var i = table.rows.length - 1; i > 0; i--){
            table. deleteRow(i);
        }
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
            trainee = JSON.parse(this.responseText);
            var tbody = addHtmlElement(table, document.createElement("tbody"));
            //trainee.uren.sort(function(a,b){return b.factuurDatum<a.factuurDatum?-1:1});
            // Tim - empty variables before the loops begin
            emptyTotaal();
            emptyGoedgekeurd();
            emptyAfgekeurd();
            emptyTeaccoderen();
            // Tim - Per Trainee loop
            for(var i = 0; i < trainee.length; i++){
                console.log(trainee[i].voornaam + " Per Trainee in Uren loop");
                // Tim - Per Uur loop
                for(var k = 0; k < trainee[i].uren.length; k++){
                    //console.log("PER UUR VAN DE TRAINEE");
                    //console.log(trainee[i].uren[k].accordStatus);
                    uurInDBHemZeMonth = trainee[i].uren[k].factuurDatum.substring(5,7);
                    //console.log(uurInDBHemZeMonth);
                    if(uurInDBHemZeMonth == theMonth) {
                        //console.log(trainee[i].voornaam + " IF ITS THE RIGHT MONTH");
                        switchTotaalUren(trainee[i].uren[k],trainee[i].uren[k].waarde);
                        switchTotaalGoegekeurdUren(trainee[i].uren[k],trainee[i].uren[k].waarde);
                        switchTotaalAfgekeurdeUren(trainee[i].uren[k],trainee[i].uren[k].waarde);
                        switchTotaalteaccoderenUren(trainee[i].uren[k],trainee[i].uren[k].waarde);
                    }
                }
            }
            //Tim - Opbouwen van de body van de tabel
            addHtmlElement(tbody, adminUrenTotaalTableRow(trainee));
            addHtmlElement(tbody, adminUrentGoedgekeurdTableRow(trainee));
            addHtmlElement(tbody, adminUrentAfgekeurdTableRow(trainee));
            addHtmlElement(tbody, adminUrenteaccoderenTableRow(trainee));
        }
    };
    xhttp.open("GET", apiUserId, true);
	xhttp.setRequestHeader("Content-type", "application/json");
	xhttp.send();	
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
// EMIEL - totaal - Afhankelijk van het type uren worden de uren van een "Uren" in database bij de totalen van de correcte variabelen toegevoegd
function switchTotaalUren(traineelijst,typeUur){
    switch(typeUur){
        case "Gewerkte Uren": 
        //console.log("Check in Gewerkte uren: "+ traineelijst.aantal)
            AantalGewerkteUren += traineelijst.aantal;
            AantalTotaalUren += traineelijst.aantal; 
            return AantalGewerkteUren;
        case "Overuren 100%": 
            AantalOver100Uren += traineelijst.aantal;
            AantalTotaalUren += traineelijst.aantal;
        break
        case "Overuren 125%": 
            AantalOver125Uren += traineelijst.aantal;
            AantalTotaalUren += traineelijst.aantal;
        break
        case "Verlof Uren": 
            AantalVerlofUren += traineelijst.aantal;
            AantalTotaalUren += traineelijst.aantal;
        break
        case "Ziekte Uren": 
            AantalZiekteUren += traineelijst.aantal;
            AantalTotaalUren += traineelijst.aantal;
        break
    }
}
// Tim - Goedgekeurd - Afhankelijk van het type uren worden de uren van een "Uren" in database bij de totalen van de correcte variabelen toegevoegd
function switchTotaalGoegekeurdUren(traineelijst,typeUur){
    if(traineelijst.accordStatus == "GOEDGEKEURD"){
        switch(typeUur){
            case "Gewerkte Uren": 
            //console.log("Check in Gewerkte uren: "+ traineelijst.aantal)
                GoedgekeurdGewerkteUren += traineelijst.aantal;
                GoedgekeurdTotaalUren += traineelijst.aantal; 
                return AantalGewerkteUren;
            case "Overuren 100%": 
                GoedgekeurdOver100Uren += traineelijst.aantal;
                GoedgekeurdTotaalUren += traineelijst.aantal;
            break
            case "Overuren 125%": 
                GoedgekeurdOver125Uren += traineelijst.aantal;
                GoedgekeurdTotaalUren += traineelijst.aantal;
            break
            case "Verlof Uren": 
                GoedgekeurdVerlofUren += traineelijst.aantal;
                GoedgekeurdTotaalUren += traineelijst.aantal;
            break
            case "Ziekte Uren": 
                GoedgekeurdZiekteUren += traineelijst.aantal;
                GoedgekeurdTotaalUren += traineelijst.aantal;
            break
        }
    }
}
// Tim - Goedgekeurd - Afhankelijk van het type uren worden de uren van een "Uren" in database bij de totalen van de correcte variabelen toegevoegd
function switchTotaalAfgekeurdeUren(traineelijst,typeUur){
    if(traineelijst.accordStatus == "AFGEKEURD"){
        switch(typeUur){
            case "Gewerkte Uren": 
            //console.log("Check in Gewerkte uren: "+ traineelijst.aantal)
                AfgekeurdGewerkteUren += traineelijst.aantal;
                AfgekeurdTotaalUren += traineelijst.aantal; 
                return AantalGewerkteUren;
            case "Overuren 100%": 
                AfgekeurdOver100Uren += traineelijst.aantal;
                AfgekeurdTotaalUren += traineelijst.aantal;
            break
            case "Overuren 125%": 
                AfgekeurdOver125Uren += traineelijst.aantal;
                AfgekeurdTotaalUren += traineelijst.aantal;
            break
            case "Verlof Uren": 
                AfgekeurdVerlofUren += traineelijst.aantal;
                AfgekeurdTotaalUren += traineelijst.aantal;
            break
            case "Ziekte Uren": 
                AfgekeurdZiekteUren += traineelijst.aantal;
                AfgekeurdTotaalUren += traineelijst.aantal;
            break
        }
    }
}
// Tim - Teaccoderen - Afhankelijk van het type uren worden de uren van een "Uren" in database bij de totalen van de correcte variabelen toegevoegd
function switchTotaalteaccoderenUren(traineelijst,typeUur){
    if(traineelijst.accordStatus == "TEACCODEREN"){
        switch(typeUur){
            case "Gewerkte Uren": 
            //console.log("Check in Gewerkte uren: "+ traineelijst.aantal)
                teaccoderenGewerkteUren += traineelijst.aantal;
                teaccoderenTotaalUren += traineelijst.aantal; 
                return AantalGewerkteUren;
            case "Overuren 100%": 
                teaccoderenOver100Uren += traineelijst.aantal;
                teaccoderenTotaalUren += traineelijst.aantal;
            break
            case "Overuren 125%": 
                teaccoderenOver125Uren += traineelijst.aantal;
                teaccoderenTotaalUren += traineelijst.aantal;
            break
            case "Verlof Uren": 
                teaccoderenVerlofUren += traineelijst.aantal;
                teaccoderenTotaalUren += traineelijst.aantal;
            break
            case "Ziekte Uren": 
                teaccoderenZiekteUren += traineelijst.aantal;
                teaccoderenTotaalUren += traineelijst.aantal;
            break
        }
    }
}
// Tim - Teaccoderen - Afhankelijk van het type uren worden de uren van een "Uren" in database bij de totalen van de correcte variabelen toegevoegd
function switchTotaalKosten(traineelijst,typeKosten){
    if(traineelijst.status == "Opgeslagen"){
        switch(typeKosten){
            case "Overige Kosten":
                OverigeKosten += traineelijst.bedrag;
                Totaal += traineelijst.bedrag;
            case "Openbaar Vervoer":
                OpenbaarVervoer += traineelijst.bedrag;
                Totaal += traineelijst.bedrag;
            case "Auto":
                AutoKM += traineelijst.aantalKM;
        }
    }
    //console.log(OverigeKosten + "Totaal Overige Kosten");
    //console.log(OpenbaarVervoer + "Totaal Openbaar Vervoer");
    //console.log(AutoKM + "Totaal Auto KM");
    //console.log(Totaal + "Totaal");
}
// EMIEL - Totaal Rij aanmaken
function adminUrenTotaalTableRow(traineelijst) {
    var tr = document.createElement("tr");
    addHtmlElementContent(tr, document.createElement("td"), "Totaal");
    addHtmlElementContent(tr, document.createElement("td"), AantalTotaalUren);
    //addHtmlElementContent(tr, document.createElement("td"), "Datum");
    addHtmlElementContent(tr, document.createElement("td"), AantalGewerkteUren);
    addHtmlElementContent(tr, document.createElement("td"), AantalOver100Uren);
    addHtmlElementContent(tr, document.createElement("td"), AantalOver125Uren);
    addHtmlElementContent(tr, document.createElement("td"), AantalVerlofUren);
    addHtmlElementContent(tr, document.createElement("td"), "");
    addHtmlElementContent(tr, document.createElement("td"), AantalZiekteUren);
    return tr;
}
// Tim - Goedgekeurd Rij aanmaken
function adminUrentGoedgekeurdTableRow(traineelijst) {
    var tr = document.createElement("tr");
    addHtmlElementContent(tr, document.createElement("td"), "Goedgekeurd");
    addHtmlElementContent(tr, document.createElement("td"), GoedgekeurdTotaalUren);
    //addHtmlElementContent(tr, document.createElement("td"), "Datum");
    addHtmlElementContent(tr, document.createElement("td"), GoedgekeurdGewerkteUren);
    addHtmlElementContent(tr, document.createElement("td"), GoedgekeurdOver100Uren);
    addHtmlElementContent(tr, document.createElement("td"), GoedgekeurdOver125Uren);
    addHtmlElementContent(tr, document.createElement("td"), GoedgekeurdVerlofUren);
    addHtmlElementContent(tr, document.createElement("td"), "");
    addHtmlElementContent(tr, document.createElement("td"), GoedgekeurdZiekteUren);
    return tr;
}
// Tim - Afgekeurd Rij aanmaken
function adminUrentAfgekeurdTableRow(traineelijst) {
    var tr = document.createElement("tr");
    addHtmlElementContent(tr, document.createElement("td"), "Afgekeurd");
    addHtmlElementContent(tr, document.createElement("td"), AfgekeurdTotaalUren);
    //addHtmlElementContent(tr, document.createElement("td"), "Datum");
    addHtmlElementContent(tr, document.createElement("td"), AfgekeurdGewerkteUren);
    addHtmlElementContent(tr, document.createElement("td"), AfgekeurdOver100Uren);
    addHtmlElementContent(tr, document.createElement("td"), AfgekeurdOver125Uren);
    addHtmlElementContent(tr, document.createElement("td"), AfgekeurdVerlofUren);
    addHtmlElementContent(tr, document.createElement("td"), "");
    addHtmlElementContent(tr, document.createElement("td"), AfgekeurdZiekteUren);
    return tr;
}
// Tim - Teaccoderen Rij aanmaken
function adminUrenteaccoderenTableRow(traineelijst) {
    var tr = document.createElement("tr");
    addHtmlElementContent(tr, document.createElement("td"), "Ingediend");
    addHtmlElementContent(tr, document.createElement("td"), teaccoderenTotaalUren);
    //addHtmlElementContent(tr, document.createElement("td"), "Datum");
    addHtmlElementContent(tr, document.createElement("td"), teaccoderenGewerkteUren);
    addHtmlElementContent(tr, document.createElement("td"), teaccoderenOver100Uren);
    addHtmlElementContent(tr, document.createElement("td"), teaccoderenOver125Uren);
    addHtmlElementContent(tr, document.createElement("td"), teaccoderenVerlofUren);
    addHtmlElementContent(tr, document.createElement("td"), "");
    addHtmlElementContent(tr, document.createElement("td"), teaccoderenZiekteUren);
    return tr;
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
// Tim - empty totaal variables before the loops start
function emptyTotaal(){
    AantalGewerkteUren = 0;
    AantalOver100Uren = 0;
    AantalOver125Uren = 0;
    AantalVerlofUren = 0;
    AantalZiekteUren = 0;
    AantalTotaalUren = 0;
}
// Tim - empty goedgekeurd variables before the loops start
function emptyGoedgekeurd(){
    GoedgekeurdGewerkteUren = 0; 
    GoedgekeurdOver100Uren = 0;
    GoedgekeurdOver125Uren = 0;
    GoedgekeurdVerlofUren = 0;
    GoedgekeurdZiekteUren = 0;
    GoedgekeurdTotaalUren = 0;
}
// Tim - empty teaccoderen variables before the loops start
function emptyTeaccoderen(){
    teaccoderenGewerkteUren = 0; 
    teaccoderenOver100Uren = 0;
    teaccoderenOver125Uren = 0;
    teaccoderenVerlofUren = 0;
    teaccoderenZiekteUren = 0;
    teaccoderenTotaalUren = 0;
}
// Tim - empty afgekeurd variables before the loops start
function emptyAfgekeurd(){
    AfgekeurdGewerkteUren = 0; 
    AfgekeurdOver100Uren = 0;
    AfgekeurdOver125Uren = 0;
    AfgekeurdVerlofUren = 0;
    AfgekeurdZiekteUren = 0;
    AfgekeurdTotaalUren = 0;
}
// Tim - empty totaal kosten
function emptyTotaalKosten(){
    OverigeKosten = 0;
    OpenbaarVervoer = 0;
    AutoKM = 0;
    AutoEuro = 0;
    Totaal = 0;
}