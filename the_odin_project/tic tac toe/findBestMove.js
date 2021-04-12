const grabEmptySquares = (array) => {
  var emptyGameSquares = [];
  for (i = 0; i < 9; i++) {
    if (!array[i]) emptyGameSquares.push(i);
  }
  return emptyGameSquares;
};
function findBestMove(board) {
  var bestMove = {
    index: null,
    evaluation: null,
  };
  var availableMoves = grabEmptySquares(board);
  availableMoves.forEach((move) => {
    const simulGameboard = JSON.parse(JSON.stringify(board));
    simulGameboard[move] = "o";
    const evaluation = minimax(simulGameboard, 1, false);
    const moveDetails = {
      index: move,
      evaluation: evaluation,
    };
    if (evaluation > bestMove.evaluation || bestMove.evaluation === null) {
      bestMove.index = move;
      bestMove.evaluation = evaluation;
    }
  });
  console.log(bestMove);
  return bestMove.index;
}

function evaluate(board, isMaximizingPlayer, depth) {
  var gameStatus = game.isGameOver(board);
  if (gameStatus[0] != true) return;
  if (gameStatus[1] === "win")
    return isMaximizingPlayer ? +10 - depth : -10 + depth;
  if (gameStatus[1] === "tie") return 0;
}

function minimax(board, depth, isMaximizingPlayer) {
  var gameStatus = isGameOver(board);
  if (gameStatus[0] == true) {
    const evaluation = evaluate(board, isMaximizingPlayer, depth);
    return evaluation;
  }

  var simulGameboard = JSON.parse(JSON.stringify(board));
  var availableMoves = grabEmptySquares(simulGameboard);

  if (isMaximizingPlayer) {
    bestVal = -Infinity;
    availableMoves.forEach((move) => {
      depth % 2 === 0
        ? (simulGameboard[move] = "o")
        : (simulGameboard[move] = "x");
      value = minimax(simulGameboard, depth + 1, false);
      bestVal = Math.max(bestVal, value);

      const moveDetails = {
        index: move,
        evaluation: bestVal,
        depth: depth,
      };
    });
    return bestVal;
  } else {
    bestVal = Infinity;
    availableMoves.forEach((move) => {
      depth % 2 === 0
        ? (simulGameboard[move] = "o")
        : (simulGameboard[move] = "x");

      value = minimax(simulGameboard, depth + 1, true);
      bestVal = Math.min(bestVal, value);

      const moveDetails = {
        index: move,
        evaluation: bestVal,
        depth: depth,
      };
    });
    return bestVal;
  }
}

function isGameOver(array) {
  var gameOver = false;
  if ([...array].every((index) => index)) {
    return (gameOver = [true, "tie"]);
  }
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
  return (gameOver = [false, null]);
}

module.exports = findBestMove;
