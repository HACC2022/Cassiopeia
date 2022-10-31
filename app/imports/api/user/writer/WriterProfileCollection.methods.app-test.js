import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import faker from 'faker';
import {
  defineTestAdminUser,
  withLoggedInUser,
  withSubscriptions,
} from '../../../test-utilities/test-utilities';
import { defineMethod, updateMethod, removeItMethod } from '../../base/BaseCollection.methods';
import { WriterProfiles } from './WriterProfileCollection';

/* eslint prefer-arrow-callback: "off",  no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isClient) {
  describe('WriterProfileCollection Meteor Methods', function testSuite() {
    it('Can define, update, and removeIt', async function test1() {
      const { username, password } = await defineTestAdminUser.callPromise();
      await withLoggedInUser({ username, password });
      await withSubscriptions();
      const collectionName = WriterProfiles.getCollectionName();
      const definitionData = {};
      definitionData.email = faker.internet.email();
      definitionData.firstName = faker.name.firstName();
      definitionData.lastName = faker.name.lastName();
      // console.log(collectionName, definitionData);
      const docID = await defineMethod.callPromise({ collectionName, definitionData });
      expect(WriterProfiles.isDefined(docID)).to.be.true;
      let doc = WriterProfiles.findDoc(docID);
      expect(doc.email).to.equal(definitionData.email);
      expect(doc.firstName).to.equal(definitionData.firstName);
      expect(doc.lastName).to.equal(definitionData.lastName);
      const updateData = {};
      updateData.id = docID;
      updateData.firstName = faker.name.firstName();
      updateData.lastName = faker.name.lastName();
      await updateMethod.callPromise({ collectionName, updateData });
      doc = WriterProfiles.findDoc(docID);
      expect(doc.email).to.equal(updateData.email);
      expect(doc.firstName).to.equal(updateData.firstName);
      expect(doc.lastName).to.equal(updateData.lastName);
      await removeItMethod.callPromise({ collectionName, instance: docID });
      expect(WriterProfiles.isDefined(docID)).to.be.false;
    });
  });
}
