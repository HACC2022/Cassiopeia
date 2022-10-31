/*
import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import faker from 'faker';
import fc from 'fast-check';
import { Testimonies } from './testimonyCollection';
import { removeAllEntities } from '../base/BaseUtilities';

if (Meteor.isServer) {
  describe('TestimonyCollection', function testSuite() {
    before(function setup() {
      removeAllEntities();
    });

    after(function teardown() {
      removeAllEntities();
    });

    it('Can define and removeIt', function test1(done) {
      fc.assert(
        fc.property(
          fc.lorem(4),
          fc.lorem(2),
          fc.lorem(4),
          fc.lorem(2),
          fc.lorem(1),
          fc.lorem(2),
          fc.lorem(6),
          fc.lorem(10),
          fc.lorem(4),
          fc.lorem(15),
          fc.lorem(100),
          fc.lorem(1000),
          fc.lorem(4),
          (
            governorName,
            governorTitle,
            testifier,
            testifierTitle,
            hearingDate,
            hearingTime,
            hearingLocation,
            committee,
            department,
            billTitle,
            billPurpose,
            position,
            lastEditedBy,
          ) => {
            const docID = Testimonies.define({
              governorName, governorTitle, testifier, testifierTitle, hearingDate, hearingTime,
              hearingLocation, committee, department, billTitle, billPurpose, position, lastEditedBy,
            });
            expect(Testimonies.isDefined(docID)).to.be.true;
            Testimonies.removeIt(docID);
            expect(Testimonies.isDefined(docID)).to.be.false;
          },
        ),
      );
      done();
    });

    TODO stopped editing here, idk if we even need this file
    it('Can define duplicates', function test2() {
      const committeeChair = faker.animal.dog();
      const committeeName = faker.animal.dog();
      const billNumber = faker.animal.dog();
      const draftNumber = faker.animal.dog();
      const hearingDate = faker.animal.dog();
      const hearingLocation = faker.animal.dog();
      const position = faker.animal.dog();
      const introduction = faker.animal.dog();
      const owner = faker.internet.email();

      // committeeChair, committeeName, billNumber, draftNumber, hearingDate, hearingLocation, position, introduction

      const docID1 = Testimonies.define({ committeeChair, committeeName, billNumber, draftNumber, hearingDate, hearingLocation, position, introduction, owner });
      const docID2 = Testimonies.define({ committeeChair, committeeName, billNumber, draftNumber, hearingDate, hearingLocation, position, introduction, owner });
      expect(docID1).to.not.equal(docID2);
    });

    it('Can update', function test3(done) {
      const committeeChair = faker.lorem.words();
      const committeeName = faker.lorem.words();
      const billNumber = faker.lorem.words();
      const draftNumber = faker.lorem.words();
      const hearingDate = faker.lorem.words();
      const hearingLocation = faker.lorem.words();
      const position = faker.lorem.words();
      const introduction = faker.lorem.words();
      const owner = faker.lorem.words();
      const docID = Testimonies.define({
        committeeChair, committeeName, billNumber, draftNumber, hearingDate, hearingLocation, position, introduction, owner,
      });
      // console.log(Stuffs.findDoc(docID));
      fc.assert(
        fc.property(
          fc.lorem(1),
          fc.lorem(1),
          fc.lorem(1),
          fc.lorem(1),
          fc.lorem(1),
          fc.lorem(1),
          fc.lorem(1),
          fc.lorem(100),
          fc.lorem(1),
          (newCommitteeChair, newCommitteeName, newBillNumber, newDraftNumber, newHearingDate, newHearingLocation, newPosition, newIntroduction) => {
            Testimonies.update(docID, {
              committeeChair: newCommitteeChair,
              committeeName: newCommitteeName,
              billNumber: newBillNumber,
              draftNumber: newDraftNumber,
              hearingDate: newHearingDate,
              hearingLocation: newHearingLocation,
              position: newPosition,
              introduction: newIntroduction,
            });
            const testimony = Testimonies.findDoc(docID);
            expect(testimony.committeeChair).to.equal(newCommitteeChair);
            expect(testimony.committeeName).to.equal(newCommitteeName);
            expect(testimony.billNumber).to.equal(newBillNumber);
            expect(testimony.draftNumber).to.equal(newDraftNumber);
            expect(testimony.hearingDate).to.equal(newHearingDate);
            expect(testimony.hearingLocation).to.equal(newHearingLocation);
            expect(testimony.position).to.equal(newPosition);
            expect(testimony.introduction).to.equal(newIntroduction);
          },
        ),
      );
      done();
    });

    it('Can dumpOne, removeIt, and restoreOne', function test4() {
      const origDoc = Testimonies.findOne({});
      let docID = origDoc._id;
      const dumpObject = Testimonies.dumpOne(docID);
      Testimonies.removeIt(docID);
      expect(Testimonies.isDefined(docID)).to.be.false;
      docID = Testimonies.restoreOne(dumpObject);
      expect(Testimonies.isDefined(docID)).to.be.true;
      const doc = Testimonies.findDoc(docID);
      expect(doc.committeeChair).to.equal(origDoc.committeeChair);
      expect(doc.committeeName).to.equal(origDoc.committeeName);
      expect(doc.billNumber).to.equal(origDoc.billNumber);
      expect(doc.draftNumber).to.equal(origDoc.draftNumber);
      expect(doc.hearingDate).to.equal(origDoc.hearingDate);
      expect(doc.hearingLocation).to.equal(origDoc.hearingLocation);
      expect(doc.position).to.equal(origDoc.position);
      expect(doc.introduction).to.equal(origDoc.introduction);
      expect(doc.owner).to.equal(origDoc.owner);
    });
  });
}
*/
