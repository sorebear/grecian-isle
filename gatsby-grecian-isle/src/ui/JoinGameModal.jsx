import React from 'react';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';

import { db } from '../firebase';

const JoinGameModal = props => {
  if (!props.requestedGameId) {
    return <div />;
  } else if (!props.requestedGame[0]) {
    return <div />;
  } else if (props.requestedGame[0].requestAccepted) {
    props.history.push(`/game/${props.requestedGameId}`, 2);
  } else if (!props.requestedGame[0].pendingRequest) {
    return (
      <div className="modal-mask">
        <div className={`modal ${props.requestedGame[0].gameTitleRef}`}>
          <h3>Sorry. {props.requestedGame[0].creatingPlayer} has rejected your request.</h3>
          <p>Please try playing a game with someone else.</p>
          <button className="ui-button" onClick={props.closeModal}>
            Close
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="modal-mask">
      <div className={`modal ${props.requestedGame[0].gameTitleRef}`}>
        <h3>Your play request has been sent!</h3>
        <p>Waiting on <span className="accent-color">{props.requestedGame[0].creatingPlayer}</span> to accept</p>
        <button className="ui-button" onClick={props.closeModal}>
          Close
        </button>
      </div>
    </div>
  );
};

export default withRouter(JoinGameModal);

JoinGameModal.propTypes = {
  requestedGameId: PropTypes.string,
  closeModal: PropTypes.func.isRequired,
  requestedGame: PropTypes.arrayOf(PropTypes.shape({
    gameTitleRef: PropTypes.string.isRequired,
    requestAccepted: PropTypes.bool.isRequired,
    pendingRequest: PropTypes.string.isRequired,
    creatingPlayer: PropTypes.string.isRequired,
  })),
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

JoinGameModal.defaultProps = {
  requestedGameId: null,
  requestedGame: {
    pendingRequest: null,
  },
};
