import React, { Component } from 'react';
import { withRouter } from 'react-router';

import NewGameModal from '../ui/NewGameModal';
import JoinGameModal from '../ui/JoinGameModal';
import BasicModal from '../ui/BasicModal';
import InstructionalModal from '../ui/InstructionalModal';
import { grecianIsleInstructions } from '../ui/instructions';
import { db } from '../firebase';

class App extends Component {
  constructor(props) {
    super(props);
    this.imgRoot = 'https://res.cloudinary.com/sorebear/image/upload';

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
      availableGames: null,
    };
  }

  async componentDidMount() {
    window.addEventListener('beforeunload', db.removeGameAddedOrRemovedListener);
    const availableGames = await db.getAvailableGames();
    this.setState({ availableGames: availableGames.val() });

    db.applyGameAddedOrRemovedListener((snapshot) => {
      this.setState({ availableGames: snapshot.val() });
    });
  }

  componentWillUnmount() {
    localStorage.setItem('username', this.state.username);
    db.removeGameAddedOrRemovedListener();
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
    const { availableGames } = this.state;
    if (!availableGames) {
      return (
        <h3 style={{ color: 'white', fontSize: '2.4rem', marginBottom: '2rem' }}>There are currently no Active Games</h3>
      );
    };
    return Object.keys(availableGames).map(gameId => {
      const game = availableGames[gameId];
      if ((!game.localGame || game.interuptable) && game.playerCount === 1) {
        return (
          <div className={`card flex-column align-start ${game.gameTitleRef}`} key={gameId}>
            <h3>{game.gameTitle}</h3>
            <p>Active Players: {game.playerCount}</p>
            <p>Created By: <span className="accent-color">{game.creatingPlayer}</span></p>
            <button
              type="button"
              className="ui-button"
              onClick={() => this.openJoinGameModal(gameId, game.gameTitleRef)}
            >
              Join Game
            </button>
          </div>
        );
      }
    });
  }

  renderNewGameModal() {
    if (this.state.showNewGameModal) {
      return (
        <NewGameModal
          closeModal={this.closeModals}
          handleKeyPress={this.handleKeyPress}
          username={this.state.username}
        />
      );
    }
  }

  renderJoinGameModal() {
    if (this.state.requestedGameId) {
      return (
        <JoinGameModal
          closeModal={this.cancelJoinGameRequest}
          requestedGame={this.state.availableGames[this.state.requestedGameId]}
          requestedGameId={this.state.requestedGameId}
        />
      );
    }
  }

  renderInstructionalModal() {
    if (this.state.showInstructionalModal) {
      return (
        <InstructionalModal
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
      );
    }
  }

  renderNoUsernameModal() {
    if (this.state.showNoUsernameModal) {
      return (
        <BasicModal className={this.state.noUserModalClass}>
          <div>
            <button type="button" className="close-modal-button" onClick={this.closeModals}>
              <img
                alt="close modal"
                src={`${this.imgRoot}/v1521228838/svg-icons/ess-light/essential-light-10-close-big.svg`}
              />
            </button>
            <p>Please enter a username.</p>
          </div>
        </BasicModal>
      );
    }
  }

  render() {
    console.log('INDEX STATE:', this.state);
    return (
      <div className="wrapper">
        <h1>Grecian Isle</h1>
        <h2 style={{ color: 'white', fontSize: '3.2rem', marginBottom: '2rem' }}>Active Real-Time Games</h2>
        <div className="available-games-container">
          { this.renderAvailableGames() }
        </div>
        <div style={{ display: 'flex' }}>
          <button
            type="button"
            className="ui-button"
            onClick={this.openNewGameModal}
            style={{ marginRight: '.5rem' }}
          >
            Create New Game
          </button>
          <button
            type="button"
            className="ui-button"
            onClick={this.toggleInstructionalModal}
            style={{ marginLeft: '.5rem' }}
          >
            Learn How To Play
          </button>
        </div>
        { this.renderNewGameModal() }
        { this.renderJoinGameModal() }
        { this.renderInstructionalModal() }
        { this.renderNoUsernameModal() }
      </div>
    );
  }
}

export default withRouter(App);