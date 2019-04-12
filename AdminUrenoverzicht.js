// localhost
var apiUur = "http://localhost:8082/api/trainee";

// EMIEL - Variabelen aanmaken om de totale uren in bij elkaar op te tellen
var AantalGewerkteUren = 0;
var AantalOver100Uren = 0;
var AantalOver125Uren = 0;
var AantalVerlofUren = 0;
var AantalZiekteUren = 0;
var AantalTotaalUren = 0;

// Tim - Variabelen aanmaken om de totale  goedgekeurde uren in bij elkaar op te tellen
var GoedgekeurdGewerkteUren = 0; 
var GoedgekeurdOver100Uren = 0;
var GoedgekeurdOver125Uren = 0;
var GoedgekeurdVerlofUren = 0;
var GoedgekeurdZiekteUren = 0;
var GoedgekeurdTotaalUren = 0;

// Tim - Variabelen aanmaken om de totale  teaccoderen uren in bij elkaar op te tellen
var teaccoderenGewerkteUren = 0; 
var teaccoderenOver100Uren = 0;
var teaccoderenOver125Uren = 0;
var teaccoderenVerlofUren = 0;
var teaccoderenZiekteUren = 0;
var teaccoderenTotaalUren = 0;

// Tim - Variabelen aanmaken om de totale  open "nietingevuld/ingediende" uren in bij elkaar op te tellen
var NietingevuldGewerkteUren = 0; 
var NietingevuldOver100Uren = 0;
var NietingevuldOver125Uren = 0;
var NietingevuldVerlofUren = 0;
var NietingevuldZiekteUren = 0;
var NietingevuldTotaalUren = 0;


// EMIEL - Functie om de pagina op te bouwen bij het inladen
function AdminUrenoverzichtPageLoad(){
    AdminUrenLijstBuild();
}

// EMIEL - tabel opbouwen
function AdminUrenLijstBuild() {
    var xhttp = new XMLHttpRequest();
 
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
            if (this.status == 200) {
                document.getElementById("AdminTotaalUrenOverzichtTabel").innerHTML = "";
                var traineelijst = JSON.parse(this.responseText);
                var table = document.createElement("table");

                // createNewUrenLijstTableHeader();
                addHtmlElement(table,adminUrenTotTableHeader());  
                var tbody = addHtmlElement(table, document.createElement("tbody"));

                // Tim - Totale uren
                    // Tim - Per trainee
                    for(var i = 0; i< traineelijst.length; i++) {
                        console.log("PER TRAINEE");
                        // Tim - Per uur van de trainee
                        for(var k = 0; k < traineelijst[i].uren.length; k++){
                            switchTotaalUren(traineelijst[i].uren[k],traineelijst[i].uren[k].waarde);
                            switchTotaalGoegekeurdUren(traineelijst[i].uren[k],traineelijst[i].uren[k].waarde);
                            switchTotaalteaccoderenUren(traineelijst[i].uren[k],traineelijst[i].uren[k].waarde);
                            switchTotaalNietingevuldUren(traineelijst[i].uren[k],traineelijst[i].uren[k].waarde);
                        }
                    }
                //Opbouwen van de body van de tabel
                addHtmlElement(tbody, adminUrenTotaalTableRow(traineelijst));
                addHtmlElement(tbody,adminUrentGoedgekeurdTableRow(traineelijst));
                addHtmlElement(tbody,adminUrenteaccoderenTableRow(traineelijst));
                addHtmlElement(tbody,adminUrentNietingevuldTableRow(traineelijst));
                document.getElementById("AdminTotaalUrenOverzichtTabel").appendChild(table);
            } else {
                alert(this.statusText)
            }
        }
    };
    xhttp.open("GET", apiUur, true);
    xhttp.send();
}
// EMIEL - totaal - Afhankelijk van het type uren worden de uren van een "Uren" in database bij de totalen van de correcte variabelen toegevoegd
function switchTotaalUren(traineelijst,typeUur){
    switch(typeUur){
        case "Gewerkte Uren": 
        console.log("Check in Gewerkte uren: "+ traineelijst.aantal)
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
            console.log("Check in Gewerkte uren: "+ traineelijst.aantal)
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
// Tim - Teaccoderen - Afhankelijk van het type uren worden de uren van een "Uren" in database bij de totalen van de correcte variabelen toegevoegd
function switchTotaalteaccoderenUren(traineelijst,typeUur){
    if(traineelijst.accordStatus == "TEACCODEREN"){
        switch(typeUur){
            case "Gewerkte Uren": 
            console.log("Check in Gewerkte uren: "+ traineelijst.aantal)
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
function switchTotaalNietingevuldUren(traineelijst,typeUur){
    if(traineelijst.accordStatus == "NIETINGEVULD"){
        switch(typeUur){
            case "Gewerkte Uren": 
            console.log("Check in Gewerkte uren: "+ traineelijst.aantal)
                NietingevuldGewerkteUren += traineelijst.aantal;
                NietingevuldTotaalUren += traineelijst.aantal; 
                return AantalGewerkteUren;
            case "Overuren 100%": 
                NietingevuldOver100Uren += traineelijst.aantal;
                NietingevuldTotaalUren += traineelijst.aantal;
            break
            case "Overuren 125%": 
                NietingevuldOver125Uren += traineelijst.aantal;
                NietingevuldTotaalUren += traineelijst.aantal;
            break
            case "Verlof Uren": 
                NietingevuldVerlofUren += traineelijst.aantal;
                NietingevuldTotaalUren += traineelijst.aantal;
            break
            case "Ziekte Uren": 
                NietingevuldZiekteUren += traineelijst.aantal;
                NietingevuldTotaalUren += traineelijst.aantal;
            break
        }
    }
}
// EMIEL - Header tabel aanmaken
function adminUrenTotTableHeader() {
    var tableHeader = document.createElement("thead");
    var tr = addHtmlElement(tableHeader, document.createElement("tr"));
    addHtmlElementContent(tr, document.createElement("th"), "Status");
    addHtmlElementContent(tr, document.createElement("th"), "Totaal");
    //addHtmlElementContent(tr, document.createElement("th"), "Datum");
    addHtmlElementContent(tr, document.createElement("th"), "Gewerkt");
    addHtmlElementContent(tr, document.createElement("th"), "Over 100%");
    addHtmlElementContent(tr, document.createElement("th"), "Over 125%");
    addHtmlElementContent(tr, document.createElement("th"), "Verlof");
    addHtmlElementContent(tr, document.createElement("th"), "Wacht");
    addHtmlElementContent(tr, document.createElement("th"), "Ziekte");
    return tableHeader;
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
// Tim - Nietingevuld Rij aanmaken
function adminUrentNietingevuldTableRow(traineelijst) {
    var tr = document.createElement("tr");
    addHtmlElementContent(tr, document.createElement("td"), "Open");
    addHtmlElementContent(tr, document.createElement("td"), NietingevuldTotaalUren);
    //addHtmlElementContent(tr, document.createElement("td"), "Datum");
    addHtmlElementContent(tr, document.createElement("td"), NietingevuldGewerkteUren);
    addHtmlElementContent(tr, document.createElement("td"), NietingevuldOver100Uren);
    addHtmlElementContent(tr, document.createElement("td"), NietingevuldOver125Uren);
    addHtmlElementContent(tr, document.createElement("td"), NietingevuldVerlofUren);
    addHtmlElementContent(tr, document.createElement("td"), "");
    addHtmlElementContent(tr, document.createElement("td"), NietingevuldZiekteUren);
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
