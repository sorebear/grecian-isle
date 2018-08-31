import React from 'react';
import PropTypes from 'prop-types';

const Worker = ({ workerId, workerImages, className, conditional, onClick }) => (
  <div
    className={`worker-container ${workerId} ${className}`}
    role="button"
    style={{ cursor: conditional ? 'pointer' : 'default' }}
    onClick={conditional ? onClick : null}
    onKeyDown={conditional ? onClick : null}
  >
    <div className="block worker-base-larger">
      <div className="block-face block-side front" />
      <div className="block-face block-side back" />
      <div className="block-face block-side left" />
      <div className="block-face block-side right" />
      <div className="block-face top" />
    </div>
    <div className="block worker-base-smaller">
      <div className="block-face block-side front" />
      <div className="block-face block-side back" />
      <div className="block-face block-side left" />
      <div className="block-face block-side right" />
      <div className="block-face top" />
    </div>
    <div className="block worker-column">
      <div className="block-face block-side front">
        { workerImages[workerId]}
      </div>
      <div className="block-face block-side back">
        { workerImages[workerId]}
      </div>
      <div className="block-face block-side left">
        { workerImages[workerId]}
      </div>
      <div className="block-face block-side right">
        { workerImages[workerId]}
      </div>
    </div>
    <div className="block worker-top-smaller">
      <div className="block-face block-side front" />
      <div className="block-face block-side back" />
      <div className="block-face block-side left" />
      <div className="block-face block-side right" />
      <div className="block-face top" />
      <div className="block-face bottom" />
    </div>
    <div className="block worker-top-larger">
      <div className="block-face block-side front" />
      <div className="block-face block-side back" />
      <div className="block-face block-side left" />
      <div className="block-face block-side right" />
      <div className="block-face top" />
      <div className="block-face bottom" />
    </div>
  </div>
);

export default Worker;

Worker.propTypes = {
  workerId: PropTypes.string.isRequired,
  className: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  conditional: PropTypes.bool,
  workerImages: PropTypes.shape({
    p1Male: PropTypes.element.isRequired,
    p2Male: PropTypes.element.isRequired,
    p1Female: PropTypes.element.isRequired,
    p2Female: PropTypes.element.isRequired
  })
};

Worker.defaultProps = {
  conditional: undefined,
  onClick: undefined,
};
