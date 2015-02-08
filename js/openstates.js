/*
This file moves the OpenStates API calls into their own module, and caches responses for speed on second request.
*/

var API_KEY = "9e3e71730ae34e1ebbf4dd0e1c346c07";
var prefix = "http://openstates.org/api/v1/";

var $ = require("jquery");

var cache = {
  states: {},
  committees: {},
  people: {}
}

var getState = function(state) {
  if (!cache.states[state]) {
    cache.states[state] = $.ajax({
      dataType: "json",
      url: prefix + "committees/",
      data: {
        state: state,
        fields: "members,committee,subcommittee,chamber",
        apikey: API_KEY
      }
    });
  }
  return cache.states[state];
};

var getCommittee = function(id) {
  if (!cache.committees[id]) {
    cache.committees[id] = $.ajax({
      dataType: "json",
      url: prefix + "committees/" + id + "/",
      data: {
        apikey: API_KEY
      }
    });
  }
  return cache.committees[id];
};

var getMember = function(id) {
  if (!cache.people[id]) {
    cache.people[id] = $.ajax({
      dataType: "json",
      url: prefix + "legislators/" + id + "/",
      data: {
        active: true,
        fields: "party,leg_id,active,district,party,email,full_name,role,email,photo_url,offices,votesmart_id",
        apikey: API_KEY
      }
    });
  }
  return cache.people[id];
};

module.exports = {
  getState: getState,
  getCommittee: getCommittee,
  getMember: getMember
}