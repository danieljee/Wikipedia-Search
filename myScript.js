document.addEventListener("DOMContentLoaded", function(){
	document.getElementById("searchIcon").addEventListener("click", function(event){
		event.preventDefault();
		expandSearch();
	})
});

function expandSearch(){
	var searchIcon = document.getElementById("searchIcon");
	var div = document.getElementById("nonStaticArea");
	div.removeChild(searchIcon);
	var input = document.createElement("input");
	input.setAttribute("type", "text");
	input.setAttribute("id", "searchBar");
	input.addEventListener("keydown", function(event){
		var code = event.keyCode;
		if (code == 13){
			var searchArea = document.getElementById("searchArea");
			searchArea.style.marginTop = "5%";
			loadJSON(input.value);
		}
	})
	div.appendChild(input);
	input.focus();
}


function createCORSRequest(method, url){
	var xhr = new XMLHttpRequest();
	if ("withCredentials" in xhr){
		xhr.open(method,url, true);
	} else if (typeof XDomainRequest != "undefined"){
		xhr = new XDomainRequest();
		xhr.open(method, url);
	} else {
		xhr = null;
	}
	return xhr;
}

function loadJSON(keyword){
	var URL = "https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch="+keyword+"&srwhat=text&srprop=snippet&format=json&origin=*&continue=";
	//The mediawiki api server does not simply use the value of request header origin
	//The origin parameter will be matched against the Origin header. 
	try{
		var http_request = createCORSRequest("GET", URL);
		if (!http_request){
			throw new Error("CORS not supported");
		}
		http_request.onreadystatechange = function(){
			if (http_request.readyState === 4 && http_request.status === 200){
				var JSONString = JSON.parse(http_request.responseText);
				
				//Clear the previous results if exists
				var resultsArea = document.getElementById("resultsArea");
				while(resultsArea.firstChild){
					resultsArea.removeChild(resultsArea.firstChild);
				}
				
				for (var i=0; i < 10; i++){
					var title = JSONString.query.search[i].title;
					var snippet = JSONString.query.search[i].snippet;		
					var individualItem = document.createElement("div");
					var link = document.createElement("a");
					individualItem.setAttribute("class", "individualItem");
					individualItem.setAttribute("style", "position: relative; background-color: white; text-align:left; margin: 10px 0px; padding:10px");
					link.setAttribute("style", "position:absolute; top:0; right:0; bottom:0; left:0;")
					link.setAttribute("href", "http://en.wikipedia.org/wiki/"+title);
					link.setAttribute("target", "_block");		
					individualItem.innerHTML = "<h3>"+title+"</h3><p>"+snippet+"</p>";	
					individualItem.appendChild(link);
					resultsArea.appendChild(individualItem);
				}
			}
		};		
		http_request.send();
	} catch (e){
		console.log(e.message);
	}
}


