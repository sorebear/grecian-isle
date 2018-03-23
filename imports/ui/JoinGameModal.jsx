import React from 'react';
import { withRouter } from 'react-router';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';

import { ActiveGames } from '../api/activeGames';

const JoinGameModal = props => {
  if (!props.requestedGameId) {
    return <div />;
  } else if (!props.requestedGame[0]) {
    return <div />;
  } else if (props.requestedGame[0].requestAccepted) {
    props.history.push(`/game/${props.requestedGameId}`, 2);
  } else if (!props.requestedGame[0].pendingRequest) {
    return (
      <div className="modal-mask join-game-modal">
        <div className="modal join-game-modal-content">
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
    <div className="modal-mask join-game-modal">
      <div className="modal join-game-modal-content">
        <h3>Your play request has been sent!</h3>
        <p>Waiting on {props.requestedGame[0].creatingPlayer} to accept</p>
        <button className="ui-button" onClick={props.closeModal}>
          Close
        </button>
      </div>
    </div>
  );
};

export default withTracker((props) => {
  Meteor.subscribe('activeGames');
  return {
    requestedGame: ActiveGames.find({ _id: props.requestedGameId }).fetch(),
  };
})(withRouter(JoinGameModal));

JoinGameModal.propTypes = {
  requestedGameId: PropTypes.string,
  closeModal: PropTypes.func.isRequired,
  requestedGame: PropTypes.arrayOf(PropTypes.shape({
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
