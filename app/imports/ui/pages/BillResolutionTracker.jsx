import React, { useEffect, useState } from 'react';
import { Button, Col, Navbar, Nav, NavLink } from 'react-bootstrap';
import { ChevronLeft, PencilSquare, List, FileEarmarkPlusFill, Trash3Fill } from 'react-bootstrap-icons';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import BillResolutionDetails from '../components/billDetails/BillResolutionDetails';
import TestimonyTracker from '../components/testimony/TestimonyTracker';
import DesktopSideBarExpanded from '../components/SideNavBar/DesktopSideBarExpanded';
import DesktopSideBarCollapsed from '../components/SideNavBar/DesktopSideBarCollapsed';
import CreateTestimonyModal from '../components/testimony/CreateTestimonyModal';
import MobileSideBar from '../components/SideNavBar/MobileSideBar';

const BillResolutionTracker = () => {
  const { _code } = useParams();
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [expanded, setExpanded] = useState(false);

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

  const breakPoint = 800;
  const mobileMainBody = {
    fontSize: '10px',
  };
  const mainBodyLeftMargin = {
    marginLeft: expanded ? '132px' : '62px',
  };
  const navBarStyle = {
    backgroundColor: '#FFFFFF',
    borderBottom: '2px solid #DDDDDD',
    marginLeft: expanded ? '132px' : '62px',
  };
  function getDesktopSidebar() {
    if (expanded) {
      return (
        <Col className="col-3" style={{ position: 'fixed' }}>
          <Button
            onClick={() => setExpanded(false)}
            className="py-2 px-3 text-end navButtons navButtonStyle"
          >
            <ChevronLeft />
          </Button>
          <DesktopSideBarExpanded page="deets" />
        </Col>
      );
    }
    return (
      <Col style={{ position: 'fixed' }}>
        <Button
          onClick={() => setExpanded(true)}
          className="py-2 px-3 text-center navButtons closedNavButtonStyle"
        >
          <List />
        </Button>
        <DesktopSideBarCollapsed page="deets" />
      </Col>
    );
  }

  return (
    <Col>
      {width < breakPoint ? <MobileSideBar page="deets" /> : getDesktopSidebar()}
      <Col>
        <div style={width < breakPoint ? mobileMainBody : mainBodyLeftMargin} className="d-flex justify-content-center">
          <Navbar className="fixed-top justify-content-center" style={width < breakPoint ? mobileMainBody : navBarStyle}>
            <Nav.Link className="mx-5 my-1" as={NavLink} onClick={handleShow}> <FileEarmarkPlusFill className="mb-1" />&nbsp;&nbsp;Create New Testimony</Nav.Link>
            <Nav.Link className="mx-5 my-1" as={Link} to={`/edit/${_code}`}> <PencilSquare className="mb-1" />&nbsp;&nbsp;Edit Bill Details</Nav.Link>
            <Nav.Link className="mx-5 my-1" style={{ color: 'red' }} as={NavLink} to="#"> <Trash3Fill className="mb-1" />&nbsp;&nbsp;Remove from DOE DB</Nav.Link>
          </Navbar>
          <CreateTestimonyModal
            show={show}
            _code={_code}
            handleClose={handleClose}
          />
          <BillResolutionDetails />
        </div>
        <TestimonyTracker _code={_code} />
      </Col>
    </Col>
  );
};

export default BillResolutionTracker;
