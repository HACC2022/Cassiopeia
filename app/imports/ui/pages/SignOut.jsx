import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Button, Row, Image, Card } from 'react-bootstrap';
import Col from 'react-bootstrap/Col';
import { DoorOpen } from 'react-bootstrap-icons';

/* After the user clicks the "SignOut" link in the NavBar, log them out and display this page. */
const SignOut = () => {
  Meteor.logout();
  return (
    <div
      className="p-0 m-0 g-0 d-flex flex-column justify-content-between"
      style={{
        color: 'white',
        height: '100vh',
        width: '100%',
        borderCollapse: 'collapse',
        backgroundColor: '#4c556f',
      }}
    >
      <div> </div>
      <div className="d-flex flex-column gap-3">
        <Row className="g-0">
          <Col className="d-flex justify-content-center">
            <Image
              style={{ width: '10%', minWidth: '6em' }}
              className="mt-4"
              src="/images/doe-logo.png"
              alt="DOE seal"
            />
          </Col>
        </Row>
        <Row className="g-0">
          <Col className="d-flex justify-content-center mt-3">
            <h1>
              <b>DOELT</b>
            </h1>
          </Col>
        </Row>
        <Row>
          <Col className="d-flex justify-content-center mt-3">
            <Card style={{ width: '30rem', backgroundColor: '#2f374f', color: 'white' }} className="text-center">
              <Card.Body>
                <Card.Text>You have successfully logged out.</Card.Text>
                <Card.Text>
                  Click the button below to sign in again.
                </Card.Text>
                <Button href="/signin">Sign In <DoorOpen /></Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
      <div
        style={{ backgroundColor: '#2e374f' }}
        className="p-0 m-0"
      >
        <Col
          className="d-flex justify-content-center pt-2 pb-0 m-0"
          style={{ width: '100%', backgroundColor: '#4c556f' }}
        >
          <Image
            style={{ width: '25%', minWidth: '14em' }}
            src="/images/capitol.png"
            className="p-0 m-0"
            alt="Hawaii State Capitol"
          />
        </Col>
        <div
          style={{ backgroundColor: '#2e374f', fontSize: 'smaller' }}
          className="pt-3 pb-0 m-0 d-flex justify-content-center text-center"
        >
          Property of the Hawai&apos;i State Department of Education.
          Unauthorized access prohibited.
        </div>
        <div
          style={{ backgroundColor: '#2e374f', fontSize: 'small', paddingBottom: '10vh' }}
          className="m-0 d-flex justify-content-center text-center"
        >
          <p>
            <u>Contact Administrator</u>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignOut;
