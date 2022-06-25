const koch_snowflake = require('koch-snowflake-cli');

const getWidth = function(n) {
  if (n === 0) {
    return 1;
  } else if (n === 1) {
    return 5;
  }
  return 3 * getWidth(n - 1) + 2;
}

const getHeight = function(n) {
  if (n === 0) {
    return 1;
  }
  return parseInt(getWidth(n) / 2) + 1;
}

const createBoard = function(w, h) {
  let board = [];
  for (let i = 0; i < h; i++) {
    let row = [];
    for (let j = 0; j < w; j++) {
      row.push(' ');
    }
    board.push(row);
  }
  return board;
}

const snowflakeToBoard = function(data) {
  const parts = data.split('\n').filter(p => p.length > 1);
  let board = [];
  for (let i = 0; i < parts.length; i++) {
    let row = [];
    for (let j = 1; j < parts[i].length; j++) {
      row.push(parts[i].charAt(j));
    }
    board.push(row);
  }
  return board;
}

const drawTriangle = function(board, pos, scale) {
  var curW = getWidth(scale);
  var startX = pos.x - parseInt(curW / 2.0);
  var curY = pos.y;
  for (let i = 0; i < getHeight(scale); i++) {
    for (let j = 0; j < curW; j++) {
      if (j % 2 === 0) {
        board[curY][startX + j] = '▲';
      } else {
        board[curY][startX + j] = '▼';
      }
    }
    curW -= 2;
    startX += 1;
    curY += 1;
  }
}

const draw = function(board) {
  var result = '\n ';
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      result += board[board.length - i - 1][j];
    }
    result += '\n ';
  }
  return result;
}

const cutSnowflakeTop = function(triangleBoard, snowflakeBoard) {
  const snowflakeTopLength = parseInt(snowflakeBoard.length / 4);
  for (let i = 0; i < snowflakeTopLength; i++) {
    for (let j = 0; j < snowflakeBoard[i].length; j++) {
      if (snowflakeBoard[snowflakeTopLength - i - 1][j] !== ' ') {
        triangleBoard[i][j] = ' ';
      }
    }
  }
}

const cutSnowflakeLeft = function(triangleBoard, snowflakeBoard) {
  const snowflakeTopLength = parseInt(snowflakeBoard.length / 4);
  const snowflakeSideLength = parseInt(snowflakeBoard[0].length / 2);

  for (let i = 0; i < triangleBoard.length; i++) {
    for (let j = 0; j < snowflakeSideLength; j++) {
      if (snowflakeBoard[snowflakeBoard.length - i - 1][snowflakeSideLength + j + 1] !== ' ') {
        triangleBoard[i][j] = ' ';
      }
    }
  }
}

const cutSnowflakeRight = function(triangleBoard, snowflakeBoard) {
  const snowflakeTopLength = parseInt(snowflakeBoard.length / 4);
  const snowflakeSideLength = parseInt(snowflakeBoard[0].length / 2);

  for (let i = 0; i < triangleBoard.length; i++) {
    for (let j = 0; j < snowflakeSideLength; j++) {
      if (snowflakeBoard[snowflakeBoard.length - i - 1][j] !== ' ') {
        triangleBoard[i][snowflakeSideLength + j + 1] = ' ';
      }
    }
  }
}

const create = function(n, scale) {
  if (n === undefined || n < 0) {
    return '';
  }
  if (scale === undefined || scale < n) {
    scale = n;
  }

  const triangleBoard = createBoard(getWidth(scale), getHeight(scale));
  drawTriangle(triangleBoard, { x: parseInt(getWidth(scale) / 2.0), y: 0 }, scale);

  if (n > 0) {
    const snowflake = koch_snowflake.create(n, scale);
    const snowflakeBoard = snowflakeToBoard(snowflake);
    cutSnowflakeTop(triangleBoard, snowflakeBoard);
    cutSnowflakeLeft(triangleBoard, snowflakeBoard);
    cutSnowflakeRight(triangleBoard, snowflakeBoard);
  }

  return draw(triangleBoard);

}

module.exports = {
  create: create
};