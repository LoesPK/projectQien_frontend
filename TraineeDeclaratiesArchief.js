
//Loes: onderstaande is het javascript datum object
var date = new Date();
//Loes: de api
var apiUserId = "http://localhost:8082/api/trainee/"+sessionStorage.getItem("storedUserID");

//Bepalen huidige datum zodat er nooit een leeg datumveld wordt opgestuurd (was een bug)
var today = new Date();
var dd = today.getDate();
var mm = today.getMonth()+1; //As January is 0.
var yyyy = today.getFullYear();
if(dd<10) dd='0'+dd;
if(mm<10) mm='0'+mm;
today = yyyy+'-'+mm+'-'+dd ;


// EMIEL - De maand selecteren
function selectMonth(){
	var tableBody = document.getElementById("selectedMonth");
        var theMonth = tableBody[tableBody.selectedIndex].value;
        var table = document.getElementById("kostenTabel");
            for(var i = table.rows.length - 1; i > 0; i--){
                if(i !=0){
                    console.log(i);     
                    table.deleteRow(i);
                }//end if
            }//end for
        console.log("theMonth: " + theMonth);
        console.log(sessionStorage.getItem("storedUserID"))
		GETDeclaratiesPerMaand(theMonth);
		}

// EMIEL - GET trainee en de kosten
function GETDeclaratiesPerMaand(theMonth){
  var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var trainee = JSON.parse(this.responseText);  
            trainee.kosten.sort(function(a,b){return a.factuurDatum<b.factuurDatum?-1:1});
            for(var i = 0; i<trainee.kosten.length; i++){
                kostenInDBHemZeMonth = trainee.kosten[i].factuurDatum.substring(5,7);
                if(kostenInDBHemZeMonth == theMonth) {
                    console.log(trainee.kosten[i].status)	
                    console.log(trainee.kosten[i])
                    BuildRowKostenTabel(trainee.kosten[i]);
                }//end if
            }//end for
        }//end if
    };//end function
    xhttp.open("GET", apiUserId, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(); 
}

//EMIEL - Opbouwen rijen urentabel
function BuildRowKostenTabel(kosten){
  var table = document.getElementById("kostenTabel");
  
  var insertedRow = table.insertRow(1);
  
  var insertedCell = insertedRow.insertCell(0);
  insertedCell.innerHTML = kosten.status;
  //datum
  var insertedCell = insertedRow.insertCell(1);
    insertedCell.innerHTML = kosten.factuurDatum.substring(8,10)+ "/"+kosten.factuurDatum.substring(5,7)+"/"+ kosten.factuurDatum.substring(0,4);
  //soort kosten
  var insertedCell2 = insertedRow.insertCell(2);
  insertedCell2.innerHTML = kosten.soort;

  //bedrag kosten
  var insertedCell3 = insertedRow.insertCell(3);
  if(kosten.soort == "Auto"){
    insertedCell3.innerHTML = (kosten.bedrag*kosten.aantalKM)/100;
    }else{
      insertedCell3.innerHTML = kosten.bedrag/100;
    }//end if else  
  
    //Aantal KM als de kosten soort auto is
    var insertedCell4 = insertedRow.insertCell(4);
    if(kosten.soort == "Auto"){
    insertedCell4.innerHTML = kosten.aantalKM;}
    else {insertedCell4.innerHTML = "nvt"}
    
    // // IN PROGRESS : Totaal rij...?
    // var kostenTabelBody = document.createElement("tr");
    // table.appendChild(kostenTabelBody);
    // var totaalRow = kostenTabelBody.insertRow(1);
    // var insertedCellTotaal1 = insertRow.insertCell(0);
    // insertedCellTotaal1.innerHTML = "Totaal";
    //     kostenTabelBody.insertRow(totaalRow);
    
}//end BuildRowKostenTabel    
    
  