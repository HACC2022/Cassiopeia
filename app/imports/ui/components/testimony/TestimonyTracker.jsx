import React from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { Container, Table } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router';
import { Testimonies } from '../../../api/testimony/TestimonyCollection';
import TestimonyRow from './TestimonyRow';
import LoadingSpinner from '../LoadingSpinner';

// eslint-disable-next-line react/prop-types
const TestimonyTracker = ({ _code }) => {
  const { ready, testimonies } = useTracker(() => {
    const subscription = Testimonies.subscribeTestimony();
    const rdy = subscription.ready();
    // TODO replace billcode with _code
    const testimoniesItems = Testimonies.find({ billCode: `${_code}` }).fetch();
    return {
      testimonies: testimoniesItems,
      ready: rdy,
    };
  }, false);

  const navigate = useNavigate();
  if (!testimonies && ready) {
    navigate('/*');
  }

  return (ready ? (
    <Container className="text-center">
      <h3>Testimonies</h3>
      <Table striped>
        <thead style={{ zIndex: 200 }}>
          <tr>
            <th>Hearing Date</th>
            <th>Bill No</th>
            <th>Testifier</th>
            <th>Status</th>
            <th>Edit</th>
          </tr>
        </thead>
        <tbody>
          {testimonies.map(testimony => (
            <TestimonyRow
              key={testimony._id}
              testimony={testimony}
              _code={_code}
            />
          ))}
        </tbody>
      </Table>
    </Container>
  ) : <LoadingSpinner />);
};

TestimonyTracker.defaultProps = {
  _code: PropTypes.string,
};

export default TestimonyTracker;
