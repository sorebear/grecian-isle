import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { db } from '../firebase';

import BasicModal from '../components/ui/BasicModal';
import NewGameModal from '../components/ui/NewGameModal';
import JoinGameModal from '../components/ui/JoinGameModal';
import InstructionalModal from '../components/ui/InstructionalModal';
import { grecianIsleInstructions } from '../components/ui/instructions';

import close from '../assets/img/icons/close.svg';

class App extends Component {
  constructor(props) {
    super(props);
    this.imgCloseModal = <img alt="close modal" src={close} />;
    this.unload = this.unload.bind(this);
    this.closeModals = this.closeModals.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.openNewGameModal = this.openNewGameModal.bind(this);
    this.cancelJoinGameRequest = this.cancelJoinGameRequest.bind(this);
    this.toggleInstructionalModal = this.toggleInstructionalModal.bind(this);

    this.state = {
      username: '',
      showNewGameModal: false,
      showNoUsernameModal: false,
      showInstructionalModal: false,
      noUserModalClass: '',
      requestedGameId: null,
      availableGames: null,
    };
  }

  componentDidMount() {
    db.getAvailableGames().then(availableGames => {
      this.setState({ availableGames: availableGames.val() });
    }).catch(err => {
      console.log('There Was An Error Getting The Games', err);
    });
    
    db.applyGameAddedOrRemovedListener((snapshot) => {
      this.setState({ availableGames: snapshot.val() });
    });
  }

  componentWillUnmount() {
    // localStorage.setItem('username', this.state.username);
    this.unload();
  }

  unload() {
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
    }
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
          imgCloseModal={this.imgCloseModal}
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
          unload={this.unload}
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
          imgCloseModal={this.imgCloseModal}
          closeModal={this.toggleInstructionalModal}
          gameTitleRef="grecianIsle"
        >
          {grecianIsleInstructions.map(item => (
            <div key={item.id} className="instructions flex-column">
              {item.img()}
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
              {this.imgCloseModal}
            </button>
            <p>Please enter a username.</p>
          </div>
        </BasicModal>
      );
    }
  }

  render() {
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