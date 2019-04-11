var api = "http://localhost:8082/api/trainee";


function traineeFields(){
  console.log(document.getElementById("apiUrl").value);
  var voornaam = document.getElementById("voornaam").value;
  var achternaam = document.getElementById("achternaam").value;
  var username = document.getElementById("username").value;
  var wachtwoord = document.getElementById("wachtwoord").value;
  var loon = document.getElementById("loon").value;
  var type = document.getElementById("type").value;
  var trainee = {}
    trainee.voornaam = voornaam;
    trainee.achternaam = achternaam;
    trainee.username = username; 
    trainee.wachtwoord = wachtwoord;
    trainee.loon = loon;
    trainee.type = type;
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
        if (this.readyState == 4 && this.status == 202) {
        console.log(this.responseText);
        document.getElementById("demo").innerHTML = this.responseText;
        }
    };
    xhttp.open("POST", api, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(data);
}

