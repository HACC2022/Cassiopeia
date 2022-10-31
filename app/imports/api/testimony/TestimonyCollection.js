import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { check } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';
import BaseCollection from '../base/BaseCollection';
import { ROLE } from '../role/Role';

export const testimonyPublications = {
  testimony: 'Testimony',
  testimonyAdmin: 'TestimonyAdmin',
};

export const testimonyStatuses = ['-', 'Awaiting Writer', 'Awaiting Office Approval', 'Awaiting PIPE Approval', 'Awaiting Final Approval', 'Approved'];

class TestimonyCollection extends BaseCollection {
  constructor() {
    super('Testimonies', new SimpleSchema({
      governorName: { type: String, defaultValue: 'DAVID Y. IGE' },
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
      lastEditedBy: { type: String, defaultValue: '-', optional: true },
      status: { type: String, defaultValue: '-', allowedValues: testimonyStatuses },
    }));
  }

  /**
   * Defines a new Testimony item.
   * @param governorName name of current governor
   * @param governorTitle title of governor (in case it's deputy governor something sometimes)
   * @param testifier the person testifying
   * @param testifierTitle the title of the person testifying
   * @param hearingDate the date of the hearing (this date needs to be on the testimony)
   * @param hearingTime same
   * @param hearingLocation same
   * @param committee committee on testimony page
   * @param department should always be education, but just in case
   * @param billCode the bill code used for routing
   * @param billTitle the entire title of the bill, including the 'code', draft number, and title
   * @param billPurpose the one-liner explaining the purpose of the bill
   * @param the department's position and explanation
   */
  define({ governorName, governorTitle, testifier, testifierTitle, hearingDate, hearingTime, hearingLocation,
    committee, department, billCode, billTitle, billPurpose, position, lastEditedBy, status }) {
    const docID = this._collection.insert({
      governorName,
      governorTitle,
      testifier,
      testifierTitle,
      hearingDate,
      hearingTime,
      hearingLocation,
      committee,
      department,
      billCode,
      billTitle,
      billPurpose,
      position,
      lastEditedBy,
      status,
    });
    return docID;
  }

  /**
   * Updates the given document.
   * @param governorName name of current governor
   * @param governorTitle title of governor (in case it's deputy governor something sometimes)
   * @param testifier the person testifying
   * @param testifierTitle the title of the person testifying
   * @param hearingDate the date of the hearing (this date needs to be on the testimony)
   * @param hearingTime same
   * @param hearingLocation same
   * @param committee committee on testimony page
   * @param department should always be education, but just in case
   * @param billTitle the entire title of the bill, including the 'code', draft number, and title
   * @param billPurpose the one-liner explaining the purpose of the bill
   * @param the department's position and explanation
   * @param status which stage of approval the testimony is in
   */
  update(docID, { governorName, governorTitle, testifier, testifierTitle, hearingDate, hearingTime, hearingLocation, committee, department, billCode, billTitle, billPurpose, position, lastEditedBy, status }) {
    const updateData = {};
    if (governorName) updateData.governorName = governorName;
    if (governorTitle) updateData.governorTitle = governorTitle;
    if (testifier) updateData.testifier = testifier;
    if (testifierTitle) updateData.testifierTitle = testifierTitle;
    if (hearingDate) updateData.hearingDate = hearingDate;
    if (hearingTime) updateData.hearingTime = hearingTime;
    if (hearingLocation) updateData.hearingLocation = hearingLocation;
    if (committee) updateData.committee = committee;
    if (department) updateData.department = department;
    if (billCode) updateData.billCode = billCode;
    if (billTitle) updateData.billTitle = billTitle;
    if (billPurpose) updateData.billPurpose = billPurpose;
    if (position) updateData.position = position;
    if (lastEditedBy) updateData.lastEditedBy = lastEditedBy;
    if (status) updateData.status = status;
    this._collection.update(docID, { $set: updateData });
  }

  /**
   * A stricter form of remove that throws an error if the document or docID could not be found in this collection.
   * @param { String | Object } name A document or docID in this collection.
   * @returns true
   */
  removeIt(name) {
    const doc = this.findDoc(name);
    check(doc, Object);
    this._collection.remove(doc._id);
    return true;
  }

  /**
   * Default publication method for entities.
   * It publishes the entire collection for admin and just the stuff associated to an owner.
   */
  publish() {
    if (Meteor.isServer) {
      // get the testimonyCollection instance.
      const instance = this;
      /** This subscription publishes only the documents associated with the logged in user */
      Meteor.publish(testimonyPublications.testimony, function publish() {
        if (this.userId) {
          // const username = Meteor.users.findOne(this.userId).username;
          return instance._collection.find();
        }
        return this.ready();
      });

      /** This subscription publishes all documents regardless of user, but only if the logged in user is the Admin. */
      Meteor.publish(testimonyPublications.testimonyAdmin, function publish() {
        if (this.userId && Roles.userIsInRole(this.userId, ROLE.ADMIN)) {
          return instance._collection.find();
        }
        return this.ready();
      });
    }
  }

  /**
   * Subscription method for testimony owned by the current user.
   */
  subscribeTestimony() {
    if (Meteor.isClient) {
      return Meteor.subscribe(testimonyPublications.testimony);
    }
    return null;
  }

  /**
   * Subscription method for admin users.
   * It subscribes to the entire collection.
   */
  subscribeTestimonyAdmin() {
    if (Meteor.isClient) {
      return Meteor.subscribe(testimonyPublications.testimonyAdmin);
    }
    return null;
  }

  /**
   * Default implementation of assertValidRoleForMethod. Asserts that userId is logged in as an Admin or User.
   * This is used in the define, update, and removeIt Meteor methods associated with each class.
   * @param userId The userId of the logged in user. Can be null or undefined
   * @throws { Meteor.Error } If there is no logged in user, or the user is not an Admin or User.
   */
  assertValidRoleForMethod(userId) {
    this.assertRole(userId, [ROLE.ASSIGNER, ROLE.FINAL_APV, ROLE.SUBMITTER, ROLE.OFFICE_APV, ROLE.PIPE_APV, ROLE.WRITER]);
  }

  /**
   * Returns an object representing the definition of docID in a format appropriate to the restoreOne or define function.
   * @param docID
   * @return {{owner: (*|number), condition: *, quantity: *, name}}
   */
  dumpOne(docID) {
    const doc = this.findDoc(docID);
    const governorName = doc.governorName;
    const governorTitle = doc.governorTitle;
    const testifier = doc.testifier;
    const testifierTitle = doc.testifierTitle;
    const hearingDate = doc.hearingDate;
    const hearingTime = doc.hearingTime;
    const hearingLocation = doc.hearingLocation;
    const committee = doc.committee;
    const department = doc.department;
    const billCode = doc.billCode;
    const billTitle = doc.billTitle;
    const billPurpose = doc.billPurpose;
    const position = doc.position;
    const lastEditedBy = doc.lastEditedBy;
    const status = doc.status;
    return { governorName, governorTitle, testifier, testifierTitle, hearingDate, hearingTime, hearingLocation,
      committee, department, billCode, billTitle, billPurpose, position, lastEditedBy, status };
  }
}

/**
 * Provides the singleton instance of this class to all other entities.
 */
export const Testimonies = new TestimonyCollection();
