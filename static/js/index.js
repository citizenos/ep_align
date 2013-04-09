var _, $, jQuery;

var $ = require('ep_etherpad-lite/static/js/rjquery').$;
var _ = require('ep_etherpad-lite/static/js/underscore');
var alignClass = 'align';
var cssFiles = ['ep_align/static/css/editor.css'];

// All our tags are block elements, so we just return them.
var tags = ['left', 'center', 'right'];
var aceRegisterBlockElements = function(){
  return tags;
}

// Bind the event handler to the toolbar buttons
var postAceInit = function(hook, context){
  var hs = $('#align-selection');
  hs.on('change', function(){
    var value = $(this).val();
    var intValue = parseInt(value,10);
    if(!_.isNaN(intValue)){
      context.ace.callWithAce(function(ace){
        ace.ace_doInsertalign(intValue);
      },'insertalign' , true);
      hs.val("dummy");
    }
  })
};



// Our align attribute will result in a heaading:h1... :h6 class
function aceAttribsToClasses(hook, context){
  if(context.key == 'align'){
    return ['align:' + context.value ];
  }
}

// Here we convert the class align:h1 into a tag
var aceDomLineProcessLineAttributes = function(name, context){
  var cls = context.cls;
  var domline = context.domline;
  var alignType = /(?:^| )align:([A-Za-z0-9]*)/.exec(cls);
  var tagIndex;
  if (alignType) tagIndex = _.indexOf(tags, alignType[1]);
  if (tagIndex !== undefined && tagIndex >= 0){
    var tag = tags[tagIndex];
    var modifier = {
      preHtml: '<p style="width:100%;text-align:' + tag + '"><span>',
      postHtml: '</span></p>',
      processedMarker: true
    };
    return [modifier];
  }
  return [];
};

// Find out which lines are selected and assign them the align attribute.
// Passing a level >= 0 will set a align on the selected lines, level < 0 
// will remove it
function doInsertalign(level){
  var rep = this.rep,
    documentAttributeManager = this.documentAttributeManager;
  if (!(rep.selStart && rep.selEnd) || (level >= 0 && tags[level] === undefined))
  {
    return;
  }
  
  var firstLine, lastLine;
  
  firstLine = rep.selStart[0];
  lastLine = Math.max(firstLine, rep.selEnd[0] - ((rep.selEnd[1] === 0) ? 1 : 0));
  _(_.range(firstLine, lastLine + 1)).each(function(i){
    if(level >= 0){
      documentAttributeManager.setAttributeOnLine(i, 'align', tags[level]);
    }else{
      documentAttributeManager.removeAttributeOnLine(i, 'align');
    }
  });
}


// Once ace is initialized, we set ace_doInsertalign and bind it to the context
function aceInitialized(hook, context){
  var editorInfo = context.editorInfo;
  editorInfo.ace_doInsertalign = _(doInsertalign).bind(context);
}

function aceEditorCSS(){
  return cssFiles;
};

// Export all hooks
exports.aceRegisterBlockElements = aceRegisterBlockElements;
exports.aceInitialized = aceInitialized;
exports.postAceInit = postAceInit;
exports.aceDomLineProcessLineAttributes = aceDomLineProcessLineAttributes;
exports.aceAttribsToClasses = aceAttribsToClasses;
exports.aceEditorCSS = aceEditorCSS;
