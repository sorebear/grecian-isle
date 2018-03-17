import React, { Component } from 'react';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';

class NewGameModal extends Component {
  constructor(props) {
    super(props);
    this.handleNewGameSubmit = this.handleNewGameSubmit.bind(this);
    this.toggleSinglePlayerGame = this.toggleSinglePlayerGame.bind(this);
    this.toggleInteruptable = this.toggleInteruptable.bind(this);
    this.state = {
      singlePlayerGame: false,
      interuptable: true,
    };
  }

  toggleSinglePlayerGame() {
    this.setState({
      singlePlayerGame: !this.state.singlePlayerGame,
    });
  }

  toggleInteruptable() {
    this.setState({
      interuptable: !this.state.interuptable,
    });
  }

  handleNewGameSubmit(e) {
    e.preventDefault();
    Meteor.call('activeGames.createNewGame', this.props.username, (err, newGameId) => {
      if (!err) {
        console.log('Create Game Callback in: ', newGameId);
        localStorage.setItem('username', this.props.username);
        this.props.history.push(`/game/${newGameId}`, this.props.username);
      }
    });
  }

  render() {
    console.log('Modal Props', this.props);
    return (
      <div className="modal new-game-modal" style={{ display: this.props.showModal ? 'flex' : 'none' }}>
        <form onSubmit={this.handleNewGameSubmit} className="new-game-form">
          <div className="username-container-modal">
            <label htmlFor="username-in-modal">Username:</label>
            <input
              id="username-in-modal"
              type="text"
              value={this.props.username}
              onChange={this.props.handleKeyPress}
              required
            />
          </div>
          <div className="flex-container-row">
            <button
              type="button"
              className={`ui-button ${this.state.singlePlayerGame ? '' : 'inactive'}`}
              onClick={this.toggleSinglePlayerGame}
            >
              Single Player
            </button>
            <button
              type="button"
              className={`ui-button ${this.state.singlePlayerGame ? 'inactive' : ''}`}
              onClick={this.toggleSinglePlayerGame}
            >
              VS
            </button>
          </div>
          <div className="flex-container-row" style={{ display: this.state.singlePlayerGame ? 'flex' : 'none' }}>
            <button
              type="button"
              className={`ui-button ${this.state.interuptable ? '' : 'inactive'}`}
              onClick={this.toggleInteruptable}
            >
              Allow Interuptions
            </button>
            <button
              type="button"
              className={`ui-button ${this.state.interuptable ? 'inactive' : ''}`}
              onClick={this.toggleInteruptable}
            >
              No Interuptions
            </button>
          </div>
          <button type="button" className="ui-button" onClick={this.props.closeModal}>
            Close
          </button>
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

