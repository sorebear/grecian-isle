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
		this.state = {
			username: ''
		}
	}

	createNewGame() {
		Meteor.call('activeGames.createNewGame', (err, newGameId) => {
			if (!err) {
        console.log('Create Game Callback in: ', newGameId);
        
			}
    });
	}

	deleteGame(game) {
		Meteor.call('activeGames.deleteGame', game._id);
	}

	renderAvailableGames() {
		return this.props.availableGames.map((game) => (
			<div style={{ display: 'flex', flexDirection: 'row' }} key={game._id}>
				<Link to={`game/${game._id}`}>
					<button className="ui-button">
						<h3>{game._id} - Active Players: {game.playerCount}</h3>
					</button>
				</Link>
				<button className="ui-button" onClick={() => this.deleteGame(game)}>
					Delete
				</button>
			</div>
		))
	}

	handleKeyPress(e) {
		this.setState({ username: e.target.value })
	}

	render() {
		console.log('App Props', this.props);
		return (
			<div className="wrapper">
				<div className="available-games-container">
					{ this.renderAvailableGames() }
				</div>
				<div className="username-container">
					<label htmlFor="username">Username:</label>
					<input id="username" type="text" value={this.state.username} onChange={this.handleKeyPress.bind(this)} />
				</div>
				<button className="ui-button" onClick={this.createNewGame}>
					Create New Game
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
