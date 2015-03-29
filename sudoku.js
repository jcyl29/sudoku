if (!window.Sudoku) {
    window.Sudoku = {};
}

Sudoku = {
    totalSubgrids: null,
    totalSubdivisions: null,
    allowedValues: [],
    matrix: [],
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
        var data = {};
        data.value = parseInt(e.target.value);

        if (this.isPuzzleSolved()) {
            console.log("already solved!");
            return;
        }


//        if (this.allowedValues.indexOf(value) === -1) {
////        console.log("keydown, not valid value");
//            return;
//        }

        data.rowId = "row" + e.target.dataset.row;
        data.colId = "col" + e.target.dataset.col;
        data.sectId = "sect" + e.target.dataset.sect;

        this.validateNumber(data);
    },

    validateNumber: function (data) {
        var row, col, sect, value, silent, result = true;

        value = data.value;
        silent = data.silent;
        row = this.matrix[data.rowId];
        col = this.matrix[data.colId];
        sect = this.matrix[data.sectId];

        if (row.indexOf(value) === -1) {
            row.push(value);
        } else {
            if (!silent) {
                console.error(value + " already exists in row");
            }
            result = false;
//        e.target.value = "";
        }

        if (col.indexOf(value) === -1) {
            col.push(value);
        } else {
            if (!silent) {
                console.error(value + " already exists in col");
            }
            result = false;
        }

        if (sect.indexOf(value) === -1) {
            sect.push(value);
        } else {
            if (!silent) {
                console.error(value + " already exists in sect");
            }
            result = false;
        }

        return result;

        console.log("row", row, "col", col, "sect", sect);
    },

    buildRandomValue: function () {
        var totalSubgrids = this.totalSubgrids,
            randomRow = Math.ceil(Math.random() * totalSubgrids),
            randomCol = Math.ceil(Math.random() * totalSubgrids),
            randomValue = Math.ceil(Math.random() * totalSubgrids),
            sectId,
            data = {};

        randomInput = Array.prototype.filter.call(document.getElementsByTagName("input"), function (a) {
            return a.dataset.row == randomRow && a.dataset.col == randomCol;
        });

        randomInput = randomInput[0];
        sectId = randomInput.dataset.sect;

        data.value = randomValue;
        data.rowId = "row" + randomRow;
        data.colId = "col" + randomCol;
        data.sectId = "sect" + sectId;
        data.silent = true;

        if (this.validateNumber(data)) {
            randomInput.value = randomValue;
        }
    },

    buildRandomValues: function () {
        //arbitrary choose totalSubgrids as the amount of random values to put
        //on the board;

        for (var i = 0; i < this.totalSubgrids; i++) {
            this.buildRandomValue();
        }
    },

    init: function (conf) {
        conf = conf || {};

        var table;
        this.totalSubgrids = conf.totalSubgrids || 4;
        this.totalSubdivisions = Math.sqrt(this.totalSubgrids);
        this.buildGrid();

        table = document.getElementById("sudoku-table");

        //can event capturing, don't need to worry about IE that don't support it
        table.addEventListener("blur", this.handleBlur.bind(this), true);

        table.addEventListener("keyup", this.handleKeyup.bind(this));
        if (conf.prefillBoard) {
            this.buildRandomValues();
        }

    }
};

Sudoku.init({totalSubgrids: 4, prefillBoard: true});


