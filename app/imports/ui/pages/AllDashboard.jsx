import React, { useEffect, useState } from 'react';
import {
  Row,
  Col,
  Table,
  Dropdown,
  DropdownButton,
  Pagination,
  ButtonGroup,
  Button,
} from 'react-bootstrap';
import { CaretDownFill, CaretUpFill, ChevronLeft, List } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';
import { _ } from 'meteor/underscore';
import LoadingSpinner from '../components/LoadingSpinner';
import AllBill from '../components/AllBill';
import LegTracker from '../utilities/Legtracker';
import DesktopSideBarCollapsed from '../components/SideNavBar/DesktopSideBarCollapsed';
import DesktopSideBarExpanded from '../components/SideNavBar/DesktopSideBarExpanded';
import MobileSideBar from '../components/SideNavBar/MobileSideBar';

const AllDashboard = () => {
  /* states for item filtering */
  const [billNum, setBillNum] = useState('');
  const [keyword, setKeyword] = useState('');
  const [statusDate, setStatusDate] = useState('');
  const [dateSearch, setDateSearch] = useState(1);
  const [title, setTitle] = useState('');
  const [type, setType] = useState('hb');
  const [year, setYear] = useState('2022');
  const [measures, setMeasures] = useState([]);
  const [filteredMeasures, setFilteredMeasures] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const rowNumber = 15;
  const [firstIndex, setFirstIndex] = useState(
    currentPage * rowNumber - rowNumber,
  );
  const [lastIndex, setLastIndex] = useState(currentPage * rowNumber);
  const [expanded, setExpanded] = useState(false);

  // values: ca = bill code ascending
  //         cd = bill code descending
  //         sa = status date ascending
  //         sd = status date descending
  const [sortBy, setSortBy] = useState('cd');

  let items = [];

  /* When the filtered data needs to call the api */
  useEffect(() => {
    setLoading(true);
    LegTracker
      .scrapeMeasures(year, type)
      .then(initialMeasures => {
        setMeasures(initialMeasures.scrapedData);
        setFilteredMeasures(initialMeasures.scrapedData);
        setBillNum('');
        setStatusDate('');
        setTitle('');
        setLoading(false);
        setKeyword('');
        setDateSearch(1);
        setSortBy('cd');

        document.title = 'DOELT - View All Bills/Measures';
      });
  }, [year, type]);

  /* When the filtered data can just search the current array */
  useEffect(() => {
    let filtered = measures;
    switch (sortBy) {
    case 'cd':
      filtered = _.sortBy(filtered, 'code').reverse();
      break;
    case 'sa':
      filtered = _.sortBy(filtered, 'statusDate');
      break;
    case 'sd':
      filtered = _.sortBy(filtered, 'statusDate').reverse();
      break;
    default:
      filtered = _.sortBy(filtered, 'code');
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
          obj.introducer.toLowerCase().includes(keyword.toLowerCase()) ||
          obj.description.toLowerCase().includes(keyword.toLowerCase()) ||
          obj.reportTitle.toLowerCase().includes(keyword.toLowerCase())
        );
      });
    }
    if (statusDate) {
      filtered = filtered.filter(function (obj) {
        const slash = obj.statusDate.search('/');
        const objDate = +`${obj.statusDate.substring(0, slash)}.${
          obj.statusDate.substring(slash + 1, obj.statusDate.substring(slash + 1).search('/') + obj.statusDate.substring(0, slash).length + 1)}`;
        if (dateSearch === 1) {
          return objDate < +statusDate;
        }
        if (dateSearch === 2) {
          return objDate === +statusDate;
        }
        return objDate > +statusDate;
      });
    }
    setFilteredMeasures(filtered);
  }, [keyword, billNum, title, statusDate, dateSearch, sortBy]);

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

  const handleClick = (page) => {
    setCurrentPage(page);

    setFirstIndex(page * rowNumber - rowNumber);
    setLastIndex(page * rowNumber);
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

  function getStatusDateSort() {
    if (sortBy === 'sd') {
      return <CaretDownFill />;
    }
    if (sortBy === 'sa') {
      return <CaretUpFill />;
    }
    return '';
  }

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
  const textBoxStyle = {
    borderRadius: '10px',
    borderWidth: '1px',
    paddingLeft: '8px',
    paddingTop: '4px',
    paddingBottom: '4px',
    paddingRight: '8px',
  };
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
          <DesktopSideBarExpanded page="all-bills" />
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
        <DesktopSideBarCollapsed page="all-bills" />
      </Col>
    );
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
        active={Math.ceil(filteredMeasures.length / rowNumber) === currentPage}
        onClick={() => handleClick(Math.ceil(filteredMeasures.length / rowNumber))}
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

  const returnFilter = () => (
    <div className="pb-3">
      <Row className="pt-4">
        <Col className="d-flex justify-content-center align-bottom">
          <h1 className="d-inline pe-2 align-items-center"><b>{year}</b></h1>
          <DropdownButton
            className="d-inline pe-3 mt-3"
            id="allBillsDropdown"
            title=""
            onSelect={(e) => setYear(e)}
          >
            <Dropdown.Item eventKey="2022">2022</Dropdown.Item>
            <Dropdown.Item eventKey="2021">2021</Dropdown.Item>
            <Dropdown.Item eventKey="2020">2020</Dropdown.Item>
            <Dropdown.Item eventKey="2019">2019</Dropdown.Item>
            <Dropdown.Item eventKey="2018">2018</Dropdown.Item>
            <Dropdown.Item eventKey="2017">2017</Dropdown.Item>
            <Dropdown.Item eventKey="2016">2016</Dropdown.Item>
            <Dropdown.Item eventKey="2015">2015</Dropdown.Item>
            <Dropdown.Item eventKey="2014">2014</Dropdown.Item>
            <Dropdown.Item eventKey="2013">2013</Dropdown.Item>
            <Dropdown.Item eventKey="2012">2012</Dropdown.Item>
            <Dropdown.Item eventKey="2011">2011</Dropdown.Item>
            <Dropdown.Item eventKey="2010">2010</Dropdown.Item>
          </DropdownButton>
          <h1 className="d-inline pe-2 align-items-center"><b>{type === 'hb' ? 'House Bills' : 'Senate Bills'}</b></h1>
          <DropdownButton
            className="d-inline mt-3"
            id="allBillsDropdown"
            title=""
            onSelect={(e) => setType(e)}
          >
            <Dropdown.Item eventKey="hb">House Bills</Dropdown.Item>
            <Dropdown.Item eventKey="sb">Senate Bills</Dropdown.Item>
          </DropdownButton>
        </Col>
        <Row>
          <Col className="d-flex justify-content-center">
            <Link className="small mb-2 text-center" to="/view/DOE">
              View Saved DOE Bill/Measures
            </Link>
          </Col>
        </Row>
        <Row className="py-2 px-5">
          <Col className="d-flex justify-content-center">
            <label htmlFor="Search by Bill Code">
              <Col className="d-flex justify-content-center mb-1 small" style={{ color: '#313131' }}>
                Search by Bill Number
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
                Search by Bill Title
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
            <label htmlFor="Search by Keyword">
              <Col className="d-flex justify-content-center mb-1 small" style={{ color: '#313131' }}>
                Search by Keyword
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
            <label htmlFor="Search by status date" className="text-center">
              <Col>
                <div className="mb-1 small" style={{ color: '#313131' }}>
                  Search by Status Date
                </div>
                <input
                  type="date"
                  className="shadow-sm"
                  style={textBoxStyle}
                  placeholder="Enter date here"
                  onChange={e => {
                    const month = e.target.value.substring(5, 7);
                    const day = e.target.value.substring(8);
                    setStatusDate(`${month}.${day}`);
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
      </Row>
    </div>
  );

  const returnList = () => (
    <div style={{ height: '100vh', overflowY: 'visible' }}>
      <div style={{ textAlign: 'center' }} />
      <Table striped className="border border-2">
        <thead style={{ zIndex: 200 }}>
          <tr>
            <th>DOE DB</th>
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
            <th>
              <Button
                style={tableButtonStyle}
                onClick={() => {
                  setSortBy(sortBy === 'sd' ? 'sa' : 'sd');
                  setCurrentPage(1);
                }}
              >
                Status {getStatusDateSort()}
              </Button>
            </th>
            <th>Introducer(s)</th>
            <th>Referral</th>
            <th>Companion</th>
          </tr>
        </thead>
        <tbody>
          { filteredMeasures.length === 0 || loading
            ? <tr><td> </td></tr>
            : filteredMeasures
              .map((bill, index) => <AllBill key={index} bill={bill} />)
              .slice(firstIndex, lastIndex)}
        </tbody>
      </Table>
      { loading ? <LoadingSpinner /> : ''}
      <Col className="d-flex justify-content-center">
        <Pagination className="pt-3 mb-2" style={{ color: 'black' }}>{items}</Pagination>
      </Col>
      <Row className="d-flex justify-content-center text-center pb-3">
        {loading ? ' ' : `${filteredMeasures.length} Results`}
      </Row>
    </div>
  );

  return (
    <div>
      {width < breakPoint ? <MobileSideBar page="all-bills" /> : getDesktopSidebar()}
      <div style={width < breakPoint ? mobileMainBody : mainBodyLeftMargin} className="d-flex justify-content-center">

        <Row id="dashboard-screen">
          <Col className="mx-3">
            <Row id="dashboard-filter">{returnFilter()}</Row>
            <Row id="dashboard-list">{returnList()}</Row>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default AllDashboard;
