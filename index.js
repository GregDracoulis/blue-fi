#!/usr/bin/env node

var bleno = require('bleno');

var BlenoPrimaryService = bleno.PrimaryService;

var ScanCharacteristic = require('./characteristic');

bleno.on('stateChange', function(state) {
  console.log('onStateChange ' + state);

  if (state === 'poweredOn') {
    bleno.startAdvertising('wifiScan', ['fffffffffffffffffffffffffffffff0'])
  } else {
    bleno.stopAdvertising();
  }
});

bleno.on('advertisingStart', function(error) {
  console.log('onAdvertisingStart: ' + (error ? 'error ' + error : 'success'));

  if (!error) {
    bleno.setServices([
      new BlenoPrimaryService({
        uuid: 'fffffffffffffffffffffffffffffff0',
        characteristics: [
          new ScanCharacteristic()
        ]
      })
    ])
  }
});
