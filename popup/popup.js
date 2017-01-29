function animateSuccess(element) {
	element.classList.add("successAnimated");
	setTimeout(function() {
		element.classList.remove("successAnimated");
	},1500);
}

function animateFailure(element) {
	element.classList.add("failureAnimated");
	setTimeout(function() {
		element.classList.remove("failureAnimated");
	},1500);	
}

//Fills the popup page
function fillPopup(tabs) {
    var activeTab = tabs[0];
    if(!page.isAWebpage(activeTab.url)) {
    	return;
    }
	hostUrl = page.getHostname(activeTab.url);
	
	//Sets the checkbox depending on the if it exists in the set
	if(page.hasHost(hostUrl)) {
		switchToAutoDelete.checked = true; 
	} else {
		switchToAutoDelete.checked = false; 
	}

	
	var hostPlaceholder = document.getElementById("hostwebsite");

	//Append the favicon image of the host site to the beggining of the URL

	if (activeTab.favIconUrl) {
		var faviconImage = new Image();
		faviconImage.src = activeTab.favIconUrl;
		faviconImage.style.width = "1em";
		faviconImage.style.height = "1em";
		hostPlaceholder.appendChild(faviconImage);
	}

	//Sets the Host site placeholder
	hostPlaceholder.appendChild(document.createTextNode(hostUrl));
	
}


//Initialize variables
var hostUrl;
var switchToAutoDelete = document.getElementById("switchToAutoDelete");
var page = browser.extension.getBackgroundPage();
browser.tabs.query({currentWindow: true, active: true})
.then(fillPopup);


//Checkbox Event Handling
switchToAutoDelete.addEventListener("click", function() {
	if(switchToAutoDelete.checked) {
		page.addURL(hostUrl);
	} else {
		page.removeURL(hostUrl);
		
	}
});

//Setting Click Handling
document.getElementById("settings").addEventListener("click", function() {
	browser.runtime.openOptionsPage();
});

//Clear all history for a domain
document.getElementById("clearHistory").addEventListener("click", function(e) {
	// Don't try and delete history when there's no hostname.
	if (!hostUrl) {
		return;
	}

    // Search will return us a list of histories for this domain.
    // Loop through them and delete them one by one.
    var searchingHistory = browser.history.search({
    	text: hostUrl,
    	maxResults: 1000000000,
    	startTime: 0
    });

    searchingHistory.then(function(results) {
		if(results.length > 0) {
			for (let k = 0; k < results.length; k++) {
				browser.history.deleteUrl({url: results[k].url});
			}
			animateSuccess(document.getElementById("clearHistory"));
		} else {
			animateFailure(document.getElementById("clearHistory"));
		}

    });
    e.preventDefault();
	

	
});