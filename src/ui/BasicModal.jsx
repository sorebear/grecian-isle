import React from 'react';
import PropTypes from 'prop-types';

const BasicModal = ({ children, className }) => (
  <div className="modal-mask">
    <div className={`modal ${className}`}>
      {children}
    </div>
  </div>
);

export default BasicModal;

BasicModal.propTypes = {
  className: PropTypes.string,
  children: PropTypes.element.isRequired,
  showModal: PropTypes.bool.isRequired,
};

BasicModal.defaultProps = {
  className: '',
};
