import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Button, Modal } from 'react-bootstrap';
import { Power } from 'react-bootstrap-icons';

const MobileSignoutCheck = () => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const buttonStyle = {
    backgroundColor: '#2e374f',
    borderWidth: 0,
    fontWeight: 'normal',
    fontSize: '13px',
    marginLeft: 0,
    marginRight: '3px',
    boxShadow: 'none',
  };

  return (
    <>
      <Button
        className="navButtons"
        style={buttonStyle}
        variant="primary"
        onClick={handleShow}
      >
        <Power style={{ fontSize: '20px' }} className="mb-1 ms-2 mt-2" />
      </Button>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Sign Out</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to sign out?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleClose}>
            NO
          </Button>
          <Button variant="success" as={NavLink} to="/signout">
            YES
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default MobileSignoutCheck;
