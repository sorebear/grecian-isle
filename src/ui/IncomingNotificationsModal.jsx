import React, { Component } from 'react';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import { db } from '../firebase';

class IncomingNotificationsModal extends Component {
  constructor(props) {
    super(props);
    this.handleResolveInvitation = this.handleResolveInvitation.bind(this);
    this.handleExit = this.handleExit.bind(this);
  }

  handleResolveInvitation(requestAccepted) {
    db.resolveRequestToJoin(this.props.gameId, requestAccepted, this.props.pendingRequest);
  }

  handleExit() {
    this.props.history.push('/');
  }

  renderIncomingRequestMessage() {
    const { gameTitleRef, pendingRequest } = this.props;
    return (
      <div className={`modal ${gameTitleRef}`}>
        <h3><span className="accent-color">{pendingRequest}</span> has requested to join your game.</h3>
        <div className="flex-row w-100 justify-between">
          <button type="button" className="ui-button w-40" onClick={() => this.handleResolveInvitation(true)}>
            Accept
          </button>
          <button type="button" className="ui-button w-40" onClick={() => this.handleResolveInvitation(false)}>
            Reject
          </button>
        </div>
      </div>
    );
  }

  renderWaitingMessage() {
    const { creatingPlayer, leavingPlayer, gameTitleRef } = this.props;
    if (!creatingPlayer) {
      return (
        <div className={`modal ${gameTitleRef}`}>
          <h3>
            I&apos;m sorry. The game&apos;s creator, <span className="accent-color">{leavingPlayer}</span>, has left the game.
          </h3>
          <button type="button" onClick={this.handleExit} className="ui-button">
            Exit To Menu
          </button>
        </div>
      );
    }

    return (
      <div className={`modal ${gameTitleRef}`}>
        { leavingPlayer ?
          <h3>I&apos;m sorry. <span className="accent-color">{leavingPlayer}</span> has left.</h3>
          : <div /> }
        <h3>Waiting for another player to join your game...</h3>
        <button type="button" onClick={this.handleExit} className="ui-button">
          Exit To Menu
        </button>
      </div>
    );
  }

  render() {
    const { pendingRequest } = this.props;
    return (
      <div className="modal-mask">
        { pendingRequest ? this.renderIncomingRequestMessage() : this.renderWaitingMessage() }
      </div>
    );
  }
}

export default withRouter(IncomingNotificationsModal);

IncomingNotificationsModal.propTypes = {
  gameTitleRef: PropTypes.string.isRequired,
  joiningPlayer: PropTypes.string,
  pendingRequest: PropTypes.string,
  gameId: PropTypes.string.isRequired,
  localGame: PropTypes.bool.isRequired,
  leavingPlayer: PropTypes.string,
  creatingPlayer: PropTypes.string,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

IncomingNotificationsModal.defaultProps = {
  joiningPlayer: null,
  pendingRequest: null,
  leavingPlayer: null,
};
