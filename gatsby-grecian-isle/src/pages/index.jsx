import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';

import NewGameModal from '../ui/NewGameModal';
import JoinGameModal from '../ui/JoinGameModal';
import BasicModal from '../ui/BasicModal';
import * as db from '../firebase/db';
import InstructionalModal from '../ui/InstructionalModal';
import { grecianIsleInstructions } from '../ui/instructions';

class App extends Component {
  constructor(props) {
    super(props);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.openNewGameModal = this.openNewGameModal.bind(this);
    this.closeModals = this.closeModals.bind(this);
    this.cancelJoinGameRequest = this.cancelJoinGameRequest.bind(this);
    this.toggleInstructionalModal = this.toggleInstructionalModal.bind(this);
    this.state = {
      username: localStorage.getItem('username') || '',
      showNewGameModal: false,
      showNoUsernameModal: false,
      showInstructionalModal: false,
      noUserModalClass: '',
      requestedGameId: null,
    };
  }

  componentWillUnmount() {
    localStorage.setItem('username', this.state.username);
  }

  openJoinGameModal(gameId, gameTitleRef) {
    if (!this.state.username) {
      this.setState({ showNoUsernameModal: true, noUserModalClass: gameTitleRef });
    } else {
      this.setState({ requestedGameId: gameId });
      db.makeRequestToJoin(gameId, this.state.username);
    }
  }

  openNewGameModal() {
    this.setState({ showNewGameModal: true });
  }

  closeModals() {
    this.setState({ showNewGameModal: false, showNoUsernameModal: false });
  }

  cancelJoinGameRequest() {
    db.cancelRequestToJoin(this.state.requestedGameId);
    this.setState({ requestedGameId: null });
  }

  toggleInstructionalModal() {
    this.setState({ showInstructionalModal: !this.state.showInstructionalModal });
  }

  handleKeyPress(e) {
    this.setState({ username: e.target.value });
  }

  renderAvailableGames() {
    // if (this.props.availableGames.length === 0) {
      return (
        <h3 style={{ color: 'white', fontSize: '2.4rem', marginBottom: '2rem' }}>There are currently no Active Games</h3>
      );
    // }
    return this.props.availableGames.map(game => (
      <div className={`card flex-column align-start ${game.gameTitleRef}`} key={game._id}>
        <h3>{game.gameTitle}</h3>
        <p>Active Players: {game.playerCount}</p>
        <p>Created By: <span className="accent-color">{game.creatingPlayer}</span></p>
        <button
          className="ui-button"
          onClick={() => this.openJoinGameModal(game._id, game.gameTitleRef)}
        >
          Join Game
        </button>
      </div>
    ));
  }

  render() {
    return (
      <div className="wrapper">
        {/* <div className="top-bar flex-row justify-center">
          <div className="username-container flex-column justify-center">
            <label htmlFor="username">Username:</label>
            <input
              id="username"
              type="text"
              value={this.state.username}
              onChange={this.handleKeyPress}
            />
          </div>
        </div> */}
        <h1>Grecian Isle</h1>
        <h2 style={{ color: 'white', fontSize: '3.2rem', marginBottom: '2rem' }}>Open Real-Time Game</h2>
        <div className="available-games-container">
          { this.renderAvailableGames() }
        </div>
        <div style={{ display: 'flex' }}>
          <button className="ui-button" onClick={this.openNewGameModal} style={{ marginRight: '.5rem' }}>
            Create New Game
          </button>
          <button className="ui-button" onClick={this.toggleInstructionalModal} style={{ marginLeft: '.5rem' }}>
            Learn How To Play
          </button>
        </div>
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
        <InstructionalModal
          showModal={this.state.showInstructionalModal}
          closeModal={this.toggleInstructionalModal}
          gameTitleRef="grecianIsle"
        >
          {grecianIsleInstructions.map(item => (
            <div key={item.id} className="instructions flex-column">
              <img src={item.img} alt={item.title} />
              <h3>{item.title}</h3>
              {item.text()}
            </div>
          ))}
        </InstructionalModal>
        <BasicModal
          className={this.state.noUserModalClass}
          showModal={this.state.showNoUsernameModal}
        >
          <div>
            <button className="close-modal-button" onClick={this.closeModals}>
              <img
                src="https://res.cloudinary.com/sorebear/image/upload/v1521228838/svg-icons/ess-light/essential-light-10-close-big.svg"
                alt="close modal"
              />
            </button>
            <p>Please enter a username.</p>
          </div>
        </BasicModal>
      </div>
    );
  }
}

export default withRouter(App);

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
