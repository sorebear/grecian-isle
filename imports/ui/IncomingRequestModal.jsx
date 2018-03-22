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
    Meteor.call('game.resolveRequestToJoin', this.props.gameId, requestAccepted, this.props.pendingRequest)
	}

	handleExit() {
		this.props.history.push('/');
	}
	
	renderIncomingRequestMessage() {
		return (
			<div className="modal">
				<h3>{this.props.pendingRequest} has requested to join your game.</h3>
				<button className="ui-button" onClick={() => this.handleResolveInvitation(true)}>
					Accept
				</button>
				<button className="ui-button" onClick={() => this.handleResolveInvitation(false)}>
					Reject
				</button>
			</div>
		);
	}

	renderWaitingMessage() {
		if (!this.props.creatingPlayer) {
			return (
				<div className="modal">
					<h3>I'm sorry. The game's creator, {this.props.leavingPlayer}, has left the game.</h3>
					<button onClick={this.handleExit} className="ui-button">
						Exit To Menu
					</button>
				</div>
			)
		}
		return (
			<div className="modal">
				{ this.props.leavingPlayer ? <h3>I'm sorry. {this.props.leavingPlayer} has left.</h3> : <div /> }
				<h3>Waiting for another player to join your game...</h3>
				<button onClick={this.handleExit} className="ui-button">
					Exit To Menu
				</button>
			</div>
		)
	}

	render() {
		return (
			<div 
				className="modal-mask incoming-request-modal" 
				style={{ display: this.props.localGame || (this.props.joiningPlayer && this.props.creatingPlayer) ? 'none' : 'flex' }}
			>
				{ this.props.pendingRequest ? this.renderIncomingRequestMessage() : this.renderWaitingMessage() }
			</div>
		);
	}
}

export default withRouter(IncomingRequestModal);
