'use strict';

angular.module('copayApp.controllers').controller('preferencesUnitController',
  function($rootScope, $scope, configService, go) {
    var config = configService.getSync();
    this.unitName = config.wallet.settings.unitName;
    this.unitOpts = [
      // TODO : add Satoshis to bitcore-wallet-client formatAmount()
      // {
      //     name: 'Satoshis (100,000,000 satoshis = 1START)',
      //     shortName: 'SAT',
      //     value: 1,
      //     decimals: 0,
      //     code: 'sat',
      //   }, 
      {
        name: 'bits (1,000,000 bits = 1START)',
        shortName: 'bits',
        value: 100,
        decimals: 2,
        code: 'bit',
      }
      // TODO : add mSTART to bitcore-wallet-client formatAmount()
      // ,{
      //   name: 'mSTART (1,000 mSTART = 1START)',
      //   shortName: 'mSTART',
      //   value: 100000,
      //   decimals: 5,
      //   code: 'mstart',
      // }
      , {
        name: 'START',
        shortName: 'START',
        value: 100000000,
        decimals: 8,
        code: 'start',
      }
    ];

    this.save = function(newUnit) {
      var opts = {
        wallet: {
          settings: {
            unitName: newUnit.shortName,
            unitToSatoshi: newUnit.value,
            unitDecimals: newUnit.decimals,
            unitCode: newUnit.code,
          }
        }
      };
      this.unitName = newUnit.shortName;

      configService.set(opts, function(err) {
        if (err) console.log(err);
        $scope.$emit('Local/ConfigurationUpdated');
      });

    };
  });
