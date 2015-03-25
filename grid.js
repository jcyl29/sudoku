var row, col;
html = "";

html = "<table>";

var totalSubgrids = 9;
var totalSubdivisions = Math.sqrt(totalSubgrids);
var temp;

for (row = 1; row <= totalSubgrids; row++) {
    html += "<tr>";
    for (col = 1; col <= totalSubgrids; col++) {
        temp = "";
        if (col > 0 && col <= 3 && row > 0 && row <= 3) {
            temp = 1;
        } else if (col > 3 && col <= 6 && row > 0 && row <= 3) {
            temp = 2;
        } else if (col > 6 && col <= 9 && row > 0 && row <= 3) {
            temp = 3;
        } else if (col > 0 && col <= 3 && row > 3 && row <= 6) {
            temp = 4;
        } else if (col > 3 && col <= 6 && row > 3 && row <= 6) {
            temp = 5;
        } else if (col > 6 && col <= 9 && row > 3 && row <= 6) {
            temp = 6;
        } else if (col > 0 && col <= 3 && row > 6 && row <= 9) {
            temp = 7;
        } else if (col > 3 && col <= 6 && row > 6 && row <= 9) {
            temp = 8;
        } else if (col > 6 && col <= 9 && row > 6 && row <= 9) {
            temp = 9;
        }


        html += "<td data-subgrid='" + temp + "' data-col=" + col + " data-row=" + row + ">" +
//            "<input maxlength=10 size=30 type='text' value='" + row + col + " xmod=" + row % totalSubdivisions + ",ymod=" +  col % totalSubdivisions + "'></td>";
            "<input maxlength=10 size=20 type='text' value='" + row + col + " total=" + temp + "'></td>";
//            "<input maxlength=10 size=30 type='text' value='" + "r"+row + "c"+col + " sectId=" + sectid  + "'></td>";
//            "<input maxlength=10 size=30 type='text' value='" + Math.floor(row/totalSubgrids) + Math.floor(col/totalSubgrids) + " xmod=" + row % totalSubdivisions + ",ymod=" +  col % totalSubdivisions + "'></td>";
    }
    html += "</tr>";

}

html += "</table>";

document.body.innerHTML = html;