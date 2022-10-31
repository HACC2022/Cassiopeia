import React, { useEffect, useState } from 'react';
import swal from 'sweetalert';
import { Button, Col, Container, Row, Navbar, Nav } from 'react-bootstrap';
import { AutoField, AutoForm, SubmitField, TextField } from 'uniforms-bootstrap5';
import { useTracker } from 'meteor/react-meteor-data';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { useNavigate, useParams } from 'react-router';
import { ChevronLeft, XCircle, HddFill, List } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';
import { SavedMeasures } from '../../api/savedMeasures/SavedMeasuresCollection';
import { updateMethod } from '../../api/base/BaseCollection.methods';
import { PAGE_IDS } from '../utilities/PageIDs';
import LoadingSpinner from '../components/LoadingSpinner';
import DesktopSideBarExpanded from '../components/SideNavBar/DesktopSideBarExpanded';
import DesktopSideBarCollapsed from '../components/SideNavBar/DesktopSideBarCollapsed';
import MobileSideBar from '../components/SideNavBar/MobileSideBar';

const bridge = new SimpleSchema2Bridge(SavedMeasures._schema);

/* Renders the EditBill page for editing a single document. */
const EditMeasure = () => {
  const { _code } = useParams();
  const { doc, ready } = useTracker(() => {
    const subscription = SavedMeasures.subscribeMeasureSaved();
    const rdy = subscription.ready();
    const document = SavedMeasures.find({ code: _code }).fetch();
    return {
      doc: document[0],
      ready: rdy,
    };
  }, false);

  const navigate = useNavigate();
  if (!doc && ready) {
    navigate('/*');
  }

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

  // On successful submit, insert the data.
  const submit = (data) => {
    const { office, archive, code, measurePdfUrl, measureArchiveUrl, measureTitle, reportTitle, description, statusHorS,
      statusDescription, statusDate, introducer, currentReferral, companion, doeAction, hearingDate, hearingTime,
      hearingLocation, doePosition, testifier, doeInternalStatus } = data;
    const collectionName = SavedMeasures.getCollectionName();
    // eslint-disable-next-line max-len
    const updateData = { _id: doc._id, office, archive, code, measurePdfUrl, measureArchiveUrl, measureTitle, reportTitle,
      description, statusHorS, statusDescription, statusDate, introducer, currentReferral, companion, doeAction, hearingDate,
      hearingTime, hearingLocation, doePosition, testifier, doeInternalStatus };
    updateMethod.callPromise({ collectionName, updateData })
      .catch(error => swal('Error', error.message, 'error'))
      .then(() => swal('Success', 'Measure updated successfully', 'success')
        .then(function () {
          window.location = `/view/${code}`;
        }));
  };

  const navBarStyle = {
    backgroundColor: '#F7F7F7',
    borderBottom: '2px solid #DDDDDD',
    marginLeft: expanded ? '132px' : '62px',
  };
  const mobileNavBarStyle = {
    backgroundColor: '#F7F7F7',
    borderBottom: '2px solid #DDDDDD',
    paddingLeft: '20px',
    paddingRight: '20px',
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
          <DesktopSideBarExpanded page="edit-bill" />
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
        <DesktopSideBarCollapsed page="edit-bill" />
      </Col>
    );
  }

  return (
    <Col id={PAGE_IDS.EDIT_BILL}>
      {width < breakPoint ? <MobileSideBar page="deets" /> : getDesktopSidebar()}
      {ready ? (
        <Col style={width < breakPoint ? mobileMainBody : mainBodyLeftMargin} className="d-flex justify-content-center">
          <AutoForm className="p-5 d-flex justify-content-center" schema={bridge} onSubmit={data => submit(data)} model={doc}>
            <Navbar className="fixed-top d-flex justify-content-center align-items-center" style={width < breakPoint ? mobileNavBarStyle : navBarStyle}>
              <HddFill />
              <SubmitField className="testimonyNavbarButtons me-5" value="Save Changes" />
              <Nav.Link className="mx-5 my-1" as={Link} to={`/view/${_code}`}><XCircle className="ms-5 me-2 mb-1" />Discard Changes</Nav.Link>
            </Navbar>
            <Container className="text-center border border-1 small m-3" style={{ backgroundColor: 'white' }}>
              <Row style={{ backgroundColor: '#ddf3dd' }}>
                <Col>
                  <h3 className="pt-2"><b>{`Editing ${_code}`}</b></h3>
                </Col>
              </Row>
              <Row className="py-1">
                <b>{doc.measureTitle}</b>
              </Row>
              <Row>
                <Col>
                  <Row>
                    <Col className="border border-start-0 border-end-0">
                      <b>Report Title</b>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="py-2">
                      {doc.reportTitle}
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Row>
                    <Col className="border border-start-0 border-end-0">
                      <b>Description</b>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="py-2">
                      {doc.description}
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row className="border border-bottom-0 border-start-0 border-end-0">
                <Col>
                  <Row>
                    <Col className="border border-top-0 border-start-0 border-end-0">
                      <b>Office</b>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="py-2">
                      <AutoField name="office" label="" />
                    </Col>
                  </Row>
                </Col>
                <Col className="border border-top-0 border-bottom-0">
                  <Row>
                    <Col className="border border-top-0 border-start-0 border-end-0">
                      <b>Action</b>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="py-2">
                      <TextField name="doeAction" label="" />
                    </Col>
                  </Row>
                </Col>
                <Col>
                  <Row>
                    <Col className="border border-top-0 border-start-0 border-end-0">
                      <b>Status</b>
                    </Col>
                  </Row>
                  <Row className="py-2">
                    <Col>
                      <TextField name="doeInternalStatus" label="" />
                    </Col>
                  </Row>
                </Col>
                <Col className="border border-top-0 border-bottom-0 border-end-0">
                  <Row>
                    <Col className="border border-top-0 border-start-0 border-end-0">
                      <b>Position</b>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="py-2">
                      <TextField name="doePosition" label="" />
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row className="border border-start-0 border-end-0 border-bottom-0">
                <Col className="border border-top-0 border-bottom-0 border-start-0">
                  <Row>
                    <Col className="border border-top-0 border-start-0 border-end-0">
                      <b>Introduced by</b>
                    </Col>
                  </Row>
                  <Row className="py-2">
                    <Col>
                      {doc.introducer}
                    </Col>
                  </Row>
                </Col>
                <Col className="border border-top-0 border-bottom-0 border-start-0">
                  <Row>
                    <Col className="border border-top-0 border-start-0 border-end-0">
                      <b>Committee Referral</b>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="py-2">
                      {doc.currentReferral}
                    </Col>
                  </Row>
                </Col>
                <Col className="border border-top-0 border-bottom-0 border-start-0">
                  <Row>
                    <Col className="border border-top-0 border-start-0 border-end-0">
                      <b>Companion</b>
                    </Col>
                  </Row>
                  <Row className="py-2">
                    <Col>
                      {doc.companion}
                    </Col>
                  </Row>
                </Col>
                <Col>
                  <Row>
                    <Col className="border border-top-0 border-start-0 border-end-0">
                      <b>Supt&apos;s</b>
                    </Col>
                  </Row>
                  <Row className="py-2">
                    <Col>
                      {/* TODO supplements, not sure what this is either */}
                      <input type="checkbox" />
                  &nbsp;Binder
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row>
                <Col className="border border-top-0 border-bottom-0 border-start-0">
                  <Row>
                    <Col className="border border-start-0 border-end-0">
                      <b>Hearing Date and Time</b>
                    </Col>
                  </Row>
                  <Row className="py-2">
                    <Col>
                      <TextField name="hearingDate" label="Date" />
                      <TextField name="hearingTime" label="Time" />
                    </Col>
                  </Row>
                </Col>
                <Col className="border border-top-0 border-bottom-0 border-start-0">
                  <Row>
                    <Col className="border border-start-0 border-end-0">
                      <b>Hearing Location</b>
                    </Col>
                  </Row>
                  <Row className="py-2">
                    <Col>
                      <TextField name="hearingLocation" label="" />
                    </Col>
                  </Row>
                </Col>
                <Col>
                  <Row>
                    <Col className="border border-start-0 border-end-0">
                      <b>Notified of Hearings</b>
                    </Col>
                  </Row>
                  <Row className="py-2">
                    <Col>
                      {/* TODO 'notified of hearings' section from lotus notes. no idea */}
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Row>
                    <Col className="border border-start-0 border-end-0">
                      <b>Last Status Text</b>
                    </Col>
                  </Row>
                  <Row className="py-2">
                    <Col>
                      {`${doc.statusDate}: ${doc.statusDescription}`}
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Container>
          </AutoForm>
        </Col>
      ) : <LoadingSpinner /> }
    </Col>
  );
};

export default EditMeasure;
