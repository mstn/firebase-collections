Package.describe({
  summary:'Firebase backed collections',
  version:'0.0.1',
  name:'mstn:firebase-collections'
});

Package.onUse(function(api){
  api.versionsFrom('1.2'); 

  api.use('ecmascript', 'client');

  api.use('mstn:firebase-core', 'client');
  api.use('peerlibrary:url-utils', 'client');
  api.use('tracker', 'client');

  api.addFiles([
    'firebase_collections_client.js'
  ], 'client');

});
