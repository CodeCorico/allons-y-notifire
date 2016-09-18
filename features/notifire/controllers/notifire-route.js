'use strict';

module.exports = {
  url: '/notifire',

  enter: [
    '$FaviconService', '$BodyDataService', '$Page', '$i18nService', '$Layout',
  function($FaviconService, $BodyDataService, $Page, $i18nService, $Layout) {
    var user = $BodyDataService.data('user');

    if (user.permissionsPublic.indexOf('notifire-access') < 0) {
      return window.page.redirect('/');
    }

    document.title = $i18nService._('Notifire') + ' - ' + $BodyDataService.data('web').brand;
    $FaviconService.update('/public/notifire/favicon.png');

    $Layout.selectApp('Notifire', false);

    setTimeout(function() {
      require('/public/notifire/notifire-service.js')
        .then(function() {
          return require('/public/vendor/plumes/notifications-panel/pl-notifications-panel.css');
        })
        .then(function() {
          return $Layout.require('notifire-layout');
        })
        .then(function() {
          var $NotifireService = DependencyInjection.injector.view.get('$NotifireService');

          $NotifireService.init();
          DependencyInjection.injector.view.get('$NotificationsService').init();

          $Page.rightButtonAdd('notifire-details', {
            icon: 'fa fa-check',
            group: 'group-notifire-details',
            ready: function(button) {
              button.action(false);
            },
            beforeGroup: function(context, $group, userBehavior, callback) {
              context.require('notifire-details').then(function() {
                $NotifireService.details(context.findChild('name', 'notifire-details'));

                callback();
              });
            }
          });
        });
    });
  }],

  exit: ['$next', '$Page', '$Layout', function($next, $Page, $Layout) {
    require('/public/notifire/notifire-service.js').then(function() {
      var $NotifireService = DependencyInjection.injector.view.get('$NotifireService'),
          pathname = window.location.pathname.split('/');

      if (!pathname || pathname.length < 2 || pathname[1] != 'notifire') {
        $Layout.rightContext().closeIfGroupOpened('group-notifire-details');

        $Page.rightButtonRemove('notifire-details');

        $NotifireService.teardown(null, $next);
      }
    });
  }]
};
