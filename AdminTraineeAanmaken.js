var api = "http://localhost:8082/api/trainee";


function traineeFields(){
//   console.log(document.getElementById("apiUrl").value);
  var voornaam = document.getElementById("voornaamTrainee").value;
  var achternaam = document.getElementById("achternaamTrainee").value;
  var username = document.getElementById("usernameTrainee").value;
  var wachtwoord = document.getElementById("wachtwoordTrainee").value;
  var loon = document.getElementById("loonTrainee").value;
  var trainee = {}
    trainee.voornaam = voornaam;
    trainee.achternaam = achternaam;
    trainee.username = username; 
    trainee.wachtwoord = wachtwoord;
    trainee.loon = loon;
    trainee.uren = new Array(); 
    return trainee;
}

function UserVersturen(){
					
    trainee = traineeFields();
    console.log(trainee + "trainee");
    postData(JSON.stringify(trainee));
      
}
//POST
function postData(data){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
        console.log(this.responseText);
        document.getElementById("demo").innerHTML = this.responseText;
        }
    };
    xhttp.open("POST", api, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(data);
}

