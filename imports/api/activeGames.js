import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
export const ActiveGames = new Mongo.Collection('activeGames');
if (Meteor.isServer) {
   Meteor.publish('game', function (id) {
      check(id, String);
      return ActiveGames.find({ _id: id });
   });

   Meteor.publish('activeGames', function activeGamesPublication() {
      return ActiveGames.find();
   });
}

Meteor.methods({

   'game.handleSelectionInSelectPhase'(id, newData) {
      ActiveGames.update(id, {
         $set: { 
            turnPhase: newData.turnPhase,
            selectedWorker: newData.selectedWorker,
         }
      });
   },

   'game.handleSelectionInMovePhase'(id, newData) {
      ActiveGames.update(id, {
         $set: {
            turnPhase: newData.turnPhase,
            gameBoard: newData.gameBoard,
            selectedWorker: newData.selectedWorker,
         }
      });
   },

   'game.handleSelectionInBuildProcess'(id, newData) {
      ActiveGames.update(id, {
         $set: {
            turnPhase: newData.turnPhase,
            activePlayer: newData.activePlayer,
            gameBoard: newData.gameBoard,
         }
      });
   },


});