import React, { Component } from 'react';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';

// import DropdownMenu from './DropdownMenu';
import { db } from '../../firebase';

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
      }
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
    e.preventDefault();
    const { username } = this.props;
    const { localGame, selectedGame, interuptable } = this.state;
    db.createNewGame(username, selectedGame, localGame, interuptable).then((newGame) => {
      if (newGame) {
        this.props.history.push(`/game?${newGame.key}`, 1);
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
      <div className="modal-mask">
        <form onSubmit={this.handleNewGameSubmit} className={`modal ${this.state.selectedGame.id}`}>
          <button type="button" className="close-modal-button" onClick={this.closeAndReset}>
            {this.props.imgCloseModal}
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
          {/* <div className="flex-column w-100 my-2">
            <label>Selected Game</label>
            <DropdownMenu
              menuItems={this.games}
              callback={this.updateSelectedGame}
            />
          </div> */}
          <div className="flex-column w-100 my-2 game-options">
            <label>Game Options</label>
            <div className="flex-row align-center justify-between">
              <button
                type="button"
                className={`ui-button w-40 ${this.state.localGame ? 'inactive' : ''}`}
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
                className={`ui-button w-40 ${this.state.localGame ? '' : 'inactive'}`}
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
                className={`ui-button w-40 ${this.state.interuptable ? '' : 'inactive'}`}
                onClick={this.toggleInteruptable}
              >
                Allow Interuptions
              </button>
              <button
                type="button"
                className={`switch ${this.state.interuptable ? '' : 'switch-right'}`}
                onClick={this.toggleInteruptable}
              >
                <div className="switch__track" />
                <div className="switch__thumb" />
              </button>
              <button
                type="button"
                className={`ui-button w-40 ${this.state.interuptable || !this.state.localGame ? 'inactive' : ''}`}
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
  closeModal: PropTypes.func.isRequired,
  imgCloseModal: PropTypes.element.isRequired,
  username: PropTypes.string.isRequired,
  handleKeyPress: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};
