import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link, Navigate } from 'react-router-dom';
import { Accounts } from 'meteor/accounts-base';
import { Alert, Button, Modal } from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';
import SimpleSchema from 'simpl-schema';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import {
  AutoForm,
  ErrorsField,
  SubmitField,
  TextField,
} from 'uniforms-bootstrap5';

/**
 * SignUp component is similar to signin component, but we create a new user instead.
 */
const MobileSignUpModal = () => {
  const [error, setError] = useState('');
  const [redirectToReferer, setRedirectToRef] = useState(false);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const schema = new SimpleSchema({
    email: String,
    password: String,
  });
  const bridge = new SimpleSchema2Bridge(schema);

  /* Handle SignUp submission. Create user account and a profile entry, then redirect to the home page. */
  const submit = (doc) => {
    const { email, password } = doc;
    Accounts.createUser({ email, username: email, password }, (err) => {
      if (err) {
        setError(err.reason);
      } else {
        setError('');
        setRedirectToRef(true);
      }
    });
  };

  // if correct authentication, redirect to from: page instead of signup screen
  if (redirectToReferer) {
    return <Navigate to="/home" />;
  }
  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        <b>
          <Icon.PersonPlus />
        </b>
      </Button>

      <Modal show={show} onHide={handleClose}>
        <AutoForm schema={bridge} onSubmit={(data) => submit(data)}>
          <Modal.Header closeButton>
            <Modal.Title>
              <h3 style={{ textAlign: 'center' }}>Register your account</h3>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <TextField name="email" placeholder="E-mail address" />
            <TextField name="password" placeholder="Password" type="password" />
            <ErrorsField />
            <div className="text-center">
              <SubmitField />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <div className="text-center">
              <h7>Already have an account? </h7>
              <Link to="/signin">Sign In</Link>
            </div>
          </Modal.Footer>
          {error === '' ? (
            ''
          ) : (
            <Alert variant="danger">
              <Alert.Heading>Registration was not successful</Alert.Heading>
              {error}
            </Alert>
          )}
        </AutoForm>
      </Modal>
    </>
  );
};

/* Ensure that the React Router location object is available in case we need to redirect. */
MobileSignUpModal.propTypes = {
  location: PropTypes.shape({
    state: PropTypes.string,
  }),
};

MobileSignUpModal.defaultProps = {
  location: { state: '' },
};

export default MobileSignUpModal;
