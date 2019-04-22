var api = "http://localhost:8082/api/"

function createAdmin(){
    console.log("je maakt een admin");
    var admin = {};
    admin.voornaam = document.getElementById("voornaamAdmin").value;
    admin.achternaam = document.getElementById("achternaamAdmin").value;
    admin.emailadres = document.getElementById("emailadresAdmin").value;
    admin.username = document.getElementById("usernameAdmin").value;
    admin.wachtwoord = document.getElementById("passwordAdmin").value;
    PostUser(JSON.stringify(admin), "admin");
}

// klant toewijzen klopt niet
function generateUsers(){
    console.log("aantal users aangemaakt");

    // klant 1
    var nintendo = {};
    nintendo.voornaam = "Bowser";
    nintendo.achternaam = "Koopa";
    nintendo.emailadres = "bkoopa@evil.com";
    nintendo.username = "bowser"; 
    nintendo.wachtwoord = "bow";
    nintendo.bedrijf = "Nintendo";

    // klant 2
    var fbi = {};
    fbi.voornaam = "Justin";
    fbi.achternaam = "Time";
    fbi.emailadres = "top@secret.com";
    fbi.username = "justintime"; 
    fbi.wachtwoord = "1234";
    fbi.bedrijf = "FBI";

    PostUser(JSON.stringify(nintendo), "klant");
    PostUser(JSON.stringify(fbi), "klant");

    // trainee 1
    var jordi = {};
    jordi.voornaam = "Jordi";
    jordi.achternaam = "Hessels";
    jordi.emailadres = "email@adres.com";
    jordi.username = "jhessels"; 
    jordi.wachtwoord = "geheim";
    jordi.klant = nintendo;

    // trainee 2
    var tim = {};
    tim.voornaam = "Tim";
    tim.achternaam = "Kroon";
    tim.emailadres = "tim@adres.com";
    tim.username = "jhessels"; 
    tim.wachtwoord = "geheim";
    tim.klant = nintendo;

    // trainee 3
    var emiel = {};
    emiel.voornaam = "Emiel";
    emiel.achternaam = "Achternaam";
    emiel.emailadres = "emiel@adres.com";
    emiel.username = "emiel"; 
    emiel.wachtwoord = "geheim";
    emiel.klant = fbi;

    // trainee 4
    var loes = {};
    loes.voornaam = "Loes";
    loes.achternaam = "Poes";
    loes.emailadres = "loespoes@adres.com";
    loes.username = "ploes"; 
    loes.wachtwoord = "geheim";
    loes.klant = fbi;

    PostUser(JSON.stringify(jordi), "trainee");
    PostUser(JSON.stringify(tim), "trainee");
    PostUser(JSON.stringify(emiel), "trainee");
    PostUser(JSON.stringify(loes), "trainee");

    alert("done");
}

// doet nog niks
function getKlant(klant){
    // console.log(user);
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4){
            if (this.status == 200){
                console.log(this.responseText);
                console.log(JSON.parse(this.responseText));
                // return JSON.parse(this.responseText);
            }
        }
    }
    xhttp.open("GET", api+"klant", true);//check of api hier klopt
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send();	
}

function PostUser(user, typeUser){
    // console.log(user);
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4){
            if (this.status == 200){
                console.log(this.responseText);
                console.log(JSON.parse(this.responseText));
            }
        }
    }
    xhttp.open("POST", api+typeUser, true);//check of api hier klopt
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(user);	
}