// Get names of the committies
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

      $('#update-left pre').html(JSON.stringify( sortedLowerCommittees, null, 2));
      $('#update-right pre').html(JSON.stringify(sortedUpperCommittees, null,2));
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
var drawMap= function (committee) {
  console.log(committee);
  var committeeRequest = $.ajax({
    dataType: "json",
    url: "http://openstates.org/api/v1/committees/" + committee,
    data: {
      apikey: "9e3e71730ae34e1ebbf4dd0e1c346c07"
    }
  }).done(function(committee){
      console.log('Now in drawMap function')
      console.log("Committee", committee);
      console.log(committee.members);
      leg_id_array = _.pluck(committee.members, 'leg_id');
      console.log(leg_id_array);
//      $('#update').html(committee);
      for (i in leg_id_array) {
        addLegislators(leg_id_array[i], committee);
      }
    });
};

// Get legislator detail
var addLegislators = function(leg_id, committee) {
//  for (i in leg_id) {
//    $('#update1-left pre').append(leg_id);
  var memberListRequest = $.ajax({
    dataType: "json",
    url: "http://openstates.org/api/v1/legislators/" + leg_id,
    data: {
//      state: state,
      active: true,
      apikey: "9e3e71730ae34e1ebbf4dd0e1c346c07"
    }
  }).done(function(memberDetail) {
      console.log("member detail", memberDetail, committee.members);
      for (i in committee.members) {
        if (committee.members[i].leg_id === leg_id ) {
        console.log (leg_id, committee.members[i].name)
        committee.members[i].detail = memberDetail;
        console.log(committee.members);
        }
      }
      $('#update1-left pre').html(JSON.stringify(committee.members, null, 2));
    })
    };
$(document.body).on("click", "[data-cmte-id]",function(e) {
  e.preventDefault();
  console.log($(this));
//  var committee_id = $(this).attr("data-cmte-id");
  var committee_id = $(this).data("cmte-id");
  console.log('data-committee', committee_id);
  $(this).parent().parent()
    .css('left', '-99999px')
    .removeClass("open");
  drawMap(committee_id);
});


// http://css-tricks.com/snippets/javascript/get-url-variables/
function getQueryVariable(variable)
{
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
    if(pair[0] == variable){return pair[1];}
  }
  return(false);
}
