import React, { Component } from 'react';
import PropTypes from 'prop-types';

class DropDownMenu extends Component {
  constructor(props) {
    super(props);
    this.updateSelectedMenuItem = this.updateSelectedMenuItem.bind(this);
    this.toggleDropdownMenu = this.toggleDropdownMenu.bind(this);
    this.availableMenuItems = this.props.menuItems;
    this.state = {
      showDropdownMenu: false,
      selectedMenuItem: this.availableMenuItems[0],
    };
  }

  updateSelectedMenuItem(index) {
    this.setState({
      showDropdownMenu: false,
      selectedMenuItem: this.availableMenuItems[index],
    });
    this.props.callback(index);
  }

  toggleDropdownMenu() {
    this.setState({
      showDropdownMenu: !this.state.showDropdownMenu,
    });
  }

  renderDropdownItems() {
    return this.availableMenuItems.map((item, index) => {
      if (item !== this.state.selectedMenuItem) {
        return (
          <button
            key={item.id}
            type="button"
            className="dropdown-item"
            onKeyPress={() => this.updateSelectedMenuItem(index)}
            onClick={() => this.updateSelectedMenuItem(index)}
          >
            {item.name}
          </button>
        );
      }
      return <div key={item.id} />;
    });
  }

  render() {
    const { selectedMenuItem, showDropdownMenu } = this.state;
    return (
      <div className="dropdown">
        <button
          type="button"
          className={`dropdown__button ${showDropdownMenu ? 'show' : ''}`}
          onClick={this.toggleDropdownMenu}
        >
          {selectedMenuItem.name}
          &nbsp;&nbsp;
          <img
            className="dropdown__arrow"
            src="https://res.cloudinary.com/sorebear/image/upload/v1521228835/svg-icons/ess-light/essential-light-04-chevron-down.svg"
            alt="down arrow"
          />
        </button>
        <div className={`dropdown__content ${showDropdownMenu ? 'show' : ''}`}>
          {this.renderDropdownItems()}
        </div>
      </div>
    );
  }
}

export default DropDownMenu;

DropDownMenu.propTypes = {
  callback: PropTypes.func.isRequired,
  menuItems: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  })).isRequired,
};
