import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const ActiveGames = new Mongo.Collection('activeGames');

const initialGameBoard = [
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

if (Meteor.isServer) {
  Meteor.publish('game', id => {
    check(id, String);
    return ActiveGames.find({ _id: id });
  });

  Meteor.publish('activeGames', () => ActiveGames.find({
    $and: [
      { playerCount: 1 },
      { creatingPlayer: { $ne: null } },
      { localGame: false },
    ],
  }));
}

Meteor.methods({
  'game.addPlayer'(id) {
    ActiveGames.update(id, {
      $inc: {
        playerCount: 1,
      },
    });
  },

  'game.removePlayer'(id, userId, creatingPlayer, joiningPlayer) {
    if (userId === 1) {
      ActiveGames.update(id, {
        $set: {
          leavingPlayer: creatingPlayer,
          creatingPlayer: null,
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
  },

  'game.handleSelectionInPlacementPhase'(id, newData) {
    ActiveGames.update(id, {
      $inc: {
        workerBeingPlaced: 1,
      },
      $set: {
        activePlayer: newData.activePlayer,
        gameBoard: newData.gameBoard,
        turnPhase: newData.turnPhase,
      },
    });
  },

  'game.handleSelectionInSelectPhase'(id, newData) {
    ActiveGames.update(id, {
      $set: {
        turnPhase: newData.turnPhase,
        selectedWorker: newData.selectedWorker,
      },
    });
  },

  'game.handleSelectionInMovePhase'(id, newData) {
    ActiveGames.update(id, {
      $set: {
        winConditionMet: newData.selectedWorker.height === 3,
        turnPhase: newData.turnPhase,
        gameBoard: newData.gameBoard,
        selectedWorker: newData.selectedWorker,
      },
    });
  },

  'game.handleSelectionInBuildPhase'(id, newData) {
    ActiveGames.update(id, {
      $set: {
        turnPhase: newData.turnPhase,
        activePlayer: newData.activePlayer,
        gameBoard: newData.gameBoard,
        selectedWorker: {
          workerId: '',
          row: 0,
          col: 0,
          height: 0,
        },
      },
    });
  },

  'game.makeRequestToJoin'(id, username) {
    ActiveGames.update(id, {
      $set: {
        pendingRequest: username,
        requestAccepted: false,
        requestRejected: false,
      },
    });
  },

  'game.cancelRequestToJoin'(id) {
    ActiveGames.update(id, {
      $set: {
        pendingRequest: null,
        requestAccepted: false,
        requestRejected: false,
      },
    });
  },

  'game.resetGame'(id) {
    ActiveGames.update(id, {
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
  },

  'game.resolveRequestToJoin'(id, acceptRequest, joiningPlayer) {
    if (acceptRequest) {
      ActiveGames.update(id, {
        $set: {
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
        },
      });
    } else {
      ActiveGames.update(id, {
        $set: {
          pendingRequest: null,
          requestRejected: true,
        },
      });
    }
  },

  'activeGames.deleteGame'(gameId) {
    ActiveGames.remove(gameId);
  },

  'activeGames.createNewGame'(username, localGame) {
    return ActiveGames.insert(
      {
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
        winConditionMet: false,
        selectedWorker: {
          workerId: '',
          row: 0,
          col: 0,
          height: 0,
        },
        gameBoard: initialGameBoard,
      },
      (err, newlyCreatedGame) => {
        if (err) {
          return err;
        }
        return newlyCreatedGame;
      },
    );
  },
});
