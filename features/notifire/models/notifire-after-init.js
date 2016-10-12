'use strict';

module.exports = function(GroupModel, $done) {
  var PERMISSIONS = {
        'notifire-access': {
          title: 'Access to the Notifire app',
          description: 'Access to the Notifire app',
          isPublic: true
        }
      },
      NOTIFIRE_HOME_TILE = {
        url: '/notifire',
        cover: '/public/notifire/notifire-home.jpg',
        large: true,
        centered: {
          title: 'NOTIFIRE'
        }
      },

      extend = require('extend'),
      UserModel = DependencyInjection.injector.model.get('UserModel');

  GroupModel.registerPermissions(PERMISSIONS);

  UserModel.homeDefaultTile(extend(true, {
    date: new Date()
  }, NOTIFIRE_HOME_TILE), ['notifire-access']);

  $done();
};
