import React from 'react';
import PropTypes from 'prop-types';

const TopBar = ({ children, currentLocation }) => (
  <div className="top-bar flex-row space-between">
    <div className="top-bar__logo flex-row align-center">
      <h3>Sore Bear Games - </h3>
      <h3>{currentLocation}</h3>
    </div>
    { children }
    <div className="top-bar__info flex-row align-center justify-end">
      <h3>Info</h3>
    </div>
  </div>
);

export default TopBar;

TopBar.propTypes = {
  children: PropTypes.element.isRequired,
  currentLocation: PropTypes.string.isRequired,
};
