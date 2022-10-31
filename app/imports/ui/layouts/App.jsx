import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import NotFound from '../pages/NotFound';
import SignIn from '../pages/SignIn';
import NotAuthorized from '../pages/NotAuthorized';
import { ROLE } from '../../api/role/Role';

/*
 * From Legislature-Tracker
 * Imports that are commented out means that they're using unsecure methods
 * instead of meteor methods
 */
import Landing from '../pages/Landing';
import Home from '../pages/Home';
import AllDashboard from '../pages/AllDashboard';
import SavedDashboard from '../pages/SavedDashboard';
import BillResolutionTracker from '../pages/BillResolutionTracker';
import Calendar from '../pages/Calendar';
import EditTestimony from '../pages/EditTestimony';
import EditMeasure from '../pages/EditMeasure';
import SignOut from '../pages/SignOut';

const App = () => (
  <Router>
    <div className="d-flex flex-column min-vh-100">
      <Routes>
        <Route exact path="/signin" element={<SignIn />} />
        <Route exact path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signout" element={<SignOut />} />
        <Route path="/view/all" element={<ProtectedRoute><AllDashboard /></ProtectedRoute>} />
        <Route path="/view/DOE" element={<ProtectedRoute><SavedDashboard /></ProtectedRoute>} />
        <Route path="/edit-testimony/:_code/:_id" element={<ProtectedRoute><EditTestimony /></ProtectedRoute>} />
        <Route path="/view/:_code" element={<ProtectedRoute><BillResolutionTracker /></ProtectedRoute>} />
        <Route path="/calendar" element={<ProtectedRoute><Calendar /></ProtectedRoute>} />
        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/edit/:_code" element={<ProtectedRoute><EditMeasure /></ProtectedRoute>} />
        <Route path="/notauthorized" element={<ProtectedRoute><NotAuthorized /></ProtectedRoute>} />
        <Route path="*" element={<ProtectedRoute><NotFound /></ProtectedRoute>} />
      </Routes>
    </div>
  </Router>

);

/*
 * ProtectedRoute (see React Router v6 sample)
 * Checks for Meteor login before routing to the requested page, otherwise goes to signin page.
 * @param {any} { component: Component, ...rest }
 */
const ProtectedRoute = ({ children }) => {
  const isLogged = Meteor.userId() !== null;
  console.log('ProtectedRoute', isLogged);
  return isLogged ? children : <Navigate to="/signin" />;
};

/**
 * AdminProtectedRoute (see React Router v6 sample)
 * Checks for Meteor login and admin role before routing to the requested page, otherwise goes to signin page.
 * @param {any} { component: Component, ...rest }
 */
const AdminProtectedRoute = ({ children }) => {
  const isLogged = Meteor.userId() !== null;
  if (!isLogged) {
    return <Navigate to="/signin" />;
  }
  const isAdmin = Roles.userIsInRole(Meteor.userId(), [ROLE.ADMIN]);
  console.log('AdminProtectedRoute', isLogged, isAdmin);
  return (isLogged && isAdmin) ? children : <Navigate to="/notauthorized" />;
};

// Require a component and location to be passed to each ProtectedRoute.
ProtectedRoute.propTypes = {
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
};

ProtectedRoute.defaultProps = {
  children: <Landing />,
};

// Require a component and location to be passed to each AdminProtectedRoute.
AdminProtectedRoute.propTypes = {
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
};

AdminProtectedRoute.defaultProps = {
  children: <Landing />,
};

export default App;
