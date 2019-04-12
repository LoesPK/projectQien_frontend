var api = "http://localhost:8082/api/";



// HIER MOET NOG EEN DROPDOWN VAN GEMAAKT EN INGEVOERD WORDEN
// // EMIEL - Opbouwen vd pagina en zn onderdelen
// function setPage(){
//     var arr = ["Gewerkte Uren", "Overuren 100%", "Overuren 125%", "Verlof Uren", "Ziekte Uren"];
// 	var klantTrainee = document.createElement("select");
// 	for(var i = 0; i<arr.length; i++){
// 		var option = document.createElement("OPTION"),
// 		txt = document.createTextNode(arr[i]);
//         option.appendChild(txt);
//     }
//     var elm1 = document.getElementById("klantTrainee");
//     elm1.appendChild(klantTrainee);
// }

// EMIEL - Afhankelijk van het type user, roep specifieke functies aan die de user maakt
function UserVersturen(user){
	if(user == "trainee"){		
        trainee = traineeFields();
        console.log(trainee + "trainee");
        postData(JSON.stringify(trainee),"trainee");
            }
    if (user == "klant") {
        klant = klantFields();
        console.log(klant + "klant");
        postData(JSON.stringify(klant),"klant");
    }
   
}




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
    // trainee.uren = new Array(); 
    // trainee.klant = new Array();
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
      var trainee = document.getElementById("traineeKlant").value;
      var klant = {}
        klant.voornaam = voornaam;
        klant.achternaam = achternaam;
        klant.emailadres = emailadres;
        klant.username = username; 
        klant.wachtwoord = wachtwoord;
        klant.bedrijf = bedrijf;
        klant.trainee = new Array(); 
        return klant;
    }

//POST user
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

