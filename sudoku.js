if (!window.Sudoku) {
    window.Sudoku = {};
}

Sudoku = {
    totalSubgrids: 9,
    totalSubdivisions: null,
    allowedValues: [],
    matrix: [],
    ignoreKeycodes: [37, 38, 39, 40],
    isPuzzleSolved: function () {
        var i;

        for (i = 1; i <= this.totalSubgrids; i++) {
            console.info("row" + i, this.matrix["row" + i].length);
            if (this.matrix["row" + i].length != this.totalSubgrids) {
                return false;
            }
        }

        return true;
    },

    buildGrid: function () {
        //build the html for the sudoku
        //assign the arrays to store the column, row, and section values

        var row, sectRow, sectCol, sectId, oddClassName, html;

        html = "<table id='sudoku-table'>";

        for (row = 1; row <= this.totalSubgrids; row++) {
            this.matrix["row" + row] = [];
            this.matrix["col" + row] = [];

            this.allowedValues.push(row);
            html += "<tr>";
            for (col = 1; col <= this.totalSubgrids; col++) {
                sectRow = Math.ceil(row / this.totalSubdivisions);
                sectCol = Math.ceil(col / this.totalSubdivisions);
                sectId = sectRow + "" + sectCol;
                oddClassName = ((sectCol + sectRow) % 2 !== 0) ? "odd" : "";
                if (!this.matrix["sect" + sectId]) {
                    this.matrix["sect" + sectId] = [];
                }

                html += "<td>" +
//                                "<input maxlength=1 size=20 type='text' value='" + row + col + "isOdd=" + oddClassName + "'></td>";
                    "<input style='width: 2em; height: 2em; font-size: 2em;' title='" + row + col + ",sg=" + sectId + ",isOdd=" + oddClassName + "' data-sect='" + sectId + "' data-col=" + col + " data-row=" + row + " class='" + oddClassName + "' maxlength=1 type='text'></td>";
            }
        }

        html += "</tr>";
        html += "</table>";
        document.body.innerHTML = html;
    },

    handleKeyup: function (e) {
        console.log(e.type);
        if (this.isPuzzleSolved()) {
            console.warn("already solved!");
            return;
        }

    },

    handleBlur: function (e) {
        console.log(e.type);

        var value = parseInt(e.target.value);
        var row, col, sect;

        if (this.isPuzzleSolved()) {
            console.log("already solved!");
            return;
        }


        if (this.allowedValues.indexOf(value) === -1) {
//        console.log("keydown, not valid value");
            return;
        }

        row = this.matrix["row" + e.target.dataset.row];
        col = this.matrix["col" + e.target.dataset.col];
        sect = this.matrix["sect" + e.target.dataset.sect];

        if (row.indexOf(value) === -1) {
            row.push(value);
        } else {
            console.error(value + " already exists in row");
//        e.target.value = "";
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
    },

    init: function (conf) {
        conf = conf || {};

        var table;
        this.totalSubgrids = conf.totalSubgrids || 4;
        this.totalSubdivisions = Math.sqrt(this.totalSubgrids);
        this.buildGrid();

        table = document.getElementById("sudoku-table");

        table.addEventListener("blur", this.handleBlur.bind(this), true);
        table.addEventListener("keyup", this.handleKeyup.bind(this));

    }
};

Sudoku.init({totalSubgrids: 4});