/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

// Ad unit configuration
 var admobid = null;
 var admobBanner = false;
 if( /(android)/i.test(navigator.userAgent) ) {
     // Android
     admobid = {
         banner: 'ca-app-pub-4400088783500800/3716426977',
         interstitial: 'ca-app-pub-4400088783500800/6209758175'
     };
 } else if(/(ipod|iphone|ipad)/i.test(navigator.userAgent)) {
     // iOS
     admobid = {
         banner: 'ca-app-pub-4400088783500800/3716426977',
         interstitial: 'ca-app-pub-4400088783500800/6209758175'
     };
 } else {
     // Windows
     admobid = {
         banner: 'ca-app-pub-4400088783500800/3716426977',
         interstitial: 'ca-app-pub-4400088783500800/6209758175'
     };
}

function initialize() {
    // When the device is ready
    document.addEventListener('deviceready', function () {
        // Register app product
        cordova.plugins.DeviceMeta.getDeviceMeta(function(result){
            store.ready(function () {
                renderInterstitial(result.debug);
            });
            store.register({
                id: 'remove_ads',
                alias: 'Remove Ads',
                type: store.NON_CONSUMABLE
            });
            store.when('remove_ads').approved(function (product) {
                product.finish();
            });
            store.when('remove_ads').updated(function () {
                renderBanner(result.debug);
            });
            store.refresh();
        });

        // Setup controllers
        App.controller('home', homeController);
        App.controller('info', infoController);

        // Load app
        try {
            App.restore();
        } catch (err) {
            App.load('home');
        }
    }, false);

    // When the app resumes
    document.addEventListener('resume', function () {
        location.reload();
    }, false);
}

function renderInterstitial(testing) {
    var product = store.get('remove_ads');
    if (!product.owned) {
        AdMob.prepareInterstitial({
            adId: admobid.interstitial,
            isTesting: testing,
            autoShow: true
        });
    }
}

function renderBanner(testing) {
    var product = store.get('remove_ads');
    if (product.owned && admobBanner) {
        AdMob.removeBanner();
        admobBanner = false;
    } else if (!product.owned && !admobBanner) {
        AdMob.createBanner({
            adId: admobid.banner,
            position: AdMob.AD_POSITION.BOTTOM_CENTER,
            isTesting: testing,
            overlap: false,
            offsetTopBar: false,
            bgColor: 'black'
        });
        admobBanner = true;
    }
}

function noop () { }

function homeController(page) {
    var text = 'Today is ' + discordian(new Date(Date.now())) + '.';
    $(page).find('#discordian-text').text(text);
    $(page).find('#share-button').on('click', function () {
        window.plugins.socialsharing.shareWithOptions({
            message: text,
            subject: 'A message from Wanda'
        }, noop, noop);
    });
    $(page).find('#info-button').on('click', function () {
        App.load('info');
    });
}

function infoController(page) {
    var mailLink = $(page).find('#mail-link');
    var productButton = $(page).find('#product-button');
    var restoreButton = $(page).find('#restore-button');
    $(page).find('#donate-button').on('click', function () {
        window.open('https://ko-fi.com/A214L4K');
    });
    productButton.on('click', function () {
        store.order('remove_ads');
    });
    restoreButton.on('click', function () {
        store.refresh();
    });

    // Conditionally display the remove ads button
    function renderPurchase() {
        var product = store.get('remove_ads');
        if (product && product.state === store.VALID && !product.owned && product.canPurchase) {
            productButton.removeClass('hidden');
            restoreButton.removeClass('hidden');
        } else {
            productButton.addClass('hidden');
            restoreButton.addClass('hidden');
        }
    }

    $(page).on('appShow', function () {
        renderPurchase();
        store.when('remove_ads').updated(renderPurchase);
    });

    $(page).on('appHide', function () {
        store.off(renderPurchase);
    });
}

/**
 * All Hail Discordia! - this script prints Discordian date using system date.
 * author: jklu, lang: JavaScript
 */
 Date.prototype.isLeapYear = function() {
   var year = this.getFullYear();
   if ((year & 3) !== 0) return false;
   return ((year % 100) !== 0 || (year % 400) === 0);
 };
 Date.prototype.getDOY = function() {
   var dayCount = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
   var mn = this.getMonth();
   var dn = this.getDate();
   var dayOfYear = dayCount[mn] + dn;
   if (mn > 1 && this.isLeapYear()) dayOfYear++;
   return dayOfYear;
 };
 var seasons = ["Chaos", "Discord", "Confusion",
   "Bureaucracy", "The Aftermath"];
 var weekday = ["Sweetmorn", "Boomtime", "Pungenday",
   "Prickle-Prickle", "Setting Orange"];
 var apostle = ["Mungday", "Mojoday", "Syaday",
   "Zaraday", "Maladay"];
 var holiday = ["Chaoflux", "Discoflux", "Confuflux",
   "Bureflux", "Afflux"];

function discordian (date) {
    var y = date.getFullYear();
    var yold = y + 1166;
    var dayOfYear = date.getDOY();

    if (date.isLeapYear()) {
      if (dayOfYear == 60)
        return "St. Tib's Day, in the YOLD " + yold;
      else if (dayOfYear > 60)
        dayOfYear--;
    }
    dayOfYear--;

    var divDay= Math.floor(dayOfYear/73);

    var seasonDay = (dayOfYear % 73) + 1;
    if (seasonDay == 5)
      return apostle[divDay] + ", in the YOLD " + yold;
    if (seasonDay == 50)
      return holiday[divDay] + ", in the YOLD " + yold;

    var season = seasons[divDay];
    var dayOfWeek = weekday[dayOfYear % 5];

    return dayOfWeek + ", day " + seasonDay + " of " +
      season + " in the YOLD " + yold;
}

// Start the app
initialize();
