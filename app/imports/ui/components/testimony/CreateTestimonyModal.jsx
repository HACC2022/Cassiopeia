import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Button, Modal, Row, Col } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import SimpleSchema from 'simpl-schema';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import swal from 'sweetalert';
import { AutoForm, ErrorsField, LongTextField, SelectField, SubmitField, TextField } from 'uniforms-bootstrap5';
import { SavedMeasures } from '../../../api/savedMeasures/SavedMeasuresCollection';
import LoadingSpinner from '../LoadingSpinner';
import { Testimonies } from '../../../api/testimony/TestimonyCollection';
import { defineMethod } from '../../../api/base/BaseCollection.methods';

const formSchema = new SimpleSchema({
  governorName: String,
  governorTitle: { type: String, defaultValue: 'GOVERNOR' },
  testifier: String,
  testifierTitle: String,
  hearingDate: String,
  hearingTime: String,
  hearingLocation: String,
  committee: String,
  department: { type: String, defaultValue: 'Education' },
  billCode: String,
  billTitle: String,
  billPurpose: String,
  position: String,
  lastEditedBy: { type: String, defaultValue: '-' },
  status: { type: String, defaultValue: 'Awaiting Writer', allowedValues: ['Awaiting Writer'] },
});

const bridge = new SimpleSchema2Bridge(formSchema);

// eslint-disable-next-line react/prop-types
const CreateTestimonyModal = ({ show, handleClose, _code }) => {
  const { ready, bill } = useTracker(() => {
    const subscription = SavedMeasures.subscribeMeasureSaved();
    const rdy = subscription.ready();
    const billItem = SavedMeasures.find({ code: _code }).fetch();
    return {
      bill: billItem[0],
      ready: rdy,
    };
  }, false);

  const submit = (data) => {
    const lastEditedBy = Meteor.user().username;
    const { governorName, governorTitle, testifier, testifierTitle, hearingDate, hearingTime, hearingLocation, committee, department, billCode, billTitle, billPurpose, position, status } = data;

    const collectionName = Testimonies.getCollectionName();
    const definitionData = { governorName, governorTitle, testifier, testifierTitle, hearingDate, hearingTime, hearingLocation, committee, department, billCode, billTitle, billPurpose, position, lastEditedBy, status };

    defineMethod.callPromise({ collectionName, definitionData })
      .then(() => {
        swal('Success', `Testimony for ${_code} has been added`, 'success');
      })
      .catch(error => swal('Error', error.message, 'error'));

  };

  let fRef = null;
  return (
    <Modal show={show} onHide={handleClose}>
      {console.log(bill)}
      <Modal.Header closeButton>
        <Modal.Title>Add Testimony</Modal.Title>
      </Modal.Header>
      {ready ? (
        <AutoForm ref={ref => { fRef = ref; }} className="d-flex justify-content-center flex-column" schema={bridge} onSubmit={data => submit(data, fRef)}>
          <Modal.Body>
            <ErrorsField />
            <Row>
              <Col>
                <TextField showInlineError name="governorName" value="DAVID Y. IGE" />
              </Col>
              <Col>
                <TextField showInlineError name="governorTitle" value="GOVERNOR" />
              </Col>
            </Row>
            <Row>
              <Col>
                <TextField showInlineError name="testifier" />
              </Col>
              <Col>
                <TextField name="testifierTitle" showInlineError />
              </Col>
            </Row>
            <Row>
              <Col>
                <TextField name="committee" showInlineError />
              </Col>
            </Row>
            <Row>
              <Col>
                <TextField name="hearingDate" showInlineError placeholder="mm/dd/yyyy" />
              </Col>
              <Col>
                <TextField name="hearingTime" showInlineError placeholder="hh:mm PM/AM" />
              </Col>
              <Col>
                <TextField name="hearingLocation" showInlineError />
              </Col>
            </Row>
            <Row>
              <Col>
                <TextField name="department" showInlineError />
              </Col>
            </Row>
            <Row>
              <Col>
                <TextField name="billCode" showInlineError value={bill.code} />
              </Col>
              <Col>
                <TextField name="billTitle" showInlineError value={bill.measureTitle} />
              </Col>
            </Row>
            <Row>
              <Col>
                <LongTextField name="billPurpose" showInlineError value={bill.description} />
              </Col>
            </Row>
            <Row>
              <Col>
                <LongTextField name="position" showInlineError value="WRITER TO EDIT" />
              </Col>
            </Row>
            <Row>
              <SelectField name="status" showInlineError />
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <SubmitField value="Add" />
          </Modal.Footer>
        </AutoForm>
      ) : <LoadingSpinner />}
    </Modal>
  );
};

export default CreateTestimonyModal;
