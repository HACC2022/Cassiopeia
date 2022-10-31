import React, { useEffect, useState } from 'react';
import { Accordion, Button, ButtonGroup, Col, Dropdown, DropdownButton, Pagination, Row, Table } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import { Link } from 'react-router-dom';
import { CaretDownFill, CaretUpFill, ChevronLeft, List } from 'react-bootstrap-icons';
import { _ } from 'meteor/underscore';
import { SavedMeasures } from '../../api/savedMeasures/SavedMeasuresCollection';
import SavedBill from '../components/SavedBill';
import LoadingSpinner from '../components/LoadingSpinner';
import DesktopSideBarCollapsed from '../components/SideNavBar/DesktopSideBarCollapsed';
import DesktopSideBarExpanded from '../components/SideNavBar/DesktopSideBarExpanded';
import MobileSideBar from '../components/SideNavBar/MobileSideBar';

/* Renders a table containing all of the Stuff documents. Use <StuffItem> to render each row. */
const Dashboard = () => {
  const [office, setOffice] = useState('');
  const [action, setAction] = useState('');
  const [chamber, setChamber] = useState('');
  const [keyword, setKeyword] = useState('');
  const [dateSearch, setDateSearch] = useState(1);
  const [billNum, setBillNum] = useState('');
  const [hearingDate, setHearingDate] = useState('');
  const [title, setTitle] = useState('');
  const rowNumber = 15;
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredMeasures, setFilteredMeasures] = useState([]);
  const [firstIndex, setFirstIndex] = useState(
    currentPage * rowNumber - rowNumber,
  );
  const [lastIndex, setLastIndex] = useState(currentPage * rowNumber);
  const [expanded, setExpanded] = useState(false);

  // values: ca = bill code ascending
  //         cd = bill code descending
  //         oa = status date ascending
  //         od = status date descending
  //         ha = hearing date ascending
  //         hd = hearing date descending
  //         sa = status ascending
  //         sd = status descending
  const [sortBy, setSortBy] = useState('cd');

  let items = [];

  const { ready, bills } = useTracker(() => {
    const subscription = SavedMeasures.subscribeMeasureSaved();
    const rdy = subscription.ready();
    const billItem = SavedMeasures.find({}, {}).fetch();
    return {
      bills: billItem,
      ready: rdy,
    };
  }, false);

  const textBoxStyle = {
    borderRadius: '10px',
    borderWidth: '1px',
    paddingLeft: '8px',
    paddingTop: '4px',
    paddingBottom: '4px',
    paddingRight: '8px',
  };
  const beforeDate = {
    color: dateSearch === 1 ? 'white' : 'grey',
    backgroundColor: dateSearch === 1 ? '#57749f' : '#F6F6F6',
    borderColor: dateSearch === 1 ? '#425e88' : '#ece9e9',
    borderWidth: '2px',
  };
  const onDate = {
    color: dateSearch === 2 ? 'white' : 'grey',
    backgroundColor: dateSearch === 2 ? '#57749f' : '#F6F6F6',
    borderColor: dateSearch === 2 ? '#425e88' : '#ece9e9',
    borderWidth: '2px',
  };
  const afterDate = {
    color: dateSearch === 3 ? 'white' : 'grey',
    backgroundColor: dateSearch === 3 ? '#57749f' : '#F6F6F6',
    borderColor: dateSearch === 3 ? '#425e88' : '#ece9e9',
    borderWidth: '2px',
  };

  useEffect(() => {
    document.title = 'DOELT - View DOE Bills/Measures';
  }, []);

  // set bills in filteredMeasures when finished loading
  useEffect(() => {
    if (ready) {
      setFilteredMeasures(bills);
    }
  }, [ready]);

  const handleClick = (page) => {
    setCurrentPage(page);

    setFirstIndex(page * rowNumber - rowNumber);
    setLastIndex(page * rowNumber);
  };

  // values: ca = bill code ascending
  //         cd = bill code descending
  //         oa = status date ascending
  //         od = status date descending
  //         ha = hearing date ascending
  //         hd = hearing date descending
  //         sa = status ascending
  //         sd = status descending

  // for filtering
  useEffect(() => {
    let filtered = bills;
    switch (sortBy) {
    case 'cd':
      filtered = _.sortBy(filtered, 'code').reverse();
      break;
    case 'oa':
      filtered = _.sortBy(filtered, 'office');
      break;
    case 'od':
      filtered = _.sortBy(filtered, 'office').reverse();
      break;
    case 'ha':
      filtered = _.sortBy(filtered, 'hearingDate');
      break;
    case 'hd':
      filtered = _.sortBy(filtered, 'hearingDate').reverse();
      break;
    case 'sa':
      filtered = _.sortBy(filtered, 'doeInternalStatus');
      break;
    case 'sd':
      filtered = _.sortBy(filtered, 'doeInternalStatus').reverse();
      break;
    default:
      filtered = _.sortBy(filtered, 'code');
    }
    if (chamber) {
      filtered = filtered.filter(function (obj) { return obj.statusHorS === chamber; });
    }
    if (billNum) {
      filtered = filtered.filter(function (obj) { return obj.code.toLowerCase().includes(billNum.toLowerCase()); });
    }
    if (title) {
      filtered = filtered.filter(function (obj) { return obj.measureTitle.toLowerCase().includes(title.toLowerCase()); });
    }
    if (keyword) {
      filtered = filtered.filter(function (obj) {
        return (
          obj.description.toLowerCase().includes(keyword.toLowerCase()) ||
            obj.reportTitle.toLowerCase().includes(keyword.toLowerCase())
        );
      });
    }
    // filter option fields from modal, first need to check if populated
    if (hearingDate) {
      filtered = filtered.filter(function (obj) {
        if (obj.hearingDate) {
          const slash = obj.hearingDate.search('/');
          const objDate = +`${obj.hearingDate.substring(0, slash)}.${
            obj.hearingDate.substring(slash + 1, obj.hearingDate.substring(slash + 1).search('/') + obj.hearingDate.substring(0, slash).length + 1)}`;
          if (dateSearch === 1) {
            return objDate < +hearingDate;
          }
          if (dateSearch === 2) {
            return objDate === +hearingDate;
          }
          return objDate > +hearingDate;
        }
        return '';
      });
    }
    if (office) {
      filtered = filtered.filter(function (obj) { return obj.office ? obj.office.includes(office) : false; });
    }
    if (action) {
      filtered = filtered.filter(function (obj) { return obj.doeAction ? obj.doeAction.toLowerCase().includes(action.toLowerCase()) : false; });
    }
    setFilteredMeasures(filtered);
  }, [chamber, billNum, title, keyword, office, action, hearingDate, dateSearch, sortBy]);

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

  function chamberTitle() {
    if (chamber === '') return 'Select a Chamber';
    if (chamber === 'S') return 'Senate';
    return 'House';
  }

  if (Math.ceil(filteredMeasures.length / rowNumber) > 10) {
    items = [];
    for (let number = 1; number <= 10; number++) {
      items.push(
        <Pagination.Item
          key={number}
          active={number === currentPage}
          onClick={() => handleClick(number)}
        >
          {number}
        </Pagination.Item>,
      );
    }
    items.push(
      <Pagination.Item
        key="..."
      >
        ...
      </Pagination.Item>,
    );
    items.push(
      <Pagination.Item
        key={Math.ceil(filteredMeasures.length / rowNumber)}
      >
        {Math.ceil(filteredMeasures.length / rowNumber)}
      </Pagination.Item>,
    );
  } else {
    items = [];
    for (let number = 1; number <= Math.ceil(filteredMeasures.length / rowNumber); number++) {
      items.push(
        <Pagination.Item
          key={number}
          active={number === currentPage}
          onClick={() => handleClick(number)}
        >
          {number}
        </Pagination.Item>,
      );
    }
  }
  const tableButtonStyle = {
    fontWeight: 'bold',
    backgroundColor: 'transparent',
    borderWidth: 0,
    color: 'black',
    padding: 0,
  };
  const mainBodyLeftMargin = {
    marginLeft: expanded ? '132px' : '62px',
  };

  function getCodeSort() {
    if (sortBy === 'cd') {
      return <CaretDownFill />;
    }
    if (sortBy === 'ca') {
      return <CaretUpFill />;
    }
    return '';
  }
  function getOfficeSort() {
    if (sortBy === 'od') {
      return <CaretDownFill />;
    }
    if (sortBy === 'oa') {
      return <CaretUpFill />;
    }
    return '';
  }
  function getHearingDateSort() {
    if (sortBy === 'hd') {
      return <CaretDownFill />;
    }
    if (sortBy === 'ha') {
      return <CaretUpFill />;
    }
    return '';
  }
  function getStatusSort() {
    if (sortBy === 'sd') {
      return <CaretDownFill />;
    }
    if (sortBy === 'sa') {
      return <CaretUpFill />;
    }
    return '';
  }
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
          <DesktopSideBarExpanded page="doe-bills" />
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
        <DesktopSideBarCollapsed page="doe-bills" />
      </Col>
    );
  }

  const returnFilter = () => (
    <div className="pb-3">
      <h1 className="mt-4 text-center mb-2"><b>DOE Bills/Measures</b></h1>
      <Row>
        <Col className="d-flex justify-content-center">
          <Link className="d-flex justify-content-center mb-3 small" to="/view/all">
            View All Bill/Measures
          </Link>
        </Col>
      </Row>
      <div id="filter-border">
        <Accordion>
          <Accordion.Item eventKey="0">
            <Accordion.Header>
              Filter Options
            </Accordion.Header>
            <Accordion.Body>
              <Row className="pt-3 px-3">
                <Col className="d-flex justify-content-center">
                  <label htmlFor="Search by Bill Code">
                    <Col className="d-flex justify-content-center mb-1 small" style={{ color: '#313131' }}>
                      Bill Number
                    </Col>
                    <input
                      type="text"
                      className="shadow-sm"
                      style={textBoxStyle}
                      placeholder="Enter bill number"
                      onChange={e => setBillNum(e.target.value)}
                    />
                  </label>
                </Col>
                <Col className="d-flex justify-content-center">
                  <label htmlFor="Search by title">
                    <Col className="d-flex justify-content-center mb-1 small" style={{ color: '#313131' }}>
                      Bill Title
                    </Col>
                    <input
                      type="text"
                      className="shadow-sm"
                      style={textBoxStyle}
                      placeholder="Relating to..."
                      onChange={e => setTitle(e.target.value)}
                    />
                  </label>
                </Col>
                <Col className="d-flex justify-content-center">
                  <label htmlFor="Search by keyword">
                    <Col className="d-flex justify-content-center mb-1 small" style={{ color: '#313131' }}>
                      Keyword
                    </Col>
                    <input
                      type="text"
                      className="shadow-sm"
                      style={textBoxStyle}
                      placeholder="Enter keyword"
                      onChange={e => setKeyword(e.target.value)}
                    />
                  </label>
                </Col>
                <Col className="d-flex justify-content-center">
                  <label htmlFor="Hearing Date" className="text-center">
                    <Col>
                      <div className="mb-1 small" style={{ color: '#313131' }}>
                        Hearing Date
                      </div>
                      <input
                        type="date"
                        className="shadow-sm"
                        style={textBoxStyle}
                        placeholder="Enter date here"
                        onChange={e => {
                          const month = e.target.value.substring(5, 7);
                          const day = e.target.value.substring(8);
                          setHearingDate(`${month}.${day}`);
                        }}
                      />
                      <ButtonGroup className="btn-group-sm mt-1 ms-1">
                        <Button
                          onClick={() => setDateSearch(1)}
                          className="dateFilterButtons"
                          style={beforeDate}
                        >
                          Before
                        </Button>
                        <Button
                          onClick={() => setDateSearch(2)}
                          className="dateFilterButtons"
                          style={onDate}
                        >
                          On
                        </Button>
                        <Button
                          onClick={() => setDateSearch(3)}
                          className="dateFilterButtons"
                          style={afterDate}
                        >
                          After
                        </Button>
                      </ButtonGroup>
                    </Col>
                  </label>
                </Col>
              </Row>
              <Row className="pb-4 pt-0 px-3">
                <Col className="d-flex justify-content-center">
                  {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                  <label htmlFor="Filter chamber">
                    <Col className="d-flex justify-content-center mb-1 small" style={{ color: '#313131' }}>
                      Current Chamber
                    </Col>
                    <DropdownButton
                      id="savedFilterDropdown"
                      variant="secondary"
                      title={chamberTitle()}
                      onSelect={(e) => setChamber(e)}
                    >
                      <Dropdown.Item eventKey="">Any</Dropdown.Item>
                      <Dropdown.Item eventKey="S">Senate</Dropdown.Item>
                      <Dropdown.Item eventKey="H">House</Dropdown.Item>
                    </DropdownButton>
                  </label>
                </Col>
                <Col className="d-flex justify-content-center">
                  {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                  <label htmlFor="Filter office">
                    <Col className="d-flex justify-content-center mb-1 small" style={{ color: '#313131' }}>
                      Office
                    </Col>
                    <DropdownButton
                      id="savedFilterDropdown"
                      variant="secondary"
                      title={office === '' ? 'Select an Office' : office}
                      onSelect={(e) => setOffice(e)}
                    >
                      <Dropdown.Item eventKey="">Any</Dropdown.Item>
                      <Dropdown.Item eventKey="BOE">BOE</Dropdown.Item>
                      <Dropdown.Item eventKey="OCID">OCID</Dropdown.Item>
                      <Dropdown.Item eventKey="OFO">OFO</Dropdown.Item>
                      <Dropdown.Item eventKey="OFS">OFS</Dropdown.Item>
                      <Dropdown.Item eventKey="OHE">OHE</Dropdown.Item>
                      <Dropdown.Item eventKey="OITS">OITS</Dropdown.Item>
                      <Dropdown.Item eventKey="OSIP">OSIP</Dropdown.Item>
                      <Dropdown.Item eventKey="OSSS">OSSS</Dropdown.Item>
                      <Dropdown.Item eventKey="OTM">OTM</Dropdown.Item>
                      <Dropdown.Item eventKey="SUPT">SUPT</Dropdown.Item>
                    </DropdownButton>
                  </label>

                </Col>
                <Col className="d-flex justify-content-center">
                  <label htmlFor="Search by action">
                    <Col className="mb-1 small d-flex justify-content-center" style={{ color: '#313131' }}>
                      Action
                    </Col>
                    <input
                      type="text"
                      className="shadow-sm"
                      style={textBoxStyle}
                      placeholder="Enter action here"
                      onChange={e => setAction(e.target.value)}
                    />
                  </label>
                </Col>
                <Col />
              </Row>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </div>
    </div>
  );

  const returnList = () => (
    <div style={{ height: '100vh', overflowY: 'visible' }}>
      <Table striped className="border border-2">
        <thead style={{ zIndex: 200 }}>
          <tr>
            <th>
              <Button
                style={tableButtonStyle}
                onClick={() => {
                  setSortBy(sortBy === 'cd' ? 'ca' : 'cd');
                  setCurrentPage(1);
                }}
              >
                Bill / Resolution {getCodeSort()}
              </Button>
            </th>
            <th style={{ width: '100px' }}>
              <Button
                style={tableButtonStyle}
                onClick={() => {
                  setSortBy(sortBy === 'od' ? 'oa' : 'od');
                  setCurrentPage(1);
                }}
              >
                Office {getOfficeSort()}
              </Button>
            </th>
            <th>Action</th>
            <th>Committee</th>
            <th style={{ width: '100px' }}>
              <Button
                style={tableButtonStyle}
                onClick={() => {
                  setSortBy(sortBy === 'hd' ? 'ha' : 'hd');
                  setCurrentPage(1);
                }}
              >
                Hearing {getHearingDateSort()}
              </Button>
            </th>
            <th>Position</th>
            <th>Testifier</th>
            <th style={{ width: '100px' }}>
              <Button
                style={tableButtonStyle}
                onClick={() => {
                  setSortBy(sortBy === 'sd' ? 'sa' : 'sd');
                  setCurrentPage(1);
                }}
              >
                Status {getStatusSort()}
              </Button>
            </th>
          </tr>
        </thead>
        <tbody>
          { filteredMeasures.length === 0 ? (<tr><td>-</td></tr>) : filteredMeasures
            .map((bill) => <SavedBill key={bill._id} bill={bill} />)
            .slice(firstIndex, lastIndex)}
        </tbody>
      </Table>
      { filteredMeasures.length === 0 ? <div className="d-flex justify-content-center">No bills/measures found in DOE database</div> : '' }
      <Col className="d-flex justify-content-center">
        <Pagination className="pt-3 mb-2" style={{ color: 'black' }}>{items}</Pagination>
      </Col>
      <Row className="d-flex justify-content-center text-center pb-3">
        { !ready ? ' ' : `${filteredMeasures.length} Results`}
      </Row>
    </div>
  );

  return (
    <div>
      {width < breakPoint ? <MobileSideBar page="doe-bills" /> : getDesktopSidebar()}
      <div style={width < breakPoint ? mobileMainBody : mainBodyLeftMargin} className="d-flex justify-content-center">
        <Row id="dashboard-screen">
          <Col className="mx-3">
            <Row id="dashboard-filter">{returnFilter()}</Row>
            { ready ? <Row id="dashboard-list">{returnList()}</Row> : '' }
            { ready ? '' : <LoadingSpinner /> }
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Dashboard;
