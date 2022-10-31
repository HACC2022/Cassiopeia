import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Accordion } from 'react-bootstrap';

/** Renders a single row in the List Stuff table. See pages/ListStuff.jsx. */
const SavedBill = ({ bill }) => (
  <tr>
    <td>
      <div style={{ fontSize: '20px' }}><Link to={`/view/${bill.code}`}><strong>{bill.code}</strong></Link></div>
      <Accordion flush className="billAccordion">
        <Accordion.Item eventKey="0">
          <Accordion.Header>{bill.measureTitle}</Accordion.Header>
          <Accordion.Body>{bill.description}</Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </td>
    <td>{bill.office ? bill.office.toString() : 'N/A'}</td>
    <td>{bill.doeAction ? bill.doeAction : 'N/A'}</td>
    <td>{bill.currentReferral ? bill.currentReferral : 'N/A'}</td>
    <td>
      {bill.hearingDate ? bill.hearingDate : 'N/A'}<br />
      {bill.hearingTime}
    </td>
    <td>{bill.doePosition ? bill.doePosition : 'N/A'}</td>
    <td>{bill.testifier ? bill.testifier : 'N/A'}</td>
    <td>{bill.doeInternalStatus ? bill.doeInternalStatus : 'N/A'}</td>{/* THIS IS AN INTERNALLY TRACKED DOE STATUS, NOT THE STATUS ON THE STATE WEBSITE */}
  </tr>
);

// Require a document to be passed to this component.
SavedBill.propTypes = {
  bill: PropTypes.shape({
    // eslint-disable-next-line react/forbid-prop-types
    office: PropTypes.array,
    archive: PropTypes.bool,
    code: PropTypes.string,
    measurePdfUrl: PropTypes.string,
    measureArchiveUrl: PropTypes.string,
    measureTitle: PropTypes.string,
    reportTitle: PropTypes.string,
    description: PropTypes.string,
    statusHorS: PropTypes.string,
    statusDescription: PropTypes.string,
    statusDate: PropTypes.string,
    introducer: PropTypes.string,
    currentReferral: PropTypes.string,
    companion: PropTypes.string,
    doeAction: PropTypes.string,
    hearingDate: PropTypes.string,
    hearingTime: PropTypes.string,
    hearingLocation: PropTypes.string,
    doePosition: PropTypes.string,
    testifier: PropTypes.string,
    doeInternalStatus: PropTypes.string,
    _id: PropTypes.string,
  }).isRequired,
};

export default SavedBill;
