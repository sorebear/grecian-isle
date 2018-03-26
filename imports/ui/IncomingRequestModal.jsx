import React, { Component } from 'react';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';

class IncomingRequestModal extends Component {
  constructor(props) {
    super(props);
    this.handleResolveInvitation = this.handleResolveInvitation.bind(this);
    this.handleExit = this.handleExit.bind(this);
  }

  handleResolveInvitation(requestAccepted) {
    Meteor.call('game.resolveRequestToJoin', this.props.gameId, requestAccepted, this.props.pendingRequest);
  }

  handleExit() {
    this.props.history.push('/');
  }

  renderIncomingRequestMessage() {
    return (
      <div className="modal">
        <h3><span className="accent-color">{this.props.pendingRequest}</span> has requested to join your game.</h3>
        <div className="flex-row w-100 justify-between">
          <button className="ui-button w-40" onClick={() => this.handleResolveInvitation(true)}>
            Accept
          </button>
          <button className="ui-button w-40" onClick={() => this.handleResolveInvitation(false)}>
            Reject
          </button>
        </div>
      </div>
    );
  }

  renderWaitingMessage() {
    const { leavingPlayer } = this.props;
    if (!this.props.creatingPlayer) {
      return (
        <div className="modal">
          <h3>
            I&apos;m sorry. The game&apos;s creator, <span className="accent-color">{leavingPlayer}</span>, has left the game.
          </h3>
          <button onClick={this.handleExit} className="ui-button">
            Exit To Menu
          </button>
        </div>
      );
    }
    return (
      <div className="modal">
        { leavingPlayer ?
          <h3>I&apos;m sorry. <span className="accent-color">{leavingPlayer}</span> has left.</h3>
           : <div /> }
        <h3>Waiting for another player to join your game...</h3>
        <button onClick={this.handleExit} className="ui-button">
          Exit To Menu
        </button>
      </div>
    );
  }

  render() {
    const { creatingPlayer, joiningPlayer, localGame, pendingRequest } = this.props;
    return (
      <div
        className="modal-mask"
        style={{ display: localGame || (joiningPlayer && creatingPlayer) ? 'none' : 'flex' }}
      >
        { pendingRequest ? this.renderIncomingRequestMessage() : this.renderWaitingMessage() }
      </div>
    );
  }
}

export default withRouter(IncomingRequestModal);

IncomingRequestModal.propTypes = {
  joiningPlayer: PropTypes.string,
  pendingRequest: PropTypes.string,
  gameId: PropTypes.string.isRequired,
  localGame: PropTypes.bool.isRequired,
  leavingPlayer: PropTypes.string,
  creatingPlayer: PropTypes.string.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

IncomingRequestModal.defaultProps = {
  joiningPlayer: null,
  pendingRequest: null,
  leavingPlayer: null,
};
