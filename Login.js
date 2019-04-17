var apiGetLogin = "http://localhost:8082/api/login";
//was xmlhttp

function userLogin(){
  var UserName = document.getElementById("gebruikersnaam").value; // pak hiervan eerst de username, daarna het ww (todo nog)
  var UserPassword = document.getElementById("wachtwoord").value;

  var currentUser = {};
  currentUser.username = UserName;
  currentUser.wachtwoord = UserPassword;
  POSTTrainee(currentUser);

} 

//POST
function POSTTrainee(currentUser){
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var user = JSON.parse(this.responseText);
      console.log(user);
      sessionStorage.setItem("storedUserID", user.id);
      console.log(user.id);
      // window.location.href = 'KlantHomepage.html';
      window.location.href = 'TraineeUrenoverzicht.html';
    }
  };
  xhttp.open("POST", apiGetLogin, true);
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.send(JSON.stringify(currentUser));
}


