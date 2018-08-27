import React from 'react';
import PropTypes from 'prop-types';

const Block = ({ level }) => {
  if (level === 4) {
    return (
      <div className="crown-container">
        <div className="block crown-level-1">
          <div className="block-face block-side front" />
          <div className="block-face block-side back" />
          <div className="block-face block-side left" />
          <div className="block-face block-side right" />
          <div className="block-face top" />
        </div>
        <div className="block crown-level-2">
          <div className="block-face block-side front" />
          <div className="block-face block-side back" />
          <div className="block-face block-side left" />
          <div className="block-face block-side right" />
          <div className="block-face top" />
        </div>
        <div className="block crown-level-3">
          <div className="block-face block-side front" />
          <div className="block-face block-side back" />
          <div className="block-face block-side left" />
          <div className="block-face block-side right" />
          <div className="block-face top" />
          <div className="block-face bottom" />
        </div>
      </div>
    );
  }
  return (
    <div className="block">
      <div className="block-face block-side front" />
      <div className="block-face block-side left" />
      <div className="block-face block-side back" />
      <div className="block-face block-side right" />
      <div className="block-face top" />
    </div>
  );
};

export default Block;

Block.propTypes = {
  level: PropTypes.number.isRequired,
};
