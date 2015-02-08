/*
Loads and compiles templates for the app
*/

var $ = require("jquery");
var Handlebars = require("handlebars");
//Handlebars extensions
require("./breaklines");

module.exports = {
  member: Handlebars.compile( $("#committee-member-template").html() ),
  detail: Handlebars.compile( $("#committee-member-detail-template").html() ),
  list: Handlebars.compile( $("#committee-list-template").html() )
};