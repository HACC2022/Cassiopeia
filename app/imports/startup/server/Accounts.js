import { Meteor } from 'meteor/meteor';
import { ROLE } from '../../api/role/Role';
import { AdminProfiles } from '../../api/user/admin/AdminProfileCollection';
import { UserProfiles } from '../../api/user/UserProfileCollection';
import { AssignerProfiles } from '../../api/user/assigner/AssignerProfileCollection';
import { WriterProfiles } from '../../api/user/writer/WriterProfileCollection';
import { OfficerApvProfiles } from '../../api/user/office_apv/OfficeApvProfileCollection';
import { PIPEApvProfiles } from '../../api/user/pipe_apv/PIPEApvProfileCollection';
import { FinalApvProfiles } from '../../api/user/final_apv/FinalApvProfileCollection';
import { SubmitterProfiles } from '../../api/user/submitter/SubmitterProfileCollection';

/* eslint-disable no-console */

function createUser(email, role, firstName, lastName, password) {
  console.log(`  Creating user ${email} with role ${role}.`);
  if (role === ROLE.ADMIN) {
    AdminProfiles.define({ email, firstName, lastName, password });
  } else if (role === ROLE.ASSIGNER) {
    AssignerProfiles.define({ email, firstName, lastName, password });
  } else if (role === ROLE.WRITER) {
    WriterProfiles.define({ email, firstName, lastName, password });
  } else if (role === ROLE.OFFICE_APV) {
    OfficerApvProfiles.define({ email, firstName, lastName, password });
  } else if (role === ROLE.PIPE_APV) {
    PIPEApvProfiles.define({ email, firstName, lastName, password });
  } else if (role === ROLE.FINAL_APV) {
    FinalApvProfiles.define({ email, firstName, lastName, password });
  } else if (role === ROLE.SUBMITTER) {
    SubmitterProfiles.define({ email, firstName, lastName, password });
  } else { // everyone else is just a user.
    UserProfiles.define({ email, firstName, lastName, password });
  }
}

// When running app for first time, pass a settings file to set up a default user account.
if (Meteor.users.find().count() === 0) {
  if (Meteor.settings.defaultAccounts) {
    console.log('Creating the default user(s)');
    Meteor.settings.defaultAccounts.map(({ email, password, role, firstName, lastName }) => createUser(email, role, firstName, lastName, password));
  } else {
    console.log('Cannot initialize the database!  Please invoke meteor with a settings file.');
  }
}
