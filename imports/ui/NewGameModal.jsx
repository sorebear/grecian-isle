import React, { Component } from 'react';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';

class NewGameModal extends Component {
  constructor(props) {
    super(props);
    this.handleNewGameSubmit = this.handleNewGameSubmit.bind(this);
    this.toggleLocalGame = this.toggleLocalGame.bind(this);
    // this.toggleInteruptable = this.toggleInteruptable.bind(this);
    this.state = {
      localGame: false,
    };
  }

  toggleLocalGame() {
    this.setState({
      localGame: !this.state.localGame,
    });
  }

  // toggleInteruptable() {
  //   this.setState({
  //     interuptable: !this.state.interuptable,
  //   });
  // }

  handleNewGameSubmit(e) {
    e.preventDefault();
    Meteor.call('activeGames.createNewGame', this.props.username, this.state.localGame, (err, newGameId) => {
      if (!err) {
        this.props.history.push(`/game/${newGameId}`, 1);
      }
    });
  }

  render() {
    return (
      <div className="modal-mask" style={{ display: this.props.showModal ? 'flex' : 'none' }}>
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
              className={`ui-button ${this.state.localGame ? '' : 'inactive'}`}
              onClick={this.toggleLocalGame}
            >
              Local Game
            </button>
            <button
              type="button"
              className={`ui-button ${this.state.localGame ? 'inactive' : ''}`}
              onClick={this.toggleLocalGame}
            >
              Network Game
            </button>
          </div>
          {/* <div
                className="flex-container-row"
                style={{ display: this.state.singlePlayerGame ? 'flex' : 'none' }}
              >
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
          </div> */}
          <button type="submit" className="ui-button">
            Create Game
          </button>
          <button type="button" className="ui-button" onClick={this.props.closeModal}>
            Close
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
