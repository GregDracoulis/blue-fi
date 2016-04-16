#!/usr/bin/env node

var util = require('util');

var bleno = require('bleno');
var WiFiControl = require('wifi-control');

var Descriptor = bleno.Descriptor;
var Characteristic = bleno.Characteristic;

var ScanCharacteristic = function() {
  ScanCharacteristic.super_.call(this, {
    uuid: 'fffffffffffffffffffffffffffffff1',
    properties: ['read'],
    descriptors: [
      new Descriptor({
        uuid: '2901', // String describing value returned by characteristic
        value: 'JSON describing hotspots in range'
      }),
      new Descriptor({
        uuid: '2904', // Hex fields describing data format returned by characteristic
        value: new Buffer([0x25, 0x01, 0x27, 0xAD, 0x01, 0x00, 0x00]) // UTF-8 String
      })
    ]
  });

  this._value = new Buffer(0);
  this._updateValueCallback = null;
}

util.inherits(ScanCharacteristic, Characteristic);

ScanCharacteristic.prototype.onReadRequest = function(offset, callback) {
  //  Initialize wifi-control package with verbose output
  WiFiControl.init({
    debug: true
  });

  //  Try scanning for access points:
  WiFiControl.scanForWiFi(function(err, response) {
    if (err) console.log(err);
    console.log(response);
    var transmitResponse = JSON.stringify(response);
    callback(this.RESULT_SUCCESS, new Buffer(transmitResponse, 'utf8'));
  });
};

module.exports = ScanCharacteristic;
