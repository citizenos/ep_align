var eejs = require('ep_etherpad-lite/node/eejs/');
var Changeset = require("ep_etherpad-lite/static/js/Changeset");
var Security = require('ep_etherpad-lite/static/js/security');

function getInlineStyle(header) {
 // TODO!
  switch (header) {
  case "h1":
    return "font-size: 2.0em;line-height: 120%;";
    break;
  case "h2":
    return "font-size: 1.5em;line-height: 120%;";
    break;
  case "h3":
    return "font-size: 1.17em;line-height: 120%;";
    break;
  case "h4":
    return "line-height: 120%;";
    break;
  case "h5":
    return "font-size: 0.83em;line-height: 120%;";
    break;
  case "h6":
    return "font-size: 0.75em;line-height: 120%;";
    break;
  case "code":
    return "font-family: monospace";
  }

  return "";
}
// line, apool,attribLine,text
exports.getLineHTMLForExport = function (hook, context) {
  var alignment = _analyzeLine(context.attribLine, context.apool);
  if (alignment) {
    context.lineContent = "<p style='text-align:" + alignment + "'>" + Security.escapeHTML(context.text.substring(1)) + "</p>";
    return "<p style='text-align:" + alignment + "'>" + Security.escapeHTML(context.text.substring(1)) + "</p>";
  }
}

function _analyzeLine(alineAttrs, apool) {
  var alignment = null;
  if (alineAttrs) {
    var opIter = Changeset.opIterator(alineAttrs);
    if (opIter.hasNext()) {
      var op = opIter.next();
      alignment = Changeset.opAttributeValue(op, 'align', apool);
    }
  }
  return alignment;
}


exports.padInitToolbar = function (hook_name, args) {
    var toolbar = args.toolbar;

    var alignLeftButton = toolbar.button({
        command: 'alignLeft',
        localizationId: 'ep_align.toolbar.left.title',
        class: "buttonicon buttonicon-align-left ep_align ep_align_left"
    });

    var alignCenterButton = toolbar.button({
        command: 'alignCenter',
        localizationId: 'ep_align.toolbar.middle.title',
        class: "buttonicon buttonicon-align-center ep_align ep_align_center"
    });

    var alignJustifyButton = toolbar.button({
        command: 'alignJustify',
        localizationId: 'ep_align.toolbar.justify.title',
        class: "buttonicon buttonicon-align-justify ep_align ep_align_justify"
    });

    var alignRightButton = toolbar.button({
        command: 'alignRight',
        localizationId: 'ep_align.toolbar.right.title',
        class: "buttonicon buttonicon-align-right ep_align ep_align_right"
    });

    toolbar.registerButton('alignLeft', alignLeftButton);
    toolbar.registerButton('alignCenter', alignCenterButton);
    toolbar.registerButton('alignJustify', alignJustifyButton);
    toolbar.registerButton('alignRight', alignRightButton);
};
