import React from 'react';
import PropTypes from 'prop-types';

const GameSpaceButton = ({ id, onClick, conditional }) => {
  if (conditional) {
    return (
      <button
        id={id}
        type="button"
        className="game-space-button"
        onClick={onClick}
      />
    );
  }
  return (
    <button
      id={id}
      type="button"
      className="game-space-button"
      onClick={onClick}
      disabled
    />
  );
};

export default GameSpaceButton;

GameSpaceButton.propTypes = {
  id: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  conditional: PropTypes.bool.isRequired,
};
