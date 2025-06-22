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
    const coordLetterIndex = coordLetterIndexRef.indexOf(row)
    const coordIndex = coordLetterIndex * 9 + (Number(column) - 1)
    return coordIndex
  }

  checkRowPlacement(puzzleString, row, column, value) {
    const placementIndex = this.coordToIndex(row, column)
    const placementRowNum = findRowNumber(placementIndex)
    for (let n = 0; n < puzzleString.length; n++) {
      if (findRowNumber(n) === placementRowNum && n !== placementIndex && puzzleString[n] === value) {
        return false
      }
    }
    return true
  }

  checkColPlacement(puzzleString, row, column, value) {
    const placementIndex = this.coordToIndex(row, column)
    const placementColNum = findColNumber(placementIndex)
    for (let n = 0; n < puzzleString.length; n++) {
      if (findColNumber(n) === placementColNum && n !== placementIndex && puzzleString[n] === value) {
        return false
      }
    }
    return true
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    const placementIndex = this.coordToIndex(row, column)
    const placementGridNum = findGridNumber(placementIndex)
    for (let n = 0; n < puzzleString.length; n++) {
      if (findGridNumber(n) === placementGridNum && n !== placementIndex && puzzleString[n] === value) {
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
        possibilityArray = [...possibilityArray, [Number(...input[n])]]
      }
    }
  
    for (let n = 0; n < possibilityArray.length; n++) {
      if (possibilityArray[n].length > 1) {
          for (let m = 0; m < possibilityArray.length; m++) {
              if (findColNumber(m) === findColNumber(n) && possibilityArray[m].length === 1 && m !== n) {
                possibilityArray[n] = possibilityArray[n].filter(num => num != possibilityArray[m][0])
         }
        }
      }
    }
    
    for (let n = 0; n < possibilityArray.length; n++) {
      if (possibilityArray[n].length > 1) {
          for (let m = 0; m < possibilityArray.length; m++) {
              if (findRowNumber(m) === findRowNumber(n) && possibilityArray[m].length === 1 && m !== n) {
               possibilityArray[n] = possibilityArray[n].filter(num => num !== possibilityArray[m][0]) 
              }
          }
      }    
    }
     
    for (let n = 0; n < possibilityArray.length; n++) {
      if (possibilityArray[n].length > 1) {
        for (let m = 0; m < possibilityArray.length; m++) {
            if (findGridNumber(m) === findGridNumber(n) && possibilityArray[m].length === 1 && m !== n) {
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
    if (solution.replace(".","").length < 81) {
      return "unsolvable"
    }
    return solution
  }
}
module.exports = SudokuSolver;
