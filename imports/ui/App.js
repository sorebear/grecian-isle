import React, { Component } from 'react';
import { Link } from 'react-router-dom';
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
		Meteor.call('activeGames.createNewGame');
	}

	selectAvailableGame(selectedGame) {
		this.setState({
			localActiveGame: selectedGame
		});
	}

	deleteGame(game) {
		Meteor.call('activeGames.deleteGame', game._id);
	}

	renderAvailableGames() {
		return this.props.availableGames.map((game) => (
			<div key={game._id}>
				{/* <button onClick={() => this.selectAvailableGame(game)}> */}
				<Link to={`game/${game._id}`}>
					<button>
						<h3>{game._id} - Active Players: {game.playerCount}</h3>
					</button>
				</Link>
				<button onClick={() => this.deleteGame(game)}>
					Delete
				</button>
			</div>
		))
	}

	componentWillReceiveProps(newProps) {
		newProps.availableGames.map(updatedGame => {
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
		console.log('App Props', this.props);
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
	Meteor.subscribe('activeGames');
	return {
		availableGames: ActiveGames.find({}).fetch(),
	};
})(App);
