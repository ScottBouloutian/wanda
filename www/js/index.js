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
var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
        document.addEventListener('resume', onResume, false);
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        App.controller('home', homeController);
        try {
            App.restore();
        } catch (err) {
            App.load('home');
        }
    }
};

function noop () { }

function onResume() {
    location.reload();
}

function homeController(page) {
    var text = 'Today is ' + discordian(new Date(Date.now())) + '.';
    $(page).find('#discordian-text').text(text);
    $(page).find('#share-button').on('click', function () {
        window.plugins.socialsharing.shareWithOptions({
            message: text,
            subject: 'A message from Wanda'
        }, noop, noop);
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

app.initialize();
