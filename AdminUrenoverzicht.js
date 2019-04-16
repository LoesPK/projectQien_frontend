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
var Goedgekeurdpertraineestatus;
var Goedgekeurdpertraineetotaal = 0;
var Goedgekeurdpertraineedagen = 0;
var GoedgekeurdpertraineeGewerkteUren = 0; 
var GoedgekeurdpertraineeOver100Uren = 0;
var GoedgekeurdpertraineeOver125Uren = 0;
var GoedgekeurdpertraineeVerlofUren = 0;
var GoedgekeurdpertraineeZiekteUren = 0;
var GoedgekeurdpertraineeTotaalUren = 0;

// Tim - per trainee - Afgekeurd uren
var Afgekeurdpertraineestatus;
var Afgekeurdpertraineetotaal = 0;
var Afgekeurdpertraineedagen = 0;
var AfgekeurdpertraineeGewerkteUren = 0; 
var AfgekeurdpertraineeOver100Uren = 0;
var AfgekeurdpertraineeOver125Uren = 0;
var AfgekeurdpertraineeVerlofUren = 0;
var AfgekeurdpertraineeZiekteUren = 0;
var AfgekeurdpertraineeTotaalUren = 0;

// Tim - per trainee - Teaccoderen uren
var Teaccoderenpertraineestatus;
var Teaccoderenpertraineetotaal = 0;
var Teaccoderenpertraineedagen = 0;
var TeaccoderenpertraineeGewerkteUren = 0; 
var TeaccoderenpertraineeOver100Uren = 0;
var TeaccoderenpertraineeOver125Uren = 0;
var TeaccoderenpertraineeVerlofUren = 0;
var TeaccoderenpertraineeZiekteUren = 0;
var TeaccoderenpertraineeTotaalUren = 0;

// Tim - per trainee - nietingediend uren
var Nietingediendpertraineestatus = "-";
var Nietingediendpertraineetotaal = "-";
var Nietingediendpertraineedagen = "-";
var NietingediendpertraineeGewerkteUren = "-"; 
var NietingediendpertraineeOver100Uren = "-";
var NietingediendpertraineeOver125Uren = "-";
var NietingediendpertraineeVerlofUren = "-";
var NietingediendpertraineeZiekteUren = "-";
var NietingediendpertraineeTotaalUren = "-";

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
}

// Tim - GET trainees en alle uren van
function GETUrenPerMaand(theMonth){
    var table = document. getElementById("urenTabel");
    var pertraineetable = document. getElementById("perTraineeTabel");

        // Tim - empty tables on month selection
        for(var i = table.rows.length - 1; i > 0; i--){
            table. deleteRow(i);
        }
        for(var i = pertraineetable.rows.length - 1; i > 0; i--){
            pertraineetable. deleteRow(i);
        }
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
            trainee = JSON.parse(this.responseText);
            var tbody = addHtmlElement(table, document.createElement("tbody"));
            var pertraineetbody = addHtmlElement(pertraineetable, document.createElement("tbody"));

            //trainee.uren.sort(function(a,b){return b.factuurDatum<a.factuurDatum?-1:1});
            // Tim - empty variables totaal before the loops begin
            emptyTotaal();
            emptyGoedgekeurd();
            emptyAfgekeurd();
            emptyTeaccoderen();


            // Tim - Per Trainee loop
            for(var i = 0; i < trainee.length; i++){
                console.log(trainee[i].voornaam);
                // Tim - empty variables per trainee before loops begin
                emptyPerTraineeGoedgekeurdVariables();
                emptyPerTraineeAfgekeurdVariables();
                emptyPerTraineeTeaccoderenVariables();

                klant = trainee[i].klant;
                voornaam = trainee[i].voornaam;
                achternaam = trainee[i].achternaam;

                // Tim - Per Uur loop
                for(var k = 0; k < trainee[i].uren.length; k++){
                    //console.log("PER UUR VAN DE TRAINEE");
                    //console.log(trainee[i].uren[k].accordStatus);
                    uurInDBHemZeMonth = trainee[i].uren[k].factuurDatum.substring(5,7);
                    //console.log(uurInDBHemZeMonth);
                    if(uurInDBHemZeMonth == theMonth) {
                        // console.log(trainee[i].voornaam + " IF ITS THE RIGHT MONTH");
                        // Tim - Totaal tabel variables pakken
                        switchTotaalUren(trainee[i].uren[k],trainee[i].uren[k].waarde);
                        switchTotaalGoegekeurdUren(trainee[i].uren[k],trainee[i].uren[k].waarde);
                        switchTotaalAfgekeurdeUren(trainee[i].uren[k],trainee[i].uren[k].waarde);
                        switchTotaalteaccoderenUren(trainee[i].uren[k],trainee[i].uren[k].waarde);

                        // Tim - Per Trainee tabel variables pakken
                        switch(trainee[i].uren[k].accordStatus){
                            case "GOEDGEKEURD": 
                            switchPerTraineeGoedgekeurdUren(trainee[i].uren[k],trainee[i].uren[k].waarde);
                            case "AFGEKEURD":
                            switchPerTraineeAfgekeurdUren(trainee[i].uren[k],trainee[i].uren[k].waarde);
                            case "TEACCODEREN":
                            switchPerTraineeTeaccoderenUren(trainee[i].uren[k],trainee[i].uren[k].waarde);
                            
                        }
                    }
                }
                // Tim - per trainee - opbouwen van de body van de tabel
                // Tim - als de trainee goedegeurde uren heeft dan zet ie het in de tabel
                if(GoedgekeurdpertraineeTotaalUren > 0){
                    // Tim - per trainee - per uur categorie een rij maken
                    //console.log("GOEDGEKEURD");
                    addHtmlElement(pertraineetbody,PerTraineeGoedgekeurdTableRow(trainee));
                }
                // Tim - als de trainee afgekeurde uren heeft dan zet ie het in de tabel
                if(AfgekeurdpertraineeTotaalUren > 0){
                    //console.log("AFGEKEURD");
                    addHtmlElement(pertraineetbody,PerTraineeAfgekeurdTableRow(trainee));
                }
                // Tim - als de trainee teaccoderen uren heeft dan zet ie het in de tabel
                if(TeaccoderenpertraineeTotaalUren > 0){
                    //console.log("TEACCODEREN");
                    addHtmlElement(pertraineetbody,PerTraineeTeaccoderenTableRow(trainee));
                }
                console.log(GoedgekeurdpertraineeTotaalUren + " GoedgekeurdpertraineeTotaalUren");
                console.log(AfgekeurdpertraineeTotaalUren + " AfgekeurdpertraineeTotaalUren");
                console.log(TeaccoderenpertraineeTotaalUren + " TeaccoderenpertraineeTotaalUren");


                //Tim - als de trainee geen uren heeft ingediend
                if(TeaccoderenpertraineeTotaalUren == 0 && AfgekeurdpertraineeTotaalUren == 0 && GoedgekeurdpertraineeTotaalUren == 0){
                    console.log("NIKS INGEDIEND");
                    addHtmlElement(pertraineetbody,PerTraineeNietingediendTableRow(trainee));
                }
            }
            //Tim - Totaal table - Opbouwen van de body van de tabel
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
// Tim - per trainee - Goedgekeurd uren - Afhankelijk van het type uren worden de uren van een "Uren" in database bij de totalen van de correcte variabelen toegevoegd
function switchPerTraineeGoedgekeurdUren(traineelijst,typeUur){
    if(traineelijst.accordStatus == "GOEDGEKEURD"){
    //console.log("PER GOEDGEKEURD");
    Goedgekeurdpertraineestatus = "Goedgekeurd";

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
// Tim - per trainee - Afgekeurd uren - Afhankelijk van het type uren worden de uren van een "Uren" in database bij de totalen van de correcte variabelen toegevoegd
function switchPerTraineeAfgekeurdUren(traineelijst,typeUur){
    if(traineelijst.accordStatus == "AFGEKEURD"){
    //console.log("PER AFGEKEURD");
    Afgekeurdpertraineestatus = "Afgekeurd";

        switch(typeUur){
            case "Gewerkte Uren": 
                AfgekeurdpertraineeGewerkteUren += traineelijst.aantal;
                AfgekeurdpertraineeTotaalUren += traineelijst.aantal; 
                return AantalGewerkteUren;
            case "Overuren 100%": 
                AfgekeurdpertraineeOver100Uren += traineelijst.aantal;
                AfgekeurdpertraineeTotaalUren += traineelijst.aantal;
            break
            case "Overuren 125%": 
                AfgekeurdpertraineeOver125Uren += traineelijst.aantal;
                AfgekeurdpertraineeTotaalUren += traineelijst.aantal;
            break
            case "Verlof Uren": 
                AfgekeurdpertraineeVerlofUren += traineelijst.aantal;
                AfgekeurdpertraineeTotaalUren += traineelijst.aantal;
            break
            case "Ziekte Uren": 
                AfgekeurdpertraineeZiekteUren += traineelijst.aantal;
                AfgekeurdpertraineeTotaalUren += traineelijst.aantal;
            break
        }
        //console.log(AfgekeurdpertraineeTotaalUren);
    }
}
// Tim - per trainee - teaccoderen uren - Afhankelijk van het type uren worden de uren van een "Uren" in database bij de totalen van de correcte variabelen toegevoegd
function switchPerTraineeTeaccoderenUren(traineelijst,typeUur){
    if(traineelijst.accordStatus == "TEACCODEREN"){
    //console.log("PER INGEDIEND");
    Teaccoderenpertraineestatus = "Ingediend";

        switch(typeUur){
            case "Gewerkte Uren": 
                TeaccoderenpertraineeGewerkteUren += traineelijst.aantal;
                TeaccoderenpertraineeTotaalUren += traineelijst.aantal; 
                return AantalGewerkteUren;
            case "Overuren 100%": 
                TeaccoderenpertraineeOver100Uren += traineelijst.aantal;
                TeaccoderenpertraineeTotaalUren += traineelijst.aantal;
            break
            case "Overuren 125%": 
                TeaccoderenpertraineeOver125Uren += traineelijst.aantal;
                TeaccoderenpertraineeTotaalUren += traineelijst.aantal;
            break
            case "Verlof Uren": 
                TeaccoderenpertraineeVerlofUren += traineelijst.aantal;
                TeaccoderenpertraineeTotaalUren += traineelijst.aantal;
            break
            case "Ziekte Uren": 
                TeaccoderenpertraineeZiekteUren += traineelijst.aantal;
                TeaccoderenpertraineeTotaalUren += traineelijst.aantal;
            break
        }
        console.log(AfgekeurdpertraineeTotaalUren);
    }
}
// Tim - per trainee - Nietingediend uren - Afhankelijk van het type uren worden de uren van een "Uren" in database bij de totalen van de correcte variabelen toegevoegd
function switchPerTraineeNietingediendUren(traineelijst,typeUur){
    if(traineelijst.accordStatus == "NIETINGEDIEND"){
    console.log("PER NIETINGEDIEND");
    Teaccoderenpertraineestatus = "-";

        switch(typeUur){
            case "Gewerkte Uren": 
                NietingediendtraineeGewerkteUren += traineelijst.aantal;
                NietingediendtraineeTotaalUren += traineelijst.aantal; 
                return AantalGewerkteUren;
            case "Overuren 100%": 
                NietingediendtraineeOver100Uren += traineelijst.aantal;
                NietingediendtraineeTotaalUren += traineelijst.aantal;
            break
            case "Overuren 125%": 
                NietingediendtraineeOver125Uren += traineelijst.aantal;
                NietingediendpertraineeTotaalUren += traineelijst.aantal;
            break
            case "Verlof Uren": 
                NietingediendpertraineeVerlofUren += traineelijst.aantal;
                NietingediendpertraineeTotaalUren += traineelijst.aantal;
            break
            case "Ziekte Uren": 
                NietingediendpertraineeZiekteUren += traineelijst.aantal;
                NietingediendpertraineeTotaalUren += traineelijst.aantal;
            break
        }
        console.log(AfgekeurdpertraineeTotaalUren);
    }
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
// Tim - Per Trainee - goedgekeurde uren rij aanmaken
function PerTraineeGoedgekeurdTableRow(traineelijst) {
    var tr = document.createElement("tr");
    addHtmlElementContent(tr, document.createElement("td"), "");
    addHtmlElementContent(tr, document.createElement("td"), voornaam);
    addHtmlElementContent(tr, document.createElement("td"), achternaam);
    addHtmlElementContent(tr, document.createElement("td"), Goedgekeurdpertraineestatus);
    addHtmlElementContent(tr, document.createElement("td"), GoedgekeurdpertraineeTotaalUren);
    addHtmlElementContent(tr, document.createElement("td"), GoedgekeurdpertraineeGewerkteUren);
    addHtmlElementContent(tr, document.createElement("td"), GoedgekeurdpertraineeOver100Uren);
    addHtmlElementContent(tr, document.createElement("td"), GoedgekeurdpertraineeOver125Uren);
    addHtmlElementContent(tr, document.createElement("td"), GoedgekeurdpertraineeVerlofUren);
    addHtmlElementContent(tr, document.createElement("td"), "");
    addHtmlElementContent(tr, document.createElement("td"), GoedgekeurdpertraineeZiekteUren);
    return tr;
}
// Tim - Per Trainee - afgekeurde uren rij aanmaken
function PerTraineeAfgekeurdTableRow(traineelijst) {
    var tr = document.createElement("tr");
    addHtmlElementContent(tr, document.createElement("td"), "");
    addHtmlElementContent(tr, document.createElement("td"), voornaam);
    addHtmlElementContent(tr, document.createElement("td"), achternaam);
    addHtmlElementContent(tr, document.createElement("td"), Afgekeurdpertraineestatus);
    addHtmlElementContent(tr, document.createElement("td"), AfgekeurdpertraineeTotaalUren);
    addHtmlElementContent(tr, document.createElement("td"), AfgekeurdpertraineeGewerkteUren);
    addHtmlElementContent(tr, document.createElement("td"), AfgekeurdpertraineeOver100Uren);
    addHtmlElementContent(tr, document.createElement("td"), AfgekeurdpertraineeOver125Uren);
    addHtmlElementContent(tr, document.createElement("td"), AfgekeurdpertraineeVerlofUren);
    addHtmlElementContent(tr, document.createElement("td"), "");
    addHtmlElementContent(tr, document.createElement("td"), AfgekeurdpertraineeZiekteUren);
    return tr;
}
// Tim - Per Trainee - afgekeurde uren rij aanmaken
function PerTraineeTeaccoderenTableRow(traineelijst) {
    var tr = document.createElement("tr");
    addHtmlElementContent(tr, document.createElement("td"), "");
    addHtmlElementContent(tr, document.createElement("td"), voornaam);
    addHtmlElementContent(tr, document.createElement("td"), achternaam);
    addHtmlElementContent(tr, document.createElement("td"), Teaccoderenpertraineestatus);
    addHtmlElementContent(tr, document.createElement("td"), TeaccoderenpertraineeTotaalUren);
    addHtmlElementContent(tr, document.createElement("td"), TeaccoderenpertraineeGewerkteUren);
    addHtmlElementContent(tr, document.createElement("td"), TeaccoderenpertraineeOver100Uren);
    addHtmlElementContent(tr, document.createElement("td"), TeaccoderenpertraineeOver125Uren);
    addHtmlElementContent(tr, document.createElement("td"), TeaccoderenpertraineeVerlofUren);
    addHtmlElementContent(tr, document.createElement("td"), "");
    addHtmlElementContent(tr, document.createElement("td"), TeaccoderenpertraineeZiekteUren);
    return tr;
}
// Tim - Per Trainee - afgekeurde uren rij aanmaken
function PerTraineeNietingediendTableRow(traineelijst) {
    var tr = document.createElement("tr");
    addHtmlElementContent(tr, document.createElement("td"), "");
    addHtmlElementContent(tr, document.createElement("td"), voornaam);
    addHtmlElementContent(tr, document.createElement("td"), achternaam);
    addHtmlElementContent(tr, document.createElement("td"), Nietingediendpertraineestatus);
    addHtmlElementContent(tr, document.createElement("td"), NietingediendpertraineeTotaalUren);
    addHtmlElementContent(tr, document.createElement("td"), NietingediendpertraineeGewerkteUren);
    addHtmlElementContent(tr, document.createElement("td"), NietingediendpertraineeOver100Uren);
    addHtmlElementContent(tr, document.createElement("td"), NietingediendpertraineeOver125Uren);
    addHtmlElementContent(tr, document.createElement("td"), NietingediendpertraineeVerlofUren);
    addHtmlElementContent(tr, document.createElement("td"), "");
    addHtmlElementContent(tr, document.createElement("td"), NietingediendpertraineeZiekteUren);
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
// Tim - empty - per trainee - goedgekeurd uren
function emptyPerTraineeGoedgekeurdVariables(){
    //console.log("Empty variables");
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
// Tim - empty - per trainee - afgekeurd uren
function emptyPerTraineeAfgekeurdVariables(){
    //console.log("Empty variables AFGEKEURD");
    Afgekeurdpertraineestatus;
    Afgekeurdpertraineetotaal = 0;
    Afgekeurdpertraineedagen = 0;
    AfgekeurdpertraineeGewerkteUren = 0; 
    AfgekeurdpertraineeOver100Uren = 0;
    AfgekeurdpertraineeOver125Uren = 0;
    AfgekeurdpertraineeVerlofUren = 0;
    AfgekeurdpertraineeZiekteUren = 0;
    AfgekeurdpertraineeTotaalUren = 0;
}
// Tim - empty - per trainee - teaccoderen
function emptyPerTraineeTeaccoderenVariables(){
    //console.log("Empty variables INGEDIEND");
    Teaccoderenpertraineestatus;
    Teaccoderenpertraineetotaal = 0;
    Teaccoderenpertraineedagen = 0;
    TeaccoderenpertraineeGewerkteUren = 0; 
    TeaccoderenpertraineeOver100Uren = 0;
    TeaccoderenpertraineeOver125Uren = 0;
    TeaccoderenpertraineeVerlofUren = 0;
    TeaccoderenpertraineeZiekteUren = 0;
    TeaccoderenpertraineeTotaalUren = 0;
}

