import React from 'react';
import PropTypes from 'prop-types';

const NotificationBill = ({ bills }) => (
  <tr key={bills.code}>
    <td>{bills.code}</td>
    <td>{bills.measureTitle}</td>
    <td>{bills.currentReferral}</td>
    <td>{bills.statusDate}</td>
  </tr>
);

NotificationBill.propTypes = {
  bills: PropTypes.shape({
    code: PropTypes.string,
    measureTitle: PropTypes.string,
    currentReferral: PropTypes.string,
    statusDate: PropTypes.string,
  }).isRequired,
};

export default NotificationBill;
