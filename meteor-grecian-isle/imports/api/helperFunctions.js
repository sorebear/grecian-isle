
export const setWorkerAnimation = (movingFromArr, movingToArr) => {
  if (movingFromArr[0] < movingToArr[0]) {
    // Moving Up A Row
    if (movingFromArr[1] < movingToArr[1]) {
      // Moving Up A Column
      if (movingFromArr[2] < movingToArr[2]) {
        return 'rowInc_colInc_upOneLevel';
      } else if (movingFromArr[2] === movingToArr[2]) {
        return 'rowInc_colInc_sameLevel';
      } else if (movingFromArr[2] === movingToArr[2] - 1) {
        return 'rowInc_colInc_downOneLevel';
      }
      return 'rowInc_colInc_downTwoLevels';
    } else if (movingFromArr[1] < movingToArr[1]) {
      // Moving Down A Column
      if (movingFromArr[2] < movingToArr[2]) {
        return 'rowInc_colDec_upOneLevel';
      } else if (movingFromArr[2] === movingToArr[2]) {
        return 'rowInc_colDec_sameLevel';
      } else if (movingFromArr[2] === movingToArr[2] - 1) {
        return 'rowInc_colDec_downOneLevel';
      }
      return 'rowInc_colDec_downTwoLevels';
    }
    // Staying In The Same Column
    if (movingFromArr[2] < movingToArr[2]) {
      return 'rowInc_colSame_upOneLevel';
    } else if (movingFromArr[2] === movingToArr[2]) {
      return 'rowInc_colSame_sameLevel';
    } else if (movingFromArr[2] === movingToArr[2] - 1) {
      return 'rowInc_colSame_downOneLevel';
    }
    return 'rowInc_colSame_downTwoLevels';
  } else if (movingFromArr[0] > movingToArr[0]) {
    // Moving Down A Row
    if (movingFromArr[1] < movingToArr[1]) {
      // Moving Up A Column
      if (movingFromArr[2] < movingToArr[2]) {
        return 'rowDec_colInc_upOneLevel';
      } else if (movingFromArr[2] === movingToArr[2]) {
        return 'rowDec_colInc_sameLevel';
      } else if (movingFromArr[2] === movingToArr[2] - 1) {
        return 'rowDec_colInc_downOneLevel';
      }
      return 'rowDec_colInc_downTwoLevels';
    } else if (movingFromArr[1] < movingToArr[1]) {
      // Moving Down A Column
      if (movingFromArr[2] < movingToArr[2]) {
        return 'rowDec_colDec_upOneLevel';
      } else if (movingFromArr[2] === movingToArr[2]) {
        return 'rowDec_colDec_sameLevel';
      } else if (movingFromArr[2] === movingToArr[2] - 1) {
        return 'rowDec_colDec_downOneLevel';
      }
      return 'rowDec_colDec_downTwoLevels';
    }
    // Staying In The Same Column
    if (movingFromArr[2] < movingToArr[2]) {
      return 'rowDec_colSame_upOneLevel';
    } else if (movingFromArr[2] === movingToArr[2]) {
      return 'rowDec_colSame_sameLevel';
    } else if (movingFromArr[2] === movingToArr[2] - 1) {
      return 'rowDec_colSame_downOneLevel';
    }
    return 'rowDec_colSame_downTwoLevels';
  }
  if (movingFromArr[1] < movingToArr[1]) {
    // Moving Up A Column
    if (movingFromArr[2] < movingToArr[2]) {
      return 'rowSame_colInc_upOneLevel';
    } else if (movingFromArr[2] === movingToArr[2]) {
      return 'rowSame_colInc_sameLevel';
    } else if (movingFromArr[2] === movingToArr[2] - 1) {
      return 'rowSame_colInc_downOneLevel';
    }
    return 'rowSame_colInc_downTwoLevels';
  } else if (movingFromArr[1] > movingToArr[1]) {
    // Moving Down A Column
    if (movingFromArr[2] < movingToArr[2]) {
      return 'rowSame_colDec_upOneLevel';
    } else if (movingFromArr[2] === movingToArr[2]) {
      return 'rowSame_colDec_sameLevel';
    } else if (movingFromArr[2] === movingToArr[2] - 1) {
      return 'rowSame_colDec_downOneLevel';
    }
    return 'rowSame_colDec_downTwoLevels';
  }
  // Staying In The Same Column
  if (movingFromArr[2] < movingToArr[2]) {
    return 'rowSame_colSame_upOneLevel';
  } else if (movingFromArr[2] === movingToArr[2]) {
    return 'rowSame_colSame_sameLevel';
  } else if (movingFromArr[2] === movingToArr[2] - 1) {
    return 'rowSame_colSame_downOneLevel';
  }
  return 'rowSame_colSame_downTwoLevels';
};
