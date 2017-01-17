const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const DELAYINMINUTES = 60;

//Keep History for X amount of days
function deleteOldHistory() {
	browser.history.deleteRange({startTime: 0, endTime: Date.now() - (DAY*daysToKeep)} , function() {
			//console.log("History cleared");
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


//Logs the error
function onError(error) {
	console.error(`Error: ${error}`);
}


//Returns the host name of the url. Etc. "https://en.wikipedia.org/wiki/Cat" becomes en.wikipedia.org
function getHostname(url) {
    var hostname = new URL(url).hostname;
    // Strip "www." if the URL starts with it.
    hostname = hostname.replace(/^www\./, '');
    return hostname;
}

function isAWebpage(URL) {
	if(URL.match(/^http:/) || URL.match(/^https:/)) {
		return true;
	}
	return false;
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
		var currentHostUrl = getHostname(currentUrl);
		//console.log(currentUrl);
		//console.log("Host: " + currentHostUrl);
		if(hasHost(currentHostUrl)) {
			var deletingUrl = browser.history.deleteUrl({url: currentUrl});
			deletingUrl.then(function() {
				//console.log(currentURL + " deleted from history");
			});
		}
	}

}

//Increment the counter and store the counter to local after 1 minute
function incrementCounter() {
	if (statLoggingSetting == true) {
		historyDeletedCounterTotal++;
		historyDeletedCounter++;
		browser.alarms.create("storeCounterToLocalAlarm", {
			delayInMinutes: 1
		});		
		//console.log(historyDeletedCounterTotal);
	}

}

//Resets the counter
function resetCounter() {
	browser.storage.local.set({historyDeletedCounterTotal: 0});
	historyDeletedCounterTotal = 0;
	historyDeletedCounter = 0;
}

//Stores the total history entries deleted to local
function storeCounterToLocal() {
	browser.storage.local.set({historyDeletedCounterTotal: historyDeletedCounterTotal});
}

//Set the variables from local storage
function initializeVariables() {
	var getLocal = browser.storage.local.get();
	getLocal.then(function(items) {
		if(items.daysToKeep == null) {
			setDefaults();
		}
		urlsToRemove = new Set(items.URLS);
		daysToKeep = items.daysToKeep;
		historyDeletedCounterTotal = items.historyDeletedCounterTotal;
		keepHistorySetting = items.keepHistorySetting;
		statLoggingSetting = items.statLoggingSetting;
		//console.log(historyDeletedCounterTotal + ", " + keepHistorySetting + ", " + statLoggingSetting);
	}).catch(onError);
}

//Create some objects based on the values from initializing the variables
function initializeObjects() {
	if(keepHistorySetting != null && keepHistorySetting == true) {
		deleteOldHistory();
		createOldHistoryAlarm();
	}

}

//Set the defaults if nothing appears in local storage
function setDefaults() {
	console.log("Set defaults");
	browser.storage.local.set({
		daysToKeep: 60,
		historyDeletedCounterTotal: 0,
		keepHistorySetting: false,
		statLoggingSetting: true
	});
}
//The set of urls
var urlsToRemove;
//Numeric values
var daysToKeep;
var historyDeletedCounterTotal;
var historyDeletedCounter = 0;
//Boolean values
var keepHistorySetting;
var statLoggingSetting;
initializeVariables();
initializeObjects();

//History Event handler
browser.history.onVisited.addListener(onVisited);
browser.history.onVisitRemoved.addListener(incrementCounter);

//Logic that controls when to disable the browser action
browser.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
	browser.windows.getCurrent(function(windowInfo) {
		if (!isAWebpage(tab.url) || windowInfo.incognito) {
			browser.browserAction.disable(tab.id);
			browser.browserAction.setBadgeText({text: "X", tabId: tab.id});
		} else {
			browser.browserAction.enable(tab.id);
			browser.browserAction.setBadgeText({text: "", tabId: tab.id});
		}
	});

});

//Alarm event handler
browser.alarms.onAlarm.addListener(function (alarmInfo) {
	console.log(alarmInfo.name);
	if(alarmInfo.name == "historyAutoDeleteAlarm") {
		deleteOldHistory();		
	}
	if(alarmInfo.name == "storeCounterToLocalAlarm") {
		storeCounterToLocal();
	}

});

