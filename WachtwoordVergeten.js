var api = "http://localhost:8082/api/user"
function WachtwoordUpdate(){
	user{}
	user.username = document.getElementById("username").value;
	console.log(user.username);
	user.password = document.getElementById("password").value;
	console.log(user.password);
};


function putData(){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
       
        if (this.readyState == 4 && this.status == 200) {
            
            console.log("Check3")
        console.log(JSON.parse(this.responseText));
        }
    };

    xhttp.open("PUT", api+"/" + id, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(user));
}
