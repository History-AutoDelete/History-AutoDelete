function onError(error) {
	console.log(`Error: ${error}`);
}

function onSuccess() {
	console.log("Success");
}

function get_hostname(url) {
	var temp = url.split("/")[2];
	//console.log("Before split: " + temp);
	var searchIndex = temp.search("https://");
	if(searchIndex != -1) {
		//console.log("slice https");
		temp.slice(8);
	}
	searchIndex = temp.search("www.");
	if(searchIndex != -1) {
		//console.log("slice www.");
		temp = temp.slice(4);
	}
	//console.log("After split: " + temp);
	return temp;
}

function hasHost(url) {
	return urlsToRemove.has(url);
}

function storeLocal() {
	var urlArray = Array.from(urlsToRemove);
	var storeLocal = browser.storage.local.set({URLS: urlArray});
	storeLocal.then(onSuccess, onError);
}

function addURL(url) {
	urlsToRemove.add(url);
	storeLocal();
}

function removeURL(url) {
	urlsToRemove.delete(url);
	storeLocal();
}

function clearURL() {
	urlsToRemove.clear();
	storeLocal();
}

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

var urlsToRemove;
browser.storage.local.get("URLS", function(results) {
	urlsToRemove = new Set(results.URLS);
	console.log(urlsToRemove);
});
getLocalURl.then(onGot, onError);

browser.history.onVisited.addListener(onVisited);