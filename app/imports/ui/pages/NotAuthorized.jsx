import React, { useEffect, useState } from 'react';
import { Button, Col, Container } from 'react-bootstrap';
import { ChevronLeft, List } from 'react-bootstrap-icons';
import { PAGE_IDS } from '../utilities/PageIDs';
import DesktopSideBarExpanded from '../components/SideNavBar/DesktopSideBarExpanded';
import DesktopSideBarCollapsed from '../components/SideNavBar/DesktopSideBarCollapsed';
import MobileSideBar from '../components/SideNavBar/MobileSideBar';

/** Render a Not Found page if the user enters a URL that doesn't match any route. */
const NotFound = () => {
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
    <>
      {width < breakPoint ? <MobileSideBar page="deets" /> : getDesktopSidebar()}
      <Container id={PAGE_IDS.NOT_FOUND} className="py-3 h-100 d-flex justify-content-center align-items-center flex-column">
        <h1>NOT AUTHORIZED</h1>
        <h4>OOPS!</h4>
      </Container>
    </>
  );
};

export default NotFound;
