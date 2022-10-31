import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { Alert, Button, Modal } from 'react-bootstrap';
import SimpleSchema from 'simpl-schema';
import * as Icon from 'react-bootstrap-icons';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import {
  AutoForm,
  ErrorsField,
  SubmitField,
  TextField,
} from 'uniforms-bootstrap5';

/**
 * Signin page overrides the form’s submit event and call Meteor’s loginWithPassword().
 * Authentication errors modify the component’s state to be displayed
 */
const MobileSignInModal = () => {
  const [error, setError] = useState('');
  const [redirect, setRedirect] = useState(false);
  const schema = new SimpleSchema({
    email: String,
    password: String,
  });

  const bridge = new SimpleSchema2Bridge(schema);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // Handle Signin submission using Meteor's account mechanism.
  const submit = (doc) => {
    // console.log('submit', doc, redirect);
    const { email, password } = doc;
    Meteor.loginWithPassword(email, password, (err) => {
      if (err) {
        setError(err.reason);
      } else {
        setRedirect(true);
      }
    });
    // console.log('submit2', email, password, error, redirect);
  };

  // Render the signin form.
  // console.log('render', error, redirect);
  // if correct authentication, redirect to page instead of login screen
  if (redirect) {
    return <Navigate to="/home" />;
  }
  // Otherwise return the Login form.
  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        <b>
          <Icon.PersonCheck />
        </b>
      </Button>
      <Modal show={show} onHide={handleClose}>
        <AutoForm schema={bridge} onSubmit={(data) => submit(data)}>
          <Modal.Header closeButton>
            <Modal.Title>
              <h3 style={{ textAlign: 'center' }}>Login to your account</h3>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <TextField
              id="signin-form-email"
              name="email"
              placeholder="E-mail address"
            />
            <TextField
              id="signin-form-password"
              name="password"
              placeholder="Password"
              type="password"
            />
            <ErrorsField />
            <div className="text-center">
              <SubmitField id="signin-form-submit" />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <div className="text-center">
              <h7>Don&apos;t have an account yet? </h7>
              <Link to="/signup">Sign Up</Link>
            </div>
          </Modal.Footer>

          {error === '' ? (
            ''
          ) : (
            <Alert variant="danger">
              <Alert.Heading>Login was not successful</Alert.Heading>
              {error}
            </Alert>
          )}
        </AutoForm>
      </Modal>
    </>
  );
};

export default MobileSignInModal;
