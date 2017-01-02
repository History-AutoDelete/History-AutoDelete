function makeTableHTML(myArray) {
    var result = "<table border=1>";
    for(var i=0; i<myArray.length; i++) {
        result += "<tr>";
        for(var j=0; j<myArray[i].length; j++){
            result += "<td>"+myArray[i][j]+"</td>";
        }
        result += "</tr>";
    }
    result += "</table>";

    return result;
}

browser.storage.local.get("URLS", function (result) {
    var array = result.URLS;
    console.log(array[0]);
    var arrayLength = array.length;
    var theTable = document.createElement('table');

    // Note, don't forget the var keyword!
    for (var i = 0, tr, td; i < arrayLength; i++) {
        tr = document.createElement('tr');
        td = document.createElement('td');
        td.appendChild(document.createTextNode(array[i]));
        tr.appendChild(td);
        theTable.appendChild(tr);
    }

    document.getElementById('table').appendChild(theTable);
});
