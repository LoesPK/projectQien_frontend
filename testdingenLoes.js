insertedRow.addEventListener("click", function(){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        var trainee = JSON.parse(this.responseText);   
        console.log(trainee); 
        var thead = document.createElement("thead");
        var th1 = document.createElement("th");
        th1.innerHTML = "Voornaam";
        var th2 = document.createElement("th");
        th2.innerHTML = "Achternaam";
        var th3 = document.createElement("th");
        th3.innerHTML = "Aantal Uren";
        var th4 = document.createElement("th");
        th4.innerHTML = "Datum";
        var th5 = document.createElement("th");
        th5.innerHTML = "Soort Uur";
        var theadtr = document.createElement("tr");
        thead.appendChild(theadtr);
        theadtr.appendChild(th1);
        theadtr.appendChild(th2);
        theadtr.appendChild(th3);
        theadtr.appendChild(th4);
        theadtr.appendChild(th5);

        table.appendChild(theadtr);
        var aantalRijenToegevoegd =0;
    for(var j=0;j<trainee.uren.length;j++){
        var tr = document.createElement("tr");
        var liVNaam = document.createElement("td");
        liVNaam.innerHTML = trainee.voornaam;
        var liANaam = document.createElement("td");
        liANaam.innerHTML = trainee.achternaam;
        tr.appendChild(liVNaam);
        tr.appendChild(liANaam);
        aantalRijenToegevoegd++;
      //datum
      var liDatum = document.createElement("td");
      liDatum.innerHTML = trainee.uren[j].factuurDatum.substring(8,10) + "/" + trainee.uren[j].factuurDatum.substring(5,7) +"/" + trainee.uren[j].factuurDatum.substring(0,4);
      //soort uur
      var liSoort = document.createElement("td");
      liSoort.innerHTML = trainee.uren[j].waarde;
      //aantal uur
      var liAantal = document.createElement("td");
      liAantal.innerHTML = trainee.uren[j].aantal;
      tr.appendChild(liAantal);
      tr.appendChild(liDatum);
      tr.appendChild(liSoort);
      
      table.appendChild(tr);

    }
    theadtr.addEventListener("click", function(){
        theadtr.style.display = "none";
        console.log(aantalRijenToegevoegd);
        for(var i =0; i<aantalRijenToegevoegd;i++){
          console.log(tr[i]);
          tr[i].style.display = "none";
        }
      })
    }
    };
      xhttp.open("GET", apiTrainee + trainee.id, true);
      xhttp.setRequestHeader("Content-type", "application/json");
      xhttp.send(); 

  });
    