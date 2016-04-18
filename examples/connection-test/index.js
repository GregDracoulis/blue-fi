var noble = require('noble');

var serviceUuid = 'fffffffffffffffffffffffffffffff0';
var characteristicUuid = 'fffffffffffffffffffffffffffffff1';

noble.on('stateChange', function(state) {
  if (state === 'poweredOn') {
    console.log('scanning');
    noble.startScanning([serviceUuid], false);
  } else {
    noble.stopScanning();
  }
});

noble.on('discover', function(peripheral) {
  noble.stopScanning();

  console.log('found peripheral: ', peripheral.advertisement);
  peripheral.connect(function(err) {
    peripheral.discoverServices([serviceUuid], function(err, services) {
      services.forEach(function(service) {
        console.log('found service: ' + service.uuid);
        service.discoverCharacteristics([], function(err, characteristics) {
          characteristics.forEach(function(characteristic) {
            console.log('found characteristic: ' + characteristic.uuid);
            if (characteristicUuid == characteristic.uuid) {
              console.log('found matching characteristic')
              characteristic.read(function(err, data) {
                console.log(data);
                try {
                  console.log(JSON.parse(data));
                } catch (e) {
                  console.log(e);
                }
              });
            }
          });
        });
      });
    });
  });
});
