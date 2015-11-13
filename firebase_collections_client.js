"use strict"
const FirebaseRef = Firebase;

Firebase = {};

class Collection {
  constructor(name, options){
    options = options || {};

    var endpoint = options.endpoint;

    if (!endpoint){
      throw new Meteor.Error('firebase-error', 'no endpoint specified');
    }

    this.ref = new FirebaseRef( UrlUtils.resolve(endpoint, name)  );
  }
  /**
   *@summary Insert a document into a collection. Returns its unique _id;
   */
  insert(doc){
    var newDocRef = this.ref.push(doc);
    return newDocRef.key();
  }
};


Firebase.Collection = Collection;
// useful for debug
Firebase._FirebaseRef = FirebaseRef;
