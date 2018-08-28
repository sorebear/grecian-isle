import { db } from './firebase';

export const initialGameBoard = [
  [
    { id: 'space-0x0', row: 0, col: 0, height: 0, worker: 0 },
    { id: 'space-0x1', row: 0, col: 1, height: 0, worker: 0 },
    { id: 'space-0x2', row: 0, col: 2, height: 0, worker: 0 },
    { id: 'space-0x3', row: 0, col: 3, height: 0, worker: 0 },
    { id: 'space-0x4', row: 0, col: 4, height: 0, worker: 0 },
  ],
  [
    { id: 'space-1x0', row: 1, col: 0, height: 0, worker: 0 },
    { id: 'space-1x1', row: 1, col: 1, height: 0, worker: 0 },
    { id: 'space-1x2', row: 1, col: 2, height: 0, worker: 0 },
    { id: 'space-1x3', row: 1, col: 3, height: 0, worker: 0 },
    { id: 'space-1x4', row: 1, col: 4, height: 0, worker: 0 },
  ],
  [
    { id: 'space-2x0', row: 2, col: 0, height: 0, worker: 0 },
    { id: 'space-2x1', row: 2, col: 1, height: 0, worker: 0 },
    { id: 'space-2x2', row: 2, col: 2, height: 0, worker: 0 },
    { id: 'space-2x3', row: 2, col: 3, height: 0, worker: 0 },
    { id: 'space-2x4', row: 2, col: 4, height: 0, worker: 0 },
  ],
  [
    { id: 'space-3x0', row: 3, col: 0, height: 0, worker: 0 },
    { id: 'space-3x1', row: 3, col: 1, height: 0, worker: 0 },
    { id: 'space-3x2', row: 3, col: 2, height: 0, worker: 0 },
    { id: 'space-3x3', row: 3, col: 3, height: 0, worker: 0 },
    { id: 'space-3x4', row: 3, col: 4, height: 0, worker: 0 },
  ],
  [
    { id: 'space-4x0', row: 4, col: 0, height: 0, worker: 0 },
    { id: 'space-4x1', row: 4, col: 1, height: 0, worker: 0 },
    { id: 'space-4x2', row: 4, col: 2, height: 0, worker: 0 },
    { id: 'space-4x3', row: 4, col: 3, height: 0, worker: 0 },
    { id: 'space-4x4', row: 4, col: 4, height: 0, worker: 0 },
  ],
];

export const getGameState = (gameId) => {
  return db.ref(`activeGames/${gameId}`).once('value');
}

export const getAvailableGames = () => {
  return db.ref('activeGames').once('value');
}

export const deleteGame = (gameId) => {
  return db.ref(`activeGames/${gameId}`).remove();
};

export const onGameAddedOrRemoved = (callback) => {
  db.ref('activeGames').on('child_added', callback);
  db.ref('activeGames').on('child_removed', callback);
}

export const onCurrentGameChange = (gameId, callback) => {
  db.ref(`activeGames/${gameId}`).on('child_changed', callback);
}

export const createNewGame = (username, selectedGame, localGame) => {
  if (selectedGame.id === 'grecianIsle') {
    return db.ref('activeGames').push({
      gameTitle: selectedGame.name,
      gameTitleRef: selectedGame.id,
      activePlayer: Math.ceil(Math.random() * 2),
      playerCount: 0,
      localGame: localGame,
      creatingPlayer: username,
      joiningPlayer: null,
      leavingPlayer: null,
      pendingRequest: null,
      requestAccepted: false,
      workerBeingPlaced: 1,
      turnPhase: 'placement',
      currentUpdate: null,
      winConditionMet: false,
      selectedWorker: {
        workerId: '',
        row: 0,
        col: 0,
        height: 0,
      },
      gameBoard: initialGameBoard,
    });
  }
  return 'An error occured.';
};

export const addPlayer = (gameId, currentPlayerCount) => {
  console.log('ID', gameId);
  db.ref(`activeGames/${gameId}`).update({
    playerCount: currentPlayerCount + 1
  });
};

export const removePlayer = (gameId, userId, creatingPlayer, joiningPlayer) => {
  console.log('Remove Player Invoked');
  const ref = db.ref(`activeGames/${gameId}`);
  if (userId === 1) {
    ref.update({ 
      leavingPlayer: creatingPlayer,
      creatingPlayer: null,
      $inc: {
        playerCount: -1,
      },
    }, err => {
      if (!err) {
        ActiveGames.remove({
          $and: [
            { _id: id },
            { playerCount:
              { $lte: 0 },
            },
          ],
        });
      }
    });
  } else {
    ActiveGames.update(id, {
      $set: {
        leavingPlayer: joiningPlayer,
        joiningPlayer: null,
      },
      $inc: {
        playerCount: -1,
      },
    }, err => {
      if (!err) {
        ActiveGames.remove({
          $and: [
            { _id: id },
            { playerCount:
              { $lte: 0 },
            },
          ],
        });
      }
    });
  }
};

export const handleSelectionInPlacementPhase = (gameId, workerBeingPlaced, newData) => {
  const ref = db.ref(`activeGames/${gameId}`);
  ref.update({
    workerBeingPlaced: newData.workerBeingPlaced,
    activePlayer: newData.activePlayer,
    gameBoard: newData.gameBoard,
    turnPhase: newData.turnPhase,
  });
};

export const handleSelectionInSelectPhase = (gameId, newData) => {
  console.log('Handle Selection in Select Phase Invoked', gameId, newData);
  const ref = db.ref(`activeGames/${gameId}`);
  ref.update({
    turnPhase: newData.turnPhase,
    selectedWorker: newData.selectedWorker,
  });
};

export const handleSelectionInMovePhase = (gameId, newData) => {
  console.log('Handle Selection in Move Phase Invoked', gameId, newData);
  const ref = db.ref(`activeGames/${gameId}`);
  ref.update({
    winConditionMet: newData.selectedWorker.height === 3,
    turnPhase: newData.turnPhase,
    gameBoard: newData.gameBoard,
    currentUpdate: newData.currentUpdate,
    selectedWorker: newData.selectedWorker,
  });
};

export const handleSelectionInBuildPhase = (gameId, newData) => {
  console.log('Handle Selection in Build Phase Invoked');
  const ref = db.ref(`activeGames/${gameId}`);
  ref.update({
    turnPhase: newData.turnPhase,
    activePlayer: newData.activePlayer,
    gameBoard: newData.gameBoard,
    currentUpdate: newData.currentUpdate,
    selectedWorker: {
      workerId: '',
      row: 0,
      col: 0,
      height: 0,
    },
  });
};

export const makeRequestToJoin = (gameId, username) => {
  console.log('Make Request to Join Invoked');
  const ref = db.ref(`activeGames/${gameId}`);
  ref.update({
    pendingRequest: username,
    requestAccepted: false,
    requestRejected: false,
  });
};

export const cancelRequestToJoin = gameId => {
  console.log('Cancel Request to Join Invoked');
  const ref = db.ref(`activeGames/${gameId}`);
  ref.update({
    pendingRequest: null,
    requestAccepted: false,
    requestRejected: false,
  });
};

export const resetGame = gameId => {
  console.log('Reset Game Invoked');
  const ref = db.ref(`activeGames/${gameId}`);
  ref.update({
    activePlayer: Math.ceil(Math.random() * 2),
    workerBeingPlaced: 1,
    turnPhase: 'placement',
    winConditionMet: false,
    selectedWorker: {
      workerId: '',
      row: 0,
      col: 0,
      height: 0,
    },
    gameBoard: initialGameBoard,
  });
};

export const resolveRequestToJoin = (gameId, acceptRequest, joiningPlayer) => {
  const ref = db.ref(`activeGames/${gameId}`);
  console.log('Resolve Request to Join Invoked');
  if (acceptRequest) {
    ref.upate({
      pendingRequest: null,
      requestAccepted: true,
      joiningPlayer: joiningPlayer,
      activePlayer: Math.ceil(Math.random() * 2),
      workerBeingPlaced: 1,
      turnPhase: 'placement',
      winConditionMet: false,
      selectedWorker: {
        workerId: '',
        row: 0,
        col: 0,
        height: 0,
      },
      gameBoard: initialGameBoard,
    });
  } else {
    ref.update({
      pendingRequest: null,
      requestRejected: true,
    });
  }
};