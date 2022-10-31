import React from 'react';
import { Nav, Col } from 'react-bootstrap';
import {
  HouseFill,
  CardChecklist,
  ListColumnsReverse,
  CalendarEventFill,
} from 'react-bootstrap-icons';
import PropTypes from 'prop-types';
import MobileSignOutCheck from '../MobileSignOutCheck';
import HalpModal from '../modals/HelpModal';

const DesktopSideBarCollapsed = (props) => {

  const closeWidth = '62px';
  const { page } = props;

  const closeSideBarStyle = {
    position: 'fixed',
    width: closeWidth,
    minWidth: closeWidth,
    maxWidth: closeWidth,
    minHeight: '100vh',
    backgroundColor: '#2e374f',
    color: 'white',
    fontSize: '14px',
    zIndex: 300,
  };
  const closedSelected = {
    width: '60px',
    color: 'white',
    backgroundColor: '#242c41',
  };
  const closedReg = {
    width: '60px',
    color: 'white',
    backgroundColor: '#2e374f',
  };

  return (
    <Col className="col-3">
      <Nav
        className="justify-content-start"
        style={closeSideBarStyle}
        activeKey="/home"
      >
        <Nav.Item>
          <Nav.Link
            href="/"
            className="py-3 navButtons"
            style={page === 'home' ? closedSelected : closedReg}
          >
            <HouseFill className="mb-1 ms-1" style={{ fontSize: '20px' }} />
          </Nav.Link>
          <Nav.Link
            href="/view/all"
            className="py-3 navButtons"
            style={page === 'all-bills' ? closedSelected : closedReg}
          >
            <ListColumnsReverse className="mb-1 ms-1" style={{ fontSize: '20px' }} />
          </Nav.Link>
          <Nav.Link
            href="/view/DOE"
            className="py-3 navButtons"
            style={page === 'doe-bills' ? closedSelected : closedReg}
          >
            <CardChecklist
              style={{ fontSize: '20px' }}
              className="mb-1 me-3 ms-1"
            />
          </Nav.Link>
          <Nav.Link
            href="/calendar"
            className="py-3 navButtons"
            style={page === 'calendar' ? closedSelected : closedReg}
          >
            <CalendarEventFill
              className="mb-1 ms-1"
              style={{ fontSize: '20px' }}
            />
          </Nav.Link>
          <MobileSignOutCheck style={{ fontSize: '20px' }} />
          <br />
          <HalpModal />
        </Nav.Item>
      </Nav>
    </Col>
  );
};

DesktopSideBarCollapsed.propTypes = {
  page: PropTypes.string.isRequired,
};

export default DesktopSideBarCollapsed;
