import React from 'react';
import PropTypes from 'prop-types';

const GameSpaceButton = ({ id, onClick, children, conditional }) => {
  if (conditional) {
    return (
      <button
        id={id}
        className="game-space-button"
        onClick={onClick}
      >
        {children}
      </button>
    );
  }
  return (
    <button
      id={id}
      className="game-space-button"
      onClick={onClick}
      disabled
    >
      {children}
    </button>
  );
};

export default GameSpaceButton;

GameSpaceButton.propTypes = {
  id: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  children: PropTypes.element.isRequired,
  conditional: PropTypes.bool.isRequired,
};
