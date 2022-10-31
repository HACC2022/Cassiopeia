import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import { PencilFill } from 'react-bootstrap-icons';

// eslint-disable-next-line react/prop-types
const TestimonyRow = ({ testimony, _code }) => (
  <tr>
    <td>
      {testimony.hearingDate ? testimony.hearingDate : '-'}
    </td>
    <td>
      { testimony.billCode ? testimony.billCode : '-' }
    </td>
    <td>
      { testimony.testifier ? testimony.testifier : '-'}
    </td>
    <td>
      { testimony.status ? testimony.status : '-'}
    </td>
    <td>
      <Button id="editTestButtons" href={`/edit-testimony/${_code}/${testimony._id}`}>
        <PencilFill />
      </Button>
    </td>
  </tr>
);

TestimonyRow.propTypes = {
  testimony: PropTypes.shape({
    hearingDate: PropTypes.string,
    billCode: PropTypes.string,
    testifier: PropTypes.string,
    status: PropTypes.string,
    _id: PropTypes.string,
  }).isRequired,
};

export default TestimonyRow;
