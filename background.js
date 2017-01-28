const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

//Keep History for X amount of days
function deleteOldHistory() {
	browser.storage.local.get("daysToKeep")
	.then(function(items) {
		browser.history.deleteRange({startTime: 0, endTime: Date.now() - (DAY*items.daysToKeep)});
	}).catch(onError);
}

//Creates an alarm that clears history every hour
function createOldHistoryAlarm() {
	browser.alarms.create("historyAutoDeleteAlarm", {
		periodInMinutes: 60
	});
	//console.log("Created alarm");
}

//Deletes the alarm
function deleteOldHistoryAlarm() {
   	browser.alarms.clear("historyAutoDeleteAlarm");
   	//console.log("Deleted alarm");
}


//Logs the error
function onError(error) {
	console.error(`Error: ${error}`);
}


//Returns the host name of the url. Etc. "https://en.wikipedia.org/wiki/Cat" becomes en.wikipedia.org
function getHostname(url) {
    var hostname = new URL(url).hostname;
    // Strip "www." if the URL starts with it.
    hostname = hostname.replace(/^www\./, "");
    return hostname;
}

function isAWebpage(URL) {
	if(URL.match(/^http:/) || URL.match(/^https:/) || URL.match(/^moz-extension:/)) {
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
		//console.log("Already have " + url);
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

//Deletes the history if the set contains the history url"s hostname
function onVisited(historyItem) {
	if (historyItem.url) {
		var currentUrl = historyItem.url;
		var currentHostUrl = getHostname(currentUrl);
		//console.log(currentUrl);
		//console.log("Host: " + currentHostUrl);
		if(hasHost(currentHostUrl)) {
			browser.history.deleteUrl({url: currentUrl})
			.then(function() {
				//console.log(currentURL + " deleted from history");
			}).catch(onError);
		}
	}

}

//Increment the counter and store the counter to local after 1 minute
function incrementCounter() {
	browser.storage.local.get("statLoggingSetting")
	.then(function(items) {
		if(items.statLoggingSetting === true) {
			historyDeletedCounterTotal++;
			historyDeletedCounter++;
			browser.alarms.create("storeCounterToLocalAlarm", {
				delayInMinutes: 1
			});
		}
	}).catch(onError);
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

//Sets up the background page on startup
function onStartUp() {
	browser.storage.local.get()
	.then(function(items) {
		urlsToRemove = new Set(items.URLS);
		//Checks to see if these settings are in storage, if not create and set the default
		if(items.daysToKeep === null) {
			browser.storage.local.set({daysToKeep: 60});
		}
		
		if(items.historyDeletedCounterTotal === null) {
			resetCounter();
		} else {
			historyDeletedCounterTotal = items.historyDeletedCounterTotal;
		}
		
		if(items.keepHistorySetting === null) {
			browser.storage.local.set({keepHistorySetting: false});
		} 
		
		if(items.statLoggingSetting === null) {
			browser.storage.local.set({statLoggingSetting: true});
		}

		if(items.showVisitsInIconSetting === null) {
			browser.storage.local.set({showVisitsInIconSetting: true});
		}

		//Create objects based on settings
		if(items.keepHistorySetting === true) {
			deleteOldHistory();
			createOldHistoryAlarm();
		} else {
			deleteOldHistoryAlarm();
		}

		if(items.statLoggingSetting === true) {
			browser.history.onVisitRemoved.addListener(incrementCounter);
		} else if(browser.history.onVisitRemoved.hasListener(incrementCounter)) {
			browser.history.onVisitRemoved.removeListener(incrementCounter);
		}
	}).catch(onError);
}


//Set the defaults 
function setDefaults() {
	browser.storage.local.clear();
	onStartUp();
}

//The set of urls
var urlsToRemove;

var historyDeletedCounterTotal;
var historyDeletedCounter = 0;

onStartUp();
browser.history.onVisited.addListener(onVisited);

function showVisitsInBadge(tabURL,tabID) {
	browser.history.search({
    	text: getHostname(tabURL),
    	maxResults: 1000000000,
    	startTime: 0
	}).then(function(results) {
		browser.browserAction.setBadgeText({text: results.length.toString(), tabId: tabID});
		browser.browserAction.setBadgeBackgroundColor({color: "#e68d7d", tabId: tabID});
	}).catch(onError);
} 

//Logic that controls when to disable the browser action
browser.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
	if (tab.status === "complete") {
		browser.windows.getCurrent()
		.then(function(windowInfo) {
			if (!isAWebpage(tab.url) || windowInfo.incognito) {
				browser.browserAction.disable(tab.id);
				browser.browserAction.setBadgeText({text: "X", tabId: tab.id});
				browser.browserAction.setBadgeBackgroundColor({color: "red", tabId: tab.id});
			} else {
				browser.browserAction.enable(tab.id);
				browser.browserAction.setBadgeText({text: "", tabId: tab.id});
				browser.storage.local.get("showVisitsInIconSetting")
				.then(function(items) {
					if(items.showVisitsInIconSetting === true) {
						showVisitsInBadge(tab.url, tab.id);
					}	
				});
			}
		}).catch(onError);
	}


});

//Alarm event handler
browser.alarms.onAlarm.addListener(function (alarmInfo) {
	//console.log(alarmInfo.name);
	if(alarmInfo.name === "historyAutoDeleteAlarm") {
		deleteOldHistory();		
	}
	if(alarmInfo.name === "storeCounterToLocalAlarm") {
		storeCounterToLocal();
	}

});

