(function() {
  'use strict';

  window.Ractive.controllerInjection('notifire-layout', [
    '$Page', '$Layout', '$i18nService',
    '$NotificationsService', '$NotifireService',
    '$component', '$data', '$done',
  function notifireLayoutController(
    $Page, $Layout, $i18nService,
    $NotificationsService, $NotifireService,
    $component, $data, $done
  ) {

    function _detailsChanged(details) {
      $.each(['message', 'content', 'picture'], function(i, key) {
        NotifireLayout.observe('notification.' + key, function(value) {
          details.set(key, value);
        });
      });
    }

    var NotifireLayout = $component({
      data: $.extend(true, {
        notification: {
          eventArgs: '{\n\n}'
        },
        users: [],
        loading: false
      }, $data)
    });

    NotifireLayout.on('fireNotification', function() {
      if (NotifireLayout.get('loading')) {
        return;
      }

      NotifireLayout.set('loading', true);

      setTimeout(function() {
        NotifireLayout.set('loading', false);
      }, 1000);

      var editedNotification = NotifireLayout.get('notification'),
          keys = [];

      for (var key in editedNotification) {
        if (key != 'eventArgs' && !editedNotification[key]) {
          keys.push(key);
        }
      }

      if (keys.length !== 0) {
        window.alert(keys.join(',') + ' are needed.');

        return;
      }

      $NotifireService.sendNotification(
        editedNotification.message,
        editedNotification.content,
        editedNotification.picture,
        editedNotification.pushTitle,
        editedNotification.pushContent,
        editedNotification.pushPicture,
        editedNotification.user,
        editedNotification.eventName,
        editedNotification.eventArgs ? JSON.parse(editedNotification.eventArgs) : {}
      );
    });

    $NotifireService.onSafe('notifireLayoutController.usersChanged', function(args) {
      var users = $.extend(true, [], args.users);

      users.sort(function(a, b) {
        var usernameA = a.username.toLowerCase(),
            usernameB = b.username.toLowerCase();

        return usernameA < usernameB ? -1 : (usernameA > usernameB ? 1 : 0);
      });

      NotifireLayout.set('users', users);
    });

    NotifireLayout.set('users', $NotifireService.users());

    NotifireLayout.on('teardown', function() {
      $NotifireService.offNamespace('notifireLayoutController');
    });

    $NotifireService.onSafe('notifireLayoutController.detailsChanged', function(args) {
      if (args.details) {
        _detailsChanged(args.details);
      }
    });

    if ($NotifireService.details()) {
      _detailsChanged($NotifireService.details());
    }

    $NotifireService.onSafe('notifireLayoutController.teardown', function() {
      NotifireLayout.teardown();
      NotifireLayout = null;
    });

    NotifireLayout.require().then($done);

  }]);

})();
