import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { QuestionCircle } from 'react-bootstrap-icons';

const HalpModal = () => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const buttonStyle = {
    backgroundColor: '#2e374f',
    position: 'absolute',
    bottom: '8%',
    borderWidth: 0,
    fontWeight: 'normal',
    fontSize: '13px',
    marginLeft: 0,
    marginRight: '3px',
    boxShadow: 'none',
  };

  return (
    <>
      <Button className="mt-2 ms-2 navButtons" style={buttonStyle} variant="primary" onClick={handleShow}>
        <QuestionCircle style={{ fontSize: '20px' }} className="mb-1" />
      </Button>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Information</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>For assistance using this application, please watch this demonstration video. If you have additional questions, please contact an administrator.</p>
        </Modal.Body>
      </Modal>
    </>
  );
};
export default HalpModal;
