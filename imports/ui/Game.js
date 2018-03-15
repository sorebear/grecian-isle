import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { ActiveGames } from '../api/activeGames';

const workerImages = {
	p1Female: 'https://res.cloudinary.com/sorebear/image/upload/v1520960687/grecian-isle/player-black-female.png',
	p1Male: 'https://res.cloudinary.com/sorebear/image/upload/v1520960687/grecian-isle/player-black-male.png',
	p2Female: 'http://res.cloudinary.com/sorebear/image/upload/v1520960687/grecian-isle/player-red-female.png',
	p2Male: 'https://res.cloudinary.com/sorebear/image/upload/v1520960687/grecian-isle/player-red-male.png'
};

class Game extends Component {
	constructor(props) {
		super(props);
		this.handleSelectionInSelectPhase = this.handleSelectionInSelectPhase.bind(this);
		this.handleSelectionInMovePhase = this.handleSelectionInMovePhase.bind(this);
		this.handleSelectionInBuildPhase = this.handleSelectionInBuildPhase.bind(this);
	}

	componentWillMount() {
		console.log('Component is Mounting!');
	}

	handleSelectionInSelectPhase(row, col) {
		console.log(`Worker Selected at ${row}x${col}`);
		Meteor.call('game.handleSelectionInSelectPhase', this.props.game._id, {
			turnPhase: 'move',
			selectedWorker: {
				workerId: this.props.game.gameBoard[row][col].worker,
				row: row,
				col: col,
			}
		});
	}

	handleSelectionInMovePhase(row, col) {
		console.log(`Worked Moved to ${row}x${col}`);
		const newGameBoard = [ ...this.props.game.gameBoard ];
		newGameBoard[this.props.game.selectedWorker.row][this.props.game.selectedWorker.col].worker = 0;
		newGameBoard[row][col].worker = this.props.game.selectedWorker.workerId;
		Meteor.call('game.handleSelectionInMovePhase', this.props.game._id, {
			turnPhase: 'build',
			gameBoard: [ ...newGameBoard ],
			selectedWorker: {
				workerId: this.props.selectedWorker,
				row: row,
				col: col,
			}
		});
	}

	handleSelectionInBuildPhase(row, col) {
		console.log(`New Piece Built at ${row}x${col}`);
		const newGameBoard = [ ...this.props.game.gameBoard ];
		newGameBoard[row][col].height = newGameBoard[row][col].height + 1;
		Meteor.call('game.handleSelectionInBuildPhase', this.props.game._id, {
			activePlayer: this.props.game.activePlayer === 1 ? 2 : 1,
			turnPhase: 'select',
			gameBoard: [ ...newGameBoard ],
		});
	}

	renderSelectBoardState() {
		const { gameBoard, activePlayer } = this.props.game;
		return gameBoard.map((row, index) => (
			<div key={index} className={`row row-${index}`}>
				{row.map(space => {
					if (
						space.worker === `p${activePlayer}Female` ||
						space.worker === `p${activePlayer}Male`
					) {
						return (
							<div key={space.id} className="game-space">
								<div className={ space.height >= 1 ? 'built-level built-level-1' : '' }>
									<div className={ space.height >= 2 ? 'built-level built-level-2' : '' }>
										<div className={ space.height >= 3 ? 'built-level built-level-3' : '' }>
                      <div className={ space.height >= 4 ? 'built-level built-level-4' : '' }>
                        <button
                          id={`game-${space.id}`}
                          className="game-space-button"
                          onClick={() => this.handleSelectionInSelectPhase(space.row, space.col)}
                        >
                          <img className="player-piece" src={workerImages[space.worker]} />
                        </button>
                      </div>
										</div>
									</div>
								</div>
							</div>
						);
					}
					return (
            <div key={space.id} className="game-space">
              <div className={space.height >= 1 ? 'built-level built-level-1' : '' }>
                  <div className={ space.height >= 2 ? 'built-level built-level-2' : '' }>
                    <div className={ space.height >= 3 ? 'built-level built-level-3' : '' }>
                      <div className={ space.height >= 4 ? 'built-level built-level-4' : '' }>
                        <button
                          id={`game-${space.id}`}
                          className="game-space-button"
                          disabled
                        >
                        {space.worker ? (<img className="player-piece" src={workerImages[space.worker]} />) : null}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
					);
				})}
			</div>
		));
	}

	renderMoveAndBuildBoardStates() {
		console.log(this.props.game.gameBoard[0]);
		const { gameBoard, activePlayer, selectedWorker, turnPhase } = this.props.game;
		return gameBoard.map((row, index) => (
			<div key={`${this.props.game._id}-row-${index}`} className={`row row-${index}`}>
				{ row.map((space, index) => {
					if (
            (space.col === selectedWorker.col && !space.worker && space.height < 4 && (space.row === selectedWorker.row + 1 || space.row == selectedWorker.row - 1)) ||
					  (space.col === selectedWorker.col + 1 && !space.worker && space.height < 4 && (space.row === selectedWorker.row + 1 || space.row == selectedWorker.row - 1)) ||
						(space.col === selectedWorker.col - 1 && !space.worker && space.height < 4 && (space.row === selectedWorker.row + 1 || space.row == selectedWorker.row - 1)) ||
						(space.row === selectedWorker.row && !space.worker && space.height < 4 && (space.col === selectedWorker.col + 1 || space.col == selectedWorker.col - 1))
					) {
						return (
              <div key={space.id} className="game-space">
                <div className={space.height >= 1 ? 'built-level built-level-1' : '' }>
                  <div className={ space.height >= 2 ? 'built-level built-level-2' : '' }>
                    <div className={ space.height >= 3 ? 'built-level built-level-3' : '' }>
                      <div className={ space.height >= 4 ? 'built-level built-level-4' : '' }>
                        <button
                          id={`game-${space.id}`}
                          className="game-space-button"
                          onClick={
                            turnPhase === 'move' ? 
                            () => this.handleSelectionInMovePhase(space.row, space.col) :
                            () => this.handleSelectionInBuildPhase(space.row, space.col)
                          }
                        >
                          {space.worker ? (<img className="player-piece" src={workerImages[space.worker]} />) : null}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
						);
					}
					return (
            <div key={space.id} className="game-space">
              <div className={space.height >= 1 ? 'built-level built-level-1' : '' }>
                <div className={ space.height >= 2 ? 'built-level built-level-2' : '' }>
                  <div className={ space.height >= 3 ? 'built-level built-level-3' : '' }>
                    <div className={ space.height >= 4 ? 'built-level built-level-4' : '' }>
                      <button
                        id={`game-${space.id}`}
                        className="game-space-button"
                        disabled
                      >
                        {space.worker ? (<img className="player-piece" src={workerImages[space.worker]} />) : null}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>  
					);
				})}
			</div>
		));
	}

	componentWillReceiveProps(newProps) {
		console.log('Component is Receiving New Props!', newProps);
	}

	renderCurrentBoardState() {
		switch (this.props.game.turnPhase) {
			case 'select':
				return this.renderSelectBoardState();
			case 'move':
				return this.renderMoveAndBuildBoardStates();
			case 'build':
				return this.renderMoveAndBuildBoardStates();
		}
	}

	render() {
		console.log('Component is Rendering With the Following Props', this.props);
		return (
			<div className="wrapper">
				<div className="game-board">{this.renderCurrentBoardState()}</div>
				<h2 className="prompt-text">{`Player ${this.props.game.activePlayer} - ${this.props.game.turnPhase}`}</h2>
			</div>
		);
	}
}

export default withTracker((props) => {
	const handle = Meteor.subscribe('game', props.match.params.id);
	return {
		listLoading: !handle.ready(),
		game: ActiveGames.find({ _id: props.match.params.id}).fetch(),
	};
})(Game);		
