//var committee ={};

// Get names of the committees
var populateDropDown= function(state) {
  var committeeListRequest = $.ajax({
    dataType: "json",
    url: "http://openstates.org/api/v1/committees/",
    data: {
      state: state,
      apikey: "9e3e71730ae34e1ebbf4dd0e1c346c07"
    }
  }).done(function(committeeList) {
      committees = _.reject(committeeList, 'subcommittee');
      upperCommittees = _.where(committees, {chamber: "upper"});
      lowerCommittees = _.where(committees,{chamber:"lower"});
      sortedUpperCommittees = _.sortBy(upperCommittees, 'committee');
      sortedLowerCommittees = _.sortBy(lowerCommittees, 'committee');

      var sortedUpperOutput = "";
        $.each(sortedUpperCommittees, function(key, val) {
        sortedUpperOutput += '<li><a href="#"  data-cmte-id="' + val.id +'">' + val.committee + '</a></li>';
      });
      var sortedLowerOutput = "";
        $.each(sortedLowerCommittees, function(key, val) {
        sortedLowerOutput += '<li><a href="#"  data-cmte-id="' + val.id +'">' + val.committee + '</a></li>';
      });

      $('ul#tinyDropUpper').prepend(sortedUpperOutput);
      $('ul#tinyDropLower').prepend(sortedLowerOutput);
    })
};

// Get committee detail
var getCommitteeDetail= function (committee_id) {
  console.log(committee_id);
  var committeeRequest = $.ajax({
    dataType: "json",
    url: "http://openstates.org/api/v1/committees/" + committee_id,
    data: {
      apikey: "9e3e71730ae34e1ebbf4dd0e1c346c07"
    }
  }).done(function(committee){
      leg_id_array = _.pluck(committee.members, 'leg_id');
addLegislators(committee)
    });
};

// append legislator detail to committee
var addLegislators = function(committee) {
  $('#update1-left pre').html("<h2>"+committee.committee+"</h2>");
  var counter = 0;
  committee.members.forEach(function(member) {

    var memberListRequest = $.ajax({
    dataType: "json",
    url: "http://openstates.org/api/v1/legislators/" + member.leg_id, //committee.members[i].leg_id,
    data: {
//      state: state,
      active: true,
      apikey: "9e3e71730ae34e1ebbf4dd0e1c346c07"
    }
  }).done(function(memberDetail) {
        member.detail = memberDetail;
        counter++;

        if (counter === committee.members.length) {
//          console.log("activeInIf",member.detail.active);
          console.log("ADDLEG", committee);
          $('#update1-left pre').append(JSON.stringify(committee, null, 2));
          listMembers(committee);
          console.log("AAA", committee);
        }
      //     }
      });

  });

};

function listMembers(committee) {
  console.log("listMembers: ", committee);
  _.each(committee.members, function (member, i) {
    if (member.role.toLowerCase() === "member") {
     member.role = null;
  } else if (member.role) {
      member.role = member.role.capitalize();
    }
    if (member.detail.party) {
     member.detail.party = member.detail.party.slice(0,1);
  }
  });

  var context = { cmte: committee,
    committeeHandle: "Yay."
  };

  var html = app.memberTemplate(context);
  $('#committee-list')
    .html(html);

  var memberDetail;
  $("[data-member-id]").on("click", function(e) {
    var ID = $(this).data("member-id");
    console.log("committee",committee.members);
    memberDetail = _.findWhere(committee.members, {leg_id: ID});
    console.log("findwhere");
    memberDetailFunction(memberDetail);
  });
}

function memberDetailFunction(mDetail){
  var memberContext = {
    members: mDetail instanceof Array ? mDetail : [mDetail]
  };
  // console.log("memberContext: ", memberContext);
  var htmlDetail = app.memberDetail(memberContext);
//  var htmlDetail = templateDetail(memberContext);
  if (memberContext.members.length>0) {
    // console.log("length > 1", memberContext.members.length);
    $('#member-detail').html(htmlDetail);
  } else {
    $('#member-detail').html('<p>Click a committee member<br />for detail. <br />Click the <i class="fa fa-link"></i> icon to visit the committee website. (It will open in a new window.) </p>');
  }
}


$(document.body).on("click", "[data-cmte-id]",function(e) {
  e.preventDefault();
  var committee_id = $(this).data("cmte-id");
  console.log('data-committee', committee_id);
  $(this).parent().parent()
    .css('left', '-99999px')
    .removeClass("open");
  getCommitteeDetail(committee_id);
});


// http://css-tricks.com/snippets/javascript/get-url-variables/
function getQueryVariable(variable) {
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
    if(pair[0] == variable){return pair[1];}
  }
  return(false);
}


var app = {};
console.log("app", app);

function init() {
  var sourceMembers = $("#committee-member-template")
    .html();
  app.memberTemplate = Handlebars.compile(sourceMembers);

  var sourceMemberDetail = $("#committee-member-detail-template")
    .html();
  app.memberDetail = Handlebars.compile(sourceMemberDetail);
}

String.prototype.capitalize = function(){ return this.replace( /(^|\s)[a-z]/g , function(m){ return m.toUpperCase(); }); };

init();
