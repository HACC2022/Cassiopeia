import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import { FiletypePdf, Youtube } from 'react-bootstrap-icons';

// eslint-disable-next-line react/prop-types
const CalModal = ({ show, handleClose, measure, time, room, youtube, noticeUrl, noticePdf }) => (
  <Modal show={show} onHide={handleClose}>
    <Modal.Header closeButton>
      <Modal.Title>
        <a className="text-decoration-none" href={noticeUrl} target="_blank" rel="noopener noreferrer">
          {measure}
        </a>
      </Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <div className="d-flex justify-content-between">
        <div>Date: {time}</div>
        <div>Room: {room}</div>
      </div>
      <div className="d-flex justify-content-around align-items-center">
        <a className="text-danger" target="_blank" rel="noopener noreferrer" href={youtube}>
          <Youtube fontSize={100} />
        </a>
        <a className="text-danger" target="_blank" rel="noopener noreferrer" href={noticePdf}>
          <FiletypePdf fontSize={70} />
        </a>
      </div>
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={handleClose}>
        Close
      </Button>
    </Modal.Footer>
  </Modal>
);

export default CalModal;
