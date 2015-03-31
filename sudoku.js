if (!window.Sudoku) {
    window.Sudoku = {};
}

Sudoku = {
    gridLength: null,
    totalSubdivisions: null,
    allowedValues: [],
    matrix: [],
    isPuzzleSolved: function () {
//        the puzzle is solved when all rows have lengths equal to the gridLength
        var i;

        for (i = 1; i <= this.gridLength; i++) {
            if (this.matrix["row" + i].length != this.gridLength) {
                return false;
            }
        }

        return true;
    },

    buildGrid: function () {
        //build the html for the sudoku
        //assign the arrays to store the column, row, and section values

        var row, sectRow, sectCol, sectId, oddClassName, html, sectionBorderClasses;

        html = "<table id='sudoku-table'>";

        for (row = 1; row <= this.gridLength; row++) {
            this.matrix["row" + row] = [];
            this.matrix["col" + row] = [];

            this.allowedValues.push(row);
            html += "<tr>";
            for (col = 1; col <= this.gridLength; col++) {
                sectRow = Math.ceil(row / this.totalSubdivisions);
                sectCol = Math.ceil(col / this.totalSubdivisions);
                sectId = sectRow + "" + sectCol;
                oddClassName = ((sectCol + sectRow) % 2 !== 0) ? "odd" : "";

                sectionBorderClasses = [];
                if (row % this.totalSubdivisions == 0 && this.gridLength / row !== 1) {
                    sectionBorderClasses.push("section-row-border");
                }

                if (!this.matrix["sect" + sectId]) {
                    this.matrix["sect" + sectId] = [];
                }

                if (col % this.totalSubdivisions == 0 && this.gridLength / col !== 1) {
                    sectionBorderClasses.push("section-col-border");
                }

                sectionBorderClasses = sectionBorderClasses.join(" ");

                html += "<td class='" + sectionBorderClasses + "'>" +
                    "<input data-sect='" + sectId + "' data-col=" + col + " data-row=" + row + " class='" + oddClassName + "' maxlength=1 type='text'><input type='hidden'>" +
                    "</td>";
            }
        }

        html += "</tr>";
        html += "</table>";
        document.body.innerHTML = html;
    },

    handleKeyDown: function (e) {
        //keydown handling is specifically for deleting values from the lookup arrays (row, column, section)
        var keyCode = e.keyCode,
            target = e.target,
            deleteKey = (keyCode == 46), backspaceKey = (keyCode == 8),
            sel, deletedText, val,
            data = {},
            getInputSelection = function (input) {
                var start = 0,
                    end = 0;

                start = input.selectionStart;
                end = input.selectionEnd;
                return {
                    start: start,
                    end: end,
                    length: end - start
                };
            };

        data.rowId = "row" + target.dataset.row;
        data.colId = "col" + target.dataset.col;
        data.sectId = "sect" + target.dataset.sect;

        if (deleteKey || backspaceKey) {
            val = e.target.value;
            sel = getInputSelection(e.target);
            if (sel.length) {
                deletedText = val.slice(sel.start, sel.end);
            } else {
                deletedText = val.charAt(deleteKey ? sel.start : sel.start - 1);
            }

            data.value = parseInt(deletedText);
            if (!this.numberExistsInGrid(data)) {
                this.removeInputValueFromMatrix(e.target, deletedText);
            }
        }
    },

    numberExistsInGrid: function (data) {
        //we need to check if the value exists in the lookup arrays (row, column, section)
        //before deleting them
        var row, col, value;

        value = data.value;
        row = this.matrix[data.rowId];
        col = this.matrix[data.colId];
        sect = this.matrix[data.sectId];

        if (row.indexOf(value) === -1) {
            return true;
        }

        if (col.indexOf(value) === -1) {
            return true;
        }

        if (sect.indexOf(value) === -1) {
            return true;
        }

        return false;
    },

    handleBlur: function (e) {
        //the blur handler is used in tandem with focus handler to check
        //for values that are deleted by typing over the previous one

        var target = e.target,
            hiddenInput = target.nextSibling,
            data = {};

        data.value = parseInt(e.target.value);

        if (this.allowedValues.indexOf(data.value) === -1) {
            return;
        }

        if (data.value === parseInt(hiddenInput.value)) {
            hiddenInput.value = "";
            return;
        }

        data.rowId = "row" + target.dataset.row;
        data.colId = "col" + target.dataset.col;
        data.sectId = "sect" + target.dataset.sect;

        if (hiddenInput.value && data.value !== parseInt(hiddenInput.value)) {
            if (!this.numberExistsInGrid(data)) {
                this.removeInputValueFromMatrix(target, hiddenInput.value);
            }
            hiddenInput.value = "";
        }

        this.validateNumber(data);
    },

    handleFocus: function (e) {
        //the focus handler is set a value to the hidden input, which is always a sibling of the visible
        //text input

        var target = e.target,
            value = parseInt(target.value),
            hiddenInput = target.nextSibling;

        if (this.allowedValues.indexOf(value) === -1) {
            return;
        }

        hiddenInput.value = value;
    },

    removeInputValueFromMatrix: function (input, value) {
        //deleting the value from the lookup arrays (row, column, section)
        var row, col, sect;

        value = parseInt(value);

        row = this.matrix["row" + input.dataset.row];
        col = this.matrix["col" + input.dataset.col];
        sect = this.matrix["sect" + input.dataset.sect];

        if (row.indexOf(value) !== -1) {
            row.splice(row.indexOf(value));
        }

        if (col.indexOf(value) !== -1) {
            col.splice(col.indexOf(value));
        }

        if (sect.indexOf(value) !== -1) {
            sect.splice(sect.indexOf(value));
        }

        input.nextSibling.value= "";
    },

    validateNumber: function (data, input) {
        //given the number, and its position on the grid, check the number with the lookup arrays
        //and either validate it or report error message to the game message element

        var row, rowUniq, col, colUniq, sect, sectUniq, value, silent, result = true,
            gameMessage = document.getElementById("game-message"),
            message = "";

        if (input && input.value) {
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

        sectUniq = sect.indexOf(value) === -1;

        if (rowUniq && colUniq && sectUniq) {
            row.push(value);
            col.push(value);
            sect.push(value);
        } else {
            if (!silent) {
                if (!rowUniq) {
                    message += "<p>" + value + " already exists in " + data.rowId + ".</p>";

                }
                if (!colUniq) {
                    message += "<p>" + value + " already exists in " + data.colId + ".</p>";
                }
                if (!sectUniq) {
                    message += "<p>" + value + " already exists in " + data.sectId + ".</p>";
                }
                gameMessage.innerHTML = message;
            }
            result = false;
        }

        if (result && gameMessage) {
            gameMessage.innerHTML = "<p>Good job...keep going!</p>";
        }

        if (this.isPuzzleSolved()) {
            gameMessage.innerHTML = "<p>Puzzle Solved!</p>";
            return;
        }

        return result;
    },

    buildRandomValue: function () {
        //check a random number, random input, and assign it the input
        //ensure the input doesn't already have a value before assigning it

        var gridLength = this.gridLength,
            randomRow = Math.ceil(Math.random() * gridLength),
            randomCol = Math.ceil(Math.random() * gridLength),
            randomValue = Math.ceil(Math.random() * gridLength),
            sectId,
            data = {};

        randomInput = Array.prototype.filter.call(document.getElementsByTagName("input"), function (el) {
            return el.dataset.row == randomRow && el.dataset.col == randomCol;
        });

        randomInput = randomInput[0];
        sectId = randomInput.dataset.sect;

        data.value = randomValue;
        data.rowId = "row" + randomRow;
        data.colId = "col" + randomCol;
        data.sectId = "sect" + sectId;
        data.silent = true;

        if (this.validateNumber(data, randomInput)) {
            randomInput.value = randomValue;
            randomInput.disabled = true;
        }
    },

    buildRandomValues: function () {
        //arbitrary choose gridLength as the amount of random values to put
        //on the board;

        for (var i = 0; i < this.gridLength; i++) {
            this.buildRandomValue();
        }
    },

    loadCss: function () {
        //load CSS file with javascript
        var link;

        link = document.createElement("link");
        link.href = "https://rawgit.com/jcyl29/sudoku/master/sudoku.css";
        link.type = "text/css";
        link.rel = "stylesheet";
        link.media = "screen,print";

        document.getElementsByTagName("head")[0].appendChild(link);

    },

    buildMessageElement: function() {
        var div = document.createElement("div");
        div.id = "game-message";
        div.innerHTML = "<p>Good Luck!</p>";
        document.body.appendChild(div);
    },

    init: function (conf) {
        conf = conf || {};

        var table, prefillBoard;

        prefillBoard = conf.prefillBoard || true;

        this.gridLength = conf.gridLength || 9;

        if (this.gridLength !== Math.pow(Math.ceil(Math.sqrt(this.gridLength)),2)) {
            throw Error("number is not a square!");
        }

        this.totalSubdivisions = Math.sqrt(this.gridLength);
        this.buildGrid();

        table = document.getElementById("sudoku-table");

        //can event capturing, don't need to worry about IE that don't support it
        table.addEventListener("blur", this.handleBlur.bind(this), true);
        table.addEventListener("focus", this.handleFocus.bind(this), true);

        table.addEventListener("keydown", this.handleKeyDown.bind(this));

        if (prefillBoard) {
            this.buildRandomValues();
        }

        this.loadCss();
        this.buildMessageElement();
    }
};