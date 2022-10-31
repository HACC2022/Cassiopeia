import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { Container, Col, Button } from 'react-bootstrap';
import { ChevronLeft, List } from 'react-bootstrap-icons';
import Legtracker from '../utilities/Legtracker';
import CalModal from '../components/modals/CalModal';
import DesktopSideBarCollapsed from '../components/SideNavBar/DesktopSideBarCollapsed';
import DesktopSideBarExpanded from '../components/SideNavBar/DesktopSideBarExpanded';
import MobileSideBar from '../components/SideNavBar/MobileSideBar';

const Calendar = () => {
  const [upcomingHearings, setUpcomingHearings] = useState([]);
  // modal states
  const [show, setShow] = useState(false);
  const [measure, setMeasures] = useState('');
  const [time, setTime] = useState('');
  const [room, setRoom] = useState('');
  const [youtube, setYoutube] = useState('');
  const [noticeLink, setNoticeLink] = useState('');
  const [noticeLinkPdf, setNoticeLinkPdf] = useState('');
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    document.title = 'DOELT - Calendar';
    Legtracker
      .scrapeUpcomingHearings()
      .then(initialData => {
        setUpcomingHearings(initialData.upcomingHearings);
      });
  }, []);

  const hasUpcomingHearings = () => {
    if (upcomingHearings.length === 0) {
      return [];
    }
    return upcomingHearings.map(data => (
      {
        title: data.measure,
        start: data.dateTime,
        room: data.room,
        youtube: data.youtubeURL,
        noticeLink: data.noticeURL,
        noticePdfLink: data.noticePdfURL,
      }
    ));
  };
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
          <DesktopSideBarExpanded page="calendar" />
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
        <DesktopSideBarCollapsed page="calendar" />
      </Col>
    );
  }

  return (
    <Col>
      {width < breakPoint ? <MobileSideBar page="calendar" /> : getDesktopSidebar()}
      <div style={width < breakPoint ? mobileMainBody : mainBodyLeftMargin} className="d-flex justify-content-center">
        <CalModal
          show={show}
          handleClose={handleClose}
          handleShow={handleShow}
          measure={measure}
          time={time}
          room={room}
          youtube={youtube}
          noticeUrl={noticeLink}
          noticePdf={noticeLinkPdf}
        />
        <Container className="p-lg-5">
          <FullCalendar
            defaultView="dayGridMonth"
            headerToolbar={{
              left: 'prev,next',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay',
            }}
            plugins={[dayGridPlugin]}
            events={hasUpcomingHearings()}
            /* eslint-disable-next-line react/jsx-no-bind */
            eventClick={function (info) {
              info.jsEvent.preventDefault();
              setMeasures(info.event.title);
              setTime(info.event.start.toLocaleString());
              setRoom(info.event.extendedProps.room);
              setYoutube(info.event.extendedProps.youtube);
              setNoticeLink(info.event.extendedProps.noticeLink);
              setNoticeLinkPdf(info.event.extendedProps.noticePdfLink);
              handleShow();
            }}
          />
        </Container>
      </div>
    </Col>

  );
};

export default Calendar;
