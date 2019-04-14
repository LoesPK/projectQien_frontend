var api = "http://localhost:8082/api/";

//array waar bedrijven in gezet worden
var arr = new Array();

// EMIEL - Opbouwen vd pagina en zn onderdelen
function setPage(){
    //dropdown klanten bij trainee
    getData("klant");
}

// EMIEL - GET Klant: Het ophalen van alle klanten in de datbase en die invullen in een dropdown menu
function getData(user){
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

                    arr.push(klant[i].bedrijf);
                }//end for
		}//end 1e if
	}//end http function;
      xhttp.open("GET", api + user, true);
	    xhttp.setRequestHeader("Content-type", "application/json");
	    xhttp.send();	
}//end GETTrainee





// EMIEL - Afhankelijk van het type user, roep specifieke functies aan die de fields vd user invult
// Vervolgens wordt een POST-functie van de user aangeroepen
function UserVersturen(user){
	if(user == "trainee"){		
        trainee = traineeFields();
        var nietPosten = 0;
        Object.keys(trainee).forEach(function(key){
// console.log(key)
// console.log(trainee[key])
// console.log(trainee[key].length)
// console.log(trainee[key][0])
            if(trainee[key].length == 0 || trainee[key][0] == " "){
                nietPosten++;
                if(confirm("Het veld " + key + " is mogelijk niet correct ingevuld. Vul iets in en let op dat er geen spaties voor staan. Klik op annuleren om te wijzigen of op ok om door te gaan.")){
                    nietPosten--;
                }else{
                }//end ifelse
            }//end if
        })//end forEach

        if(nietPosten == 0){
        postData(JSON.stringify(trainee),"trainee");
            if(!alert("Trainee "+trainee.voornaam + " "+ trainee.achternaam + " is aangemaakt!")){
             window.location.reload();
            }//end if
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
        postData(JSON.stringify(klant),"klant");
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
    // trainee.klant = ;
    
    return trainee;
}

function isEmpty(field, fieldValue){
    var regex = new RegExp("^[a-zA-Z]+$");
    if(fieldValue == regex){
    return field;}
    else{
        return "-";
    }
}

// Vul fields van de klant in met de ingevoerde velden
function klantFields(){
      var voornaam = document.getElementById("voornaamKlant").value;
      var achternaam = document.getElementById("achternaamKlant").value;
      var emailadres = document.getElementById("emailadresKlant").value;
      var bedrijf = document.getElementById("bedrijfKlant").value;
      var username = document.getElementById("usernameKlant").value;
      var wachtwoord = document.getElementById("wachtwoordKlant").value;
//     var trainee = document.getElementById("traineeKlant").value;
      var klant = {}
        klant.voornaam = voornaam;
        klant.achternaam = achternaam;
        klant.emailadres = emailadres;
        klant.username = username; 
        klant.wachtwoord = wachtwoord;
        klant.bedrijf = bedrijf;
        return klant;
    }

//EMIEL - POST user. Afhankelijk van het type user worden de waarden van de juiste fields in de database aangemaakt en ingevuld
function postData(data, typeUser){
    console.log("data: " + data);
    console.log("typeUser: " + typeUser);
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
        console.log(JSON.parse(this.responseText));
        }
    };
    xhttp.open("POST", api + typeUser, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(data);
}

