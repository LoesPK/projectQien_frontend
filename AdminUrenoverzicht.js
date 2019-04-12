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

// Tim - per trainee - Variabelen aanmaken om  een rij te maken
var klant = "";
var voornaam = "";
var achternaam = "";
var ingediend;
var goedgekeurd;
var totaal;
var dagen;
var GewerkteUren; 
var Over100Uren;
var Over125Uren;
var VerlofUren;
var ZiekteUren;
var TotaalUren;

// Tim - per trainee - Goedgekeurd uren
var Goedgekeurdpertraineeingediend;
var Goedgekeurdpertraineegoedgekeurd;
var Goedgekeurdpertraineetotaal = 0;
var Goedgekeurdpertraineedagen = 0;
var GoedgekeurdpertraineeGewerkteUren = 0; 
var GoedgekeurdpertraineeOver100Uren = 0;
var GoedgekeurdpertraineeOver125Uren = 0;
var GoedgekeurdpertraineeVerlofUren = 0;
var GoedgekeurdpertraineeZiekteUren = 0;
var GoedgekeurdpertraineeTotaalUren = 0;

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
                var traineelijst = JSON.parse(this.responseText);

                document.getElementById("AdminTotaalUrenOverzichtTabel").innerHTML = "";
                document.getElementById("PerTraineeAdminUrenOverzichtTabel").innerHTML = "";

                var table = document.createElement("table");
                var pertraineetable = document.createElement("table");

                // Emiel - create totaal TableHeader();
                addHtmlElement(table,adminUrenTotTableHeader());  
                // Tim - create PerTrainee - headers
                addHtmlElement(pertraineetable,PerTraineeUrenTableHeader());  

                // Emiel - create totaal table body
                var tbody = addHtmlElement(table, document.createElement("tbody"));
                // Tim - create per trainee table body
                var pertraineetbody = addHtmlElement(pertraineetable, document.createElement("tbody"));

                // Tim - Totale uren tabel invullen
                    // Tim - Per trainee
                    for(var i = 0; i< traineelijst.length; i++) {
                        //console.log("PER TRAINEE");
                        
                        // Tim - Per uur van de trainee
                        for(var k = 0; k < traineelijst[i].uren.length; k++){
                            switchTotaalUren(traineelijst[i].uren[k],traineelijst[i].uren[k].waarde);
                            switchTotaalGoegekeurdUren(traineelijst[i].uren[k],traineelijst[i].uren[k].waarde);
                            switchTotaalteaccoderenUren(traineelijst[i].uren[k],traineelijst[i].uren[k].waarde);
                            switchTotaalNietingevuldUren(traineelijst[i].uren[k],traineelijst[i].uren[k].waarde);
                        }
                    }

                // Tim - per trainee tabel invullen
                    //Tim - per trainee loop
                    for(var i = 0; i< traineelijst.length; i++){
                        console.log("PER TRAINEE");
                        emptyvariables();
                        //Tim - reset variables per trainee
                        voornaam = traineelijst[i].voornaam;
                        achternaam = traineelijst[i].achternaam;

                        

                        // Tim - per uur van de trainee loop
                        for(var k = 0; k < traineelijst[i].uren.length; k++){
                            //console.log("PER UUR");
                            //console.log(traineelijst[i].uren[k].accordStatus);
                                switch(traineelijst[i].uren[k].accordStatus){
                                    case "GOEDGEKEURD": 
                                    switchPerTraineeGoedgekeurdUren(traineelijst[i].uren[k],traineelijst[i].uren[k].waarde);
                                    case "TEACCODEREN":
                                    //console.log("PER TEACCORDEREN");
                                    case "NIETINGEVULD":
                                    //console.log("PER NIETINGEVULD");
                                    case "AFGEKEURD":
                                    //console.log("PER AFGEKEURD");
                            }
                            
                        }
                    
                    console.log(GoedgekeurdpertraineeTotaalUren + "GOED TOTAAL");

                    if(GoedgekeurdpertraineeTotaalUren > 0){
                    // Tim - per trainee - per uur categorie een rij maken
                    addHtmlElement(pertraineetbody,PerTraineeGoedgekeurdTableRow(traineelijst));
                    }

                    }


                


                //Opbouwen van de body van de tabel
                addHtmlElement(tbody, adminUrenTotaalTableRow(traineelijst));
                addHtmlElement(tbody,adminUrentGoedgekeurdTableRow(traineelijst));
                addHtmlElement(tbody,adminUrenteaccoderenTableRow(traineelijst));
                //addHtmlElement(tbody,adminUrentNietingevuldTableRow(traineelijst));



                document.getElementById("AdminTotaalUrenOverzichtTabel").appendChild(table);
                document.getElementById("PerTraineeAdminUrenOverzichtTabel").appendChild(pertraineetable);
            } else {
                alert(this.statusText)
            }
        }
    };
    xhttp.open("GET", apiUur, true);
    xhttp.send();
}

// Tim - per trainee - Afhankelijk van het type uren worden de uren van een "Uren" in database bij de totalen van de correcte variabelen toegevoegd
function switchPerTraineeGoedgekeurdUren(traineelijst,typeUur){
    
    
    if(traineelijst.accordStatus == "GOEDGEKEURD"){
    console.log("PER GOEDGEKEURD");
    Goedgekeurdpertraineeingediend = "Ja";
    Goedgekeurdpertraineegoedgekeurd = "Ja";

        switch(typeUur){
            case "Gewerkte Uren": 
            GoedgekeurdpertraineeGewerkteUren += traineelijst.aantal;
            GoedgekeurdpertraineeTotaalUren += traineelijst.aantal; 
                return AantalGewerkteUren;
            case "Overuren 100%": 
            GoedgekeurdpertraineeOver100Uren += traineelijst.aantal;
            GoedgekeurdpertraineeTotaalUren += traineelijst.aantal;
            break
            case "Overuren 125%": 
            GoedgekeurdpertraineeOver125Uren += traineelijst.aantal;
            GoedgekeurdpertraineeTotaalUren += traineelijst.aantal;
            break
            case "Verlof Uren": 
            GoedgekeurdpertraineeVerlofUren += traineelijst.aantal;
            GoedgekeurdpertraineeTotaalUren += traineelijst.aantal;
            break
            case "Ziekte Uren": 
            GoedgekeurdpertraineeZiekteUren += traineelijst.aantal;
            GoedgekeurdpertraineeTotaalUren += traineelijst.aantal;
            break
        }
    }
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
function switchTotaalNietingevuldUren(traineelijst,typeUur){
    if(traineelijst.accordStatus == "NIETINGEVULD"){
        switch(typeUur){
            case "Gewerkte Uren": 
            //console.log("Check in Gewerkte uren: "+ traineelijst.aantal)
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

// Tim - Per Trainee - Header tabel aanmaken
function PerTraineeUrenTableHeader() {
    var tableHeader = document.createElement("thead");
    var tr = addHtmlElement(tableHeader, document.createElement("tr"));
    addHtmlElementContent(tr, document.createElement("th"), "Klant");
    addHtmlElementContent(tr, document.createElement("th"), "Voornaam");
    addHtmlElementContent(tr, document.createElement("th"), "Achternaam");
    addHtmlElementContent(tr, document.createElement("th"), "Ingediend");
    addHtmlElementContent(tr, document.createElement("th"), "Goedgekeurd");
    addHtmlElementContent(tr, document.createElement("th"), "Totaal Uren");
    addHtmlElementContent(tr, document.createElement("th"), "Dagen");
    addHtmlElementContent(tr, document.createElement("th"), "Gewerkt");
    addHtmlElementContent(tr, document.createElement("th"), "Over 100%");
    addHtmlElementContent(tr, document.createElement("th"), "Over 125%");
    addHtmlElementContent(tr, document.createElement("th"), "Verlof");
    addHtmlElementContent(tr, document.createElement("th"), "Wacht");
    addHtmlElementContent(tr, document.createElement("th"), "Ziekte");
    return tableHeader;
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
// EMIEL - totaal tabel - Totaal Rij aanmaken
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
// Tim - totaal tabel - Teaccoderen Rij aanmaken
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
// Tim - totaal tabel - Goedgekeurd Rij aanmaken
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

// Tim - Per trainee de variable op 0 zetten
function emptyvariables(){
    console.log("Empty variables");
    Goedgekeurdpertraineeingediend = "";
    Goedgekeurdpertraineegoedgekeurd = "";
    Goedgekeurdpertraineetotaal = 0;
    Goedgekeurdpertraineedagen = 0;
    GoedgekeurdpertraineeGewerkteUren = 0; 
    GoedgekeurdpertraineeOver100Uren = 0;
    GoedgekeurdpertraineeOver125Uren = 0;
    GoedgekeurdpertraineeVerlofUren = 0;
    GoedgekeurdpertraineeZiekteUren = 0;
    GoedgekeurdpertraineeTotaalUren = 0;

}

// Tim - Per Trainee - goedgekeurde uren rij aanmaken
function PerTraineeGoedgekeurdTableRow(traineelijst) {
    var tr = document.createElement("tr");
    addHtmlElementContent(tr, document.createElement("td"), "");
    addHtmlElementContent(tr, document.createElement("td"), voornaam);
    addHtmlElementContent(tr, document.createElement("td"), achternaam);
    addHtmlElementContent(tr, document.createElement("td"), Goedgekeurdpertraineeingediend);
    addHtmlElementContent(tr, document.createElement("td"), Goedgekeurdpertraineegoedgekeurd);
    addHtmlElementContent(tr, document.createElement("td"), GoedgekeurdpertraineeTotaalUren);
    addHtmlElementContent(tr, document.createElement("td"), "");
    addHtmlElementContent(tr, document.createElement("td"), GoedgekeurdpertraineeGewerkteUren);
    addHtmlElementContent(tr, document.createElement("td"), GoedgekeurdpertraineeOver100Uren);
    addHtmlElementContent(tr, document.createElement("td"), GoedgekeurdpertraineeOver125Uren);
    addHtmlElementContent(tr, document.createElement("td"), GoedgekeurdpertraineeVerlofUren);
    addHtmlElementContent(tr, document.createElement("td"), "");
    addHtmlElementContent(tr, document.createElement("td"), GoedgekeurdpertraineeZiekteUren);
    return tr;
}

