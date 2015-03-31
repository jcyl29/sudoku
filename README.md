#Sudoku with Plain JavaScript
#####Author: Justin Lui
#####Email: justincylui AT Gmail DOT com

#Introduction

This is my take on programming a function sudoku board game with javascript.

#Technology Considerations

I wanted to make the game work on the modern browsers, such as IE11, Firefox, and Chrome.  Since I don't need to worry about cross browser issues with older browsers, I decided to build the game with plain JavaScript.

# Usage

* Load external file ```sudoku.js```.  It introduces the ```Sudoku``` namespace to window
* Start the game by calling ```Sudoku.init(conf)```.  conf is an optional configuration with the following parameters

    * ```gridLength```: the number of squares on each side of the board. Defaults to 9. A number given that is not a square will result in an error
    * ```prefillBoard```: a Boolean to prefill the board with random Values. Defaults to false.