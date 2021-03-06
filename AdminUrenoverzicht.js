var apiUserId = "http://localhost:8082/api/trainee/"; //+sessionStorage.getItem("storedUserID");

//trainee variabele 
var trainee;

// EMIEL - de geselecteerde maand

// EMIEL - de maand van het uur in database
var uurInDBHemZeMonth;

// Tim - de jaar 
var uurInDBHemZeYear;

var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //As January is 0.
    var yyyy = today.getFullYear();
    if(dd<10) dd='0'+dd;
    if(mm<10) mm='0'+mm;
    today = yyyy+'-'+mm+'-'+dd ;

var theMonth = setCurrentMonth();


function setCurrentMonth(){
    
    console.log(mm);
    var month = document.getElementById("selectedMonth");
    month.value = mm;
}

// Tim - de geselecteerde jaar
var theYear = yyyy;
console.log(theYear + " theYear");

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

// Tim - Variabelen aanmaken om de totale teaccorderen uren in bij elkaar op te tellen
var teaccorderenGewerkteUren = 0; 
var teaccorderenOver100Uren = 0;
var teaccorderenOver125Uren = 0;
var teaccorderenVerlofUren = 0;
var teaccorderenZiekteUren = 0;
var teaccorderenTotaalUren = 0;

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

// Tim - per trainee - Teaccorderen uren
var Teaccorderenpertraineestatus;
var Teaccorderenpertraineetotaal = 0;
var Teaccorderenpertraineedagen = 0;
var TeaccorderenpertraineeGewerkteUren = 0; 
var TeaccorderenpertraineeOver100Uren = 0;
var TeaccorderenpertraineeOver125Uren = 0;
var TeaccorderenpertraineeVerlofUren = 0;
var TeaccorderenpertraineeZiekteUren = 0;
var TeaccorderenpertraineeTotaalUren = 0;

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

// Tim - De maand selecteren
function selectMonth(){
	var tableBody = document.getElementById("selectedMonth");
		theMonth = tableBody[tableBody.selectedIndex].value;
        //console.log("theMonth: " + theMonth);
		GETUrenPerMaand(theMonth);
}
//Tim - De jaar selecteren
function selectYear(){
    var tablebodyYear = document.getElementById("selectedYear");
    theYear = tablebodyYear[tablebodyYear.selectedIndex].value;
    console.log(theYear + "SELECT YEAR");
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
            emptyTeaccorderen();


            // Tim - Per Trainee loop
            for(var i = 0; i < trainee.length; i++){
                console.log(trainee[i].voornaam);
                // Tim - empty variables per trainee before loops begin
                emptyPerTraineeGoedgekeurdVariables();
                emptyPerTraineeAfgekeurdVariables();
                emptyPerTraineeTeaccorderenVariables();

                klant = trainee[i].klant.bedrijf;
                voornaam = trainee[i].voornaam;
                achternaam = trainee[i].achternaam;
 

                // Tim - Per Uur loop
                for(var k = 0; k < trainee[i].uren.length; k++){
                    //console.log("PER UUR VAN DE TRAINEE");
                    //console.log(trainee[i].uren[k].accordStatus);
                    uurInDBHemZeMonth = trainee[i].uren[k].factuurDatum.substring(5,7);
                    uurInDBHemZeYear = trainee[i].uren[k].factuurDatum.substring(0,4);

                        // Tim - vergekijk maand en jaar
                        if(uurInDBHemZeMonth == theMonth && uurInDBHemZeYear == theYear) {
                            // console.log(trainee[i].voornaam + " IF ITS THE RIGHT MONTH");
                            // Tim - Totaal tabel variables pakken
                            switchTotaalUren(trainee[i].uren[k],trainee[i].uren[k].waarde);
                            switchTotaalGoegekeurdUren(trainee[i].uren[k],trainee[i].uren[k].waarde);
                            switchTotaalAfgekeurdeUren(trainee[i].uren[k],trainee[i].uren[k].waarde);
                            switchTotaalteaccorderenUren(trainee[i].uren[k],trainee[i].uren[k].waarde);

                            // Tim - Per Trainee tabel variables pakken
                            switch(trainee[i].uren[k].accordStatus){
                                case "GOEDGEKEURD": 
                                switchPerTraineeGoedgekeurdUren(trainee[i].uren[k],trainee[i].uren[k].waarde);
                                case "AFGEKEURD":
                                switchPerTraineeAfgekeurdUren(trainee[i].uren[k],trainee[i].uren[k].waarde);
                                case "TEACCORDEREN":
                                switchPerTraineeTeaccorderenUren(trainee[i].uren[k],trainee[i].uren[k].waarde);
                                
                            }//end switch
                        }//end if
                }//end for
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
                // Tim - als de trainee teaccorderen uren heeft dan zet ie het in de tabel
                if(TeaccorderenpertraineeTotaalUren > 0){
                    //console.log("TEACCORDEREN");
                    addHtmlElement(pertraineetbody,PerTraineeTeaccorderenTableRow(trainee));
                }
                //console.log(GoedgekeurdpertraineeTotaalUren + " GoedgekeurdpertraineeTotaalUren");
                //console.log(AfgekeurdpertraineeTotaalUren + " AfgekeurdpertraineeTotaalUren");
                //console.log(TeaccorderenpertraineeTotaalUren + " TeaccorderenpertraineeTotaalUren");


                //Tim - als de trainee geen uren heeft ingediend
                if(TeaccorderenpertraineeTotaalUren == 0 && AfgekeurdpertraineeTotaalUren == 0 && GoedgekeurdpertraineeTotaalUren == 0){
                    //console.log("NIKS INGEDIEND");
                    addHtmlElement(pertraineetbody,PerTraineeNietingediendTableRow(trainee));
                }
            }
            //Tim - Totaal table - Opbouwen van de body van de tabel
            //addHtmlElement(tbody, adminUrenTotaalTableRow(trainee));
            addHtmlElement(tbody, adminUrentGoedgekeurdTableRow(trainee));
            addHtmlElement(tbody, adminUrentAfgekeurdTableRow(trainee));
            addHtmlElement(tbody, adminUrenteaccorderenTableRow(trainee));
        }
        sortTable(1);
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
// Tim - per trainee - Goedgekeurd uren - Afhankelijk van het type uren worden de uren van een "Uren" in database bij de totalen van de correcte variabelen toegevoegd
function switchPerTraineeGoedgekeurdUren(traineelijst,typeUur){
    if(traineelijst.accordStatus == "GOEDGEKEURD"){
    //console.log("PER GOEDGEKEURD");
    Goedgekeurdpertraineestatus = "Goedgekeurd";

        switch(typeUur){
            case "Gewerkte Uren": 
                GoedgekeurdpertraineeGewerkteUren += traineelijst.aantal;
                GoedgekeurdpertraineeTotaalUren += traineelijst.aantal; 
                return AantalGewerkteUren; // break
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
// Tim - per trainee - teaccorderen uren - Afhankelijk van het type uren worden de uren van een "Uren" in database bij de totalen van de correcte variabelen toegevoegd
function switchPerTraineeTeaccorderenUren(traineelijst,typeUur){
    if(traineelijst.accordStatus == "TEACCORDEREN"){
    //console.log("PER INGEDIEND");
    Teaccorderenpertraineestatus = "Ingediend";

        switch(typeUur){
            case "Gewerkte Uren": 
                TeaccorderenpertraineeGewerkteUren += traineelijst.aantal;
                TeaccorderenpertraineeTotaalUren += traineelijst.aantal; 
                return AantalGewerkteUren;
            case "Overuren 100%": 
                TeaccorderenpertraineeOver100Uren += traineelijst.aantal;
                TeaccorderenpertraineeTotaalUren += traineelijst.aantal;
            break
            case "Overuren 125%": 
                TeaccorderenpertraineeOver125Uren += traineelijst.aantal;
                TeaccorderenpertraineeTotaalUren += traineelijst.aantal;
            break
            case "Verlof Uren": 
                TeaccorderenpertraineeVerlofUren += traineelijst.aantal;
                TeaccorderenpertraineeTotaalUren += traineelijst.aantal;
            break
            case "Ziekte Uren": 
                TeaccorderenpertraineeZiekteUren += traineelijst.aantal;
                TeaccorderenpertraineeTotaalUren += traineelijst.aantal;
            break
        }
        //console.log(AfgekeurdpertraineeTotaalUren);
    }
}
// Tim - per trainee - Nietingediend uren - Afhankelijk van het type uren worden de uren van een "Uren" in database bij de totalen van de correcte variabelen toegevoegd
function switchPerTraineeNietingediendUren(traineelijst,typeUur){
    if(traineelijst.accordStatus == "NIETINGEDIEND"){
    //console.log("PER NIETINGEDIEND");
    Teaccorderenpertraineestatus = "-";

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
        //console.log(AfgekeurdpertraineeTotaalUren);
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
    addHtmlElementContent(tr, document.createElement("td"), AfgekeurdZiekteUren);
    return tr;
}
// Tim - Teaccorderen Rij aanmaken
function adminUrenteaccorderenTableRow(traineelijst) {
    var tr = document.createElement("tr");

     addHtmlElementContent(tr, document.createElement("td"), "Ingediend");
    addHtmlElementContent(tr, document.createElement("td"), teaccorderenTotaalUren);
    //addHtmlElementContent(tr, document.createElement("td"), "Datum");
    addHtmlElementContent(tr, document.createElement("td"), teaccorderenGewerkteUren);
    addHtmlElementContent(tr, document.createElement("td"), teaccorderenOver100Uren);
    addHtmlElementContent(tr, document.createElement("td"), teaccorderenOver125Uren);
    addHtmlElementContent(tr, document.createElement("td"), teaccorderenVerlofUren);
    addHtmlElementContent(tr, document.createElement("td"), teaccorderenZiekteUren);
    return tr;
}
// Tim - Per Trainee - goedgekeurde uren rij aanmaken
function PerTraineeGoedgekeurdTableRow(traineelijst) {
    console.log("hoi")
    console.log(traineelijst)
    var tr = document.createElement("tr");
    addHtmlElementContent(tr, document.createElement("td"), klant);
    addHtmlElementContent(tr, document.createElement("td"), voornaam);
    addHtmlElementContent(tr, document.createElement("td"), achternaam);
    addHtmlElementContent(tr, document.createElement("td"), Goedgekeurdpertraineestatus);
    addHtmlElementContent(tr, document.createElement("td"), GoedgekeurdpertraineeTotaalUren);
    addHtmlElementContent(tr, document.createElement("td"), GoedgekeurdpertraineeGewerkteUren);
    addHtmlElementContent(tr, document.createElement("td"), GoedgekeurdpertraineeOver100Uren);
    addHtmlElementContent(tr, document.createElement("td"), GoedgekeurdpertraineeOver125Uren);
    addHtmlElementContent(tr, document.createElement("td"), GoedgekeurdpertraineeVerlofUren);
    addHtmlElementContent(tr, document.createElement("td"), GoedgekeurdpertraineeZiekteUren);
    return tr;
}
// Tim - Per Trainee - afgekeurde uren rij aanmaken
function PerTraineeAfgekeurdTableRow(traineelijst) {
    var tr = document.createElement("tr");
    var toDo = document.createElement("span");
    if(AfgekeurdpertraineeTotaalUren>0){        
    // var bla = toDo;
    addHtmlElementContentPlusAwesome(tr, toDo , document.createElement("td"), klant);
    }
    else{
     addHtmlElementContent(tr, document.createElement("td"), klant);
    }


    
    addHtmlElementContent(tr, document.createElement("td"), voornaam);
    addHtmlElementContent(tr, document.createElement("td"), achternaam);
    addHtmlElementContent(tr, document.createElement("td"), Afgekeurdpertraineestatus);
    addHtmlElementContent(tr, document.createElement("td"), AfgekeurdpertraineeTotaalUren);
    addHtmlElementContent(tr, document.createElement("td"), AfgekeurdpertraineeGewerkteUren);
    addHtmlElementContent(tr, document.createElement("td"), AfgekeurdpertraineeOver100Uren);
    addHtmlElementContent(tr, document.createElement("td"), AfgekeurdpertraineeOver125Uren);
    addHtmlElementContent(tr, document.createElement("td"), AfgekeurdpertraineeVerlofUren);
    addHtmlElementContent(tr, document.createElement("td"), AfgekeurdpertraineeZiekteUren);
    return tr;
}
// Tim - Per Trainee - afgekeurde uren rij aanmaken
function PerTraineeTeaccorderenTableRow(traineelijst) {
    var tr = document.createElement("tr");
    var toDo = document.createElement("span");
    if(TeaccorderenpertraineeTotaalUren>0){        
    // var bla = toDo;
    addHtmlElementContentPlusAwesome(tr, toDo , document.createElement("td"), klant);
    }
    else{
     addHtmlElementContent(tr, document.createElement("td"), klant);
    }


    addHtmlElementContent(tr, document.createElement("td"), voornaam);
    addHtmlElementContent(tr, document.createElement("td"), achternaam);

    addHtmlElementContent(tr, document.createElement("td"), Teaccorderenpertraineestatus);
    addHtmlElementContent(tr, document.createElement("td"), TeaccorderenpertraineeTotaalUren);
    addHtmlElementContent(tr, document.createElement("td"), TeaccorderenpertraineeGewerkteUren);
    addHtmlElementContent(tr, document.createElement("td"), TeaccorderenpertraineeOver100Uren);
    addHtmlElementContent(tr, document.createElement("td"), TeaccorderenpertraineeOver125Uren);
    addHtmlElementContent(tr, document.createElement("td"), TeaccorderenpertraineeVerlofUren);
    addHtmlElementContent(tr, document.createElement("td"), TeaccorderenpertraineeZiekteUren);
    return tr;
}
// Tim - Per Trainee - afgekeurde uren rij aanmaken
function PerTraineeNietingediendTableRow(traineelijst) {
    var tr = document.createElement("tr");
    addHtmlElementContent(tr, document.createElement("td"), klant);
    addHtmlElementContent(tr, document.createElement("td"), voornaam);
    addHtmlElementContent(tr, document.createElement("td"), achternaam);
    addHtmlElementContent(tr, document.createElement("td"), Nietingediendpertraineestatus);
    addHtmlElementContent(tr, document.createElement("td"), NietingediendpertraineeTotaalUren);
    addHtmlElementContent(tr, document.createElement("td"), NietingediendpertraineeGewerkteUren);
    addHtmlElementContent(tr, document.createElement("td"), NietingediendpertraineeOver100Uren);
    addHtmlElementContent(tr, document.createElement("td"), NietingediendpertraineeOver125Uren);
    addHtmlElementContent(tr, document.createElement("td"), NietingediendpertraineeVerlofUren);
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
// Tim - empty - per trainee - teaccorderen
function emptyPerTraineeTeaccorderenVariables(){
    //console.log("Empty variables INGEDIEND");
    Teaccorderenpertraineestatus;
    Teaccorderenpertraineetotaal = 0;
    Teaccorderenpertraineedagen = 0;
    TeaccorderenpertraineeGewerkteUren = 0; 
    TeaccorderenpertraineeOver100Uren = 0;
    TeaccorderenpertraineeOver125Uren = 0;
    TeaccorderenpertraineeVerlofUren = 0;
    TeaccorderenpertraineeZiekteUren = 0;
    TeaccorderenpertraineeTotaalUren = 0;
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
  var table = document.getElementById("pertraineeUren"); // table wordt niet aangeroepen?
  var rows = document.querySelectorAll(".pertraineeUren tr");
    // console.log(rows);
    for (var i = 0; i < rows.length; i++) {
    var row = [], cols = rows[i].querySelectorAll("td, th");
    
        for (var j = 0; j < cols.length; j++) {
            row.push(cols[j].innerText);
            // console.log(cols[j].innerText);  
        }
    csv.push(row.join(","));    
  }
    // Download CSV
    download_csv(csv.join("\n"), filename);
}

// Jordi: is dit deel echt nodig? als je het weghaalt lijkt de export nog steeds te werken...
// document.querySelector("#exporting").addEventListener("click", function () {
//     var html = document.querySelector(".pertraineeUren").outerHTML;
//     // console.log(html);
//   export_table_to_csv(html, "table.csv");
// });


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

function addHtmlElementContentPlusAwesome(parent, icon, child, tekst) {
    icon.className = "fas fa-exclamation-triangle";
    parent.appendChild(icon)
    icon.appendChild(child);
    child.style.color="red";
    // child.className = "fas fa-exclamation-triangle";
    child.innerHTML = tekst;
    // child.style.fontFamily = "Roboto"
    return child;
}