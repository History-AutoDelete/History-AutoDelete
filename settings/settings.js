//Remove the url where the user clicked
function clickRemoved(event) {
    if(event.target.classList.contains("removeIcon")) {
        //console.log(event.target.parentElement.textContent);
        page.removeURL(event.target.parentElement.textContent);
    }
}

//Generate the url table
function generateTableOfURLS() {
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

//Event handler for the clear url button
document.getElementById("clear").addEventListener("click", function() {
    page.clearURL();
});

//Event handler for the user entering a URL through a form
document.getElementById("add").addEventListener("click", function() {
    var input = document.getElementById("URLForm").value;
    if(input) {
        var URL = "http://www." + input;
        page.addURL(page.get_hostname(URL));
        document.getElementById("URLForm").value = "";    
    }


});

//Reload the page when the local storage changes
browser.storage.onChanged.addListener(function() {
    location.reload();
});