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

const isValidRotation = function(rotation) {
  return rotation !== undefined && (rotation.toLowerCase() === 'flip' || rotation.toLowerCase() === 'standard');
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

const drawTriangle = function(board, pos, size, character) {
  var curW = getWidth(size);
  var startX = pos.x - parseInt(curW / 2.0);
  var curY = pos.y;
  for (let i = 0; i < getHeight(size); i++) {
    for (let j = 0; j < curW; j++) {
      if (character) {
        board[curY][startX + j] = character;
      } else {
        if (j % 2 === 0) {
          board[curY][startX + j] = '▲';
        } else {
          board[curY][startX + j] = '▼';
        }
      }
    }
    curW -= 2;
    startX += 1;
    curY += 1;
  }
}

const drawInverseTriangle = function(board, pos, size, character) {
  var curW = 1;
  var startX = pos.x;
  var curY = pos.y;
  for (let i = 0; i < getHeight(size); i++) {
    for (let j = 0; j < curW; j++) {
      if (character) {
        board[curY][startX + j] = character;
      } else {
        if (j % 2 === 0) {
          board[curY][startX + j] = '▼';
        } else {
          board[curY][startX + j] = '▲';
        }
      }
    }
    curW += 2;
    startX -= 1;
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

const cutSnowflakeBottomLeft = function(triangleBoard, snowflakeBoard) {
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

const cutSnowflakeBottomRight = function(triangleBoard, snowflakeBoard) {
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

const cutSnowflakeBottom = function(triangleBoard, snowflakeBoard) {
  const snowflakeBottomLength = parseInt(snowflakeBoard.length / 4);
  for (let i = 0; i < snowflakeBottomLength; i++) {
    for (let j = 0; j < snowflakeBoard[i].length; j++) {
      if (snowflakeBoard[snowflakeBoard.length - snowflakeBottomLength + i][j] !== ' ') {
        triangleBoard[triangleBoard.length - i - 1][j] = ' '; 
      }
    }
  }
}

const cutSnowflakeTopLeft = function(triangleBoard, snowflakeBoard) {
  const snowflakeTopLength = parseInt(snowflakeBoard.length / 4);
  const snowflakeSideLength = parseInt(snowflakeBoard[0].length / 2);

  for (let i = 0; i < triangleBoard.length; i++) {
    for (let j = 0; j < snowflakeSideLength; j++) {
      if (snowflakeBoard[i][snowflakeSideLength + j + 1] !== ' ') {
        triangleBoard[triangleBoard.length - i - 1][j] = ' ';
      }
    }
  }
}

const cutSnowflakeTopRight = function(triangleBoard, snowflakeBoard) {
  const snowflakeTopLength = parseInt(snowflakeBoard.length / 4);
  const snowflakeSideLength = parseInt(snowflakeBoard[0].length / 2);

  for (let i = 0; i < triangleBoard.length; i++) {
    for (let j = 0; j < snowflakeSideLength; j++) {
      if (snowflakeBoard[i][j] !== ' ') {
        triangleBoard[triangleBoard.length - i - 1][snowflakeSideLength + j + 1] = ' ';
      }
    }
  }
}

const create = function(n, config) {
  if (n === undefined || n < 0) {
    return '';
  }
  
  let size = n;
  if (config && config.size && config.size > n) {
    size = config.size;
  }

  const rotate = config !== undefined && isValidRotation(config.rotate) ? config.rotate.toLowerCase() : 'standard';
  const character = config !== undefined && config.character !== undefined && config.character.length === 1 ? config.character : undefined;

  const triangleBoard = createBoard(getWidth(size), getHeight(size));
  if (rotate === 'flip') {
    drawInverseTriangle(triangleBoard, { x: parseInt(getWidth(size) / 2.0), y: 0 }, size, character);
  } else {
    drawTriangle(triangleBoard, { x: parseInt(getWidth(size) / 2.0), y: 0 }, size, character);
  }

  if (n > 0) {
    const snowflake = koch_snowflake.create(n, { size: size });
    const snowflakeBoard = snowflakeToBoard(snowflake);
    if (rotate === 'flip') {
      cutSnowflakeBottom(triangleBoard, snowflakeBoard);
      cutSnowflakeTopLeft(triangleBoard, snowflakeBoard);
      cutSnowflakeTopRight(triangleBoard, snowflakeBoard);
    } else {
      cutSnowflakeTop(triangleBoard, snowflakeBoard);
      cutSnowflakeBottomLeft(triangleBoard, snowflakeBoard);
      cutSnowflakeBottomRight(triangleBoard, snowflakeBoard);
    }
  }

  return draw(triangleBoard);

}

module.exports = {
  create: create
};