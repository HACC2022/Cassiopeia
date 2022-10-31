import { Meteor } from 'meteor/meteor';
import { Testimonies } from '../testimony/TestimonyCollection';
import { AdminProfiles } from '../user/admin/AdminProfileCollection';
import { UserProfiles } from '../user/UserProfileCollection';
import { SavedMeasures } from '../savedMeasures/SavedMeasuresCollection';
import { AssignerProfiles } from '../user/assigner/AssignerProfileCollection';
import { WriterProfiles } from '../user/writer/WriterProfileCollection';
import { OfficerApvProfiles } from '../user/office_apv/OfficeApvProfileCollection';
import { PIPEApvProfiles } from '../user/pipe_apv/PIPEApvProfileCollection';
import { FinalApvProfiles } from '../user/final_apv/FinalApvProfileCollection';
import { SubmitterProfiles } from '../user/submitter/SubmitterProfileCollection';

class MATPClass {
  collections;

  collectionLoadSequence;

  collectionAssociation;

  constructor() {
    // list of all the MATP collections
    this.collections = [
      AdminProfiles,
      UserProfiles,
      AssignerProfiles,
      WriterProfiles,
      OfficerApvProfiles,
      PIPEApvProfiles,
      FinalApvProfiles,
      SubmitterProfiles,
      Testimonies,
      SavedMeasures,
    ];
    /*
     * A list of collection class instances in the order required for them to be sequentially loaded from a file.
     */
    this.collectionLoadSequence = [
      AdminProfiles,
      UserProfiles,
      AssignerProfiles,
      WriterProfiles,
      OfficerApvProfiles,
      PIPEApvProfiles,
      FinalApvProfiles,
      SubmitterProfiles,
      Testimonies,
      SavedMeasures,
    ];

    /*
     * An object with keys equal to the collection name and values the associated collection instance.
     */
    this.collectionAssociation = {};
    this.collections.forEach((collection) => {
      this.collectionAssociation[collection.getCollectionName()] = collection;
    });

  }

  /**
   * Return the collection class instance given its name.
   * @param collectionName The name of the collection.
   * @returns The collection class instance.
   * @throws { Meteor.Error } If collectionName does not name a collection.
   */
  getCollection(collectionName) {
    // console.log('MATP', collectionName, this.collectionAssociation);
    const collection = this.collectionAssociation[collectionName];
    if (!collection) {
      throw new Meteor.Error(`Called MARTP.getCollection with unknown collection name: ${collectionName}`);
    }
    return collection;
  }
}

export const MATP = new MATPClass();
