class SudokuSolver {

  validate(puzzleString) {
    if (puzzleString.length !== 81) {
      return "invalid length"
    }
    const regex = /^[0-9.]{81}$/g
    return regex.test(puzzleString) ? "valid" : "invalid characters"
  }

  coordToIndex(row, column) {
    const coordLetterIndexRef = ["A", "B", "C", "D", "E", "F", "G", "H", "I"]
    const coordLetterIndex = coordLetterIndexRef.indexOf(row.toUpperCase())
    const coordIndex = coordLetterIndex * 9 + (Number(column) - 1)
    return coordIndex
  }

  checkRowPlacement(puzzleString, row, column, value) {
    const placementIndex = this.coordToIndex(row, column)
    const placementRowNum = this.findRowNumber(placementIndex)
    for (let n = 0; n < puzzleString.length; n++) {
      if (this.findRowNumber(n) === placementRowNum && n !== placementIndex && puzzleString[n] === value) {
        return false
      }
    }
    return true
  }

  checkColPlacement(puzzleString, row, column, value) {
    const placementIndex = this.coordToIndex(row, column)
    const placementColNum = this.findColNumber(placementIndex)
    for (let n = 0; n < puzzleString.length; n++) {
      if (this.findColNumber(n) === placementColNum && n !== placementIndex && puzzleString[n] === value) {
        return false
      }
    }
    return true
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    const placementIndex = this.coordToIndex(row, column)
    const placementGridNum = this.findGridNumber(placementIndex)
    for (let n = 0; n < puzzleString.length; n++) {
      if (this.findGridNumber(n) === placementGridNum && n !== placementIndex && puzzleString[n] === value) {
        return false
      }
    }
    return true
  }

  solve(input) {
    let possibilityArray = []
    for (let n = 0; n < input.length; n++) {
      if (input[n] === ".") {
        possibilityArray = [...possibilityArray, [1, 2, 3, 4, 5, 6, 7, 8, 9]]
      } else {
        possibilityArray = [...possibilityArray, [Number(input[n])]]
      }
    }

    for (let n = 0; n < possibilityArray.length; n++) {
      if (possibilityArray[n].length > 1) {
        for (let m = 0; m < possibilityArray.length; m++) {
          if (this.findColNumber(m) === this.findColNumber(n) && possibilityArray[m].length === 1 && m !== n) {
            possibilityArray[n] = possibilityArray[n].filter(num => num != possibilityArray[m][0])
          }
        }
      }
    }

    for (let n = 0; n < possibilityArray.length; n++) {
      if (possibilityArray[n].length > 1) {
        for (let m = 0; m < possibilityArray.length; m++) {
          if (this.findRowNumber(m) === this.findRowNumber(n) && possibilityArray[m].length === 1 && m !== n) {
            possibilityArray[n] = possibilityArray[n].filter(num => num !== possibilityArray[m][0])
          }
        }
      }
    }

    for (let n = 0; n < possibilityArray.length; n++) {
      if (possibilityArray[n].length > 1) {
        for (let m = 0; m < possibilityArray.length; m++) {
          if (this.findGridNumber(m) === this.findGridNumber(n) && possibilityArray[m].length === 1 && m !== n) {
            possibilityArray[n] = possibilityArray[n].filter(num => num !== possibilityArray[m][0])
          }
        }
      }
    }

    if (possibilityArray.flat().length > 81) {
      const possibilityString = possibilityArray.map(num => num.length === 1 ? num : ".").flat().join("")
      if (possibilityString === input) {
        return "unsolvable"
      }
      return this.solve(possibilityString)
    }

    const solution = possibilityArray.map(num => num.length === 1 ? num : ".").flat().join("")
    if (solution.replace(/\./g, "").length < 81) {
      return "unsolvable"
    }
    return solution
  }

  // 🔧 FIXED: Utility functions that were previously missing
  findRowNumber(index) {
    return Math.floor(index / 9)
  }

  findColNumber(index) {
    return index % 9
  }

  findGridNumber(index) {
    const row = this.findRowNumber(index)
    const col = this.findColNumber(index)
    return Math.floor(row / 3) * 3 + Math.floor(col / 3)
  }

}

module.exports = SudokuSolver;
