"use strict"

// model//
var gBoard

// gLevel
var gLevel = {
  SIZE: 4,
  MINES: 2,
}

// gGame
var gGame = {
  isOn: false,
  revealedCount: 0,
  markedCount: 0,
  secsPassed: 0,
}

function onInit() {
  gGame.isOn = true
  gBoard = buildBoard()
  //   console.log(gBoard)
  renderBoard(gBoard)
}

function buildBoard() {
  var board = []
  for (var i = 0; i < gLevel.SIZE; i++) {
    var row = []
    for (var j = 0; j < gLevel.SIZE; j++) {
      var cell = {
        minesAroundCount: 0,
        isRevealed: false,
        isMine: false,
        isMarked: false,
      }
      row.push(cell)
    }
    board.push(row)
  }
  board[3][2].isMine = true
  board[3][3].isMine = true
  setMinesNegsCount(board)
  console.table(board)
  return board
}

function setMinesNegsCount(board) {
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board[i].length; j++) {
      if (board[i][j].isMine) continue

      var count = getMinesNegsCount(board, i, j)
      board[i][j].minesAroundCount = count
    }
  }
}

function getMinesNegsCount(board, rowIdx, colIdx) {
  var count = 0

  for (var x = -1; x <= 1; x++) {
    for (var y = -1; y <= 1; y++) {
      if (x === 0 && y === 0) continue

      var neighborRow = rowIdx + x
      var neighborCol = colIdx + y

      if (neighborRow < 0 || neighborRow >= board.length) continue
      if (neighborCol < 0 || neighborCol >= board[0].length) continue

      if (board[neighborRow][neighborCol].isMine) {
        count++
      }
    }
  }

  return count
}

function renderBoard(board) {
  var strHTML = ``

  for (var i = 0; i < board.length; i++) {
    strHTML += `\n<tr>`

    for (var j = 0; j < board[i].length; j++) {
      var cell = board[i][j]

      strHTML += `\n<td>`

      if (!cell.isRevealed) {
        strHTML += `<button onclick="onCellClicked(this, ${i}, ${j})"></button>`
      } else {
        if (cell.isMine) {
          strHTML += `💥`
        } else if (cell.minesAroundCount > 0) {
          strHTML += cell.minesAroundCount
        }
      }
      strHTML += `</td>`
    }

    strHTML += `</tr>`
  }
  const elBoard = document.querySelector(".board")
  //   console.log(elBoard);

  //   console.log(strHTML);
  elBoard.innerHTML = strHTML
}

function onCellClicked(elCell, i, j) {
  if (!gGame.isOn) return
  var cell = gBoard[i][j]
  if (cell.isRevealed || cell.isMarked) return

  cell.isRevealed = true
  console.table(gBoard)

  renderBoard(gBoard)
  if (cell.isMine) {
    gGame.isOn = false
  }
}
