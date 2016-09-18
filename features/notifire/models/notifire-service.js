module.exports = function() {
  'use strict';

  DependencyInjection.service('$NotifireService', [
    '$AbstractService', '$socket',
  function($AbstractService, $socket) {

    return new (function $NotifireService() {

      $AbstractService.call(this);

      var _this = this,
          _users = [],
          _details = null;

      this.users = function() {
        return _users;
      };

      this.details = function(newValue) {
        if (typeof newValue != 'undefined') {
          _details = newValue;

          _this.fire('detailsChanged', {
            details: _details
          });

          return _this;
        }

        return _details;
      };

      this.sendNotification = function(message, content, picture, pushTitle, pushContent, pushPicture, user, eventName, eventArgs) {
        $socket.emit('create(notifire/notification)', {
          message: message,
          content: content,
          picture: picture,
          user: user,
          pushTitle: pushTitle,
          pushContent: pushContent,
          pushPicture: pushPicture,
          eventName: eventName,
          eventArgs: eventArgs
        });
      };

      $socket.on('read(users/names)', function(args) {
        if (!args || !args.users) {
          return;
        }

        _users = args.users;

        _this.fire('usersChanged', args);
      });

      this.onSafe('init', function() {
        $socket.emit('call(users/names)');
      });

    })();

  }]);

};
