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
//      $('pre').html(JSON.stringify(upperCommittees, null, 2));
//      for (committeeObj in upperCommittees){
//        console.log(upperCommittees[committeeObj].committee, " - ", upperCommittees[committeeObj].id)
//      }
      var upperOutput = "";
        $.each(upperCommittees, function(key, val) {
        upperOutput += '<li><a href="#"  data-committee="' + val.id +'">' + val.committee + '</a></li>';
      });
      var lowerOutput = "";
        $.each(lowerCommittees, function(key, val) {
        lowerOutput += '<li><a href="#"  data-committee="' + val.id +'">' + val.committee + '</a></li>';
      });
      $('ul#tinyDropUpper').prepend(upperOutput);
      $('ul#tinyDropLower').prepend(lowerOutput);

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
