import React from 'react';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import PropTypes from 'prop-types';

const LoadingSpinner = ({ message }) => (
  <Container>
    <Row>
      <Col className="d-flex justify-content-center m-3">
        <Spinner animation="border" />
        <p className="pt-1">
          &nbsp;&nbsp;{message}
        </p>
      </Col>
    </Row>
  </Container>
);

LoadingSpinner.propTypes = {
  message: PropTypes.string,
};

LoadingSpinner.defaultProps = {
  message: 'Loading',
};

export default LoadingSpinner;
