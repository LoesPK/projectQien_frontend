//var apiTrainee = "http://localhost:8082/api/trainee/"; // niet gebruikt?
var api = "http://localhost:8082/api/klant/";
var IDteWijzigenKlant;

// EMIEL - GET Haal alle klanten op en bouw een tabel op met deze klanten
function GETKlanten(){
  var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        var klant = JSON.parse(this.responseText);	
        var table = document.createElement("table");
        addHtmlElement(table,klantTableHeader());
        var tbody = addHtmlElement(table, document.createElement("tbody"));
      
        for(var i = 0; i< klant.length; i++){
           console.log(klantTableRow(klant[i]));
          addHtmlElement(tbody, klantTableRow(klant[i])); 
        }// end for
        document.getElementById("klantlijst").appendChild(table);		
      }// end if
    };//end xhttp function

    xhttp.open("GET", api, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send();	
}

// EMIEL - Aanmaken van headers
function klantTableHeader() {
   var tableHeader = document.createElement("thead");
   var tr = addHtmlElement(tableHeader, document.createElement("tr"));
   addHtmlElementContent(tr, document.createElement("th"), "Bedrijf", "bedrijf");
   addHtmlElementContent(tr, document.createElement("th"), "Voornaam", "voornaam");
   addHtmlElementContent(tr, document.createElement("th"), "Achternaam", "achternaam");
   addHtmlElementContent(tr, document.createElement("th"), "Emailadres", "emailadres");
   addHtmlElementContent(tr, document.createElement("th"), "Username", "username");
   
   
   return tableHeader;
}

// EMIEL - Aanmaken van rijen met daarin cellen
function klantTableRow(klant) {
   var tr = document.createElement("tr");
   tr.id = klant.id;
   addHtmlElementContent(tr, document.createElement("td"), klant.bedrijf, "BedrijfInDB"+tr.id);
    addHtmlElementContent(tr, document.createElement("td"), klant.voornaam, "VoornaamInDB"+tr.id);
    addHtmlElementContent(tr, document.createElement("td"), klant.achternaam, "AchternaamInDB"+tr.id);
    addHtmlElementContent(tr, document.createElement("td"), klant.emailadres, "EmailadresInDB"+tr.id);
    addHtmlElementContent(tr, document.createElement("td"), klant.username, "UsernameInDB"+tr.id);
    

  // Aanpasknop
  var temp1 = document.createElement("span");
  temp1.className = "fas fa-pencil-alt";
  temp1.addEventListener("click", function(){
    var td = event.target.parentNode;

    GETKlantById(klant.id)
    td.parentNode.appendChild(td);    
    });//end EventListener

    tr.appendChild(temp1);
    addHtmlElementContent(tr, temp1, "", "wijzig");

    // Verwijderknop: Maakt een element en geeft aan aan dat er een delete actie op de parent (=rij vd cel) moet worden uitgevoerd
    // klant wordt ook verwijderd uit de database
    var temp2 = document.createElement("span");
    temp2.className = "fas fa-trash-alt";
    temp2.addEventListener("click", function(){
    var td = event.target.parentNode;
    DeleteKlant(klant.id)
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


//GET by id
function GETKlantById(id){
    var xhttp = new XMLHttpRequest();
     xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
      var klant = JSON.parse(this.responseText);  
      console.log("in GETKlant: ");
      console.log(klant);
      wijzigKlant(klant);
              }
      };
       xhttp.open("GET", api+id, true);
        xhttp.setRequestHeader("Content-type", "application/json");
        xhttp.send(); 
  }
  
  // EMIEL - maken van inputvelden op de pagina
  function wijzigKlant(klant){
    IDteWijzigenKlant = klant.id;
    var row = document.getElementById(klant.id);
    //iterate through columns
    for (var j = 0, col; col = row.cells[j]; j++) {
    //   if(j==4){
    //     // var t = document.createElement("select");
    //     // t.id = "Nieuw" + col.id;
    //     // col.appendChild(t);
    //     // updateDropdownKlanten(row);
    //   }else{
  //    console.log(col.id);
  //    console.log(col.innerText);
      var t = document.createElement("input");
      var e = col;
      t.value = col.innerText;
      t.id = "Nieuw" + col.id;
  //    console.log(t.id);
      e.appendChild(t);
    //   }//end if
    }//end for
    
  }//end wijzig klant


 // EMIEL - Ophalen van een klant
 function changeKlant(id){
    var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          var nieuweKlant = JSON.parse(this.responseText);	
          
            nieuweKlant.voornaam = document.getElementById("NieuwVoornaamInDB" + id).value;
            nieuweKlant.achternaam = document.getElementById("NieuwAchternaamInDB" + id).value;
            nieuweKlant.emailadres = document.getElementById("NieuwEmailadresInDB" + id).value;
            nieuweKlant.username = document.getElementById("NieuwUsernameInDB" + id).value;
            nieuweKlant.bedrijf = document.getElementById("NieuwBedrijfInDB" + id).value;
          
          console.log("Check in changeKlant")
          console.log(nieuweKlant)
            putKlant(nieuweKlant);

          //getKlant(nieuweKlant,nieuwKlantBedrijf);
  
          }// end if
      };//end xhttp function
  
      xhttp.open("GET", api+id, true);
      xhttp.setRequestHeader("Content-type", "application/json");
      xhttp.send();	
  }

// EMIEL - PUT klant met de nieuwe waarden
function putKlant(klant){
    console.log("klantID" + klant.id)
    console.log(klant)
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
     // klantID = klant.id;
   console.log(klant.id)
  
        if (this.readyState == 4 && this.status == 200) {
         var gewijzigdeKlant = JSON.parse(this.responseText);
         if(!alert("Klant "+gewijzigdeKlant.voornaam + " "+ gewijzigdeKlant.achternaam +" bij " + gewijzigdeKlant.bedrijf+" is aangepast!")){
            window.location.reload();
       }
        //  console.log("Check in putKlant");

        //  console.log(gewijzigdeKlant);
          }//end if
      }//end http function;
  
    xhttp.open("PUT", api +"naw/"+ klant.id, true);

    console.log("XXXXX")

    console.log(api+"naw/"+klant.id);

    console.log(klant)
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(klant));	
    }//end PUT





//DELETE klant
function DeleteKlant(numb) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
    document.location.reload(true)
    alert("Klant is verwijderd!");    
    }//end if
  };//end xhttp function

  xhttp.open("DELETE", api+numb, true);
  xhttp.send();
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
