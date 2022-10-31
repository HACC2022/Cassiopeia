import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { check } from 'meteor/check';
import { _ } from 'meteor/underscore';
import { Roles } from 'meteor/alanning:roles';
import BaseCollection from '../base/BaseCollection';
import { ROLE } from '../role/Role';

export const offices = ['BOE', 'OCID', 'OFS', 'OFO', 'OHE', 'OITS', 'OSIP', 'OSSS', 'OTM', 'SUPT'];
export const savedMeasurePublications = {
  savedMeasure: 'SavedMeasure',
  savedMeasureAdmin: 'SavedMeasureAdmin',
};

class SavedMeasuresCollection extends BaseCollection {
  constructor() {
    super('SavedMeasure', new SimpleSchema({
      office: { type: Array, optional: true },
      'office.$': {
        type: String,
        allowedValues: offices,
      },
      archive: { type: Boolean, optional: true },
      code: { type: String, optional: false },
      measurePdfUrl: { type: String, optional: true },
      measureArchiveUrl: { type: String, optional: true },
      measureTitle: { type: String, optional: true },
      reportTitle: { type: String, optional: true },
      description: { type: String, optional: true },
      statusHorS: { type: String, optional: true },
      statusDescription: { type: String, optional: true },
      statusDate: { type: String, optional: true },
      introducer: { type: String, optional: true },
      currentReferral: { type: String, optional: true },
      companion: { type: String, optional: true },
      doeAction: { type: String, optional: true },
      hearingDate: { type: String, optional: true },
      hearingTime: { type: String, optional: true },
      hearingLocation: { type: String, optional: true },
      doePosition: { type: String, optional: true },
      testifier: { type: String, optional: true },
      doeInternalStatus: { type: String, optional: true },
    }));
  }

  /**
   * Defines a new MeasureSaved item.
   */
  // eslint-disable-next-line max-len
  define({ code, companion, currentReferral, description, introducer, measureArchiveUrl, measurePdfUrl, measureTitle, reportTitle, statusDate, statusDescription, statusHorS, office, doeAction, hearingDate, hearingTime, doePosition, testifier, doeInternalStatus }) {
    const docID = this._collection.insert({
      code,
      companion,
      currentReferral,
      description,
      introducer,
      measureArchiveUrl,
      measurePdfUrl,
      measureTitle,
      reportTitle,
      statusDate,
      statusDescription,
      statusHorS,
      office,
      doeAction,
      hearingDate,
      hearingTime,
      doePosition,
      testifier,
      doeInternalStatus,
    });
    return docID;
  }

  /**
   * Updates the given document.
   */
  // eslint-disable-next-line max-len
  update(docID, { office, archive, code, measurePdfUrl, measureArchiveUrl, measureTitle, reportTitle, description, statusHorS, statusDescription, statusDate, introducer, currentReferral, companion, doeAction, hearingDate, hearingTime, hearingLocation, doePosition, testifier, doeInternalStatus }) {
    const updateData = {};
    if (_.isArray(office)) {
      updateData.office = office;
    }

    if (_.isBoolean(archive)) {
      updateData.archive = archive;
    }

    if (code) {
      updateData.code = code;
    }

    if (measurePdfUrl) {
      updateData.measurePdfUrl = measurePdfUrl;
    }

    if (measureArchiveUrl) {
      updateData.measureArchiveUrl = measureArchiveUrl;
    }

    if (measureTitle) {
      updateData.measureTitle = measureTitle;
    }

    if (reportTitle) {
      updateData.reportTitle = reportTitle;
    }

    if (description) {
      updateData.description = description;
    }

    if (statusHorS) {
      updateData.statusHorS = statusHorS;
    }

    if (statusDescription) {
      updateData.statusDescription = statusDescription;
    }

    if (statusDate) {
      updateData.statusDate = statusDate;
    }

    if (introducer) {
      updateData.introducer = introducer;
    }

    if (currentReferral) {
      updateData.currentReferral = currentReferral;
    }

    if (companion) {
      updateData.companion = companion;
    }

    if (doeAction) {
      updateData.doeAction = doeAction;
    }

    if (hearingDate) {
      updateData.hearingDate = hearingDate;
    }

    if (hearingTime) {
      updateData.hearingTime = hearingTime;
    }

    if (hearingLocation) {
      updateData.hearingLocation = hearingLocation;
    }

    if (doePosition) {
      updateData.doePosition = doePosition;
    }

    if (testifier) {
      updateData.testifier = testifier;
    }

    if (doeInternalStatus) {
      updateData.doeInternalStatus = doeInternalStatus;
    }

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
    // TODO these separate admin/user returns aren't necessary for us, but maybe we can add offices in the futures here,
    //  so that each office only sees the bills that are assigned to them?
    if (Meteor.isServer) {
      // get the StuffCollection instance.
      const instance = this;
      /** This subscription publishes only the documents associated with the logged in user */
      Meteor.publish(savedMeasurePublications.savedMeasure, function publish() {
        if (this.userId) {
          return instance._collection.find();
        }
        return this.ready();
      });

      /** This subscription publishes all documents regardless of user, but only if the logged in user is the Admin. */
      Meteor.publish(savedMeasurePublications.savedMeasureAdmin, function publish() {
        if (this.userId && Roles.userIsInRole(this.userId, ROLE.ADMIN)) {
          return instance._collection.find();
        }
        return this.ready();
      });
    }
  }

  /**
   * Subscription method for stuff owned by the current user.
   */
  subscribeMeasureSaved() {
    if (Meteor.isClient) {
      return Meteor.subscribe(savedMeasurePublications.savedMeasure);
    }
    return null;
  }

  /**
   * Subscription method for admin users.
   * It subscribes to the entire collection.
   */
  subscribeMeasureSavedAdmin() {
    if (Meteor.isClient) {
      return Meteor.subscribe(savedMeasurePublications.savedMeasureAdmin);
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
    this.assertRole(userId, [ROLE.ADMIN, ROLE.USER, ROLE.ASSIGNER, ROLE.WRITER, ROLE.OFFICE_APV, ROLE.PIPE_APV, ROLE.FINAL_APV, ROLE.SUBMITTER]);
  }

  /**
   * Returns an object representing the definition of docID in a format appropriate to the restoreOne or define function.
   * @param docID
   * @return {{owner: (*|number), condition: *, quantity: *, name}}
   */
  dumpOne(docID) {
    const doc = this.findDoc(docID);
    const office = doc.office;
    const archive = doc.archive;
    const code = doc.code;
    const measurePdfUrl = doc.measurePdfUrl;
    const measureArchiveUrl = doc.measureArchiveUrl;
    const measureTitle = doc.measureTitle;
    const reportTitle = doc.reportTitle;
    const description = doc.description;
    const statusHorS = doc.statusHorS;
    const statusDescription = doc.statusDescription;
    const statusDate = doc.statusDate;
    const introducer = doc.introducer;
    const currentReferral = doc.currentReferral;
    const companion = doc.companion;
    const doeAction = doc.doeAction;
    const hearingDate = doc.hearingDate;
    const hearingTime = doc.hearingTime;
    const hearingLocation = doc.hearingLocation;
    const doePosition = doc.doePosition;
    const testifier = doc.testifier;
    const doeInternalStatus = doc.doeInternalStatus;
    const owner = doc.owner;
    // eslint-disable-next-line max-len
    return { office, archive, code, measurePdfUrl, measureArchiveUrl, measureTitle, reportTitle, description, statusHorS, statusDescription, statusDate, introducer, currentReferral, companion, doeAction, hearingDate, hearingTime, hearingLocation, doePosition, testifier, doeInternalStatus, owner };
  }
}

/**
 * Provides the singleton instance of this class to all other entities.
 */
export const SavedMeasures = new SavedMeasuresCollection();
