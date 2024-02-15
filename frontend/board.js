async function run() {

  const BOARD_COLOR = "white"
  const BOARDER_COLOR = "white"
  const DOT_COLOR = "black"
  const PLAYER1_COLOR = "crimson"
  const PLAYER1_COLOR_LIT = "lightpink"
  const PLAYER2_COLOR = "royalblue"
  const PLAYER2_COLOR_LIT = "lightsteelblue"
  const PLAYER3_COLOR = "GoldenRod"
  const PLAYER3_COLOR_LIT = "Gold"
  // text
  const TEXT_PLAYER1 = "Player One"
  const TEXT_PLAYER2 = "Player Two"
  const TEXT_PLAYER3 = "Player Three"

  const gameId = window.localStorage.getItem("gameId");
  let myTurn = false;
  await checkTurn();

  async function checkTurn() {
    const checkTurnInterval = setInterval(async () => {
      const res = await fetch(`http://localhost:3000/games/${gameId}/`, {
        "method": "GET",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'user-id': window.localStorage.getItem("userId")
        }
      })
      const resBody = await res.json();
      if (resBody.game.squares.length > 0)
        updateSquares(resBody.game.squares)

      const scoresSum = resBody.game.scores.reduce((a, b) => a + b, 0);
      if (scoresSum === GRID_SIZE * GRID_SIZE) {
        announceWinnner(scorePlayer1, scorePlayer2, scorePlayer3)
        clearInterval(checkTurnInterval);
      }

      PlayersTurn = resBody.game.players.indexOf(window.localStorage.getItem("userId"));
      scorePlayer1 = resBody.game.scores[0];
      scorePlayer2 = resBody.game.scores[1];
      scorePlayer3 = resBody.game.scores[2];
      if (resBody.game.players[resBody.game.turn] === window.localStorage.getItem("userId")) {
        myTurn = true;
        clearInterval(checkTurnInterval);
      }
    }, 100);
  }
  function updateSquares(newSquares) {
    for (let i = 0; i < squares.length; i++) {
      for (let j = 0; j < squares[i].length; j++) {
        squares[i][j].sideBot = newSquares[i][j].sideBot;
        squares[i][j].sideTOP = newSquares[i][j].sideTOP;
        squares[i][j].sideLEFT = newSquares[i][j].sideLEFT;
        squares[i][j].sideRIGHT = newSquares[i][j].sideRIGHT;
        squares[i][j].numSelected = newSquares[i][j].numSelected;
        squares[i][j].owner = newSquares[i][j].owner;

      }
    }
  }



  const side = {
    BOT: 0,
    LEFT: 1,
    RIGHT: 2,
    TOP: 3,

  }

  // creating game casnvas

  const HIGHT = 550;
  const WIDTH = HIGHT * 0.9;
  let canv = document.createElement('canvas');
  canv.height = HIGHT;
  canv.width = WIDTH;
  document.body.appendChild(canv);
  let canRect = canv.getBoundingClientRect();
  // console.log(document.querySelector("canvas").getAttributes);

  // setting dimension
  const DELAY_END = 2; // UNTIL NEW GAME STARTS
  const FPS = 30; // frames per second
  const GRID_SIZE = 2;
  const CELL = WIDTH / (GRID_SIZE + 2);
  const STROKE = CELL / 8;
  const DOT_RADIOUS = STROKE * 1.2;
  const MARGIN = HIGHT - (GRID_SIZE + 1) * CELL;
  const Text_Size_Cell = CELL / 3
  const TEXT_SIZE_TOP = MARGIN / 6;
  var closePopup = document.getElementById("popupclose");



  const start_btn = document.getElementById('start_btn');






  //canvas contex
  let contex = canv.getContext("2d");
  contex.lineWidth = STROKE;

  // game variables:
  let PlayersTurn;
  let squares;
  let currentCells;
  let scorePlayer1, scorePlayer2, scorePlayer3;
  let timeEnd;

  //start a new Game


  // track mouse
  canv.addEventListener("mousemove", function (event) {
    // get mouse position relative to the canvas
    let x = event.clientX - canRect.left;
    let y = event.clientY - canRect.top
    // highlight the suqare side
    if (myTurn)
      highlightSide(x, y);

  }
  );
  canv.addEventListener("click", async function (event) {
    console.log(myTurn);
    if (!myTurn) {
      return;
    }
    let filledSquare = false;
    if (myTurn) {
      const res = selectSide();
      console.log("res", res);
      if (!res.selectedSide) {
        return;
      }
      filledSquare = res.filledSquare;
    }
    myTurn = false;
    const gameId = window.localStorage.getItem("gameId");
    const res = await fetch(`http://localhost:3000/games/${gameId}/move`, {
      "method": "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'user-id': window.localStorage.getItem("userId")
      },
      "body": JSON.stringify({
        squares,
        filledSquare,
        scores: [scorePlayer1, scorePlayer2, scorePlayer3]
      })
    })
    await checkTurn();
  }
  );




  function highlightSide(x, y) {

    // console.log(x)
    // console.log(y)

    // clear previous highlights
    for (let rows of squares) {
      for (let square of rows) {
        square.highlight = null;
      }
    };

    let rows = squares.length;
    let cols = squares[0].length;
    currentCells = [];
    OUTER: for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        // console.log(squares[i][j]);
        // console.log(x,y);
        // console.log(squares[i][j].contains(x,y));
        if (squares[i][j].contains(x, y)) {



          //highlight current
          let highlightedSide = squares[i][j].highlightSide(x, y);
          if (highlightedSide != null) {
            currentCells.push({ row: i, col: j });
          }

          // determine neighbour
          let row = i, col = j, highlight, neighbour = true;
          if (highlightedSide == side.LEFT && j > 0) {
            col = j - 1;
            highlight = side.RIGHT;
          }
          else if (highlightedSide == side.RIGHT && j < cols - 1) {
            col = j + 1;
            highlight = side.LEFT;
          }
          else if (highlightedSide == side.TOP && i > 0) {
            row = i - 1;
            highlight = side.BOT;
          }
          else if (highlightedSide == side.BOT && i < rows - 1) {
            row = i + 1;
            highlight = side.TOP;
          }
          else {
            neighbour = false;
          }

          if (neighbour) {
            squares[row][col].highlight = highlight;
            currentCells.push({ row: row, col: col })
          }

          break OUTER;
        };

      }

    }

  }


  // if(start==true){

  let mainLoop = setInterval(loop, 1000 / FPS);
  newGame();
  // }


  function restart() {
    mainLoop = setInterval(loop, 1000 / FPS);
    newGame();
  }



  //game loop


  function loop() {
    creatBoard();
    createGrid();
    createSquares();
    drawScores();
  };

  function creatBoard() {
    contex.fillStyle = BOARD_COLOR;
    contex.strokeStyle = BOARDER_COLOR;
    contex.fillRect(0, 0, WIDTH, HIGHT);
    contex.strokeRect(STROKE / 2, STROKE / 2, WIDTH - STROKE, HIGHT - STROKE);


  }
  function drowdot(x, y) {
    contex.fillStyle = DOT_COLOR;
    // console.log("Hey")
    contex.beginPath();
    contex.arc(x, y, DOT_RADIOUS, 0, Math.PI * 2);
    contex.fill();
    contex.closePath();


  }

  function getGridX(col) {
    return CELL * (col + 1);
  }


  function getGridY(row) {
    return MARGIN + CELL * row + 1;
  }




  function getColor(PlayersTurn, light) {
    if (PlayersTurn == 0) {
      return light ? PLAYER1_COLOR_LIT : PLAYER1_COLOR

    }
    else if (PlayersTurn == 1) {
      return light ? PLAYER2_COLOR_LIT : PLAYER2_COLOR

    }
    else {
      return light ? PLAYER3_COLOR_LIT : PLAYER3_COLOR

    }



  }





  function createGrid() {

    for (let i = 0; i < GRID_SIZE + 1; i++) {
      for (let j = 0; j < GRID_SIZE + 1; j++) {
        drowdot(getGridX(j), getGridY(i));
      }
    }
  };


  function drawScores() {
    let colPlayer1 = PlayersTurn == 0 ? PLAYER1_COLOR : PLAYER1_COLOR_LIT;
    let colPlayer2 = PlayersTurn == 1 ? PLAYER2_COLOR : PLAYER2_COLOR_LIT;
    let colPlayer3 = PlayersTurn == 2 ? PLAYER3_COLOR : PLAYER3_COLOR_LIT;
    createText(TEXT_PLAYER1, WIDTH * 0.08, MARGIN * 0.14, colPlayer1, TEXT_SIZE_TOP * 1.2)
    createText(scorePlayer1, WIDTH * 0.18, MARGIN * 0.5, colPlayer1, TEXT_SIZE_TOP * 2)

    createText(TEXT_PLAYER2, WIDTH * 0.40, MARGIN * 0.14, colPlayer2, TEXT_SIZE_TOP * 1.2)
    createText(scorePlayer2, WIDTH * 0.49, MARGIN * 0.5, colPlayer2, TEXT_SIZE_TOP * 2)

    createText(TEXT_PLAYER3, WIDTH * 0.70, MARGIN * 0.14, colPlayer3, TEXT_SIZE_TOP * 1.2)
    createText(scorePlayer3, WIDTH * 0.80, MARGIN * 0.5, colPlayer3, TEXT_SIZE_TOP * 2)


    //game over text
    if (timeEnd > 0) {

      timeEnd--;



      announceWinnner(scorePlayer1, scorePlayer2, scorePlayer3)
      // createText(text,WIDTH*0.08,MARGIN * 4.3,color,TEXT_SIZE_TOP)
    }
  }

  function announceWinnner(scorePlayer1, scorePlayer2, scorePlayer3) {
    let WinnerScore = Math.max(scorePlayer1, scorePlayer2, scorePlayer3);
    let text;
    let winners = []
    let color;
    if (WinnerScore == scorePlayer1) {
      winners.push(TEXT_PLAYER1);
      color = PLAYER1_COLOR;
    }
    if (WinnerScore == scorePlayer2) {
      winners.push(TEXT_PLAYER2);
      color = PLAYER2_COLOR;

    }
    if (WinnerScore == scorePlayer3) {
      winners.push(TEXT_PLAYER3);
      color = PLAYER3_COLOR;
    }
    text = 'Winner: ' + winners.join(", ")

    showPopup(text, color);
    clearInterval(mainLoop);
  }


  function createline(x0, y0, x1, y1, color) {

    contex.strokeStyle = color;
    contex.beginPath();
    contex.moveTo(x0, y0);
    contex.lineTo(x1, y1);
    contex.stroke();
    contex.lineCap = 'round';
  };





  function createSquares() {
    for (let row of squares) {
      for (let square of row) {
        square.drawSides();
        square.drawFill();
      }
    }
  };

  function createText(text, x, y, color, size) {
    contex.fillStyle = color;
    contex.font = size + "px dejavu sans mono";
    contex.fillText(text, x, y)


  }





  function newGame() {
    currentCells = [];
    PlayersTurn = 0
    scorePlayer1 = 0
    scorePlayer2 = 0
    scorePlayer3 = 0
    timeEnd = 0;

    // set squares:
    squares = [];
    for (let i = 0; i < GRID_SIZE; i++) {
      // console.log(squares)
      squares[i] = [];
      for (let j = 0; j < GRID_SIZE; j++) {
        squares[i][j] = new Square(getGridX(j), getGridY(i), CELL, CELL);
      }
    }
  };


  function selectSide() {
    let res = {
      selectedSide: false,
      filledSquare: false
    }
    if (currentCells == null || currentCells.length == 0) {
      return res
    }

    let filledSquare = false;
    for (let cell of currentCells) {
      res = squares[cell.row][cell.col].selectSide()
      if (res.filledSquare) {
        filledSquare = true;

      }
    }
    currentCells = [];
    //check for winner
    if (filledSquare) {
      if (scorePlayer1 + scorePlayer2 + scorePlayer3 == GRID_SIZE * GRID_SIZE) {
        //game over
        timeEnd = Math.ceil(DELAY_END * FPS)


      }

    } else {
      //next player turn
      changeTurn();
    }
    return res

  };

  function changeTurn() {
    return;
    if (PlayersTurn == 0) {
      PlayersTurn = 1

    }
    else if (PlayersTurn == 1) {
      PlayersTurn = 2
    }
    else if (PlayersTurn == 2) {
      PlayersTurn = 0
    }




  }






  function Square(x, y, w, h) {
    this.w = w;
    this.h = h;
    this.left = x;
    this.right = x + w;
    this.top = y;
    this.bot = y + h;
    this.highlight = null;
    this.numSelected = 0;
    this.owner = null;
    this.sideBot = { owner: null, selected: false }
    this.sideTOP = { owner: null, selected: false }
    this.sideRIGHT = { owner: null, selected: false }
    this.sideLEFT = { owner: null, selected: false }






    this.contains = function (x, y) {
      return x >= this.left && x < this.right && y >= this.top && y < this.bot;
    };
    this.drawFill = function () {
      if (this.owner == null) {
        return;
      }
      //lighting backgaround
      contex.fillStyle = getColor(this.owner, true)
      contex.fillRect(this.left + STROKE * 1.2, this.top + STROKE * 1.2, this.w - STROKE * 2.4, this.h - STROKE * 2.4);


    }

    this.drawside = function (side, color) {
      // console.log(side)
      // console.log(color)
      switch (side) {
        case 0:

          createline(this.left, this.bot, this.right, this.bot, color);
          break;
        case 1:
          // console.log("SSS")
          createline(this.left, this.top, this.left, this.bot, color);
          break;
        case 2:

          // console.log("SSS")
          createline(this.right, this.top, this.right, this.bot, color);
          break;

        case 3:
          // console.log("SSS")
          createline(this.left, this.top, this.right, this.top, color);
          break;
      }


    }
    this.drawSides = function () {
      //highlight
      if (this.highlight != null) {
        this.drawside(this.highlight, getColor(PlayersTurn, true));
      };

      // selecting

      if (this.sideBot.selected) {
        this.drawside(side.BOT, getColor(this.sideBot.owner, false))
      }
      if (this.sideTOP.selected) {
        this.drawside(side.TOP, getColor(this.sideTOP.owner, false))
      }
      if (this.sideLEFT.selected) {
        this.drawside(side.LEFT, getColor(this.sideLEFT.owner, false))
      }
      if (this.sideRIGHT.selected) {
        this.drawside(side.RIGHT, getColor(this.sideRIGHT.owner, false))
      }

    };

    this.highlightSide = function (x, y) {
      //calcluate the distance to each side from mouse
      let dBOT = this.bot - y;
      let dTOP = y - this.top;
      let dLEFT = x - this.left;
      let dRIGHT = this.right - x;

      // pick the closest one
      let dClosest = Math.min(dBOT, dTOP, dRIGHT, dLEFT);
      // console.log(dClosest)
      //Highlight the closest if already not selected
      if (dClosest == dBOT && !this.sideBot.selected) {
        this.highlight = side.BOT;
      }
      else if (dClosest == dTOP && !this.sideTOP.selected) {
        this.highlight = side.TOP;
      }
      else if (dClosest == dLEFT && !this.sideLEFT.selected) {
        this.highlight = side.LEFT;
      }
      else if (dClosest == dRIGHT && !this.sideRIGHT.selected) {
        this.highlight = side.RIGHT;
      }
      // console.log(this.highlight)
      return this.highlight;
      // console.log(this.highlight)


    }


    this.selectSide = function () {
      let res = { 'filledSquare': false, selectedSide: false }
      if (this.highlight == null) {
        return res;
      }
      res.selectedSide = true;

      //select the highlighted
      switch (this.highlight) {
        case side.BOT:
          this.sideBot.owner = PlayersTurn;
          this.sideBot.selected = true;
          break;
        case side.TOP:
          this.sideTOP.owner = PlayersTurn;
          this.sideTOP.selected = true;
          break;
        case side.LEFT:
          this.sideLEFT.owner = PlayersTurn;
          this.sideLEFT.selected = true;
          break;
        case side.RIGHT:
          this.sideRIGHT.owner = PlayersTurn;
          this.sideRIGHT.selected = true;
          break;
      }
      this.highlight = null;
      // increase the number of selected Sides
      this.numSelected++;
      if (this.numSelected == 4) {
        this.owner = PlayersTurn;

        if (PlayersTurn == 0) {
          scorePlayer1++;

        }
        else if (PlayersTurn == 1) {
          scorePlayer2++

        }
        else {
          scorePlayer3++;

        }

        //filled
        res.filledSquare = true;
        return res;
      }
      // not filled
      return res;

    };
  }



  function showPopup(text, color) {
    // console.log(document.getElementById('popuptext'));
    document.getElementById('popuptext').innerHTML = text;
    document.getElementById('popuptext').style.color = color;

    overlay.style.visibility = 'visible';
    popup.style.visibility = 'visible';
  }
  // Close Popup Event
  closePopup.onclick = function () {
    overlay.style.visibility = 'hidden';
    popup.style.visibility = 'hidden';
  };
  // button.onclick = ()=>showPopup("salam")
  // Show Overlay and Popu


}
