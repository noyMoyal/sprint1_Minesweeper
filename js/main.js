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
  //    placeMines(board)
  board[3][2].isMine = true
  board[3][3].isMine = true

  setMinesNegsCount(board)

  //   console.table(board)
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

      strHTML += `\n<td oncontextmenu = "onCellMarked(event, ${i}, ${j})"> `

      if (!cell.isRevealed) {
        if (cell.isMarked) {
          strHTML += "🚩"
        } else {
          strHTML += `<button onclick="onCellClicked(this, ${i}, ${j})"></button>`
        }
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
  gGame.revealedCount++

  console.table(gBoard)

  if (cell.isMine) {
    gGame.isOn = false
    revalAllMines(gBoard, i, j)
  } else if (cell.minesAroundCount === 0) {
    expandReveal(gBoard, i, j)

  }
  checkGameOver()
  renderBoard(gBoard)
}

function onCellMarked(ev, i, j) {
  ev.preventDefault()
  if (!gGame.isOn) return
  var cell = gBoard[i][j]
  if (cell.isRevealed) return
  cell.isMarked = !cell.isMarked
  renderBoard(gBoard)
}

// function placeMines(board) {
//   var minesPlaced = 0

//   while (minesPlaced < gLevel.MINES) {
//     var rowIdx = getRandomInt(0, gLevel.SIZE)
//     var colIdx = getRandomInt(0, gLevel.SIZE)

//     var cell = board[rowIdx][colIdx]
//     if (cell.isMine) continue

//     cell.isMine = true

//     minesPlaced++
//   }
// }

function expandReveal(board, rowIdx, colIdx) {
  for (var x = -1; x <= 1; x++) {
    for (var y = -1; y <= 1; y++) {
      if (x === 0 && y === 0) continue

      var neighborRow = rowIdx + x
      var neighborCol = colIdx + y

      if (neighborRow < 0 || neighborRow >= board.length) continue
      if (neighborCol < 0 || neighborCol >= board[0].length) continue
      var neighborCell = board[neighborRow][neighborCol]
      if (
        neighborCell.isMine ||
        neighborCell.isRevealed ||
        neighborCell.isMarked
      )
        continue
      neighborCell.isRevealed = true
	  gGame.revealedCount++

    }
  }
}

function revalAllMines(board) {
  gGame.isOn = false
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board[i].length; j++) {
      var cell = board[i][j]
      if (cell.isMine) {
        cell.isRevealed = true
      }
    }
  }
}

function checkGameOver() {
  if (gGame.isOn == false) return
    var totalCell = gLevel.SIZE * gLevel.SIZE
    var safeCells = totalCell - gLevel.MINES
	if (gGame.revealedCount === safeCells){

	gGame.isOn = false
	alert('Yesss! We survived!')
	console.log('Victory!')

	}

  }




function getRandomInt(min, max) {
  const minCeiled = Math.ceil(min)
  const maxFloored = Math.floor(max)
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled)
}
