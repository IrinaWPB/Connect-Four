/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

let width =0;
let height=0;

let currPlayer = 1; // active player: 1 or 2
let board = []; // array of rows, each row is array of cells  (board[y][x])
const startGameBtn = document.querySelector('#start');
const restartGameBtn = document.querySelector('#restart');
const startScreen = document.querySelector('#start_screen');
const gameScreen = document.querySelector('#game');
const restartScreen = document.querySelector('#restart_screen');
const htmlBoard = document.querySelector('#board');
const columnInput = document.querySelector('#columns');
const rowInput = document.querySelector('#rows');
const winner = document.querySelector('#winner');

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

startGameBtn.addEventListener('click', function(e) {
  e.preventDefault();
  startGame();
  makeBoard();
  makeHtmlBoard();
});

restartGameBtn.addEventListener('click', function() {
  startScreen.classList.remove('hidden');
  gameScreen.classList.add('hidden');
  restartScreen.classList.add('hidden');
  winner.innerHTML ='';
  clearBoard();
});

function clearBoard() {
  htmlBoard.innerHTML = '';
  board = [];
}

function startGame() {
  width = columnInput.value;
  height = rowInput.value;

  startScreen.classList.add('hidden');
  gameScreen.classList.remove('hidden');
  restartScreen.classList.remove('hidden');
}
 

function makeBoard() {
  for (let i = 0; i < height; i++) {
    board.push([]);
    for (let j = 0; j < width; j++) {
      board[i].push(null);
    }
  }
  console.log(board);
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  // TODO: get "htmlBoard" variable from the item in HTML w/ID of "board"
  // TODO: add comment for this code
  // Creating the top row, setting it's id of "column-top" and adding handleClick on click
  const top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);

  for (let x = 0; x < width; x++) {
    const headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  htmlBoard.append(top);

  // TODO: add comment for this code
  // First loop creates rows, second loop creats table cells with id of x-y (number of the cell, 
  //     first number will represent the its row, second number - colomn), and adds cells to each row.
  for (let y = 0; y < height; y++) {
    const row = document.createElement("tr");
    for (let x = 0; x < width; x++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);
      row.append(cell);
    }
    htmlBoard.append(row);
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
  // TODO: write the real version of this, rather than always returning 0
  for (let y = height - 1; y >= 0; y--) {
    if (!board[y][x]) {
      return y;
    }
  }
  return 0;
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
  // TODO: make a div and insert into correct table cell
  const piece = document.createElement('div');
  piece.classList.add('piece', `p${currPlayer}`);
  let playingCell = document.getElementById(`${y}-${x}`);
  playingCell.append(piece);
  console.log(playingCell);
}

/** endGame: announce game end */

function endGame(msg) {
  // TODO: pop up alert message
  setTimeout(function() {
    winner.innerHTML = `<h1>${msg}</h1>`;
    clearBoard();
  }, 2000);
  
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  // get x from ID of clicked cell
  let x = +evt.target.id;
  console.log(evt);

  // get next spot in column (if none, ignore click)
  let y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  // TODO: add line to update in-memory board
  board[y][x] = currPlayer;
  placeInTable(y, x);

  // check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!`);
  }

  // check for tie
  // TODO: check if all cells in board are filled; if so call, call endGame
  if (board.every(row => row.every(td => td))) { 
    return endGame("It's a TIE!!! Try again!");
  }

  // switch players
  // TODO: switch currPlayer 1 <-> 2
  currPlayer = currPlayer === 1 ? 2 : 1;
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < height &&
        x >= 0 &&
        x < width &&
        board[y][x] === currPlayer
    );
  }

  // TODO: read and understand this code. Add comments to help you.

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]]; //any 4 cells together in a row
      let vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];  //any 4 together in colomn
      let diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]]; //Right diagonally
      let diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]]; //Left diagonally
      
      //Checks if any of the wins happen for current playaer
      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

makeBoard();
makeHtmlBoard();
