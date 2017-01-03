function clickRemoved(event) {
    if(event.target.classList.contains("url")) {
        //console.log(event.target.parentElement.textContent);
        page.removeURL(event.target.parentElement.textContent);
    }
}

function generateTableOfURLS() {
    browser.storage.local.get("URLS", function (result) {
        var array = result.URLS;
        var arrayLength = array.length;
        var theTable = document.createElement('table');

        for (var i = 0, tr, td; i < arrayLength; i++) {
            tr = document.createElement('tr');
            td = document.createElement('td');
            var removeButton =  new Image();
            removeButton.classList.add("url");
            removeButton.src = '../icons/close-circle.png';
            removeButton.addEventListener("click", clickRemoved);
            td.appendChild(removeButton);
            td.appendChild(document.createTextNode(array[i]));
            tr.appendChild(td);
            theTable.appendChild(tr);
        }

        document.getElementById('table').appendChild(theTable);
    });
}

generateTableOfURLS();
var page = browser.extension.getBackgroundPage();

document.getElementById("clear").addEventListener("click", function(){
    page.clearURL();
})

browser.storage.onChanged.addListener(function() {
    location.reload();
});