var apiUserId = "http://localhost:8082/api/trainee/"; //+sessionStorage.getItem("storedUserID");

//trainee variabele 
var trainee;

//////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                          //
//    Tim - DIKKE COMMENT - hij gaat nu door de OPGESLAGEN declaraties niet verzonden!!     //
//                                                                                          //
//////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////

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
console.log(theYear + " theYear");

// EMIEL - de maand van het uur in database
var uurInDBHemZeMonth;

// Tim - de jaar 
var uurInDBHemZeYear;

// Tim - Variabelen aanmaken om de Year tabel te maken
var YearGewerktUren = 0;
var YearOver100Uren = 0;
var YearOver125Uren = 0;
var YearVerlofUren = 0;
var YearZiekteUren = 0;
var YearTotaalUren = 0;

// Tim - Variabelen aanmaken om de Percentages van uren 
var YearPercentageGewerkteUren = 0; 
var YearPercentageOver100Uren = 0;
var YearPercentageOver125Uren = 0;
var YearPercentageVerlofUren = 0;
var YearPercentageZiekteUren = 0;
var YearPercentageTotaalUren = 0;

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

// Tim - Variabelen aanmaken om de Percentages van uren 
var PercentageGewerkteUren = 0; 
var PercentageOver100Uren = 0;
var PercentageOver125Uren = 0;
var PercentageVerlofUren = 0;
var PercentageZiekteUren = 0;
var PercentageTotaalUren = 0;

// Tim - Variabelen aanmaken om de totale afgekeurde uren in bij elkaar op te tellen
var AfgekeurdGewerkteUren = 0; 
var AfgekeurdOver100Uren = 0;
var AfgekeurdOver125Uren = 0;
var AfgekeurdVerlofUren = 0;
var AfgekeurdZiekteUren = 0;
var AfgekeurdTotaalUren = 0;

// Tim - Variabelen aanmaken om de totale teaccorderen uren in bij elkaar op te tellen
var teaccorderenGewerkteUren = 0; 
var teaccorderenOver100Uren = 0;
var teaccorderenOver125Uren = 0;
var teaccorderenVerlofUren = 0;
var teaccorderenZiekteUren = 0;
var teaccorderenTotaalUren = 0;

// Tim Declaraties variables aanmaken
var OverigeKosten;
var OpenbaarVervoer;
var AutoKM;
var AutoEuro;
var Totaal;

var PGewerkt=0;
var POver = 0;
var POver125 =0;
var PVerlof =0;
var PZiekte = 0;

function setCurrentMonth(){
    console.log(today.substring(5,7));
    var month = document.getElementById("selectedMonth");
    month.value = today.substring(5,7);
}

// Tim - De maand selecteren
function selectMonth(){
	var tableBody = document.getElementById("selectedMonth");
		theMonth = tableBody[tableBody.selectedIndex].value;
		//console.log("theMonth: " + theMonth);
        GETUrenPerMaand(theMonth);
        GETKostenPerMaand(theMonth);
}

//Tim - De jaar selecteren
function selectYear(){
    var tablebodyYear = document.getElementById("selectedYear");
    theYear = tablebodyYear[tablebodyYear.selectedIndex].value;
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
                //console.log(trainee[i].voornaam + " Per Trainee in Kosten loop");
                // Tim - per kosten loop
                for(var k = 0; k < trainee[i].kosten.length; k++){
                    //console.log("Per kosten in kosten loop");
                    uurInDBHemZeMonth = trainee[i].kosten[k].factuurDatum.substring(5,7);
                    uurInDBHemZeYear = trainee[i].kosten[k].factuurDatum.substring(0,4);
                    //console.log(uurInDBHemZeYear + " DE Jaar per kosten");
                    //console.log(theYear + " TheYear in loop");
                    //uurInDBHemZeYear = trainee[i].kosten[k].factuurDatum.substring(5,7);

                    // Tim - check if it is the right month and year
                    if(uurInDBHemZeMonth == theMonth && uurInDBHemZeYear == theYear){
                        console.log(" maand en jaar kloppen");
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
    var table = document.getElementById("urenTabel");
    var Yeartable = document.getElementById("YearTabel");
        // Tim - empty table on month selection
        for(var i = table.rows.length - 1; i > 0; i--){
            table. deleteRow(i);
        }
        for(var i = Yeartable.rows.length - 1; i > 0; i--){
            Yeartable. deleteRow(i);
        }
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
            trainee = JSON.parse(this.responseText);
            var tbody = addHtmlElement(table, document.createElement("tbody"));
            var Yeartbody = addHtmlElement(Yeartable, document.createElement("tbody"));
            //trainee.uren.sort(function(a,b){return b.factuurDatum<a.factuurDatum?-1:1});
            // Tim - empty variables before the loops begin
            emptyTotaal();
            emptyGoedgekeurd();
            emptyAfgekeurd();
            emptyTeaccorderen();
            emptyYearUren();
            // Tim - Per Trainee loop
            for(var i = 0; i < trainee.length; i++){
                //console.log(trainee[i].voornaam + " Per Trainee in Uren loop");
                // Tim - Per Uur loop
                for(var k = 0; k < trainee[i].uren.length; k++){
                    //console.log("PER UUR VAN DE TRAINEE");
                    //console.log(trainee[i].uren[k].accordStatus);
                    uurInDBHemZeMonth = trainee[i].uren[k].factuurDatum.substring(5,7);
                    uurInDBHemZeYear = trainee[i].uren[k].factuurDatum.substring(0,4);
                    //console.log(uurInDBHemZeMonth);
                    // Tim - vergekijk maand en jaar
                    if(uurInDBHemZeMonth == theMonth && uurInDBHemZeYear == theYear) {
                        //console.log(trainee[i].voornaam + " IF ITS THE RIGHT MONTH");
                        switchTotaalUren(trainee[i].uren[k],trainee[i].uren[k].waarde);
                        switchTotaalGoegekeurdUren(trainee[i].uren[k],trainee[i].uren[k].waarde);
                        switchTotaalAfgekeurdeUren(trainee[i].uren[k],trainee[i].uren[k].waarde);
                        switchTotaalteaccorderenUren(trainee[i].uren[k],trainee[i].uren[k].waarde);
                        
                    }
                    // Tim - checked alleen de jaar
                    if(uurInDBHemZeYear == theYear){
                        switchYearUren(trainee[i].uren[k],trainee[i].uren[k].waarde);
                        
                    }
                }
            }
            // Tim - rekenen van percentages
            percantagesGoegekeurdUren();
            yearPercentagesRekenen()

            // Tim - Year tabel opbouwen
            if(YearTotaalUren > 0){
                addHtmlElement(Yeartbody, PercentagesYearTableRow(trainee));
            }
            addHtmlElement(Yeartbody, YearTableRow(trainee));

            // Tim - Opbouwen van de body van de tabel
            if(GoedgekeurdTotaalUren > 0){
                addHtmlElement(tbody, adminPercentagesTableRow(trainee));
            }
            addHtmlElement(tbody, adminUrentGoedgekeurdTableRow(trainee));
            addHtmlElement(tbody, adminUrentAfgekeurdTableRow(trainee));
            addHtmlElement(tbody, adminUrenteaccorderenTableRow(trainee));
            //addHtmlElement(tbody, adminUrenTotaalTableRow(trainee));

            console.log("Na GETUrenPerMaand")
console.log(YearGewerktUren)
console.log(YearOver100Uren)
console.log(YearOver125Uren)
console.log(YearVerlofUren)
console.log(YearZiekteUren)

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

function addHtmlElementContentPlusAwesome(parent, icon, color, child, tekst) {
    icon.className = "fas fa-exclamation-triangle";
    icon.style.color = color;
    parent.appendChild(icon)
    icon.appendChild(child);

    child.innerHTML = tekst;
    return icon;
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
// Tim - Afgekeurd - Afhankelijk van het type uren worden de uren van een "Uren" in database bij de totalen van de correcte variabelen toegevoegd
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
// Tim - Teaccorderen - Afhankelijk van het type uren worden de uren van een "Uren" in database bij de totalen van de correcte variabelen toegevoegd
function switchTotaalteaccorderenUren(traineelijst,typeUur){
    if(traineelijst.accordStatus == "TEACCORDEREN"){
        switch(typeUur){
            case "Gewerkte Uren": 
            //console.log("Check in Gewerkte uren: "+ traineelijst.aantal)
                teaccorderenGewerkteUren += traineelijst.aantal;
                teaccorderenTotaalUren += traineelijst.aantal; 
                return AantalGewerkteUren;
            case "Overuren 100%": 
                teaccorderenOver100Uren += traineelijst.aantal;
                teaccorderenTotaalUren += traineelijst.aantal;
            break
            case "Overuren 125%": 
                teaccorderenOver125Uren += traineelijst.aantal;
                teaccorderenTotaalUren += traineelijst.aantal;
            break
            case "Verlof Uren": 
                teaccorderenVerlofUren += traineelijst.aantal;
                teaccorderenTotaalUren += traineelijst.aantal;
            break
            case "Ziekte Uren": 
                teaccorderenZiekteUren += traineelijst.aantal;
                teaccorderenTotaalUren += traineelijst.aantal;
            break
        }
    }
}
// Tim - Teaccorderen - Afhankelijk van het type uren worden de uren van een "Uren" in database bij de totalen van de correcte variabelen toegevoegd
function switchTotaalKosten(traineelijst,typeKosten){
    if(traineelijst.status == "Opgeslagen" || traineelijst.status == "Uitbetaald"){
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
// Tim - Year Tabel - switch per uur
function switchYearUren(traineelijst,typeUur){
    console.log("SWTCH WORKS");
    if(traineelijst.accordStatus == "GOEDGEKEURD"){
        switch(typeUur){
            case "Gewerkte Uren": 
            //console.log("Check in Gewerkte uren: "+ traineelijst.aantal)
                YearGewerktUren += traineelijst.aantal;
                YearTotaalUren += traineelijst.aantal; 
                break
            case "Overuren 100%": 
                YearOver100Uren += traineelijst.aantal;
                YearTotaalUren += traineelijst.aantal;
                break
            case "Overuren 125%": 
                YearOver125Uren += traineelijst.aantal;
                YearTotaalUren += traineelijst.aantal;
                break
            case "Verlof Uren": 
                YearVerlofUren += traineelijst.aantal;
                YearTotaalUren += traineelijst.aantal;
                break
            case "Ziekte Uren": 
                YearZiekteUren += traineelijst.aantal;
                YearTotaalUren += traineelijst.aantal;
                break
        }
    }
}

// Tim - percentages rekenen
function percantagesGoegekeurdUren(){
    PercentageGewerkteUren = GoedgekeurdGewerkteUren/GoedgekeurdTotaalUren; 
    PercentageOver100Uren = GoedgekeurdOver100Uren/GoedgekeurdTotaalUren;
    PercentageOver125Uren = GoedgekeurdOver125Uren/GoedgekeurdTotaalUren;
    PercentageVerlofUren = GoedgekeurdVerlofUren/GoedgekeurdTotaalUren;
    PercentageZiekteUren = GoedgekeurdZiekteUren/GoedgekeurdTotaalUren;
}
// Tim - Year percentages rekenen
function yearPercentagesRekenen(){
    YearPercentageGewerkteUren = YearGewerktUren/YearTotaalUren;
    YearPercentageOver100Uren = YearOver100Uren/YearTotaalUren;
    YearPercentageOver125Uren = YearOver125Uren/YearTotaalUren;
    YearPercentageVerlofUren = YearVerlofUren/YearTotaalUren;
    YearPercentageZiekteUren = YearZiekteUren/YearTotaalUren;

    
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
    addHtmlElementContent(tr, document.createElement("td"), GoedgekeurdZiekteUren);
    return tr;
}
// Tim - Percentages Rij aanmaken
function adminPercentagesTableRow(traineelijst) {
    var tr = document.createElement("tr");
    addHtmlElementContent(tr, document.createElement("td"), "");
    addHtmlElementContent(tr, document.createElement("td"), "");
    //addHtmlElementContent(tr, document.createElement("td"), "Datum");

    // Tim - reken de percentage en geef maximaal 4 cijfers op het scherm
    PGewerkt = PercentageGewerkteUren * 100;
    weergevenGewerkt = JSON.stringify(PGewerkt);
        if(PGewerkt < 10){
            PercentageWeergevenGewerkt = weergevenGewerkt.substring(0,4) + "%";
        } else {
            PercentageWeergevenGewerkt = weergevenGewerkt.substring(0,5) + "%";
        }
        //console.log(PercentageWeergevenGewerkt + "PERCENTAGE DING");

        // Tim - geen uren = lege rij
        if(PercentageWeergevenGewerkt == "null%"){
            addHtmlElementContent(tr, document.createElement("td"), "");
            addHtmlElementContent(tr, document.createElement("td"), "");
            addHtmlElementContent(tr, document.createElement("td"), "");
            addHtmlElementContent(tr, document.createElement("td"), "");
            // addHtmlElementContent(tr, document.createElement("td"), "");
        }else{
        addHtmlElementContent(tr, document.createElement("td"), PercentageWeergevenGewerkt);
    //    
    POver = PercentageOver100Uren * 100;
    weergevenOver100 = JSON.stringify(POver);
        if(POver < 10){
            PercentageWeergevenOver100 = weergevenOver100.substring(0,4) + "%";
        } else {
            PercentageWeergevenOver100 = weergevenOver100.substring(0,5) + "%";
        }
    addHtmlElementContent(tr, document.createElement("td"), PercentageWeergevenOver100);
    //
    POver125 = PercentageOver125Uren *100;
    weergevenOver125 = JSON.stringify(POver125);
        if(POver125 < 10){
            PercentrageWeergevenOver125 = weergevenOver125.substring(0,4) + "%";
        } else {
            PercentrageWeergevenOver125 = weergevenOver125.substring(0,5) + "%";
        }
    addHtmlElementContent(tr, document.createElement("td"), PercentrageWeergevenOver125);
    //
    PVerlof = PercentageVerlofUren * 100;
    weergevenVerlof = JSON.stringify(PVerlof);
        if(PVerlof < 10){
            PercentrageWeergevenVerlof = weergevenVerlof.substring(0,4) + "%";
        } else {
            PercentrageWeergevenVerlof = weergevenVerlof.substring(0,5) + "%";
        }
    addHtmlElementContent(tr, document.createElement("td"), PercentrageWeergevenVerlof);
    //
    PZiekte = PercentageZiekteUren * 100;
    weergevenZiekte = JSON.stringify(PZiekte);
        if(PZiekte < 10){
            PercentrageWeergevenZiekte = weergevenZiekte.substring(0,4) + "%";
        } else {
            PercentrageWeergevenZiekte = weergevenZiekte.substring(0,5) + "%";
        }
    addHtmlElementContent(tr, document.createElement("td"), PercentrageWeergevenZiekte);
        }
    return tr;
}
// Tim - Year tabel percentages toevoegen
function PercentagesYearTableRow(traineelijst){
    var tr = document.createElement("tr");
    PGewerkt = YearPercentageGewerkteUren * 100;
    weergevenGewerkt = JSON.stringify(PGewerkt);
        if(PGewerkt < 10){
            PercentageWeergevenGewerkt = weergevenGewerkt.substring(0,4) + "%";
        } else {
            PercentageWeergevenGewerkt = weergevenGewerkt.substring(0,5) + "%";
        }
        // Tim - geen uren = lege rij
        if(PercentageWeergevenGewerkt == "null%"){
            addHtmlElementContent(tr, document.createElement("td"), "");
            addHtmlElementContent(tr, document.createElement("td"), "");
            addHtmlElementContent(tr, document.createElement("td"), "");
            addHtmlElementContent(tr, document.createElement("td"), "");
            addHtmlElementContent(tr, document.createElement("td"), "");
        }else{
    addHtmlElementContent(tr, document.createElement("td"), PercentageWeergevenGewerkt);

    POver = YearPercentageOver100Uren * 100;
    weergevenOver100 = JSON.stringify(POver);
        if(POver < 10){
            PercentageWeergevenOver100 = weergevenOver100.substring(0,4) + "%";
        } else {
            PercentageWeergevenOver100 = weergevenOver100.substring(0,5) + "%";
        }
    addHtmlElementContent(tr, document.createElement("td"), PercentageWeergevenOver100);

    POver125 = YearPercentageOver125Uren *100;
    weergevenOver125 = JSON.stringify(POver125);
        if(POver125 < 10){
            PercentrageWeergevenOver125 = weergevenOver125.substring(0,4) + "%";
        } else {
            PercentrageWeergevenOver125 = weergevenOver125.substring(0,5) + "%";
        }
    addHtmlElementContent(tr, document.createElement("td"), PercentrageWeergevenOver125);

    PVerlof = YearPercentageVerlofUren * 100;
    weergevenVerlof = JSON.stringify(PVerlof);
        if(PVerlof < 10){
            PercentrageWeergevenVerlof = weergevenVerlof.substring(0,4) + "%";
        } else {
            PercentrageWeergevenVerlof = weergevenVerlof.substring(0,5) + "%";
        }
    addHtmlElementContent(tr, document.createElement("td"), PercentrageWeergevenVerlof);

    PZiekte = YearPercentageZiekteUren * 100;
    weergevenZiekte = JSON.stringify(PZiekte);
        if(PZiekte < 10){
            PercentrageWeergevenZiekte = weergevenZiekte.substring(0,4) + "%";
        } else {
            PercentrageWeergevenZiekte = weergevenZiekte.substring(0,5) + "%";
        }
    addHtmlElementContent(tr, document.createElement("td"), PercentrageWeergevenZiekte);
        }

    //EMIEL - Elementen toevoegen om grafiek op te bouwen
    addChartElement(PGewerkt);
    addChartElement(POver);
    addChartElement(POver125);
    addChartElement(PVerlof);
    addChartElement(PZiekte);

    return tr;
    
}
// Tim - Afgekeurd Rij aanmaken
function adminUrentAfgekeurdTableRow(traineelijst) {
    var tr = document.createElement("tr");
    // <i class="fas fa-exclamation-triangle">
    var toDo = document.createElement("span");
    var color = "red"
    if(AfgekeurdTotaalUren>0){

    // var bla = toDo;
    addHtmlElementContentPlusAwesome(tr, toDo , color, document.createElement("td"), "Afgekeurd");
    }
    else{
     addHtmlElementContent(tr, document.createElement("td"), "Afgekeurd");
    }
    addHtmlElementContent(tr, document.createElement("td"), AfgekeurdTotaalUren);
    //addHtmlElementContent(tr, document.createElement("td"), "Datum");
    addHtmlElementContent(tr, document.createElement("td"), AfgekeurdGewerkteUren);
    addHtmlElementContent(tr, document.createElement("td"), AfgekeurdOver100Uren);
    addHtmlElementContent(tr, document.createElement("td"), AfgekeurdOver125Uren);
    addHtmlElementContent(tr, document.createElement("td"), AfgekeurdVerlofUren);
    addHtmlElementContent(tr, document.createElement("td"), AfgekeurdZiekteUren);
    return tr;
}
// Tim - Teaccorderen Rij aanmaken
function adminUrenteaccorderenTableRow(traineelijst) {
    var tr = document.createElement("tr");
    var toDo = document.createElement("span");
    var color = "orange"
    if(teaccorderenTotaalUren>0){        
    // var bla = toDo;
    addHtmlElementContentPlusAwesome(tr, toDo , color, document.createElement("td"), "Ingediend");
    }
    else{
    addHtmlElementContent(tr, document.createElement("td"), "Ingediend");
    }
    addHtmlElementContent(tr, document.createElement("td"), teaccorderenTotaalUren);
    //addHtmlElementContent(tr, document.createElement("td"), "Datum");
    addHtmlElementContent(tr, document.createElement("td"), teaccorderenGewerkteUren);
    addHtmlElementContent(tr, document.createElement("td"), teaccorderenOver100Uren);
    addHtmlElementContent(tr, document.createElement("td"), teaccorderenOver125Uren);
    addHtmlElementContent(tr, document.createElement("td"), teaccorderenVerlofUren);
    addHtmlElementContent(tr, document.createElement("td"), teaccorderenZiekteUren);
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
// Tim - Year tabel rij aanmaken
function YearTableRow(traineelijst){
    var tr = document.createElement("tr");
    addHtmlElementContent(tr, document.createElement("td"), YearGewerktUren);
    addHtmlElementContent(tr, document.createElement("td"), YearOver100Uren);
    addHtmlElementContent(tr, document.createElement("td"), YearOver125Uren);
    addHtmlElementContent(tr, document.createElement("td"), YearVerlofUren);
    addHtmlElementContent(tr, document.createElement("td"), YearZiekteUren);
    return tr;
}


// EMIEL - Grafiek opbouwen
var chartElements = new Array();
function addChartElement(yearPercentage){
    yearPercentage = Math.round(yearPercentage * 100) / 100;
    chartElements.push(yearPercentage);
    console.log("chartElements");
    
    console.log(chartElements);
    if(chartElements.length == 5){
        buildChart(chartElements);
    }
}
//YearPercentageGewerkteUren,YearPercentageOver100Uren,YearPercentageOver125Uren,YearPercentageVerlofUren,YearPercentageZiekteUren

function buildChart(chartElements){

var ctx = document.getElementById('myChart').getContext('2d');
console.log(YearPercentageGewerkteUren);
var chart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'pie',
    maintainAspectRatio: 'true',

    // The data for our dataset
    data: {
        labels: ['Gewerkt', 'Over 100%', 'Over 125%', 'Verlof', 'Ziekte'],
        datasets: [{
            // label: 'My First dataset',
            backgroundColor: [
                'rgba(0, 250, 0, 0.2)',
                'rgba(0, 0, 255, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(0, 255, 255, 0.2)',
                'rgba(255, 128, 64, 0.2)',
                
                
            ],
            borderColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
   
            ],
            
            data: chartElements
            
        }]//end datasets
    },//end data
    // Configuration options go here
    options: {
    }//end options

});//end chart
}//end buildChart




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
// Tim - empty teaccorderen variables before the loops start
function emptyTeaccorderen(){
    teaccorderenGewerkteUren = 0; 
    teaccorderenOver100Uren = 0;
    teaccorderenOver125Uren = 0;
    teaccorderenVerlofUren = 0;
    teaccorderenZiekteUren = 0;
    teaccorderenTotaalUren = 0;
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
// Tim - empty year tabel
function emptyYearUren(){
    YearGewerktUren = 0;
    YearOver100Uren = 0;
    YearOver125Uren = 0;
    YearVerlofUren = 0;
    YearZiekteUren = 0;
    YearTotaalUren = 0;
}
