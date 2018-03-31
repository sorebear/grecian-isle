import React from 'react';
import PropTypes from 'prop-types';

const TopBar = ({ children }) => (
  <div className="top-bar flex-row justify-center">
    { children }
  </div>
);

export default TopBar;

TopBar.propTypes = {
  children: PropTypes.element.isRequired,
};
