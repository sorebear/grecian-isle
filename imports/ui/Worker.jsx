import React from 'react';
import PropTypes from 'prop-types';

const workerImages = {
  p1Female: 'https://res.cloudinary.com/sorebear/image/upload/v1520960687/grecian-isle/player-black-female.png',
  p1Male: 'https://res.cloudinary.com/sorebear/image/upload/v1520960687/grecian-isle/player-black-male.png',
  p2Female: 'http://res.cloudinary.com/sorebear/image/upload/v1520960687/grecian-isle/player-red-female.png',
  p2Male: 'https://res.cloudinary.com/sorebear/image/upload/v1520960687/grecian-isle/player-red-male.png',
};

const Worker = ({ workerId }) => (
  <div className={`worker-container ${workerId}`}>
    <div className="block worker-base">
      <div className="block-face block-side front" />
      <div className="block-face block-side back" />
      <div className="block-face block-side left" />
      <div className="block-face block-side right" />
      <div className="block-face top" />
    </div>
    {/* <div className="block worker-column">
      <div className="block-face block-side front">
        <img src={workerImages[workerId]} alt="worker" />
      </div>
      <div className="block-face block-side back">
        <img src={workerImages[workerId]} alt="worker" />
      </div>
      <div className="block-face block-side left">
        <img src={workerImages[workerId]} alt="worker" />
      </div>
      <div className="block-face block-side right">
        <img src={workerImages[workerId]} alt="worker" />
      </div>
    </div> */}
    {/* <div className="block worker-top">
      <div className="block-face block-side front" />
      <div className="block-face block-side back" />
      <div className="block-face block-side left" />
      <div className="block-face block-side right" />
      <div className="block-face top" />
      <div className="block-face bottom" />
    </div> */}
  </div>
);

export default Worker;

Worker.propTypes = {
  workerId: PropTypes.string.isRequired,
};
