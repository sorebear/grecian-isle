import React from 'react';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';

const JoinGameModal = props => {
  if (!props.requestedGameId) {
    return <div />;
  } else if (!props.requestedGame) {
    return <div />;
  } else if (props.requestedGame.requestAccepted) {
    props.history.push(`/game?${props.requestedGameId}`, 2);
  } else if (!props.requestedGame.pendingRequest) {
    return (
      <div className="modal-mask">
        <div className={`modal ${props.requestedGame.gameTitleRef}`}>
          <h3>Sorry. {props.requestedGame.creatingPlayer} has rejected your request.</h3>
          <p>Please try playing a game with someone else.</p>
          <button type="button" className="ui-button" onClick={props.closeModal}>
            Close
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="modal-mask">
      <div className={`modal ${props.requestedGame.gameTitleRef}`}>
        <h3>Your play request has been sent!</h3>
        <p>Waiting on <span className="accent-color">{props.requestedGame.creatingPlayer}</span> to accept</p>
        <button type="button" className="ui-button" onClick={props.closeModal}>
          Close
        </button>
      </div>
    </div>
  );
};

export default withRouter(JoinGameModal);

JoinGameModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  requestedGame: PropTypes.shape({
    creatingPlayer: PropTypes.string,
    gameTitleRef: PropTypes.string.isRequired,
    pendingRequest: PropTypes.string,
    requestAccepted: PropTypes.bool.isRequired,
  }).isRequired,
  requestedGameId: PropTypes.string,
  unload: PropTypes.func.isRequired
};

JoinGameModal.defaultProps = {
  requestedGameId: null,
  requestedGame: {
    pendingRequest: null,
  },
};
