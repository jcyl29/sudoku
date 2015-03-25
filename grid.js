var row, col;
html = "";

html = "<table>";

var totalSubgrids = 9;
var totalSubdivisions = Math.sqrt(totalSubgrids);
var allowedValues = [];
var matrix = [];

//for (var i = 1; i <= totalSubgrids; i++ ){
//    allowedValues.push(i);
//    matrix["row"+i] = [];
//    matrix["col"+i] = [];
////    matrix[""]
//    //build array here?
//}

for (row = 1; row <= totalSubgrids; row++) {
    matrix["row"+row] = [];
    matrix["col"+row] = [];

    allowedValues.push(row);
    html += "<tr>";
    for (col = 1; col <= totalSubgrids; col++) {
        sectRow = Math.ceil(row / totalSubdivisions);
        sectCol = Math.ceil(col / totalSubdivisions);
        sectId = sectRow + "" + sectCol;
        oddClassName = ((sectCol + sectRow) % 2 !== 0) ? "odd" : "";
        if (!matrix["sect"+sectId]) {
            matrix["sect"+sectId] = [];
        }

        html += "<td>" +
//            "<input maxlength=1 size=20 type='text' value='" + row + col + "isOdd=" + oddClassName + "'></td>";
            "<input placeholder='" + row + col + ",sg=" + sectId +",isOdd=" + oddClassName + "' data-subgrid='" + sectId + "' data-col=" + col + " data-row=" + row + " class='" + oddClassName + "' maxlength=1 type='text'></td>";
    }


    html += "</tr>";

}

html += "</table>";

document.body.innerHTML = html;

function handleKeyup(e){

//    do lookups here?
    var value = parseInt(e.target.value);
    if (allowedValues.indexOf(value) !== -1) {
        console.log("valid input!", allowedValues, matrix);

    } else {
        return false;
    }

    console.log("subgrid",e.target.dataset.subgrid, "row" ,e.target.dataset.row, "col", e.target.dataset.col, "value", parseInt(e.target.value));

}

var t = document.getElementsByTagName("table")[0];
t.addEventListener("keyup", handleKeyup);