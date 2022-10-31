import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { CloudCheckFill } from 'react-bootstrap-icons';
import { Accordion, Button } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import swal from 'sweetalert';
import { SavedMeasures } from '../../api/savedMeasures/SavedMeasuresCollection';
import SmallerSpinner from './SmallerSpinner';
import SaveBillModal from './modals/SaveBillModal';
import { defineMethod } from '../../api/base/BaseCollection.methods';

/** Renders a single row in the List Stuff table. See pages/ListStuff.jsx. */
const AllBill = ({ bill }) => {

  const [saveStatus, setSaveStatus] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const { ready } = useTracker(() => {
    const subscription = SavedMeasures.subscribeMeasureSaved();
    const rdy = subscription.ready();
    return {
      ready: rdy,
    };
  }, []);

  useTracker(() => {
    const svd = SavedMeasures.findOne({ code: bill.code }) != null;
    setSaveStatus(svd);
  }, [bill]);

  const save = useCallback((data) => {
    // TODO maybe add who saved the bill?
    // const owner = Meteor.user().username;
    let sad = false;
    const collectionName = SavedMeasures.getCollectionName();
    const definitionData = {
      ...data,
      ...bill,
    };
    defineMethod.callPromise({ collectionName, definitionData })
      .catch(error => {
        swal('Error', error.message, 'error');
        sad = true;
      })
      .then(() => {
        if (!sad) {
          setShowModal(false);
          swal('Success', 'Saved to DOE database', 'success');
        }
      });
  });

  const checkSaved = saveStatus ?
    <div style={{ textAlign: 'center', fontSize: '25px', color: 'darkgray' }}><CloudCheckFill /></div>
    : (
      <Button
        style={{ backgroundColor: '#418c5c', color: 'white', borderColor: '#297e4b' }}
        onClick={() => setShowModal(true)}
      >Save
      </Button>
    );

  function introducerShortened() {
    // eslint-disable-next-line for-direction
    for (let i = 0; i < bill.introducer.length; i++) {
      if (bill.introducer[i] === ' ' && i > 3) {
        return bill.introducer.substring(0, i - 1);
      }
    }
    return bill.introducer;
  }

  function theRestOfIntroducers() {
    // eslint-disable-next-line for-direction
    for (let i = 0; i < bill.introducer.length; i++) {
      if (bill.introducer[i] === ' ' && i > 3) {
        return bill.introducer.substring(i);
      }
    }
    return '';
  }
  // link to page of capital if not saved
  const linkWhenSaved = () => (saveStatus ? `/view/${bill.code}` : `${bill.measureArchiveUrl}`);

  return (
    <tr>
      <td>
        {ready ? checkSaved : <SmallerSpinner class="d-flex justify-content-center" />}
      </td>
      <td>
        <div style={{ fontSize: '20px' }}><a href={linkWhenSaved()}><strong>{bill.code}</strong></a></div>
        <Accordion flush className="billAccordion">
          <Accordion.Item eventKey="0">
            <Accordion.Header>{bill.measureTitle} </Accordion.Header>
            <Accordion.Body>{bill.description}</Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </td>
      <td>{`(${bill.statusHorS}) ${bill.statusDate} - ${bill.statusDescription}`}</td>
      <td>
        <Accordion flush className="introducerAccordionList">
          <Accordion.Item eventKey="0">
            <Accordion.Header>{introducerShortened()} </Accordion.Header>
            <Accordion.Body>{theRestOfIntroducers()}</Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </td>
      <td>{bill.currentReferral}</td>
      <td>{bill.companion}</td>
      <SaveBillModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onSubmit={save}
      />
    </tr>
  );
};

// Require a document to be passed to this component.
AllBill.propTypes = {
  bill: PropTypes.shape({
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
    _id: PropTypes.string,
  }).isRequired,
};

export default AllBill;
