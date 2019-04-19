var api = "http://localhost:8082/api/";

// // EMIEL - Array waar klant objecten in gezet worden
// var arr = new Array();


// EMIEL - Opbouwen vd pagina en zn onderdelen
function setPage(){
    updateDropdownKlanten("klant");
}

// EMIEL - GET Klant: Het ophalen van alle klanten in de datbase en die invullen in een dropdown menu
function updateDropdownKlanten(user){
  var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
				klant = JSON.parse(this.responseText);	
                var elm1 = document.getElementById("klantTrainee");
                for(i=0; i<klant.length; i++){

                    var option = document.createElement("OPTION"),
                    txt = document.createTextNode(klant[i].bedrijf);
                    option.appendChild(txt);
                    elm1.insertBefore(option,elm1.lastchild);
                   
                    // arr.push(klant[i]);
                }//end for
		}//end 1e if
	}//end http function;
      xhttp.open("GET", api + user, true);
	    xhttp.setRequestHeader("Content-type", "application/json");
	    xhttp.send();	
}//end updateDropdownKlanten

// EMIEL - Afhankelijk van het type user, roep specifieke functies aan die de fields vd user invult
function UserVersturen(user){
    // Voor de trainee wordt een getKlant functie aangeroepen, waaruit eerst nog een specifieke klant geselecteerd wordt.
    if(user == "trainee"){		
        trainee = traineeFields();

        var nietPosten = 0;

        //Een check op lege velden of spaties voor het ingevoerde. Er wordt een bericht gegeven; de admin kan bepalen 
        // of het veld leeg gelaten wordt door te accepteren, of kan door te annuleren nog een wijziging aanbrengen.
        Object.keys(trainee).forEach(function(key){
            if(trainee[key].length == 0 || trainee[key][0] == " "){
                nietPosten++;
//                console.log("Check userVersturen")
                if(confirm("Het veld " + key + " is mogelijk niet correct ingevuld. Vul iets in en let op dat er geen spaties voor staan. Klik op annuleren om te wijzigen of op ok om door te gaan.")){
                    nietPosten--;
                }else{
                }//end ifelse
            }//end if
        })//end forEach

        if(nietPosten == 0){
            var klant = document.getElementById("klantTrainee").value;
            getKlant(trainee, klant);
        }//end if
    }//end if

    // Voor de klant wordt een POST-functie aangeroepen en de klant wordt aangemaakt
    if (user == "klant") {
        klant = klantFields();
        var nietPosten = 0;
        
        //Een check op lege velden of spaties voor het ingevoerde. Er wordt een bericht gegeven; de admin kan bepalen 
        // of het veld leeg gelaten wordt door te accepteren, of kan door te annuleren nog een wijziging aanbrengen.
        Object.keys(klant).forEach(function(key){
            if(klant[key].length == 0 || klant[key][0] == " "){
                nietPosten++;
                if(confirm("Het veld " + key + " is mogelijk niet correct ingevuld. Vul iets in en let op dat er geen spaties voor staan. Klik op annuleren om te wijzigen of op ok om door te gaan.")){
                    nietPosten--;
                }else{
                }//end ifelse
            }//end if
        })//end forEach

        if(nietPosten == 0){
            postData(JSON.stringify(klant),"klant","nietGebruikteKlantID");
            if(!alert("Klant "+klant.voornaam + " "+ klant.achternaam + " bij "+ klant.bedrijf + " is aangemaakt!")){
                window.location.reload();
            }//end if
        }//end if
    }//end if   
}//end function UserVersturen(user)


// Vul fields van trainee in met de ingevoerde velden
function traineeFields(){
  var voornaam = document.getElementById("voornaamTrainee").value;
  var achternaam = document.getElementById("achternaamTrainee").value;
  var emailadres = document.getElementById("emailadresTrainee").value;
  var username = document.getElementById("usernameTrainee").value;
  var wachtwoord = document.getElementById("wachtwoordTrainee").value; 
  
  var trainee = {}
    trainee.voornaam = voornaam;
    trainee.achternaam = achternaam;
    trainee.emailadres = emailadres;
    trainee.username = username; 
    trainee.wachtwoord = wachtwoord;
    
    return trainee;
}

// Vul fields van de klant in met de ingevoerde velden
function klantFields(){
      var voornaam = document.getElementById("voornaamKlant").value;
      var achternaam = document.getElementById("achternaamKlant").value;
      var emailadres = document.getElementById("emailadresKlant").value;
      var bedrijf = document.getElementById("bedrijfKlant").value;
      var username = document.getElementById("usernameKlant").value;
      var wachtwoord = document.getElementById("wachtwoordKlant").value;
      
      var klant = {}
        klant.voornaam = voornaam;
        klant.achternaam = achternaam;
        klant.emailadres = emailadres;
        klant.username = username; 
        klant.wachtwoord = wachtwoord;
        klant.bedrijf = bedrijf;
        return klant;
    }


// EMIEL - GET een specifieke klant die geselecteerd is in het drop down menu
function getKlant(trainee, bedrijf){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
       
        if (this.readyState == 4 && this.status == 200) {
            databaseKlant = JSON.parse(this.responseText);
            
            // Zoekt de database na op een klant die het geselecteerde bedrijf heeft. 
            for(i=0; i<databaseKlant.length; i++){
//              console.log("Check getKlant" + databaseKlant.length)
                if(databaseKlant[i].bedrijf == bedrijf){
//                    console.log("for loop id in getKlant: " + id)
//                    console.log(databaseKlant[i]);
                        var klantID = databaseKlant[i].id;
//                        console.log(klantID);
                        trainee.klant = databaseKlant[i];
//                        console.log(" De trainee m et de klant")
//                        console.log(trainee);                                
                        postData(JSON.stringify(trainee),"trainee", klantID);
                        
                    //     if(!alert("Trainee "+trainee.voornaam + " "+ trainee.achternaam + " is aangemaakt!")){
                    //    // window.location.reload();
                    //     }//end if
                    }//end if
            }//end for    
        }//end 1e if
    }//end http function;

    xhttp.open("GET", api + "klant", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send();	
    }//end GET





//EMIEL - POST user. Afhankelijk van het type user worden de waarden van de juiste fields in de database aangemaakt en ingevuld
function postData(data, typeUser, klantID){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
//      console.log("check in postData")
//      console.log(this.status)
        if (this.readyState == 4 && this.status == 200) {
//            console.log("Check3")
            if(typeUser == "trainee"){
                var trainee = JSON.parse(this.responseText);
//                console.log(" XXXXXXXX")
//                console.log("trainee.klant.id "+klantID)
//                console.log(trainee);    
                putData(klantID, JSON.stringify(trainee), "klant");
            }
        }
    };
    xhttp.open("POST", api + typeUser, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(data);
}

//EMIEL - PUT user. Afhankelijk van het type user worden de waarden van de juiste fields in de database aangemaakt en ingevuld
function putData(id, data,typeUser){
    var xhttp = new XMLHttpRequest();
    var klant = {};
        var trainees = new Array();
        trainees.push(JSON.parse(data));
//            console.log(JSON.parse(data))
//            console.log(trainees);
        klant.id = id;
        klant.trainee = trainees;
//            console.log(klant)
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                if(!alert("Trainee "+trainee.voornaam + " "+ trainee.achternaam + " is aangemaakt!")){
                     window.location.reload();
                }
                     
//        console.log("Check3")
//        console.log(JSON.parse(this.responseText));
        }
    };
//  console.log(api + typeUser + "/" + id);
//  console.log("Data")
//  console.log(data);
//  console.log("Klantobject ");
//  console.log(klant);
//  console.log(" Als TEKST")
//  console.log(JSON.stringify(klant));
    xhttp.open("PUT", api + typeUser + "/" + id, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(klant));
}


