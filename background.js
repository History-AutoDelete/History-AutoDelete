//Logs the error
function onError(error) {
	console.log(`Error: ${error}`);
}

//Logs the success
function onSuccess() {
	//console.log("Success");
}

//Returns the host name of the url. Etc. "https://en.wikipedia.org/wiki/Cat" becomes en.wikipedia.org
function get_hostname(url) {
    try {
		var hostname = new URL(url).hostname;
    } catch(e) {
    	console.log("Invalid URL");
    }
    // Strip "www." if the URL starts with it.
    hostname = hostname.replace(/^www\./, '');
    return hostname;
}

//See if the set has the url
function hasHost(url) {
	return urlsToRemove.has(url);
}

//Stores the set in the local storage of the browser as an array
function storeLocal() {
	var urlArray = Array.from(urlsToRemove);
	browser.storage.local.set({URLS: urlArray});
}

//Add the url to the set
function addURL(url) {
	if(!hasHost(url)) {
		urlsToRemove.add(url);
		storeLocal();
	} else {
		console.log("Already have " + url);
	}

}

//Remove the url from the set
function removeURL(url) {
	urlsToRemove.delete(url);
	storeLocal();
}

//Clears the set
function clearURL() {
	urlsToRemove.clear();
	storeLocal();
}

//Deletes the history if the set contains the history url's hostname
function onVisited(historyItem) {
	if (historyItem.url) {
		var currentUrl = historyItem.url;
		var currentHostUrl = get_hostname(currentUrl);
		//console.log(currentUrl);
		//console.log("Host: " + currentHostUrl);
		if(hasHost(currentHostUrl)) {
			var deletingUrl = browser.history.deleteUrl({url: currentUrl});
		}
	}

}

//The set of urls
var urlsToRemove;
//Grabs the local storage's urls and initialize the set with it
browser.storage.local.get("URLS", function(results) {
	urlsToRemove = new Set(results.URLS);
	//console.log(results.URLS);
});
browser.history.onVisited.addListener(onVisited);

//Logic that controls what happens when you click on the browser action icon
browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
	browser.windows.getCurrent(function(windowInfo) {
		if (!tab.url.match(/^about:/) && !windowInfo.incognito) {
			browser.browserAction.enable(tab.id);
		} else {
			browser.browserAction.disable(tab.id);
		}
	});

});

/*
Keep History for X days Logic
*/

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const DELAYINMINUTES = 60;

//Keep History for X amount of days
function deleteOldHistory() {
	browser.storage.local.get("daysToKeep", function(results) {
		browser.history.deleteRange({startTime: 0, endTime: Date.now() - DAY*results.daysToKeep} , function() {
			//console.log("History cleared");
		});
	});

}

//Creates an alarm that clears history every hour
function createOldHistoryAlarm() {
	browser.alarms.create("historyAutoDeleteAlarm", {
		periodInMinutes: DELAYINMINUTES
	});
}

//Deletes the alarm
function deleteOldHistoryAlarm() {
    //console.log("Deleted");
   	browser.alarms.clear("historyAutoDeleteAlarm");	
}
browser.alarms.onAlarm.addListener(function(alarmInfo) {
	deleteOldHistory();
});

//On startup clear history and create the alarm if the user selects this option
browser.storage.local.get("keepHistorySetting", function(results) {
	if(results.keepHistorySetting != null && results.keepHistorySetting == true) {
		deleteOldHistory();
		createOldHistoryAlarm();
	}
});