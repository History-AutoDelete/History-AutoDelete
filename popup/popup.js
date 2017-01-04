//Gets the active tab
function getActiveTab() {
	return browser.tabs.query({active: true, currentWindow: true});
}

//Fills the popup page
function logTabs(tabs) {
	for (tab of tabs) {
		hostUrl = page.get_hostname(tab.url);
		//Sets the Host site placeholder
		document.getElementById("hostwebsite").innerHTML = hostUrl;
		//Sets the checkbox depending on the if it exists in the set
		if(page.hasHost(hostUrl)) {
			switchToAutoDelete.checked = true; 
		} else {
			switchToAutoDelete.checked = false; 
		}
	}
}

//Logs the error
function onError(error) {
	console.log(`Error: ${error}`);
}

//Initialize variables
var hostUrl;
var switchToAutoDelete = document.getElementById("switch1");
var page = browser.extension.getBackgroundPage();
var querying = browser.tabs.query({currentWindow: true, active: true});
querying.then(logTabs, onError);

//Checkbox Event Handling
function clickSwitchHandle() {
	if(switchToAutoDelete.checked) {
		page.addURL(hostUrl);
	} else {
		page.removeURL(hostUrl);
		
	}
	
}
switchToAutoDelete.addEventListener("CheckboxStateChange", clickSwitchHandle);

//Setting Click Handling
function clickSettings() {
	var opening = browser.runtime.openOptionsPage();
    opening.then(null, onError);
	
}

document.getElementById("settings").addEventListener("click", clickSettings);

//Handler for clearing the history but will not be used because of #1
function clearAll(e) {
	getActiveTab().then((tabs) => {
		if (!hostUrl) {
      // Don't try and delete history when there's no hostname.
      return;
  }

    // Search will return us a list of histories for this domain.
    // Loop through them and delete them one by one.
    var searchingHistory = browser.history.search({text: hostUrl})
    searchingHistory.then((results) => {
    	for (k = 0; k < results.length; k++) {
    		browser.history.deleteUrl({url: results[k].url});
    	}
    }
    );
});
	e.preventDefault();
}

//document.getElementById('clear').addEventListener('click', clearAll);