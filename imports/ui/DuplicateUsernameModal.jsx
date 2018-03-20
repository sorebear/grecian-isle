import React from 'react';

const DuplicateUsernameModal = ({ showModal, closeModal }) => (
   <div className="modal-mask" style={{ display: showModal ? 'flex' : 'none'}}>
      <div className="modal">
         <h3>You can't have the same username as your opponent.</h3>
         <p>Please change your username and try again.</p>
         <button className="ui-button" onClick={closeModal}>
            Close
         </button>
      </div>
   </div>
);

export default DuplicateUsernameModal;