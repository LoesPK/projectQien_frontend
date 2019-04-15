var api = "http://localhost:8082/api/";

// EMIEL - Array waar klant objecten in gezet worden
var arr = new Array();


// EMIEL - Opbouwen vd pagina en zn onderdelen
function setPage(){
    //dropdown klanten bij trainee
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
                   
                    arr.push(klant[i]);
                }//end for
		}//end 1e if
	}//end http function;
      xhttp.open("GET", api + user, true);
	    xhttp.setRequestHeader("Content-type", "application/json");
	    xhttp.send();	
}//end updateDropdownKlanten

// EMIEL - Afhankelijk van het type user, roep specifieke functies aan die de fields vd user invult
// Vervolgens wordt een POST-functie van de user aangeroepen
function UserVersturen(user){
	if(user == "trainee"){		
        trainee = traineeFields();
        
        var nietPosten = 0;
        Object.keys(trainee).forEach(function(key){
// console.log(key)
// console.log(trainee[key])
            if(trainee[key].length == 0 || trainee[key][0] == " "){
                nietPosten++;
                console.log("Check userVersturen")
                if(confirm("Het veld " + key + " is mogelijk niet correct ingevuld. Vul iets in en let op dat er geen spaties voor staan. Klik op annuleren om te wijzigen of op ok om door te gaan.")){
                    nietPosten--;
                }else{
                }//end ifelse
            }//end if
        })//end forEach

        if(nietPosten == 0){
            
           
 /////////////////////////////// Nog werkend maken dat een JSON klant wordt toegevoegd.  
        var klant = document.getElementById("klantTrainee").value;
        
        getKlant(trainee, klant);
        // console.log(getKlant(klant));
        // console.log(trainee)
        // console.log("Check trainee klant: "+trainee.klant)
    



        //     postData(JSON.stringify(trainee),"trainee");
        //    if(!alert("Trainee "+trainee.voornaam + " "+ trainee.achternaam + " is aangemaakt!")){
        //    //window.location.reload();
        //    }//end if
        }//end if
    }//end if

    if (user == "klant") {
        klant = klantFields();
        var nietPosten = 0;
        
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
  //var klant = document.getElementById("klantTrainee").value;
  var trainee = {}
    trainee.voornaam = voornaam;
    trainee.achternaam = achternaam;
    trainee.emailadres = emailadres;
    trainee.username = username; 
    trainee.wachtwoord = wachtwoord;

    return trainee;
    //UserVersturen(trainee);
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


// EMIEL - GET een specifieke klant
function getKlant(trainee, bedrijf){
    var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
                    databaseKlant = JSON.parse(this.responseText);
                    console.log("Check in getKlant");
                    console.log(databaseKlant);
                    
                    for(i=0; i<databaseKlant.length; i++){
                        console.log("Check getKlant" + databaseKlant.length)
                        if(databaseKlant[i].bedrijf == bedrijf){
                            var id = databaseKlant[i].id;
                            console.log("for loop id in getKlant: " + id)
                            console.log(databaseKlant[i]);
                                var klantID = databaseKlant[i].id;
                                console.log(klantID);
                                var klanten = new Array();
                                klanten.push(databaseKlant[i])
                                trainee.klant = klanten;
                                
                                postData(JSON.stringify(trainee),"trainee", klantID);
                                
                                if(!alert("Trainee "+trainee.voornaam + " "+ trainee.achternaam + " is aangemaakt!")){
                                //window.location.reload();
                                }//end if
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
        console.log("check in postData")
        console.log(this.status)
        if (this.readyState == 4 && this.status == 200) {
            console.log("Check3")
            if(typeUser == "trainee"){
                var trainee = JSON.parse(this.responseText);
                console.log("trainee.klant.id "+klantID)
                putData(klantID, trainee, "klant");

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

            trainees.push(data);

            klant.trainee = trainees;

    xhttp.onreadystatechange = function() {
       
        if (this.readyState == 4 && this.status == 200) {
            
            console.log("Check3")
        console.log(JSON.parse(this.responseText));
        }
    };
    xhttp.open("PUT", api + typeUser + "/" + id, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(klant));
}


