import React, { Component } from 'react';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';

class IncomingRequestModal extends Component {
  constructor(props) {
    super(props);
    this.handleResolveInvitation = this.handleResolveInvitation.bind(this);
  }

  handleResolveInvitation(requestAccepted) {
    Meteor.call('game.resolveRequestToJoin', this.props.gameId, requestAccepted, this.props.pendingRequest)
  }

	render() {
		return (
			<div className="modal-mask incoming-request-modal" style={{ display: this.props.pendingRequest ? 'flex' : 'none' }}>
				<div className="modal">
					<h3>{this.props.pendingRequest} has requested to join your game.</h3>
          <button className="ui-button" onClick={() => this.handleResolveInvitation(true)}>
						Accept
					</button>
					<button className="ui-button" onClick={() => this.handleResolveInvitation(false)}>
						Reject
					</button>
				</div>
			</div>
		);
	}
}

export default withRouter(IncomingRequestModal);
