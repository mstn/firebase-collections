Package.describe({
  summary:'Firebase backed collections',
  version:'0.0.1',
  name:'mstn:firebase-collections'
});

Package.onUse(function(api){
  api.versionsFrom('1.2'); 

  api.use('mquandalle:bower@1.5.2_1', 'client');
  api.use('peerlibrary:url-utils', 'client');

  api.addFiles([
    'bower.json',
    'firebase_collections_client.js'
  ], 'client');

  // XXX here we should export Firebase
  // but it is already a global var imported by bower
  // even if it is overridded in client code
  // it doesn't like api.export
});
