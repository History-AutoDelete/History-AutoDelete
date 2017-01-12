/*
    Panel Logic
*/
//Switchs the panel
function panelSwitch(event) {
    var element = event.target;
    if(element.tagName == "SPAN") {
        element = element.parentElement;
    }
    //console.log(element);
    if(panelTabToContentMap.has(element)) {
        panelTabToContentMap.forEach(function(value, key, map) {         
            if(element == key) {
                key.classList.add("panelTabSelected");
                value.style.display = 'block';
            } else {
                key.classList.remove("panelTabSelected"); 
                value.style.display = 'none';
            }
        }); 
    }
}

//Map that stores the tab to the corresponding content
var panelTabToContentMap = new Map();
panelTabToContentMap.set(document.getElementById("tab1"), document.getElementById("historySettingsContent"));
panelTabToContentMap.set(document.getElementById("tab2"), document.getElementById("listOfURLSContent"));
panelTabToContentMap.set(document.getElementById("tab3"), document.getElementById("aboutContent"));

//Set a click event for each tab in the Map
panelTabToContentMap.forEach(function(value, key, map) {
    key.addEventListener("click", panelSwitch);
});


/*
    History Settings Logic
*/
//Setting the values from local storage
browser.storage.local.get(function(results) {
    if(results.daysToKeep == null) {
        document.getElementById("dayInput").value = 60;
        browser.storage.local.set({daysToKeep: document.getElementById("dayInput").value});
    } else {
        document.getElementById("dayInput").value = results.daysToKeep;
    }

    if(results.keepHistorySetting != null) {
        document.getElementById("keepHistorySwitch").checked = results.keepHistorySetting;
    }
});

//Event handler for the checkbox to Keep History
document.getElementById("keepHistorySwitch").addEventListener("click", function() {
    if(document.getElementById("keepHistorySwitch").checked) {
        browser.storage.local.set({keepHistorySetting: true});
        page.deleteOldHistory();
        page.createOldHistoryAlarm();
    } else {
        browser.storage.local.set({keepHistorySetting: false});
        page.deleteOldHistoryAlarm();
    }

});

//Event handler for the X amount to days of history to keep
document.getElementById("dayInput").addEventListener("change", function() {
	if(document.getElementById("dayInput").value < 0) {
		document.getElementById("dayInput").value = 0;
	}
    browser.storage.local.set({daysToKeep: document.getElementById("dayInput").value});
});


/*
    List of URLS Logic
*/
//Remove the url where the user clicked
function clickRemoved(event) {
    if(event.target.classList.contains("removeIcon")) {
        //console.log(event.target.parentElement.textContent);
        page.removeURL(event.target.parentElement.textContent);
		generateTableOfURLS();
    }
}

//Add URL by keyboard input
function addURLFromInput() {
    var input = document.getElementById("URLForm").value;
    if(input) {
        var URL = "http://www." + input;
        page.addURL(page.get_hostname(URL));
        document.getElementById("URLForm").value = "";
        document.getElementById("URLForm").focus();  
        generateTableOfURLS();   
    }   
}

//Export the list of URLS as a text file
function downloadTextFile(arr) {
    var txt = "";
    arr.forEach(function(row) {
        txt += row;
        txt += "\n";
    });
 
    //console.log(csv);
    var hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(txt);
    hiddenElement.target = '_blank';
    hiddenElement.download = 'urls.txt';
    document.body.appendChild(hiddenElement);
    hiddenElement.click();
    document.body.removeChild(hiddenElement);
}  


//Generate the url table
function generateTableOfURLS() {
    var tableContainerNode = document.getElementById('tableContainer');
    while (tableContainerNode.firstChild) {
        tableContainerNode.removeChild(tableContainerNode.firstChild);
    }
    browser.storage.local.get("URLS", function (result) {
        var array = result.URLS;
        var arrayLength = array.length;
        var theTable = document.createElement('table');

        for (var i = 0, tr, td; i < arrayLength; i++) {
            tr = document.createElement('tr');
            td = document.createElement('td');
            var removeButton =  new Image();
            removeButton.classList.add("removeIcon");
            removeButton.src = '../icons/close-circle.png';
            removeButton.addEventListener("click", clickRemoved);
            td.appendChild(removeButton);
            td.appendChild(document.createTextNode(array[i]));
            tr.appendChild(td);
            theTable.appendChild(tr);
        }

        document.getElementById('tableContainer').appendChild(theTable);
    });
}

generateTableOfURLS();
var page = browser.extension.getBackgroundPage();

//Event handler for the Remove All button
document.getElementById("clear").addEventListener("click", function() {
    page.clearURL();
    generateTableOfURLS();
});

//Event handler for the user entering a URL through a form
document.getElementById("add").addEventListener("click", addURLFromInput);

//Event handler when the user press "Enter" on a keyboard on the URL Form
document.getElementById("URLForm").addEventListener("keypress", function (e) {
    var key = e.which || e.keyCode;
    if (key === 13) {
      addURLFromInput();
    }
});

//Exports urls to a text file
document.getElementById("exportURLS").addEventListener("click", function() {
    browser.storage.local.get("URLS", function(results) {
        downloadTextFile(results.URLS);
    });
});

//Import URLS by text
document.getElementById("importURLS").onchange = function() {
	var file = this.files[0];

	var reader = new FileReader();
	reader.onload = function(progressEvent){
	// Entire file
	//console.log(this.result);

	// By lines
	var lines = this.result.split('\n');
	for(var line = 0; line < lines.length; line++){
	  //console.log(lines[line]);
	  if(lines[line] != "") {
	  	page.addURL(lines[line]);
	  }
	}
	generateTableOfURLS();
	};
	reader.readAsText(file);
};

