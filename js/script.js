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
    });
};

$("[data-cmte-id]").on("click", function(e) {
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
