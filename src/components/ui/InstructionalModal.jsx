import React, { Component } from 'react';
import PropTypes from 'prop-types';

class InstructionalModal extends Component {
  constructor(props) {
    super(props);
    this.goToNextItem = this.goToNextItem.bind(this);
    this.goToPreviousItem = this.goToPreviousItem.bind(this);
    this.state = {
      currentItem: 0,
    };
  }

  goToNextItem() {
    const { currentItem } = this.state;
    this.setState({
      currentItem: currentItem + 1 >= this.props.children.length ? 0 : currentItem + 1,
    });
  }

  goToPreviousItem() {
    const { currentItem } = this.state;
    this.setState({
      currentItem: currentItem <= 0 ? this.props.children.length - 1 : currentItem - 1,
    });
  }

  render() {
    return (
      <div className="modal-mask">
        <div className={`modal ${this.props.gameTitleRef}`}>
          <button type="button" className="close-modal-button" onClick={this.props.closeModal}>
            { this.props.imgCloseModal }
          </button>
          <div className="instructions">
            {this.props.children[this.state.currentItem]}
          </div>
          <div className="flex-row w-100 justify-between">
            <button type="button" className="ui-button w-45" onClick={this.goToPreviousItem}>
              Previous
            </button>
            <button
              type="button"
              className="ui-button w-45"
              onClick={this.goToNextItem}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default InstructionalModal;

InstructionalModal.propTypes = {
  children: PropTypes.arrayOf(PropTypes.element.isRequired).isRequired,
  closeModal: PropTypes.func.isRequired,
  gameTitleRef: PropTypes.string.isRequired,
  imgCloseModal: PropTypes.element.isRequired
};
