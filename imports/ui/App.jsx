import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';

import NewGameModal from './NewGameModal';
import { ActiveGames } from '../api/activeGames';

class App extends Component {
  constructor(props) {
    super(props);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.openNewGameModal = this.openNewGameModal.bind(this);
    this.closeNewGameModal = this.closeNewGameModal.bind(this);
    this.state = {
      username: localStorage.getItem('username') || '',
      showNewGameModal: false,
    };
  }

  openNewGameModal() {
    this.setState({
      showNewGameModal: true,
    });
  }

  closeNewGameModal() {
    this.setState({
      showNewGameModal: false,
    });
  }

  deleteGame(game) {
    Meteor.call('activeGames.deleteGame', game._id);
  }

  handleKeyPress(e) {
    this.setState({ username: e.target.value });
  }

  renderAvailableGames() {
    return this.props.availableGames.map(game => (
      <div style={{ display: 'flex', flexDirection: 'row' }} key={game._id}>
        <Link to={`game/${game._id}`}>
          <button className="ui-button">
            <h3>Created By: {game.createdBy}, Active Players: {game.playerCount}</h3>
          </button>
        </Link>
        <button className="ui-button" onClick={() => this.deleteGame(game)}>
          Delete
        </button>
      </div>
    ));
  }

  render() {
    console.log('App Props', this.props);
    return (
      <div className="wrapper">
        <h2 style={{ color: 'white', fontSize: '3.2rem', marginBottom: '2rem' }}>Open Games</h2>
        <div className="available-games-container">
          { this.renderAvailableGames() }
        </div>
        <div className="username-container">
          <label htmlFor="username">Username:</label>
          <input id="username" type="text" value={this.state.username} onChange={this.handleKeyPress} />
        </div>
        <button className="ui-button" onClick={this.openNewGameModal}>
          Create New Game
        </button>
        <NewGameModal
          showModal={this.state.showNewGameModal}
          closeModal={this.closeNewGameModal}
          handleKeyPress={this.handleKeyPress}
          username={this.state.username}
        />
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

App.propTypes = {
  availableGames: PropTypes.arrayOf(PropTypes.shape({
    activePlayer: PropTypes.number.isRequired,
    gameBoard: PropTypes.array.isRequired,
    playerCount: PropTypes.number.isRequired,
    selectedWorker: PropTypes.shape({
      workerId: PropTypes.string.isRequired,
      row: PropTypes.number.isRequired,
      col: PropTypes.number.isRequired,
      height: PropTypes.number.isRequired,
    }).isRequired,
    turnPhase: PropTypes.string.isRequired,
    winConditionMet: PropTypes.bool.isRequired,
    _id: PropTypes.string.isRequired,
  })).isRequired,
};
