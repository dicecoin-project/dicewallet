'use strict';

angular.module('copayApp.services').factory('configService', function(localStorageService, lodash, bwcService) {
  var root = {};

  var defaultConfig = {
    // wallet limits
    limits: {
      totalCopayers: 6,
      mPlusN: 100,
    },

    // Bitcore wallet service URL
    bws: {
      url: 'https://bws.startwallet.com/bws/api',
    },

    // insight
    insight: {
      testnet: {
        url: 'http://testnet.explorer.startcoin.org',
        transports: ['polling'],
      },
      livenet: {
        url: 'http://explorer.startcoin.org',
        transports: ['polling'],
      },
    },

    // wallet default config
    wallet: {
      requiredCopayers: 2,
      totalCopayers: 3,
      spendUnconfirmed: true,
      reconnectDelay: 5000,
      idleDurationMin: 4,
      settings: {
        unitName: 'START',
        unitToSatoshi: 100000000,
        unitDecimals: 8,
        unitCode: 'start',
        alternativeName: 'Pound Sterling',
        alternativeIsoCode: 'GBP',
      }
    },

    // local encryption/security config
    passphraseConfig: {
      iterations: 5000,
      storageSalt: 'YC=y2=-HEgvl',
    },

    rates: {
      url: 'https://rates.startwallet.com/all',
    },
  };

  var configCache = null;




  root.getSync = function() {
    if (!configCache)
      throw new Error('configService#getSync called when cache is not initialized');

    return configCache;
  };

  root.get = function(cb) {
    localStorageService.get('config', function(err, localConfig) {

      if (localConfig) {
        configCache = JSON.parse(localConfig);

        //these ifs are to avoid migration problems
        if (!configCache.bws) {
          configCache.bws = defaultConfig.bws;
        }
        if (!configCache.wallet.settings.unitCode) {
          configCache.wallet.settings.unitCode = defaultConfig.wallet.settings.unitCode;
        }

      } else {
        configCache = defaultConfig;
      };

      return cb(err, configCache);
    });
  };

  root.set = function(newOpts, cb) {
    var config = defaultConfig;
    localStorageService.get('config', function(err, oldOpts) {
      if (lodash.isString(oldOpts)) {
        oldOpts = JSON.parse(oldOpts);
      }
      if (lodash.isString(config)) {
        config = JSON.parse(config);
      }
      if (lodash.isString(newOpts)) {
        newOpts = JSON.parse(newOpts);
      }
      lodash.merge(config, oldOpts, newOpts);
      configCache = config;

      localStorageService.set('config', JSON.stringify(config), cb);
    });
  };

  root.reset = function(cb) {
    localStorageService.remove('config', cb);
  };

  root.getDefaults = function() {
    return defaultConfig;
  };

  root.get(function(err, c) {
    if (err) throw Error(err);
    bwcService.setBaseUrl(c.bws.url);
  });

  return root;
});
