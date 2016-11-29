this["MyApp"] = this["MyApp"] || {};
this["MyApp"]["templates"] = this["MyApp"]["templates"] || {};
this["MyApp"]["templates"]["menu"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, options, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", buffer = 
  "    <li class=\"dropdown-header\">"
    + container.escapeExpression(((helper = (helper = helpers.type || (depth0 != null ? depth0.type : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"type","hash":{},"data":data}) : helper)))
    + "</li>\n";
  stack1 = ((helper = (helper = helpers.topics || (depth0 != null ? depth0.topics : depth0)) != null ? helper : alias2),(options={"name":"topics","hash":{},"fn":container.program(2, data, 0, blockParams, depths),"inverse":container.noop,"data":data}),(typeof helper === alias3 ? helper.call(alias1,options) : helper));
  if (!helpers.topics) { stack1 = helpers.blockHelperMissing.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  return buffer + "    <li role=\"separator\" class=\"divider\"></li>\n";
},"2":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var helper, alias1=container.escapeExpression, alias2=depth0 != null ? depth0 : {}, alias3=helpers.helperMissing, alias4="function";

  return "        <li><a href=\"javascript:void(0);\" class=\"jsTopicToWidget\" onclick=\"fnctCreateWidget('"
    + alias1(container.lambda((depths[1] != null ? depths[1].type : depths[1]), depth0))
    + "','"
    + alias1(((helper = (helper = helpers.topic || (depth0 != null ? depth0.topic : depth0)) != null ? helper : alias3),(typeof helper === alias4 ? helper.call(alias2,{"name":"topic","hash":{},"data":data}) : helper)))
    + "')\">"
    + alias1(((helper = (helper = helpers.topic || (depth0 != null ? depth0.topic : depth0)) != null ? helper : alias3),(typeof helper === alias4 ? helper.call(alias2,{"name":"topic","hash":{},"data":data}) : helper)))
    + "</a></li>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, options, buffer = "";

  stack1 = ((helper = (helper = helpers.types || (depth0 != null ? depth0.types : depth0)) != null ? helper : helpers.helperMissing),(options={"name":"types","hash":{},"fn":container.program(1, data, 0, blockParams, depths),"inverse":container.noop,"data":data}),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},options) : helper));
  if (!helpers.types) { stack1 = helpers.blockHelperMissing.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  return buffer;
},"useData":true,"useDepths":true});