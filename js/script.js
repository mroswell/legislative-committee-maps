//require("modernizr");

var $ = require("jquery");
var _ = require("lodash");
var openstates = require("./openstates");
var capitalize = require("./capitalize");
var templates = require("./templates");
var qs = require("querystring");

//alias for Foundation
window.jQuery = window.$ = $;

//state variables
var currentCommittee = null;

var getQueryVar = function(name) {
  var query = qs.parse(window.location.search.replace(/^\?/, ""));
  return query[name];
};

// Get names of the committees
var populateDropDown = function(state) {
  openstates.getState(state).done(function(committeeList) {
    //TODO: clean up some of these loops
    var upper = [];
    var lower = [];
    committeeList.forEach(function(comm) {
      if (comm.subcommittee) return; //reject subs and empties
      if (comm.chamber == "upper") {
        upper.push(comm);
      }
      if (comm.chamber == "lower") {
        lower.push(comm);
      }
    });
    upper = _.sortBy(upper, "committee");
    lower = _.sortBy(lower, "committee");
    var upperHTML = templates.list({ committees: upper });
    $("#tinyDropUpper").html(upperHTML);
    var lowerHTML = templates.list({committees: lower});
    $("#tinyDropLower").html(lowerHTML);
    
    var committee = getQueryVar("committee");
    if (committee) {
      $('[data-cmte-id="'+committee+'"]').click();
    }
  });
};

// Get committee detail
var getCommitteeDetail = function(id) {
  openstates.getCommittee(id).done(function(committee) {
    if (committee.members.length > 0) {
      addLegislators(committee);
    } else {
      $(".panel").html("<div id='no-reported'>This committee <br/>(" + committee.committee + ")<br/>has no reported members.</div>");
      $(".entry").html("");
    }
  });
};

// append legislator detail to committee
var addLegislators = function(committee) {
  committee.members.forEach(function(member, i) {
    if (member.leg_id) {
      openstates.getMember(member.leg_id).done(function(memberDetail) {
        if (committee.members[i].role) {
          if (committee.members[i].role.toLowerCase() === "member") {
            committee.members[i].role = null;
          } else {
            committee.members[i].role = capitalize(committee.members[i].role);
          }
        }
        // just first letter of party
        if (memberDetail.party) {
          memberDetail.party = memberDetail.party.slice(0, 1);
        }
        member.detail = memberDetail;
        if (committee.members.length) {
          var html = templates.member({ cmte: committee });
          $('#committee-list').html(html);
          currentCommittee = committee;
        }
      })
    }
  });
};

$(document.body).on("click", "[data-member-id]", function() {
  if (!currentCommittee) return;
  var id = $(this).data("member-id");
  for (var i = 0; i < currentCommittee.members.length; i++) {
    var member = currentCommittee.members[i];
    if (member.leg_id == id) {
      var html = templates.detail({ members: [member] });
      $("#member-detail").html(html);
      return memberDetailFunction(member);
    }
  }
});

$(document.body).on("click", "[data-cmte-id]", function(e) {
  e.preventDefault();
  var $this = $(this);
  var id = $this.data("cmte-id");
  //rework with node querystring
  // queryString.push('committee', committee_id);

  $this.closest("ul").css('left', '-99999px').removeClass("open");
  $(".panel").html("Click a committee member for detail. <i class='fa fa-long-arrow-right'></i>");
  getCommitteeDetail(id);
});
  
$("select").on("change", function() {
  var $this = $(this);
  var selectedState = $(this).val();
  // queryString.push('state', selectedState);
  populateDropDown(selectedState);
});

//not really any need for an init
var state = getQueryVar("state") || "al";
  
$('select option[value="' + state + '"]').prop('selected', true);

populateDropDown(state);
