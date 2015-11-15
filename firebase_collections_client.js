"use strict"
const FirebaseRef = Firebase;

Firebase = {};

// utility functions to handle cache operations
//
var addToArray = function(array, index, item){
  array.splice(index, 0, item);
};

var removeFromArray = function(array, predicate){
  var index;
  index = findIndex(array, predicate);
  if (index>-1){
    array.splice(index, 1);
  }
};

var findIndex = function(array, predicate){
  var i, item;
  for (i=0; i<array.length; i++){
    item = array[i];
    if ( predicate(item)  ){
      return i;
    }
  }
  return -1;
};
var isIdEqualTo = function(item, key){
  return function(item){
    return item._id === key;
  };
};

const handleChildAdded = function(child, prevChildKey){
  var item;
  var index = 0;

  item = child.val();
  item._id = child.key();

  if ( prevChildKey !== null ){
    index = findIndex(this.cache, isIdEqualTo(prevChildKey)) + 1;
  }

  addToArray(this.cache, index, item);
  this.dep.changed();
};
const handleChildRemoved = function(child){
  this.dep.changed();
};
const handleChildChanged = function(child, prevChildKey){
  this.dep.changed();
};

class Cursor {
  constructor(query){
    this.cache = [];
    this.query = query;
    this.dep = new Tracker.Dependency;

    this.query.on('child_added', handleChildAdded.bind(this));
    this.query.on('child_removed', handleChildRemoved.bind(this));
    this.query.on('child_changed', handleChildChanged.bind(this));
  }
  count(){
    return this.fetch().length;  
  }
  fetch(){
    if (this.isFirstRun){
      this.isFirstRun = false;
    }
    this.dep.depend();
    return this.cache;
  }
};

class Query {
  constructor(root){
    this.root = root;
    this.query = {};
  }
  run(){
    var build = this.root;
    build = build.orderByChild( this.query.orderBy )
    return new Cursor(build);
  }
  orderBy(field, order){
   this.query.orderBy = field;
   return this;
  }
  startAt(field){
    return this; 
  } 
  endAt(field){
    return this;
  }
  equalTo(field, value){
   this.query.match = value;
   return this;
  }
  limit(num){
   this.query.limit = num;
   return this;
  }
};

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
  select(){
    return new Query(this.ref);
  }
};


Firebase.Collection = Collection;
// useful for debug
Firebase._FirebaseRef = FirebaseRef;
