// localhost
var apiUur = "http://localhost:8082/api/uur";

// EMIEL - Variabelen aanmaken om uren in bij elkaar op te tellen
var AantalGewerkteUren = 0;
var AantalOver100Uren = 0;
var AantalOver125Uren = 0;
var AantalVerlofUren = 0;
var AantalZiekteUren = 0;
var AantalTotaalUren = 0;

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
                var adminUren = JSON.parse(this.responseText);
                    console.log(adminUren);
                var table = document.createElement("table");
                // createNewUrenLijstTableHeader();
                addHtmlElement(table,adminUrenTotTableHeader());  
                var tbody = addHtmlElement(table, document.createElement("tbody"));
                // Uren onder bepaalde type uren wegschrijven
                for(var i = 0; i< adminUren.length; i++) {
                    switchUren(adminUren[i],adminUren[i].waarde);
                }
                //Opbouwen van de body van de tabel
                addHtmlElement(tbody, adminUrenTotTableRow(adminUren));
                document.getElementById("AdminTotaalUrenOverzichtTabel").appendChild(table);
            } else {
                alert(this.statusText)
            }
        }
    };
 
    xhttp.open("GET", apiUur, true);
    xhttp.send();
 }
 // EMIEL - Header tabel aanmaken
 function adminUrenTotTableHeader() {
    var tableHeader = document.createElement("thead");
    var tr = addHtmlElement(tableHeader, document.createElement("tr"));
    addHtmlElementContent(tr, document.createElement("th"), "Status");
    addHtmlElementContent(tr, document.createElement("th"), "Totaal");
    addHtmlElementContent(tr, document.createElement("th"), "Datum");
    addHtmlElementContent(tr, document.createElement("th"), "Gewerkt");
    addHtmlElementContent(tr, document.createElement("th"), "Over 100%");
    addHtmlElementContent(tr, document.createElement("th"), "Over 125%");
    addHtmlElementContent(tr, document.createElement("th"), "Verlof");
    addHtmlElementContent(tr, document.createElement("th"), "Wacht");
    addHtmlElementContent(tr, document.createElement("th"), "Ziekte");
    return tableHeader;
 }
 // EMIEL - Rij aanmaken
 function adminUrenTotTableRow(adminUren) {
    var tr = document.createElement("tr");
    addHtmlElementContent(tr, document.createElement("td"), "AdminTotaalUrenOverzicht");
    addHtmlElementContent(tr, document.createElement("td"), AantalTotaalUren);
    addHtmlElementContent(tr, document.createElement("td"), "Datum");
    addHtmlElementContent(tr, document.createElement("td"), AantalGewerkteUren);
    addHtmlElementContent(tr, document.createElement("td"), AantalOver100Uren);
    addHtmlElementContent(tr, document.createElement("td"), AantalOver125Uren);
    addHtmlElementContent(tr, document.createElement("td"), AantalVerlofUren);
    addHtmlElementContent(tr, document.createElement("td"), "Wacht");
    addHtmlElementContent(tr, document.createElement("td"), AantalZiekteUren);
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

// EMIEL - Afhankelijk van het type uren worden de uren van een "Uren" in database bij de totalen van de correcte variabelen toegevoegd
function switchUren(adminUren,typeUur){
        
    switch(typeUur){
        case "Gewerkte Uren": 
        console.log("Check in Gewerkte uren: "+ adminUren.aantal)
            AantalGewerkteUren += adminUren.aantal;
            AantalTotaalUren += adminUren.aantal; 
            return AantalGewerkteUren;
        case "Overuren 100%": 
            AantalOver100Uren += adminUren.aantal;
            AantalTotaalUren += adminUren.aantal;
        break
        case "Overuren 125%": 
            AantalOver125Uren += adminUren.aantal;
            AantalTotaalUren += adminUren.aantal;
        break
        case "Verlof Uren": 
            AantalVerlofUren += adminUren.aantal;
            AantalTotaalUren += adminUren.aantal;
        break
        case "Ziekte Uren": 
            AantalZiekteUren += adminUren.aantal;
            AantalTotaalUren += adminUren.aantal;
        break
    }
}