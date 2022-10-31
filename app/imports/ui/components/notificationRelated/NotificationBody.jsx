import React from 'react';
import PropTypes from 'prop-types';
import * as Icon from 'react-bootstrap-icons';

/** Renders a single row in the List Stuff table. See pages/ListStuff.jsx. */
const NotificationBody = ({ hearing }) => {
  const dateFormatted = new Date(hearing.dateTime).toLocaleString(
    [],
    { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' },
  );
  const dateOnly = dateFormatted.substring(0, dateFormatted.search(','));
  const timeOnly = dateFormatted.substring(dateFormatted.search(',') + 2);

  return (
    <tr>
      <td>{hearing.measure}</td>
      <td>{dateOnly}<br />{timeOnly}</td>
      <td>{hearing.room}</td>
      <td>
        {hearing.youtubeURL ? (
          <a href={hearing.youtubeURL} target="_blank" style={{ textAlign: 'center' }} rel="noreferrer">
            <Icon.Youtube className="mt-2" style={{ fontSize: '24px', color: 'red' }} />
          </a>
        ) : <p className="mt-2">N/A</p>}
      </td>
      <td>
        {hearing.noticeURL ? (
          <a href={hearing.noticeURL} target="_blank" style={{ textAlign: 'center', color: 'black' }} rel="noreferrer">
            <Icon.Link className="mt-2" style={{ fontSize: '24px', color: 'blue' }} />
          </a>
        ) : <p className="mt-2">N/A</p>}
      </td>
      <td>
        <a href={hearing.noticePdfURL} target="_blank" style={{ textAlign: 'center', color: 'black' }} rel="noreferrer">
          <Icon.FilePdfFill className="mt-2" style={{ fontSize: '24px', color: 'red' }} />
        </a>
      </td>
    </tr>
  );
};

// Require a document to be passed to this component.
NotificationBody.propTypes = {
  hearing: PropTypes.shape({
    measure: PropTypes.string,
    room: PropTypes.string,
    dateTime: PropTypes.string,
    youtubeURL: PropTypes.string,
    noticeURL: PropTypes.string,
    noticePdfURL: PropTypes.string,
  }).isRequired,
};

export default NotificationBody;
