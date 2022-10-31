import React from 'react';
import { Button, Container } from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';
import SignInModal from '../components/modals/SignInModal';

// added

const introMessageStyle = {
  textAlign: 'center',
  fontWeight: 'bolder',
  color: 'black',
  fontSize: '16px',
  paddingLeft: '10%',
};

const landingStyleA = {
  backgroudnColor: 'whitesmoke',
};

const landingStyleB = {
  backgroundColor: 'cyan',
};

const centerBreak = {
  height: '65px',
};

const messageStyle = {
  display: 'block',
  textAlign: 'left',
  height: '50%',
  paddingLeft: '15%',
};

/* A simple static component to render some text for the landing page. */
const Landing = () => (
  <div>
    <div className="headerTopTitle">
      <div style={centerBreak} />
      <Container fluid style={introMessageStyle}>
        <h3 style={{ top: '50%' }}>DOELT</h3>
        <b>
          <hr />
        </b>
        <h4>Department Of Education Legislation Tracker</h4>
        <p>
          Have an idea to improve Hawaii <br />
          Keep a track of it here!
        </p>
      </Container>
    </div>
    <div style={landingStyleB}>
      <Container fluid style={messageStyle}>
        <h3 style={{ textAlign: 'center' }}>LOGIN TO YOUR ACCOUNT </h3>
        <div style={{ textAlign: 'center' }}>
          <SignInModal />
        </div>
        <div style={{ textAlign: 'center' }}>
          <b>If you are experiencing login difficulties</b>
        </div>
        If you have are having difficulty with logging in, please contact the
        following.
        <div style={{ textAlign: 'center' }}>
          <Button variant="primary">
            <b>
              <Icon.EnvelopePaper /> <b>Contact Assistance</b>
            </b>
          </Button>
        </div>
      </Container>
      <br />
    </div>

    <div style={landingStyleA}>
      <Container fluid style={messageStyle}>
        <h3 style={{ textAlign: 'center' }}>NOTICES</h3>
        <ul>
          <li>
            <b>Daily Down Time</b>
            <br />
          </li>
          <li>
            <b>Upcoming Scheduled Maintenance</b>
          </li>
        </ul>
      </Container>
    </div>

    <div style={messageStyle}>
      <p>Created for DOE</p>
    </div>
  </div>
);

export default Landing;
