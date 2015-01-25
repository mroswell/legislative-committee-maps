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

 //     $('#update-left pre').html(JSON.stringify(sortedLowerCommittees, null, 2));
 //     $('#update-right pre').html(JSON.stringify(sortedUpperCommittees, null,2));
//        $('pre').html(upperCommitteeNameAndID);
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
//      active: true,
      apikey: "9e3e71730ae34e1ebbf4dd0e1c346c07"
    }
  }).done(function(memberDetail) {
        member.detail = memberDetail;
        counter++;
        if (counter === committee.members.length) {
          console.log("ADDLEG", committee);
          $('#update1-left pre').append(JSON.stringify(committee, null, 2));
          listMembers(committee);
          console.log("AAA", committee);

        }
      //     }
      });

  });

};

function listMembersPLACEHOLDER(committee) {
  console.log("YOU ARE HERE");
}
function listMembers(committee) {
  console.log("listMembers: ", committee);

  var context = { cmte: committee,
//  committee_abbrev: committee.results[0].committee_id,
//  committee_name: committee.results[0].name,
//  committee_results: committee.results[0],
//  committee_members: committee.results[0].members[0].legislator,
//  sorted_members: sortedMemberNames,
//  first_name: committee.results[0].members[0].legislator.first_name,
//  title: committee.results[0].members[0].title
    committeeHandle: "Yay."
  };

  var html = app.memberTemplate(context);
  $('#committee-list')
    .html(html);
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

  console.log("init");
  var sourceMembers = $("#committee-member-template")
    .html();
  app.memberTemplate = Handlebars.compile(sourceMembers);
  console.log(app);


}

init();
