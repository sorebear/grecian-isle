import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';

import { ActiveGames } from '../api/activeGames';
// import { Game } from '../api/game.js';
import Game from './Game';

const workerImages = {
	p1Female: 'https://res.cloudinary.com/sorebear/image/upload/v1520960687/grecian-isle/player-black-female.png',
	p1Male: 'https://res.cloudinary.com/sorebear/image/upload/v1520960687/grecian-isle/player-black-male.png',
	p2Female: 'http://res.cloudinary.com/sorebear/image/upload/v1520960687/grecian-isle/player-red-female.png',
	p2Male: 'https://res.cloudinary.com/sorebear/image/upload/v1520960687/grecian-isle/player-red-male.png'
};

class App extends Component {
	constructor(props) {
		super(props);
		this.selectAvailableGame = this.selectAvailableGame.bind(this);
		this.state = {
			localActiveGame: ''
		}
	}

	createNewGame() {
		ActiveGames.insert({
			activePlayer: 1,
			turnPhase: 'select',
			selectedWorker: {
				workerId: null,
				row: 3,
				col: 2
			},
			gameBoard: [
				[
					{ id: 'space-0x0', row: 0, col: 0, height: 0, worker: 0 },
					{ id: 'space-0x1', row: 0, col: 1, height: 1, worker: 0 },
					{ id: 'space-0x2', row: 0, col: 2, height: 0, worker: 0 },
					{ id: 'space-0x3', row: 0, col: 3, height: 0, worker: 0 },
					{ id: 'space-0x4', row: 0, col: 4, height: 0, worker: 0 }
				],
				[
					{ id: 'space-1x0', row: 1, col: 0, height: 1, worker: 0 },
					{ id: 'space-1x1', row: 1, col: 1, height: 0, worker: 'p1Male' },
					{ id: 'space-1x2', row: 1, col: 2, height: 0, worker: 0 },
					{ id: 'space-1x3', row: 1, col: 3, height: 0, worker: 0 },
					{ id: 'space-1x4', row: 1, col: 4, height: 0, worker: 0 }
				],
				[
					{ id: 'space-2x0', row: 2, col: 0, height: 0, worker: 0 },
					{ id: 'space-2x1', row: 2, col: 1, height: 1, worker: 'p2Female' },
					{ id: 'space-2x2', row: 2, col: 2, height: 0, worker: 0 },
					{ id: 'space-2x3', row: 2, col: 3, height: 0, worker: 0 },
					{ id: 'space-2x4', row: 2, col: 4, height: 0, worker: 0 }
				],
				[
					{ id: 'space-3x0', row: 3, col: 0, height: 0, worker: 0 },
					{ id: 'space-3x1', row: 3, col: 1, height: 0, worker: 0 },
					{ id: 'space-3x2', row: 3, col: 2, height: 2, worker: 'p1Female' },
					{ id: 'space-3x3', row: 3, col: 3, height: 3, worker: 0 },
					{ id: 'space-3x4', row: 3, col: 4, height: 0, worker: 0 }
				],
				[
					{ id: 'space-4x0', row: 4, col: 0, height: 1, worker: 0 },
					{ id: 'space-4x1', row: 4, col: 1, height: 0, worker: 0 },
					{ id: 'space-4x2', row: 4, col: 2, height: 4, worker: 0 },
					{ id: 'space-4x3', row: 4, col: 3, height: 0, worker: 'p2Female' },
					{ id: 'space-4x4', row: 4, col: 4, height: 0, worker: 0 }
				]
			]
		});
	}

	selectAvailableGame(selectedGame) {
		this.setState({
			localActiveGame: selectedGame
		});
	}

	deleteGame(game) {
		ActiveGames.remove(game._id)
	}

	renderAvailableGames() {
		console.log('Rendering available games');
		return this.props.availableGames.map((game) => (
			<div key={game._id}>
				<button onClick={() => this.selectAvailableGame(game)}>
					<h3>{game._id}</h3>
				</button>
				<button onClick={() => this.deleteGame(game)}>
					Delete
				</button>
			</div>
		))
	}

	componentWillReceiveProps(newProps) {
		console.log('I got new props', newProps);
		newProps.availableGames.map(updatedGame => {
			console.log(updatedGame._id, this.state.localActiveGame._id);
			if (updatedGame._id === this.state.localActiveGame._id) {
				this.setState({
					localActiveGame: {...updatedGame}
				})
			}
		})
	}

	renderLocalActiveGame() {
		return (
			<Game gameInfo={this.state.localActiveGame} />
		)
	}

	render() {
		console.log('Props', this.props);
		return (
			<div className="wrapper">
				{ this.state.localActiveGame ? this.renderLocalActiveGame() : this.renderAvailableGames() }
				<button onClick={this.createNewGame}>
					Start New Game
				</button>
			</div>
		);
	}
}

export default withTracker(() => {
	return {
		availableGames: ActiveGames.find({}).fetch(),
	};
})(App);
