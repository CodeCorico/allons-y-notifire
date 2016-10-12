'use strict';

module.exports = [{
  event: 'update(web/route)',
  controller: function($socket, UserModel, $message) {
    if (!this.validMessage($message, {
      path: ['string', 'filled']
    })) {
      return;
    }

    if (!$socket.user || !$socket.user.id || !$message.path.match(/^\/notifire\/?$/)) {
      return;
    }

    UserModel.addHomeTile({
      date: new Date(),
      url: '/notifire',
      cover: '/public/notifire/notifire-home.jpg',
      large: true,
      centered: {
        title: 'NOTIFIRE'
      }
    }, $socket.user.id);
  }
}, {
  event: 'create(notifire/notification)',
  permissions: ['notifire-access'],
  controller: function($socket, UserModel, $message) {
    if (!this.validMessage($message, {
      message: ['string', 'filled'],
      content: ['string', 'filled'],
      picture: ['string', 'filled'],
      pushTitle: ['string', 'filled'],
      pushContent: ['string', 'filled'],
      pushPicture: ['string', 'filled'],
      eventName: ['string', 'filled']
    })) {
      return;
    }

    UserModel.pushNotification($socket, $message.user && $message.user != 'all' ? [$message.user] : null, {
      message: $message.message,
      content: $message.content,
      picture: $message.picture,
      pushTitle: $message.pushTitle,
      pushContent: $message.pushContent,
      pushPicture: $message.pushPicture,
      eventName: $message.eventName,
      eventArgs: $message.eventArgs
    });
  }
}];
