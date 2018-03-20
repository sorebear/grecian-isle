import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import { withTracker } from 'meteor/react-meteor-data';

import NewGameModal from './NewGameModal';
import JoinGameModal from './JoinGameModal';
import DuplicateUsernameModal from './DuplicateUsernameModal';
import { ActiveGames } from '../api/activeGames';

class App extends Component {
  constructor(props) {
    super(props);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.openNewGameModal = this.openNewGameModal.bind(this);
    this.closeModals = this.closeModals.bind(this);
    this.cancelJoinGameRequest = this.cancelJoinGameRequest.bind(this);
    this.state = {
      username: localStorage.getItem('username') || '',
      showNewGameModal: false,
      showDuplicateUsernamesModal: false,
      requestedGameId: null,
    };
  }

  componentWillUnmount() {
    localStorage.setItem('username', this.state.username);
  }

  openJoinGameModal(gameId, creatingUser) {
    if (creatingUser === this.state.username) {
      this.setState({ showDuplicateUsernamesModal: true, })
    }
    else {
      this.setState({ requestedGameId: gameId });
      Meteor.call('game.makeRequestToJoin', gameId, this.state.username);
    }
  }

  openNewGameModal() {
    this.setState({ showNewGameModal: true, });
  }

  closeModals() {
    this.setState({ showNewGameModal: false, showDuplicateUsernamesModal: false, });
  }

  cancelJoinGameRequest() {
    Meteor.call('game.cancelRequestToJoin', this.state.requestedGameId);
    this.setState({ requestedGameId: null, });
  }

  deleteGame(gameId) {
    Meteor.call('activeGames.deleteGame', gameId);
  }

  handleKeyPress(e) {
    this.setState({ username: e.target.value });
  }

  renderAvailableGames() {
    return this.props.availableGames.map(game => {
      return (
        <div style={{ display: 'flex', flexDirection: 'row' }} key={game._id}>
          <button 
            className="ui-button"
            onClick={() => this.openJoinGameModal(game._id, game.creatingPlayer) }>
            <h3>Created By: {game.creatingPlayer}, Active Players: {game.playerCount}</h3>
          </button>
          <button className="ui-button" onClick={() => this.deleteGame(game._id)}>
            Delete
          </button>
        </div>
      )
    });
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
          closeModal={this.closeModals}
          handleKeyPress={this.handleKeyPress}
          username={this.state.username}
        />
        <JoinGameModal
          closeModal={this.cancelJoinGameRequest}
          requestedGameId={this.state.requestedGameId}
        />
        <DuplicateUsernameModal
          showModal={this.state.showDuplicateUsernamesModal}
          closeModal={this.closeModals}
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
})(withRouter(App));

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
