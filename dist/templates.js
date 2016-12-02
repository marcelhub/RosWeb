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
    var helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "        <li><a href=\"javascript:void(0);\" class=\"jsTopicToWidget\" onclick=\"fnctCreateWidget('"
    + alias4(((helper = (helper = helpers.topic || (depth0 != null ? depth0.topic : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"topic","hash":{},"data":data}) : helper)))
    + "','"
    + alias4(container.lambda((depths[1] != null ? depths[1].type : depths[1]), depth0))
    + "')\">"
    + alias4(((helper = (helper = helpers.topic || (depth0 != null ? depth0.topic : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"topic","hash":{},"data":data}) : helper)))
    + "</a></li>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, options, buffer = "";

  stack1 = ((helper = (helper = helpers.types || (depth0 != null ? depth0.types : depth0)) != null ? helper : helpers.helperMissing),(options={"name":"types","hash":{},"fn":container.program(1, data, 0, blockParams, depths),"inverse":container.noop,"data":data}),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},options) : helper));
  if (!helpers.types) { stack1 = helpers.blockHelperMissing.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  return buffer;
},"useData":true,"useDepths":true});
this["MyApp"]["templates"]["widgetWrapper"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<div class=\"jsWidgetWrapper\" data-widget-id=\""
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" style=\"left:"
    + alias4(((helper = (helper = helpers.posX || (depth0 != null ? depth0.posX : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"posX","hash":{},"data":data}) : helper)))
    + "px;top:"
    + alias4(((helper = (helper = helpers.posY || (depth0 != null ? depth0.posY : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"posY","hash":{},"data":data}) : helper)))
    + "px;width:"
    + alias4(((helper = (helper = helpers.width || (depth0 != null ? depth0.width : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"width","hash":{},"data":data}) : helper)))
    + "px;height:"
    + alias4(((helper = (helper = helpers.height || (depth0 != null ? depth0.height : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"height","hash":{},"data":data}) : helper)))
    + "px;position:absolute;\">\n\n</div>";
},"useData":true});
this["MyApp"]["templates"]["index"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<meta  data-min-height=\"480\" data-min-width=\"640\" data-pos-x=\"300\" data-pos-y=\"300\">\n<img id=\"tests\" class=\"test\" src=\"http://192.168.1.97:8080/stream?topic=/axis/image_raw\"></img>\n";
},"useData":true});