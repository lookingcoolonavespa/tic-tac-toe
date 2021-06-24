const player = (name, marker, score, scoreboard) => {
  return { name, marker, score, scoreboard };
};
let player1;
let player2;
let monster;

const helpers = (() => {
  const show = (element) => {
    if (element) element.classList.remove("inactive");
  };
  const hide = (element) => {
    element.classList.add("inactive");
  };

  const fade = (element) => {
    element.classList.add("not-my-turn");
  };
  const reveal = (element) => {
    element.classList.remove("not-my-turn");
  };

  return {
    show,
    hide,
    fade,
    reveal,
  };
})();

const game = (() => {
  var turn;

  const finishMove = () => {
    var gameStatus = isGameOver(gameboard.array);
    if (gameStatus[0] === false) return game.handleTurns();
    onGameOver(gameStatus[1]);
  };

  const handleTurns = () => {
    var op;
    start.op === "friend" ? (op = player2) : (op = monster);
    if (!game.turn) game.turn = op;
    game.turn == player1
      ? (helpers.fade(player1.scoreboard),
        helpers.reveal(op.scoreboard),
        (game.turn = op))
      : (helpers.fade(op.scoreboard),
        helpers.reveal(player1.scoreboard),
        (game.turn = player1));

    if (game.turn.name === "monster") cpu.makeMove();
  };

  const cpu = (() => {
    const generateMove = () => {
      var emptyGameSquares = [];
      for (i = 0; i < 9; i++) {
        if (!gameboard.array[i]) emptyGameSquares.push(i);
      }

      const rdmMove =
        emptyGameSquares[Math.floor(Math.random() * emptyGameSquares.length)];

      return rdmMove;
    };

    const displayMove = () => {
      const miniMaxMove = monsterCode.minimax(gameboard.array, 1, true);

      gameboard.array[miniMaxMove.index] = monster.marker;

      const gridSquare = document.getElementById(`${miniMaxMove.index}`);
      gridSquare.textContent = monster.marker;

      game.finishMove();
    };

    const makeMove = () => {
      setTimeout(cpu.displayMove, 1000);
    };

    const monsterCode = (() => {
      const grabEmptySquares = (array) => {
        var emptyGameSquares = [];
        for (i = 0; i < 9; i++) {
          if (!array[i]) emptyGameSquares.push(i);
        }
        return emptyGameSquares;
      };

      function evaluate(board, isMaximizingPlayer, depth) {
        var gameStatus = game.isGameOver(board);
        if (gameStatus[0] === false) return;
        if (gameStatus[1] === "win")
          return isMaximizingPlayer ? +10 - depth : -10 + depth;
        if (gameStatus[1] === "tie") return 0;
      }

      function minimax(board, depth, isMaximizingPlayer) {
        var gameStatus = game.isGameOver(board);
        if (gameStatus[0] == true) {
          const evaluation = evaluate(board, !isMaximizingPlayer, depth);
          return evaluation;
        }

        var availableMoves = grabEmptySquares(board);
        var bestVal;
        isMaximizingPlayer ? (bestVal = -Infinity) : (bestVal = Infinity);

        var bestMove = {
          index: null,
          evaluation: null,
        };

        availableMoves.forEach((move) => {
          var simulGameboard = JSON.parse(JSON.stringify(board));

          isMaximizingPlayer
            ? (simulGameboard[move] = "o")
            : (simulGameboard[move] = "x");

          value = minimax(simulGameboard, depth + 1, !isMaximizingPlayer);

          if (depth === 1) {
            if (value > bestVal) {
              bestMove.index = move;
              bestMove.evaluation = value;
            }
          }

          isMaximizingPlayer
            ? (bestVal = Math.max(bestVal, value))
            : (bestVal = Math.min(bestVal, value));
        });

        return depth === 1 ? bestMove : bestVal;
      }

      return {
        minimax,
      };
    })();

    return {
      makeMove,
      displayMove,
    };
  })();

  const isGameOver = (array) => {
    var gameOver = false;

    if (
      (array[0] && array[0] === array[1] && array[0] === array[2]) ||
      (array[3] && array[3] === array[4] && array[3] === array[5]) ||
      (array[6] && array[6] === array[7] && array[6] === array[8])
    ) {
      return (gameOver = [true, "win"]);
    }
    if (
      (array[0] && array[0] === array[4] && array[0] === array[8]) ||
      (array[2] && array[2] === array[4] && array[2] === array[6])
    ) {
      return (gameOver = [true, "win"]);
    }
    if (
      (array[1] && array[1] === array[4] && array[4] === array[7]) ||
      (array[0] && array[0] === array[3] && array[3] === array[6]) ||
      (array[2] && array[2] === array[5] && array[5] === array[8])
    ) {
      return (gameOver = [true, "win"]);
    }
    if ([...array].every((index) => index)) {
      return (gameOver = [true, "tie"]);
    }
    return (gameOver = [false, null]);
  };

  const onGameOver = (gameState) => {
    switch (gameState) {
      case "win":
        show(`${game.turn.name} wins`);
        game.turn.score++;
        handleScore();
        console.log(`${game.turn.name} wins`);
        break;
      case "tie":
        show("tie game");
        console.log("tie game");
        break;
    }
  };

  const handleScore = () => {
    var op;
    start.op === "friend" ? (op = player2) : (op = monster);

    const player1Score = player1.scoreboard.querySelector(".score");
    player1Score.textContent = player1.score;

    const opScore = op.scoreboard.querySelector(".score");
    opScore.textContent = op.score;
  };

  const resultPopup = document.querySelector(".result");
  const popup = (() => {
    const okBtn = resultPopup.querySelector(".ok-btn");
    const newOp = resultPopup.querySelector(".new-op-btn");

    okBtn.addEventListener("click", newRound);

    newOp.addEventListener("click", newGame);

    function newRound() {
      erase(gameboard.array);
      if (game.turn.name === "monster") handleTurns();
      hidePopup();
    }

    function newGame() {
      player1 = undefined;
      player2 = undefined;

      helpers.hide(start.pageGame);
      helpers.show(start.pageStart);

      erase(gameboard.array);
      hidePopup();
    }

    function erase(array) {
      const gridSquares = gameboard.html.querySelectorAll(".game-square");
      for (j = 0; j < 9; j++) {
        array[j] = undefined;
        gridSquares[j].textContent = "";
      }
    }
  })();

  const title = document.querySelector(".title");
  function show(result) {
    const resultText = resultPopup.querySelector("p");
    resultText.textContent = result;
    helpers.show(resultPopup);
    (function addFaded() {
      start.pageGame.classList.add("faded");
      title.classList.add("faded");
    })();
  }

  function hidePopup() {
    helpers.hide(resultPopup);
    (function removeBlur() {
      start.pageGame.classList.remove("faded");
      title.classList.remove("faded");
    })();
  }

  return {
    turn,
    finishMove,
    handleTurns,
    handleScore,
    onGameOver,
    cpu,
    isGameOver,
  };
})();

const gameboard = (() => {
  var html = document.querySelector(".gameboard");
  var array = [];
  array.length = 9;

  (function build() {
    for (let i = 0; i < 9; i++) {
      const gridSquare = document.createElement("div");
      gridSquare.classList.add("game-square");
      gridSquare.id = i;
      gridSquare.addEventListener("click", () => {
        if (game.turn.name === "monster") return;
        makePlayerMove(gridSquare);
      });

      function makePlayerMove(square) {
        if (!square.textContent) {
          displayMove(square, game.turn.marker);
          array.splice(+square.id, 1, game.turn.marker);
          game.finishMove();
        }
      }
      html.appendChild(gridSquare);
    }
  })();

  function displayMove(square, marker) {
    square.textContent = marker;
  }

  return {
    array,
    html,
  };
})();

const start = (() => {
  var pageStart = document.querySelector(".start");
  var friendBtn = pageStart.querySelector(".friend-btn");
  var cpuBtn = pageStart.querySelector(".cpu-btn");
  var op;

  friendBtn.addEventListener("click", function () {
    onSelectOp("friend");
  });
  cpuBtn.addEventListener("click", function () {
    onSelectOp("cpu");
  });

  var pageName = document.querySelector(".name");
  var pageNameSubmit = pageName.querySelector(".name-btn");
  const pageNameText = pageName.querySelector(".name-text");

  pageNameSubmit.addEventListener("click", () => {
    start.op === "friend" ? createPlayers("friend") : createPlayers("cpu");
  });

  var pageGame = document.querySelector(".game");

  var nameInputs = pageName.querySelectorAll("input");
  function onSelectOp(btn) {
    helpers.hide(pageStart);
    switch (btn) {
      case "friend":
        start.op = "friend";
        helpers.show(nameInputs[1]);
        pageNameText.textContent = "What are your names?";
        helpers.show(pageName);
        break;
      case "cpu":
        start.op = "cpu";
        helpers.hide(nameInputs[1]);
        pageNameText.textContent = "What is your name?";
        helpers.show(pageName);
    }
  }

  function createPlayers() {
    const player1Name = nameInputs[0].value;

    const player1Scoreboard = document.querySelector(".player-scoreboard");

    player1 = player(player1Name, "x", 0, player1Scoreboard);

    const player1NameScore = player1Scoreboard.querySelector("p");
    player1NameScore.textContent = player1Name;

    const cpuScoreboard = document.querySelector(".cpu-scoreboard");
    const player2Scoreboard = document.querySelector(".player2-scoreboard");

    switch (start.op) {
      case "friend":
        const player2Name = nameInputs[1].value;
        player2 = player(player2Name, "o", 0, player2Scoreboard);

        const player2NameScore = player2Scoreboard.querySelector("p");
        player2NameScore.textContent = player2Name;

        helpers.hide(cpuScoreboard);
        helpers.show(player2Scoreboard);
        break;
      case "cpu":
        monster = player("monster", "o", 0, cpuScoreboard);
        helpers.hide(player2Scoreboard);
        helpers.show(cpuScoreboard);
        break;
    }

    helpers.hide(pageName);
    helpers.show(pageGame);

    game.handleScore();
    game.handleTurns();
  }
  return {
    op,
    pageGame,
    pageStart,
  };
})();
