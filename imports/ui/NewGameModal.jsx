import React, { Component } from 'react';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';

import DropdownMenu from './DropdownMenu';

class NewGameModal extends Component {
  constructor(props) {
    super(props);
    this.handleNewGameSubmit = this.handleNewGameSubmit.bind(this);
    this.updateSelectedGame = this.updateSelectedGame.bind(this);
    this.toggleLocalGame = this.toggleLocalGame.bind(this);
    this.toggleInteruptable = this.toggleInteruptable.bind(this);
    this.closeAndReset = this.closeAndReset.bind(this);
    this.games = [
      {
        name: 'Grecian Isle',
        id: 'grecianIsle',
      },
      {
        name: 'Book Mobile',
        id: 'bookMobile',
      },
    ];
    this.state = {
      selectedGame: this.games[0],
      localGame: false,
      interuptable: false,
      interuptableAnimation: 'dNone',
    };
  }

  toggleLocalGame() {
    this.setState({
      interuptableAnimation: this.state.localGame === true ? 'swipeOutLeft' : 'swipeInRight',
      localGame: !this.state.localGame,
    });
  }

  toggleInteruptable() {
    this.setState({
      interuptable: !this.state.interuptable,
    });
  }

  updateSelectedGame(gameIndex) {
    this.setState({ selectedGame: this.games[gameIndex] });
  }

  handleNewGameSubmit(e) {
    const { localGame, selectedGame } = this.state;
    e.preventDefault();
    Meteor.call('activeGames.createNewGame', this.props.username, selectedGame, localGame, (err, newGameId) => {
      if (!err) {
        this.props.history.push(`/game/${newGameId}`, 1);
      }
    });
  }

  closeAndReset() {
    this.setState({
      localGame: false,
      interuptable: false,
      interuptableAnimation: 'dNone',
    });
    this.props.closeModal();
  }

  render() {
    return (
      <div className="modal-mask" style={{ display: this.props.showModal ? 'flex' : 'none' }}>
        <form onSubmit={this.handleNewGameSubmit} className="modal">
          <button type="button" className="close-modal-button" onClick={this.closeAndReset}>
            <img src="https://res.cloudinary.com/sorebear/image/upload/v1521228838/svg-icons/ess-light/essential-light-10-close-big.svg" alt="close" />
          </button>
          <div className="flex-column w-100 my-2">
            <label htmlFor="username-in-modal">Username</label>
            <input
              id="username-in-modal"
              type="text"
              value={this.props.username}
              onChange={this.props.handleKeyPress}
              required
            />
          </div>
          <div className="flex-column w-100 my-2">
            <label>Selected Game</label>
            <DropdownMenu
              menuItems={this.games}
              callback={this.updateSelectedGame}
            />
          </div>
          <div className="flex-column w-100 my-2 game-options">
            <label>Game Options</label>
            <div className="flex-row align-center justify-between">
              <button
                type="button"
                className={`ui-button ${this.state.localGame ? 'inactive' : ''}`}
                onClick={this.toggleLocalGame}
              >
                Network Game
              </button>
              <button
                type="button"
                className={`switch ${this.state.localGame ? 'switch-right' : ''}`}
                onClick={this.toggleLocalGame}
              >
                <div className="switch__track" />
                <div className="switch__thumb" />
              </button>
              <button
                type="button"
                className={`ui-button ${this.state.localGame ? '' : 'inactive'}`}
                onClick={this.toggleLocalGame}
              >
                Local Game
              </button>
            </div>
            <div
              className="flex-row align-center justify-between"
              style={{ animation: `${this.state.interuptableAnimation} .5s forwards` }}
            >
              <button
                type="button"
                className={`ui-button ${this.state.interuptable && this.state.localGame ? '' : 'inactive'}`}
                onClick={this.state.localGame ? this.toggleInteruptable : null}
              >
                Allow Interuptions
              </button>
              <button
                type="button"
                className={`switch ${this.state.interuptable ? '' : 'switch-right'}`}
                onClick={this.state.localGame ? this.toggleInteruptable : null}
              >
                <div className={`switch__track ${this.state.localGame ? '' : 'inactive'}`} />
                <div className={`switch__thumb ${this.state.localGame ? '' : 'inactive'}`} />
              </button>
              <button
                type="button"
                className={`ui-button ${this.state.interuptable || !this.state.localGame ? 'inactive' : ''}`}
                onClick={this.state.localGame ? this.toggleInteruptable : null}
              >
                No Interuptions
              </button>
            </div>
          </div>
          <button type="submit" className="ui-button">
            Create Game
          </button>
        </form>
      </div>
    );
  }
}

export default withRouter(NewGameModal);

NewGameModal.propTypes = {
  showModal: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  handleKeyPress: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};
