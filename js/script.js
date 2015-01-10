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

      $('#update pre').html(JSON.stringify( sortedLowerCommittees, null, 2));
      $('#update2 pre').html(JSON.stringify(sortedUpperCommittees, null,2));
//        $('pre').html(upperCommitteeNameAndID);
      var sortedUpperOutput = "";
        $.each(sortedUpperCommittees, function(key, val) {
        sortedUpperOutput += '<li><a href="#"  data-committee="' + val.id +'">' + val.committee + '</a></li>';
      });
      var sortedLowerOutput = "";
        $.each(sortedLowerCommittees, function(key, val) {
        sortedLowerOutput += '<li><a href="#"  data-committee="' + val.id +'">' + val.committee + '</a></li>';
      });

      $('ul#tinyDropUpper').prepend(sortedUpperOutput);
      $('ul#tinyDropLower').prepend(sortedLowerOutput);
    })
};

var drawMap= function (committee) {
  console.log(committee);
  var committeeRequest = $.ajax({
    dataType: "json",
    url: "http://openstates.org/api/v1/committees/" + committee,
    data: {
      apikey: "9e3e71730ae34e1ebbf4dd0e1c346c07"
    }
  }).done(function(committee){
      console.log("Committee", committee);
      console.log(committee.members);
      leg_id_array = _.pluck(committee.members, 'leg_id');
      console.log(leg_id_array);
      $('#update').html(committee);
    });
};


//$("[data-committee]").on("click", function(e) {
//  e.preventDefault();
//  //console.log($(this));
//  var committee = $(this).data("committee");
////  console.log ('committee', committee);
//  $(this).parent().parent()
//    .css('left', '-99999px')
//    .removeClass("open");
//  drawMap(committee);

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
