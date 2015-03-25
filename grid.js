var row, col;
html = "";

html = "<table>";

var totalSubgrids = 9;
var totalSubdivisions = Math.sqrt(totalSubgrids);

for (row = 1; row <= totalSubgrids; row++) {
    html += "<tr>";
    for (col = 1; col <= totalSubgrids; col++) {
        sectRow = Math.ceil(row / totalSubdivisions);
        sectCol = Math.ceil(col / totalSubdivisions);
        sectId = sectRow + "" + sectCol;
        oddClassName = ((sectCol + sectRow) % 2 !== 0) ? "odd" : "";

        html += "<td data-subgrid='" + sectId + "' data-col=" + col + " data-row=" + row + " class='" + oddClassName + "'>" +
            "<input maxlength=10 size=10 type='text' value='" + row + col + "isOdd=" + oddClassName + "'></td>";
    }
    html += "</tr>";

}

html += "</table>";

document.body.innerHTML = html;