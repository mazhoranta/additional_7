var SUDOKU_ELEMENTS = [1, 2, 3, 4, 5, 6, 7, 8, 9];

module.exports = function solveSudoku(matrix) {
  let solvedSudoku = matrix;
  const emptyCellsArray = getEmptyCells(solvedSudoku),
        emptyCellsCount = emptyCellsArray.length;
  let emptyCell = 0;
  while (emptyCell < emptyCellsCount) {
    const row = emptyCellsArray[emptyCell][0],
          col = emptyCellsArray[emptyCell][1];
    let isFind = false;
    
    for (let i = 0, numberOptionsCount = emptyCellsArray[emptyCell][2].length; i < numberOptionsCount; i++) {
      if (isValid(row, col, emptyCellsArray[emptyCell][2][i], solvedSudoku)) {
        solvedSudoku[row][col] = emptyCellsArray[emptyCell][2][i];
        emptyCellsArray[emptyCell][2].splice(i, 1);
        emptyCell++;
        isFind = true;
        if (emptyCellsArray[emptyCell])
          emptyCellsArray[emptyCell][2] = getNumberOptions(emptyCellsArray[emptyCell][0], emptyCellsArray[emptyCell][1], solvedSudoku);
        break;
      }
    }

    if (solvedSudoku[row][col] === 0 || !isFind) {
      emptyCell--;
      solvedSudoku[emptyCellsArray[emptyCell][0]][emptyCellsArray[emptyCell][1]] = 0;
    }
  }

  return solvedSudoku;
}

function getEmptyCells(matrix) {
  const emptyCellsArray = [];
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (matrix[row][col] === 0) {
        emptyCellsArray.push([row, col, getNumberOptions(row, col, matrix)]);
      }
    }
  }

  return emptyCellsArray;
}

function getNumberOptions(row, col, matrix) {
  let numberOptions = arraysDifference(SUDOKU_ELEMENTS, rowContent(matrix, row));
  numberOptions = arraysDifference(numberOptions, columnContent(matrix, col));
  numberOptions = arraysDifference(numberOptions, sectionContent(matrix, row, col));

  return numberOptions;
}

function arraysDifference(array1, array2) {
  const difference = [];
  for (let i = 0, length1 = array1.length; i < length1; i++) {
    let isFound = false;
    for (let j = 0, length2 = array2.length; j < length2; j++) {
      if (array1[i] === array2[j]) {
        isFound = true;
        break;
      }
    }
    if (!isFound) {
      difference.push(array1[i]);
    }
  }

  return difference;
};

function rowContent(matrix, row) {
  const content = [];
  for (let i = 0; i < 9; i++) {
    if (matrix[row][i] !== 0) {
      content.push(matrix[row][i]);
    }
  }

  return content;
};

function columnContent(matrix, col) {
  const content = [];
  for (let i = 0; i < 9; i++) {
    if (matrix[i][col] !== 0) {
      content.push(matrix[i][col]);
    }
  }

  return content;
};

function sectionContent(matrix, row, col) {
  const content = [],
        rowSection = Math.floor(row / 3) * 3,
        colSection = Math.floor(col / 3) * 3;

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (matrix[rowSection + i][colSection + j] !== 0) {
        content.push(matrix[rowSection + i][colSection + j]);
      }
    }
  }

  return content;
};

function isValid(row, col, value, matrix) {
  return ((validateRow(row, col, value, matrix)) &&
          (validateColumn(row, col, value, matrix)) &&
          (validateBox(row, col, value, matrix)));
}

function validateRow(row, col, value, matrix) {
  for (let i = 0; i < 9; i++) {
    if (i === col)
      continue;
    if (matrix[row][i] === value)
      return false;
  }
  return true;
}

function validateColumn(row, col, value, matrix) {
  for (let i = 0; i < 9; i++) {
    if (i === row)
      continue;
    if (matrix[i][col] === value)
      return false;
  }
  return true;
}

function validateBox(row, col, value, matrix) {
  const rowSection = Math.floor(row / 3) * 3,
        colSection = Math.floor(col / 3) * 3;

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (rowSection + i === row && colSection + j === col) 
        continue;
      if (matrix[rowSection + i][colSection + j] === value) {
        return false;
      }
    }
  }

  return true;
}