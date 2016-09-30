(function() {
  'use strict';

  window.bootstrap([
    '$Page', '$BodyDataService', '$i18nService', '$done',
  function($Page, $BodyDataService, $i18nService, $done) {

    var _user = $BodyDataService.data('user') || null;

    if (_user && _user.permissionsPublic && _user.permissionsPublic.indexOf('notifire-access') > -1) {
      $Page.remember(/^\/notifire\/?$/);

      $Page.push('apps', {
        name: $i18nService._('Notifire'),
        select: function() {
          window.page('/notifire');
        }
      });
    }

    $done();
  }]);

})();
