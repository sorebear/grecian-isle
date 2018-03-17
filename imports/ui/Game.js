import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import { ActiveGames } from '../api/activeGames';

import Block from './Block';

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
		this.state = {
      rotateZ: -45,
      rotateX: 60
		}
	}

	componentWillMount() {
		Meteor.call('game.addPlayer', this.props.match.params.id);
		window.addEventListener('beforeunload', () => {
			console.log(this);
			Meteor.call('game.removePlayer', this.props.match.params.id);
		});
	}

	componentWillUnmount() {
		Meteor.call('game.removePlayer', this.props.match.params.id);
	}

	handleSelectionInSelectPhase(row, col) {
		Meteor.call('game.handleSelectionInSelectPhase', this.props.game[0]._id, {
			turnPhase: 'move',
			selectedWorker: {
				workerId: this.props.game[0].gameBoard[row][col].worker,
				row: row,
				col: col,
				height: this.props.game[0].gameBoard[row][col].height,
			}
		});
	}

	handleSelectionInMovePhase(row, col) {
		const newGameBoard = [ ...this.props.game[0].gameBoard ];
		newGameBoard[this.props.game[0].selectedWorker.row][this.props.game[0].selectedWorker.col].worker = 0;
		newGameBoard[row][col].worker = this.props.game[0].selectedWorker.workerId;
		Meteor.call('game.handleSelectionInMovePhase', this.props.game[0]._id, {
			turnPhase: 'build',
			gameBoard: [ ...newGameBoard ],
			selectedWorker: {
				workerId: this.props.selectedWorker,
				row: row,
				col: col,
				height: this.props.game[0].gameBoard[row][col].height,
			}
		});
	}

	handleSelectionInBuildPhase(row, col) {
		const newGameBoard = [ ...this.props.game[0].gameBoard ];
		newGameBoard[row][col].height = newGameBoard[row][col].height + 1;
		Meteor.call('game.handleSelectionInBuildPhase', this.props.game[0]._id, {
			activePlayer: this.props.game[0].activePlayer === 1 ? 2 : 1,
			turnPhase: 'select',
			gameBoard: [ ...newGameBoard ],
		});
	}

	renderBoardInSelectPhase() {
		const { gameBoard, activePlayer } = this.props.game[0];
		return gameBoard.map((row, index) => (
			<div key={index} className={`row row-${index}`}>
				{row.map(space => {
					if (
						space.worker === `p${activePlayer}Female` ||
						space.worker === `p${activePlayer}Male`
					) {
						return (
							<div key={space.id} className="game-space">
							{this.renderLevels(space.height, space.id)}
								<button
									id={`game-${space.id}`}
									className="game-space-button"
									onClick={() => this.handleSelectionInSelectPhase(space.row, space.col)}
								>
									<img className="player-piece" src={workerImages[space.worker]} />
								</button>
							</div>
						);
					}
					return (
            <div key={space.id} className="game-space">
							{this.renderLevels(space.height, space.id)}
								<button
									id={`game-${space.id}`}
									className="game-space-button"
									disabled
								>
								{space.worker ? (<img className="player-piece" src={workerImages[space.worker]} />) : null}
							</button>
            </div>
					);
				})}
			</div>
		));
	}

	renderLevels(height, id) {
		heightArr = []
		for (let i = 1; i <= height; i += 1) {
			heightArr.push(i)
		}
		return heightArr.map((level, index) => (
			<div key={`${id}-${level}`} className={`block-container built-level built-level-${level}`}>
        <Block />
      </div>
		));
	}

	renderBoardInBuildPhase() {
		const { gameBoard, activePlayer, selectedWorker, turnPhase } = this.props.game[0];
		return gameBoard.map((row, index) => (
			<div key={`${this.props.game[0]._id}-row-${index}`} className={`row row-${index}`}>
				{ row.map((space, index) => {
					if (
            (space.col === selectedWorker.col && !space.worker && space.height < 4 && (space.row === selectedWorker.row + 1 || space.row == selectedWorker.row - 1)) ||
					  (space.col === selectedWorker.col + 1 && !space.worker && space.height < 4 && (space.row === selectedWorker.row + 1 || space.row == selectedWorker.row - 1)) ||
						(space.col === selectedWorker.col - 1 && !space.worker && space.height < 4 && (space.row === selectedWorker.row + 1 || space.row == selectedWorker.row - 1)) ||
						(space.row === selectedWorker.row && !space.worker && space.height < 4 && (space.col === selectedWorker.col + 1 || space.col == selectedWorker.col - 1))
					) {
						return (
              <div key={space.id} className="game-space">
								{this.renderLevels(space.height, space.id)}
									<button
										id={`game-${space.id}`}
										className="game-space-button"
										onClick={() => this.handleSelectionInBuildPhase(space.row, space.col)}
									>
										{space.worker ? (<img className="player-piece" src={workerImages[space.worker]} />) : null}
									</button>
              </div>
						);
					}
					return (
            <div key={space.id} className="game-space">
						{ this.renderLevels(space.height, space.id) }
							<button
								id={`game-${space.id}`}
								className="game-space-button"
								disabled
							>
								{space.worker ? (<img className="player-piece" src={workerImages[space.worker]} />) : null}
							</button>
            </div>  
					);
				})}
			</div>
		));
	}

	renderBoardInMovePhase() {
		const { gameBoard, activePlayer, selectedWorker, turnPhase } = this.props.game[0];
		return gameBoard.map((row, index) => (
			<div key={`${this.props.game[0]._id}-row-${index}`} className={`row row-${index}`}>
				{ row.map((space, index) => {
					if (
            (space.col === selectedWorker.col && !space.worker && space.height <= selectedWorker.height + 1 && space.height < 4 && (space.row === selectedWorker.row + 1 || space.row == selectedWorker.row - 1)) ||
					  (space.col === selectedWorker.col + 1 && !space.worker && space.height <= selectedWorker.height + 1 && space.height < 4 && (space.row === selectedWorker.row + 1 || space.row == selectedWorker.row - 1)) ||
						(space.col === selectedWorker.col - 1 && !space.worker && space.height <= selectedWorker.height + 1 && space.height < 4 && (space.row === selectedWorker.row + 1 || space.row == selectedWorker.row - 1)) ||
						(space.row === selectedWorker.row && !space.worker && space.height <= selectedWorker.height + 1 && space.height < 4 && (space.col === selectedWorker.col + 1 || space.col == selectedWorker.col - 1))
					) {
						return (
              <div key={space.id} className="game-space">
								{this.renderLevels(space.height, space.id)}
									<button
										id={`game-${space.id}`}
										className="game-space-button"
										onClick={() => this.handleSelectionInMovePhase(space.row, space.col)}
									>
										{space.worker ? (<img className="player-piece" src={workerImages[space.worker]} />) : null}
									</button>
              </div>
						);
					}
					return (
            <div key={space.id} className="game-space">
						{ this.renderLevels(space.height, space.id) }
							<button
								id={`game-${space.id}`}
								className="game-space-button"
								disabled
							>
								{space.worker ? (<img className="player-piece" src={workerImages[space.worker]} />) : null}
							</button>
            </div>  
					);
				})}
			</div>
		));
	}

	rotateBoardLeft() {
		this.setState({ rotateZ: this.state.rotateZ - 45 });
	}

	rotateBoardRight() {
		this.setState({ rotateZ: this.state.rotateZ + 45 });
  }
  
  rotateBoardUp() {
    if (this.state.rotateX > 0) {
      this.setState({ rotateX: this.state.rotateX - 15 });
    }
  }

  rotateBoardDown() {
    if (this.state.rotateX < 75) {
      this.setState({ rotateX: this.state.rotateX + 15 });
    }
  }

	renderCurrentBoardState() {
		switch (this.props.game[0].turnPhase) {
			case 'select':
				return this.renderBoardInSelectPhase();
			case 'move':
				return this.renderBoardInMovePhase();
			case 'build':
				return this.renderBoardInBuildPhase();
		}
	}

	render() {
		console.log('Component is Rendering With the Following Props', this.props);
		if (this.props.game.length === 0) {
			return (
				<div className="wrapper">
					<h2 style={{ color: 'white' }}>Loading...</h2>
          <Link to="/">
            <button className="ui-button">
              Menu
            </button>
          </Link>
				</div>
			)
		}
		return (
			<div className="wrapper">
				<div className="back-button">
					<Link to="/">
						<button className="ui-button">
							Back
						</button>
					</Link>
				</div>
				{/* <div className="game-board-wrapper"> */}
					<div className="game-board" style={{ transform: `rotateX(${this.state.rotateX}deg) rotateZ(${this.state.rotateZ}deg)`}}>{this.renderCurrentBoardState()}</div>
				{/* </div> */}
				<h2 className="prompt-text">{`Player ${this.props.game[0].activePlayer} - ${this.props.game[0].turnPhase}`}</h2>
				<div className="rotate-buttons-container">
					<button onClick={this.rotateBoardLeft.bind(this)}>
						<img className="chevron-left" src='https://res.cloudinary.com/sorebear/image/upload/v1521228833/svg-icons/ess-light/essential-light-01-chevron-left.svg' />
					</button>
					<button onClick={this.rotateBoardRight.bind(this)}>
						<img className="chevron-right" src='https://res.cloudinary.com/sorebear/image/upload/v1521228834/svg-icons/ess-light/essential-light-02-chevron-right.svg' />
 					</button>
          <button onClick={this.rotateBoardUp.bind(this)}>
						<img className="chevron-up" src='https://res.cloudinary.com/sorebear/image/upload/v1521228835/svg-icons/ess-light/essential-light-03-chevron-up.svg' />
 					</button>
           <button onClick={this.rotateBoardDown.bind(this)}>
						<img className="chevron-down" src='https://res.cloudinary.com/sorebear/image/upload/v1521228835/svg-icons/ess-light/essential-light-04-chevron-down.svg' />
 					</button>
				</div>
				<div className="win-modal" style={{ display: this.props.game[0].winConditionMet ? 'flex' : 'none' }}>
					<h2>Player {this.props.game[0].activePlayer} Wins!</h2>
					<Link to="/">
						<button className="ui-button">
							Menu
						</button>
					</Link>
				</div>
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
