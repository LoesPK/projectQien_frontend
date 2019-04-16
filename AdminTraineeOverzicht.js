var api = "http://localhost:8082/api/trainee/";
var apiKlant = "http://localhost:8082/api/klant";
var IDteWijzigenTrainee;


//GET Haal alle trainees op en bouw een tabel op met deze trainees
function GETTrainees(){
  var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        var trainee = JSON.parse(this.responseText);	
        var table = document.createElement("table");
        addHtmlElement(table,traineeTableHeader());
        var tbody = addHtmlElement(table, document.createElement("tbody"));
      
        for(var i = 0; i< trainee.length; i++){
        addHtmlElement(tbody, traineeTableRow(trainee[i])); 
        }// end for
      document.getElementById("traineelijst").appendChild(table);		
      }// end if
    };//end xhttp function

    xhttp.open("GET", api, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send();	
}

// EMIEL - Aanmaken van headers
function traineeTableHeader() {
   var tableHeader = document.createElement("thead");
   var tr = addHtmlElement(tableHeader, document.createElement("tr"));
   //addHtmlElementContent(tr, document.createElement("th"), "id");
   addHtmlElementContent(tr, document.createElement("th"), "Voornaam", "voornaam");
   addHtmlElementContent(tr, document.createElement("th"), "Achternaam", "achternaam");
   addHtmlElementContent(tr, document.createElement("th"), "Emailadres", "emailadres");
   addHtmlElementContent(tr, document.createElement("th"), "Username", "username");
   addHtmlElementContent(tr, document.createElement("th"), "Klant", "klant");
  
  //  addHtmlElementContent(tr, document.createElement("th"), "Verwijderen");
   
   return tableHeader;
}

// EMIEL - Aanmaken van rijen met daarin cellen
function traineeTableRow(trainee) {
   var tr = document.createElement("tr");
   tr.id = trainee.id;
    addHtmlElementContent(tr, document.createElement("td"), trainee.voornaam, "VoornaamInDB"+tr.id);
    addHtmlElementContent(tr, document.createElement("td"), trainee.achternaam, "AchternaamInDB"+tr.id);
    addHtmlElementContent(tr, document.createElement("td"), trainee.emailadres, "EmailadresInDB"+tr.id);
    addHtmlElementContent(tr, document.createElement("td"), trainee.username, "UsernameInDB"+tr.id);
    addHtmlElementContent(tr, document.createElement("td"), trainee.klant.bedrijf, "KlantInDB"+tr.id);
   

  // Aanpasknop
  var temp1 = document.createElement("span");
  temp1.className = "fas fa-pencil-alt";
  temp1.addEventListener("click", function(){
    var td = event.target.parentNode;
//  console.log("trainee.id: "+trainee.id)

    GETTraineeById(trainee.id)
    td.parentNode.appendChild(td);    
    });//end EventListener
  tr.appendChild(temp1);
  addHtmlElementContent(tr, temp1, "", "wijzig");






    // Verwijderknop: Maakt een element en geeft aan aan dat er een delete actie op de parent (=rij vd cel) moet worden uitgevoerd
    // trainee wordt ook verwijderd uit de database
    var temp2 = document.createElement("span");
    temp2.className = "fas fa-trash-alt";
    temp2.addEventListener("click", function(){
      var td = event.target.parentNode;
//    console.log(trainee.id)
      DeleteTrainee(trainee.id)
      td.parentNode.removeChild(td);    
      });//end EventListener
    tr.appendChild(temp2);
    addHtmlElementContent(tr, temp2, "", "verwijder");

    return tr;
}

// EMIEL - Voeg child aan parent toe
function addHtmlElement(parent, child) {
   parent.appendChild(child);
   return child;
}

// EMIEL - Voeg child aan parent toe, zet de tekst als innerHTML in de child
function addHtmlElementContent(parent, child, tekst, id) {
   parent.appendChild(child);
   child.innerHTML = tekst;
   child.id = id;
   return child;
}


//DELETE trainee
function DeleteTrainee(numb) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
    document.location.reload(true)
    alert("Trainee is verwijderd!");    
    }//end if
  };//end xhttp function

  xhttp.open("DELETE", api+numb, true);
  xhttp.send();
}

///////////////////////////////////////////////////////////

// //PUT
// function AdminShowTrainee(){
//   var numberChange = document.getElementById("numberToChange").value;
//   GETTraineeById(numberChange);
//   return numberChange;
// }
//GET by id
function GETTraineeById(id){
  var xhttp = new XMLHttpRequest();
   xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
    var trainee = JSON.parse(this.responseText);  
    console.log("in GETTrainee: ");
    console.log(trainee);
    wijzigTrainee(trainee);
            }
    };
     xhttp.open("GET", api+id, true);
      xhttp.setRequestHeader("Content-type", "application/json");
      xhttp.send(); 
}

// EMIEL - maken van inputvelden op de pagina
function wijzigTrainee(trainee){
  IDteWijzigenTrainee = trainee.id;
  var row = document.getElementById(trainee.id);
  //iterate through columns
  for (var j = 0, col; col = row.cells[j]; j++) {
    if(j==4){
      var t = document.createElement("select");
      t.id = "Nieuw" + col.id;
      col.appendChild(t);
      updateDropdownKlanten(row);
    }else{
//    console.log(col.id);
//    console.log(col.innerText);
    var t = document.createElement("input");
    var e = col;
    t.value = col.innerText;
    t.id = "Nieuw" + col.id;
//    console.log(t.id);
    e.appendChild(t);
    }//end if
  }//end for
  
}//end wijzig trainee

// EMIEL - GET Klant: Het ophalen van alle klanten in de datbase en die invullen in een dropdown menu
function updateDropdownKlanten(row){
  var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        klant = JSON.parse(this.responseText);	
              var elm1 = document.getElementById("NieuwKlantInDB" + row.id);
                for(i=0; i<klant.length; i++){
                  var option = document.createElement("OPTION"),
                  txt = document.createTextNode(klant[i].bedrijf);
                  option.appendChild(txt);
                  elm1.insertBefore(option, elm1.lastChild);
              }//end for
		}//end 1e if
	}//end http function;
      xhttp.open("GET", apiKlant, true);
	    xhttp.setRequestHeader("Content-type", "application/json");
	    xhttp.send();	
}//end updateDropdownKlanten







// var huidigeTrainee;
// function voegTraineeToe(element, trainee){
//   huidigeTrainee = trainee;
//   var tID = trainee.id;
//   var e = document.getElementById(element);
//   var t = document.createElement("input");
//   t.value = trainee.voornaam;
//   t.id = "voornaam"+tID;
//   e.appendChild(t);
//   t = document.createElement("input");
//   t.value = trainee.achternaam;
//   t.id = "achternaam"+tID;
//   e.appendChild(t);
//   t = document.createElement("input");
//   t.value = trainee.username;
//   t.id = "emailadres"+tID;
//   e.appendChild(t);
//   t = document.createElement("input");
//   t.value = trainee.type;
//   t.id = "username"+tID;
//   e.appendChild(t);
//   t = document.createElement("input");
//   t.value = trainee.wachtwoord;
//   t.id = "wachtwoord"+tID;
//   e.appendChild(t);
//   t = document.createElement("input");
//   t.value = trainee.loon;
 //changeTrainee();
// }





// // EMIEL - ophalen van nieuwe fieldwaarden en een PUT xhttp-request naar de database 
// function changeTrainee(id){
//   nieuweTrainee = GETTrainee(id);  
  
//   var xhttp = new XMLHttpRequest();
//    xhttp.onreadystatechange = function() {
//     if (this.readyState == 4 && this.status == 200) {
//       alert("trainee is gewijzigd!");
//       // document.location.reload(true)  
//     }
//   };
//   xhttp.open("PUT", api+id, true); // let op dat je achter users zet welk element je wil hebben hier
//     console.log(api+id);
//     xhttp.setRequestHeader("Content-type", "application/json"); // moet bij PUT er altijd bij staan, bij GET hoeft het niet

//     xhttp.send(JSON.stringify(nieuweTrainee));  // kan niet als object worden meegestuurd, moet als string, vandaar stringify
//  }

//  // EMIEL - Ophalen van een trainee
// function changeTrainee(id){
//   var xhttp = new XMLHttpRequest();
//     xhttp.onreadystatechange = function() {
//       if (this.readyState == 4 && this.status == 200) {
//         var nieuweTrainee = JSON.parse(this.responseText);	
//         console.log(nieuweTrainee);

        
//         nieuweTrainee.voornaam = document.getElementById("NieuwVoornaamInDB" + id).value;
//         nieuweTrainee.achternaam = document.getElementById("NieuwAchternaamInDB" + id).value;
//         nieuweTrainee.wachtwoord = document.getElementById("NieuwEmailadresInDB" + id).value;
//         nieuweTrainee.username = document.getElementById("NieuwUsernameInDB" + id).value;
//         nieuweTrainee.klant = document.getElementById("NieuwKlantInDB" + id).value;
//         console.log(nieuweTrainee);

//         }// end if
//     };//end xhttp function

//     xhttp.open("GET", api+id, true);
//     xhttp.setRequestHeader("Content-type", "application/json");
//     xhttp.send();	
// }


////////////////////////////////////////////////////////////






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
  var rows = document.querySelectorAll("table tr");
  
    for (var i = 0; i < rows.length; i++) {
    var row = [], cols = rows[i].querySelectorAll("td, th");
    
        for (var j = 0; j < cols.length; j++) 
            row.push(cols[j].innerText);
        
    csv.push(row.join(","));    
  }

    // Download CSV
    download_csv(csv.join("\n"), filename);
}

document.querySelector("#exporting").addEventListener("click", function () {
    var html = document.querySelector("table").outerHTML;
  export_table_to_csv(html, "table.csv");
});
