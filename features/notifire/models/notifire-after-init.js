'use strict';

module.exports = function(GroupModel, $done) {
  var PERMISSIONS = {
    'notifire-access': {
      title: 'Access to the Notifire app',
      description: 'Access to the Notifire app',
      isPublic: true
    }
  };

  GroupModel.registerPermissions(PERMISSIONS);

  $done();
};
