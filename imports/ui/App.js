import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';

import { Game } from '../api/game.js';

class App extends Component {

   getTasks() {
      return [
         [
            { id: 'space-0x0', row: 0, column: 0, height: 0, player: 0},
            { id: 'space-0x1', row: 0, column: 1, height: 0, player: 0},
            { id: 'space-0x2', row: 0, column: 2, height: 0, player: 0},
            { id: 'space-0x3', row: 0, column: 3, height: 0, player: 0},
            { id: 'space-0x4', row: 0, column: 4, height: 0, player: 0},  
         ],
         [
            { id: 'space-1x0', row: 1, column: 0, height: 0, player: 0},
            { id: 'space-1x1', row: 1, column: 1, height: 0, player: 1},
            { id: 'space-1x2', row: 1, column: 2, height: 0, player: 0},
            { id: 'space-1x3', row: 1, column: 3, height: 0, player: 0},
            { id: 'space-1x4', row: 1, column: 4, height: 0, player: 0},  
         ],
         [
            { id: 'space-2x0', row: 2, column: 0, height: 0, player: 0},
            { id: 'space-2x1', row: 2, column: 1, height: 1, player: 2},
            { id: 'space-2x2', row: 2, column: 2, height: 0, player: 0},
            { id: 'space-2x3', row: 2, column: 3, height: 0, player: 0},
            { id: 'space-2x4', row: 2, column: 4, height: 0, player: 0},  
         ],
         [
            { id: 'space-3x0', row: 3, column: 0, height: 0, player: 0},
            { id: 'space-3x1', row: 3, column: 1, height: 0, player: 0},
            { id: 'space-3x2', row: 3, column: 2, height: 2, player: 1},
            { id: 'space-3x3', row: 3, column: 3, height: 0, player: 0},
            { id: 'space-3x4', row: 3, column: 4, height: 0, player: 0},  
         ],
         [
            { id: 'space-4x0', row: 4, column: 0, height: 0, player: 0},
            { id: 'space-4x1', row: 4, column: 1, height: 0, player: 0},
            { id: 'space-4x2', row: 4, column: 2, height: 0, player: 0},
            { id: 'space-4x3', row: 4, column: 3, height: 0, player: 2},
            { id: 'space-4x4', row: 4, column: 4, height: 0, player: 0},  
         ],
      ]
   }

   renderBoardState() {
      return this.getTasks().map((row, index) => (
         <div key={index} className={`row row-${index}`}>
            {row.map(space => {
               if (space.player) {
                  return (
                     <button key={space.id}>
                        { space.id }
                     </button>
                  )
               }
               return (
                  <button key={space.id} disabled>
                     { space.id }
                  </button>
               )
            })}
         </div>
      ));
   }

   render() {
      return(
         <div className="game-board">
            { this.renderBoardState() }
         </div>
      )
   }
}

export default App;