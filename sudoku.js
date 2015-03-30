if (!window.Sudoku) {
    window.Sudoku = {};
}

Sudoku = {
    totalSubgrids: null,
    totalSubdivisions: null,
    allowedValues: [],
    matrix: [],
    isPuzzleSolved: function () {
//        the puzzle is solved when all rows have lengths equal to the totalSubgrids
        var i;

        for (i = 1; i <= this.totalSubgrids; i++) {
            console.info("row" + i, this.matrix["row" + i].length, this.matrix["row" + i]);
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
                    "<input style='width: 2em; height: 2em; font-size: 2em;' title='" + row + col + ",sg=" + sectId + ",isOdd=" + oddClassName + "' data-sect='" + sectId + "' data-col=" + col + " data-row=" + row + " class='" + oddClassName + "' maxlength=1 type='text'><input type='hidden'></td>";
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
        var target = e.target,
            hiddenInput = target.nextSibling,
            data = {};

        data.value = parseInt(e.target.value);

        console.log("blur, target value=", data.value, " hidden input value", hiddenInput.value);

        if (this.allowedValues.indexOf(data.value) === -1) {
            return;
        }

        if (data.value === parseInt(hiddenInput.value)) {
            console.info("blur input same as hidden input, exit");
            hiddenInput.value = "";
            return;
        }

        data.rowId = "row" + target.dataset.row;
        data.colId = "col" + target.dataset.col;
        data.sectId = "sect" + target.dataset.sect;

        if (hiddenInput.value && data.value !== parseInt(hiddenInput.value)) {
            console.error("blur input different from as hidden input, delete hidden input");
            if (!this.numberExistsInGrid(data)) {
                this.removeInputValueFromMatrix(target, hiddenInput.value);
            }
            hiddenInput.value = "";
        }


        this.validateNumber(data);
    },

    removeInputValueFromMatrix: function (input, value) {
        var row, col, sect;

        value = parseInt(value);

        row = this.matrix["row" + input.dataset.row];
        col = this.matrix["col" + input.dataset.col];
        sect = this.matrix["sect" + input.dataset.sect];

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
    },

    handleFocus: function(e) {
        var target = e.target,
            value = parseInt(target.value),
            hiddenInput = target.nextSibling;

        if (this.allowedValues.indexOf(value) === -1) {
            console.log("focus event, bad input");
            return;
        }

        console.log("putting ", value, " in ", hiddenInput);
        hiddenInput.value = value;
    },

    numberExistsInGrid: function (data) {
        var row, col, value;

        value = data.value;
        row = this.matrix[data.rowId];
        col = this.matrix[data.colId];
        sect = this.matrix[data.sectId];

        if (row.indexOf(value) === -1) {
            console.log(value, "already exists in row", data.rowId);
            return true;
        }

        if (col.indexOf(value) === -1) {
            console.log(value, "already exists in col", data.colId);
            return true;
        }

        if (sect.indexOf(value) === -1) {
            console.log(value, "already exists in sect", data.sectId);
            return true;
        }

        return false;
    },


    validateNumber: function (data, input) {
        var row, rowUniq, col, colUniq, sect, sectUniq, value, silent, result = true;

        if (input && input.value) {
            return;
        }

        if (this.isPuzzleSolved()) {
            console.warn("already solved!");
            return;
        }

        value = data.value;
        silent = data.silent;
        row = this.matrix[data.rowId];
        col = this.matrix[data.colId];
        sect = this.matrix[data.sectId];

        rowUniq = row.indexOf(value) === -1;
        colUniq = col.indexOf(value) === -1;
        sectUniq = sect.indexOf(value) === -1;

        if (rowUniq && colUniq && sectUniq) {
            row.push(value);
            col.push(value);
            sect.push(value);
        } else {
            if (!silent) {
                if (!rowUniq) {
                    console.error(value + " already exists in row", data.rowId);
                }
                if (!colUniq) {
                    console.error(value + " already exists in col", data.colId);
                }
                if (!sectUniq) {
                    console.error(value + " already exists in sect", data.sectId);
                }
            }
            result = false;
        }

        if (this.isPuzzleSolved()) {
            console.warn("already solved!");
            return;
        }
        return result;
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

        console.log(data);

        if (this.validateNumber(data, randomInput)) {
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
        table.addEventListener("focus", this.handleFocus.bind(this), true);

        table.addEventListener("keyup", this.handleKeyup.bind(this));
        if (conf.prefillBoard) {
            this.buildRandomValues();
        }

//        for (i = 1; i <= this.totalSubgrids; i++) {
//            console.info("row" + i, this.matrix["row" + i]);
//        }
    }
};

Sudoku.init({totalSubgrids: 4, prefillBoard: true});


