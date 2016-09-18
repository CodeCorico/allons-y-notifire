(function() {
  'use strict';

  window.Ractive.controllerInjection('notifire-details', [
    '$component', '$data', '$done',
  function notifireDetailsController($component, $data, $done) {
    $component({
      data: $data
    });

    $done();
  }]);

})();
