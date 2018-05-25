var express = require('express');

function check(){
    var checkboxes = document.getElementsByName("someSwitchOption001");
    var location=document.getElementById("validationDefault03").value;
    if(location.length==0){
    	location="blank";
    }
  	var checkboxesChecked = [];
	var count=0;
	var categories;
  	for (var i=0; i<checkboxes.length; i++) {
     	if (checkboxes[i].checked) {
     		count++;
        	checkboxesChecked.push(checkboxes[i].value);
     	}
  	}
  	if (checkboxesChecked.length>0&&checkboxesChecked.length<4){
  		categories=checkboxesChecked.join();
  		window.location="/searchevents/"+categories+"/"+location;	
  	}
 	else {
  		alert("You must check at least one and at most three checkbox.");
  	}
}