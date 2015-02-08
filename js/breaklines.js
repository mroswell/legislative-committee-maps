var Handlebars = require("handlebars");

Handlebars.registerHelper('breaklines', function(text) {
  text = Handlebars.Utils.escapeExpression(text);
  //some legislators, such as VAL000157 have successive newlines in the offices.address fields
  text = text.replace(/(\n ?\n)/gm, '\n');
  //replace "\n" with "<br />"
  text = text.replace(/(\r\n|\n|\r)/gm, '<br />');
  return new Handlebars.SafeString(text);
});