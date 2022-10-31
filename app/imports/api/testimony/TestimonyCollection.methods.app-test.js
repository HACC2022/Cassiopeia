import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import faker from 'faker';
import { Testimonies } from './TestimonyCollection';
import { defineTestUser, withLoggedInUser, withSubscriptions } from '../../test-utilities/test-utilities';
import { defineMethod, updateMethod, removeItMethod } from '../base/BaseCollection.methods';

/* eslint prefer-arrow-callback: "off",  no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isClient) {
  describe('TestimonyCollection Meteor Methods', function testSuite() {
    it('Can define, update, and removeIt', async function test1() {
      const { username, password } = await defineTestUser.callPromise();
      await withLoggedInUser({ username, password });
      await withSubscriptions();
      const collectionName = Testimonies.getCollectionName();
      const definitionData = {};
      definitionData.governorName = faker.lorem.words();
      definitionData.governorTitle = faker.lorem.words();
      definitionData.testifier = faker.lorem.words();
      definitionData.testifierTitle = faker.lorem.words();
      definitionData.hearingDate = faker.lorem.words();
      definitionData.hearingTime = faker.lorem.words();
      definitionData.hearingLocation = faker.lorem.words();
      definitionData.committee = faker.lorem.words();
      definitionData.department = faker.lorem.words();
      definitionData.billTitle = faker.lorem.words();
      definitionData.billPurpose = faker.lorem.words();
      definitionData.position = faker.lorem.words();
      definitionData.lastEditedBy = username;
      // console.log(collectionName, definitionData);
      const docID = await defineMethod.callPromise({ collectionName, definitionData });
      expect(Testimonies.isDefined(docID)).to.be.true;
      let doc = Testimonies.findDoc(docID);
      expect(doc.governorName).to.equal(definitionData.governorName);
      expect(doc.governorTitle).to.equal(definitionData.governorTitle);
      expect(doc.testifier).to.equal(definitionData.testifier);
      expect(doc.testifierTitle).to.equal(definitionData.testifierTitle);
      expect(doc.hearingDate).to.equal(definitionData.hearingDate);
      expect(doc.hearingTime).to.equal(definitionData.hearingTime);
      expect(doc.hearingLocation).to.equal(definitionData.hearingLocation);
      expect(doc.committee).to.equal(definitionData.committee);
      expect(doc.department).to.equal(definitionData.department);
      expect(doc.billTitle).to.equal(definitionData.billTitle);
      expect(doc.billPurpose).to.equal(definitionData.billPurpose);
      expect(doc.position).to.equal(definitionData.position);
      const updateData = {};
      updateData.id = docID;
      updateData.governorName = faker.lorem.words();
      updateData.governorTitle = faker.lorem.words();
      updateData.testifier = faker.lorem.words();
      updateData.testifierTitle = faker.lorem.words();
      updateData.hearingDate = faker.lorem.words();
      updateData.hearingTime = faker.lorem.words();
      updateData.hearingLocation = faker.lorem.words();
      updateData.committee = faker.lorem.words();
      updateData.department = faker.lorem.words();
      updateData.billTitle = faker.lorem.words();
      updateData.billPurpose = faker.lorem.words();
      updateData.position = faker.lorem.words();
      await updateMethod.callPromise({ collectionName, updateData });
      doc = Testimonies.findDoc(docID);
      expect(doc.testifierTitle).to.equal(definitionData.testifierTitle);
      expect(doc.testifier).to.equal(definitionData.testifier);
      expect(doc.billTitle).to.equal(definitionData.billTitle);
      await removeItMethod.callPromise({ collectionName, instance: docID });
      expect(Testimonies.isDefined(docID)).to.be.false;
    });
  });
}
