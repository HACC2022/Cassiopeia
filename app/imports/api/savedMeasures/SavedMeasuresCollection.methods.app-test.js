import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import faker from 'faker';
import { SavedMeasures, offices } from './SavedMeasuresCollection';
import { defineTestUser, withLoggedInUser, withSubscriptions } from '../../test-utilities/test-utilities';
import { defineMethod, updateMethod, removeItMethod } from '../base/BaseCollection.methods';

/* eslint prefer-arrow-callback: "off",  no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isClient) {
  describe('SavedMeasureCollection Meteor Methods', function testSuite() {
    it('Can define, update, and removeIt', async function test1() {
      const { username, password } = await defineTestUser.callPromise();
      await withLoggedInUser({ username, password });
      await withSubscriptions();
      const collectionName = SavedMeasures.getCollectionName();
      const definitionData = {};
      definitionData.office = offices[faker.datatype.string(offices.length - 1)];
      definitionData.archive = faker.datatype.boolean();
      definitionData.code = faker.lorem.words();
      definitionData.measurePdfUrl = faker.lorem.words();
      definitionData.measureArchiveUrl = faker.lorem.words();
      definitionData.measureTitle = faker.lorem.words();
      definitionData.reportTitle = faker.lorem.words();
      definitionData.description = faker.lorem.words();
      definitionData.statusHorS = faker.lorem.words();
      definitionData.statusDescription = faker.lorem.words();
      definitionData.statusDate = faker.lorem.words();
      definitionData.introducer = faker.lorem.words();
      definitionData.currentReferral = faker.lorem.words();
      definitionData.companion = faker.lorem.words();
      definitionData.doeAction = faker.lorem.words();
      definitionData.hearingDate = faker.lorem.words();
      definitionData.hearingTime = faker.lorem.words();
      definitionData.hearingLocation = faker.lorem.words();
      definitionData.doePosition = faker.lorem.words();
      definitionData.testifier = faker.lorem.words();
      definitionData.doeInternalStatus = faker.lorem.words();
      definitionData.owner = username;

      // console.log(collectionName, definitionData);
      const docID = await defineMethod.callPromise({ collectionName, definitionData });
      expect(SavedMeasures.isDefined(docID)).to.be.true;
      let doc = SavedMeasures.findDoc(docID);
      expect(doc.office).to.equal(definitionData.office);
      expect(doc.archive).to.equal(definitionData.archive);
      expect(doc.code).to.equal(definitionData.code);
      expect(doc.measurePdfUrl).to.equal(definitionData.measureArchiveUrl);
      expect(doc.measureArchiveUrl).to.equal(definitionData.measureArchiveUrl);
      expect(doc.measureTitle).to.equal(definitionData.measureTitle);
      expect(doc.reportTitle).to.equal(definitionData.reportTitle);
      expect(doc.description).to.equal(definitionData.description);
      expect(doc.statusHorS).to.equal(definitionData.statusHorS);
      expect(doc.statusDescription).to.equal(definitionData.statusDescription);
      expect(doc.statusDate).to.equal(definitionData.statusDate);
      expect(doc.introducer).to.equal(definitionData.introducer);
      expect(doc.currentReferral).to.equal(definitionData.currentReferral);
      expect(doc.companion).to.equal(definitionData.companion);
      expect(doc.doeAction).to.equal(definitionData.doeAction);
      expect(doc.hearingDate).to.equal(definitionData.hearingDate);
      expect(doc.hearingTime).to.equal(definitionData.hearingTime);
      expect(doc.hearingLocation).to.equal(definitionData.hearingLocation);
      expect(doc.doePosition).to.equal(definitionData.doePosition);
      expect(doc.testifier).to.equal(definitionData.testifier);
      expect(doc.doeInternalStatus).to.equal(definitionData.doeInternalStatus);
      const updateData = {};
      updateData.id = docID;
      await updateMethod.callPromise({ collectionName, updateData });
      doc = SavedMeasures.findDoc(docID);
      expect(doc.office).to.equal(updateData.office);
      expect(doc.archive).to.equal(updateData.archive);
      expect(doc.code).to.equal(updateData.code);
      expect(doc.measurePdfUrl).to.equal(updateData.measureArchiveUrl);
      expect(doc.measureArchiveUrl).to.equal(updateData.measureArchiveUrl);
      expect(doc.measureTitle).to.equal(updateData.measureTitle);
      expect(doc.reportTitle).to.equal(updateData.reportTitle);
      expect(doc.description).to.equal(updateData.description);
      expect(doc.statusHorS).to.equal(updateData.statusHorS);
      expect(doc.statusDescription).to.equal(updateData.statusDescription);
      expect(doc.statusDate).to.equal(updateData.statusDate);
      expect(doc.introducer).to.equal(updateData.introducer);
      expect(doc.currentReferral).to.equal(updateData.currentReferral);
      expect(doc.companion).to.equal(updateData.companion);
      expect(doc.doeAction).to.equal(updateData.doeAction);
      expect(doc.hearingDate).to.equal(updateData.hearingDate);
      expect(doc.hearingTime).to.equal(updateData.hearingTime);
      expect(doc.hearingLocation).to.equal(updateData.hearingLocation);
      expect(doc.doePosition).to.equal(updateData.doePosition);
      expect(doc.testifier).to.equal(updateData.testifier);
      expect(doc.doeInternalStatus).to.equal(updateData.doeInternalStatus);
      await removeItMethod.callPromise({ collectionName, instance: docID });
      expect(SavedMeasures.isDefined(docID)).to.be.false;
    });
  });
}
