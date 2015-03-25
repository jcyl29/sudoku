var row, col;
html = "";

html = "<table>";

var totalSubgrids = 4;
var totalSubdivisions = Math.sqrt(totalSubgrids);
var allowedValues = [];
var matrix = [];

//check square;
if (totalSubgrids !== Math.pow(Math.ceil(Math.sqrt(totalSubgrids)),2)) {
    throw Error("number is not a square!");
}

//for (var i = 1; i <= totalSubgrids; i++ ){
//    allowedValues.push(i);
//    matrix["row"+i] = [];
//    matrix["col"+i] = [];
////    matrix[""]
//    //build array here?
//}

function isPuzzleSolved() {
    for (var i = 1; i <= totalSubgrids; i++) {
        console.info("row" + i, matrix["row" + i].length);
        if (matrix["row" + i].length != totalSubgrids) {
            return false;
        }
    }

    return true;
}

for (row = 1; row <= totalSubgrids; row++) {
    matrix["row" + row] = [];
    matrix["col" + row] = [];

    allowedValues.push(row);
    html += "<tr>";
    for (col = 1; col <= totalSubgrids; col++) {
        sectRow = Math.ceil(row / totalSubdivisions);
        sectCol = Math.ceil(col / totalSubdivisions);
        sectId = sectRow + "" + sectCol;
        oddClassName = ((sectCol + sectRow) % 2 !== 0) ? "odd" : "";
        if (!matrix["sect" + sectId]) {
            matrix["sect" + sectId] = [];
        }

        html += "<td>" +
//            "<input maxlength=1 size=20 type='text' value='" + row + col + "isOdd=" + oddClassName + "'></td>";
            "<input placeholder='" + row + col + ",sg=" + sectId + ",isOdd=" + oddClassName + "' data-sect='" + sectId + "' data-col=" + col + " data-row=" + row + " class='" + oddClassName + "' maxlength=1 type='text'></td>";
    }


    html += "</tr>";

}

html += "</table>";

document.body.innerHTML = html;

function handleKeyup(e) {
    var value = parseInt(e.target.value);
    var row, col, sect;

    console.log("value is?", value);


    if (allowedValues.indexOf(value) === -1) {
        console.log("keyup, not valid value");
        return;
    }

    console.log("valid input!", allowedValues, matrix);
    row = matrix["row" + e.target.dataset.row];
    col = matrix["col" + e.target.dataset.col];
    sect = matrix["sect" + e.target.dataset.sect];

    if (row.indexOf(value) === -1) {
        row.push(value);
    } else {
        console.error(value + " already exists in row");
    }

    if (col.indexOf(value) === -1) {
        col.push(value);
    } else {
        console.error(value + " already exists in col");
    }

    if (sect.indexOf(value) === -1) {
        sect.push(value);
    } else {
        console.error(value + " already exists in sect");
    }

    console.log("row", row, "col", col, "sect", sect);

    console.log("subgrid", e.target.dataset.sect, "row", e.target.dataset.row, "col", e.target.dataset.col, "value", parseInt(e.target.value));
    console.log("puzzleSolved?", isPuzzleSolved());


}

function handlekeyDown(e) {
    var value = parseInt(e.target.value);
    var row, col, sect;

    if (allowedValues.indexOf(value) === -1) {
        console.log("keydown, not valid value");
        return;
    }

    if (e.keyCode == 8) {
        console.log("keydown delete pressed, what is value?", value);
        row = matrix["row" + e.target.dataset.row];
        col = matrix["col" + e.target.dataset.col];
        sect = matrix["sect" + e.target.dataset.sect];

        if (row.indexOf(value) !== -1) {
            console.log(value, "found, deleting it from row array");
            row.splice(row.indexOf(value));
            col.splice(col.indexOf(value));
            sect.splice(sect.indexOf(value));
        }

        if (col.indexOf(value) !== -1) {
            console.log(value, "found, deleting it from col array");
            col.splice(col.indexOf(value));
            sect.splice(sect.indexOf(value));
        }

        if (sect.indexOf(value) !== -1) {
            console.log(value, "found, deleting it from sect array");
            sect.splice(sect.indexOf(value));
        }
    }
}

var t = document.getElementsByTagName("table")[0];
t.addEventListener("keyup", handleKeyup);

t.addEventListener("keydown", handlekeyDown);