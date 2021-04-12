const findBestMove = require("./findBestMove");
let test1Gameboard = [null, "o", "x", null, null, "x", null, null, null];
let test2Gameboard = ["x", "o", "x", null, "o", "x", null, null, null];
let test3Gameboard = [null, null, null, null, null, null, null, null, null];
let test4Gameboard = [null, null, null, null, "x", null, null, null, null];

describe("find best move", function () {
  it("loss prevention by filling in index 7", function () {
    expect(findBestMove(test1Gameboard)).toEqual(7);
  });

  it("win by logging index 7", function () {
    expect(findBestMove(test2Gameboard)).toEqual(7);
  });

  it("best move by logging index 4 ", function () {
    expect(findBestMove(test3Gameboard)).toEqual(4);
  });

  it("best move by logging corner move ", function () {
    expect(findBestMove(test3Gameboard)).toEqual(4);
  });
});
