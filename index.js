var eejs = require('ep_etherpad-lite/node/eejs/');
var Changeset = require("ep_etherpad-lite/static/js/Changeset");
var Security = require('ep_etherpad-lite/static/js/security');

// line, apool,attribLine,text
exports.getLineHTMLForExport = function (hook, context) {
  var alignment = _analyzeLine(context.attribLine, context.apool, 'align');
  if (alignment) {
    context.lineContent = "<" + alignment + " >" + context.lineContent + "</" + alignment + ">";
    return context.lineContent;
  }
}

function _analyzeLine(alineAttrs, apool, attrName) {
  var alignment = null;
  if (alineAttrs) {
    var opIter = Changeset.opIterator(alineAttrs);
    if (opIter.hasNext()) {
      var op = opIter.next();
      alignment = Changeset.opAttributeValue(op, attrName, apool);
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
