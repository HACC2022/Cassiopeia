import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';

const HalpModal = () => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const buttonStyle = {
    backgroundColor: 'transparent',
    borderWidth: 0,
    fontWeight: 'normal',
    fontSize: '12px',
    marginLeft: 0,
    marginRight: '3px',
    boxShadow: 'none',
  };

  return (
    <>
      <Button className="mt-2 ms-2 forgotPw" style={buttonStyle} onClick={handleShow}>
        Forgot password?
      </Button>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Forgot Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Please contact an administrator to reset your password.</p>
        </Modal.Body>
      </Modal>
    </>
  );
};
export default HalpModal;
