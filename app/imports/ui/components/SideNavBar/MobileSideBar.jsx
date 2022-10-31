import React, { useState, useEffect } from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import {
  HouseFill,
  CardChecklist,
  ListColumnsReverse,
  CalendarEventFill,
  QuestionCircle,
} from 'react-bootstrap-icons';
import '../style/Component.css';
import PropTypes from 'prop-types';
import MobileSignOutCheck from '../MobileSignOutCheck';

const MobileSideBar = (props) => {
  // the width of the screen using React useEffect
  const [width, setWidth] = useState(window.innerWidth);
  // make sure that it changes with the window size
  useEffect(() => {
    const handleResizeWindow = () => setWidth(window.innerWidth);
    // subscribe to window resize event "onComponentDidMount"
    window.addEventListener('resize', handleResizeWindow);
    return () => {
      // unsubscribe "onComponentDestroy"
      window.removeEventListener('resize', handleResizeWindow);
    };
  }, []);

  const mobileBottomMenuStyle = {
    color: 'white',
    backgroundColor: '#242c41',
    zIndex: '100px',
    fontSize: '20px',
  };

  const openSelected = {
    color: 'white',
    backgroundColor: '#242c41',
    width: width * 0.2,
    minWidth: width * 0.2,
    maxWidth: width * 0.2,
    textAlign: 'center',
  };

  const openReg = {
    color: 'white',
    backgroundColor: '#2e374f',
    width: width * 0.2,
    minWidth: width * 0.2,
    maxWidth: width * 0.2,
    textAlign: 'center',
  };
  const { page } = props;

  return (
    <Navbar
      className="justify-content-start"
      style={mobileBottomMenuStyle}
      fixed="bottom"
      activeKey="/home"
    >
      <Nav>
        <Nav.Link
          href="/"
          className="py-3 navButtons"
          style={page === 'home' ? openSelected : openReg}
        >
          <HouseFill style={{ fontSize: '30px' }} className="mb-1 me-3 ms-1" />
        </Nav.Link>
        <Nav.Link
          href="/view/all"
          className="py-3 navButtons"
          style={page === 'all-bills' ? openSelected : openReg}
        >
          <ListColumnsReverse style={{ fontSize: '30px' }} className="mb-1 me-3 ms-1" />
        </Nav.Link>
        <Nav.Link
          href="/view/DOE"
          className="py-3 navButtons"
          style={page === 'doe-bills' ? openSelected : openReg}
        >
          <CardChecklist style={{ fontSize: '30px' }} className="mb-1 me-3 ms-1" />
        </Nav.Link>
        <Nav.Link
          href="/calendar"
          className="py-3 navButtons"
          style={page === 'calendar' ? openSelected : openReg}
        >
          <CalendarEventFill
            style={{ fontSize: '30px' }}
            className="mb-1 me-3 ms-1"
          />
        </Nav.Link>
        <Nav.Link
          href="#"
          className="py-3 navButtons"
          style={page === 'question' ? openSelected : openReg}
        >
          <QuestionCircle
            style={{ fontSize: '30px' }}
            className="mb-1 me-3 ms-1"
          />
        </Nav.Link>
        <Nav.Link
          className="py-3 navButtons"
        >
          <MobileSignOutCheck />
        </Nav.Link>
      </Nav>
    </Navbar>
  );
};

MobileSideBar.propTypes = {
  page: PropTypes.string.isRequired,
};

export default MobileSideBar;
