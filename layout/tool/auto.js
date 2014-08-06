var fs = require('fs');
var $ = require('jQuery');

fs.readFile('../css/layout.css','utf8',function(err,data){
  if(err)throw err;
  var css = data.replace(/[\t\r\n]/g,'');
  var guDing = /\.g\-d\{(.+)\}\.+?/.exec(css)[1].match(/(\d+?)px/);
  var width = guDing[1];

  fs.readFile('../html/layout.html','utf8',function(err,data){
    var html = data.replace(/[\t\r\n]/g,'').replace(/\<\!\-\-(.*?)\-\-\>/g,'');
    var base = ".auto-d-right{float:right;position:absolute;top:0;right:0;}";
    var cssText = base + '.g-d{width:'+width+'px;float:left;}.grids{position:relative}';

    $('.grids',html).each(function(i){
      var self = $(this);
      self.find('.auto').each(function(i){
        var self = $(this);
        var classList = self.attr('class').split(' ');
        var cssed = {};
        $.each(classList,function(i,v){
          var match = v.match(/(right|left|mid)\-(\d)/);
          if(!match)return;
          if(cssed[match[0]])return;
          cssed[match[0]] = true;
          if(match[1] == 'left'){
            cssText += '.'+match[0]+'{margin-right:'+width*(+match[2])+';}';
          }else if(match[1] == 'right'){
            cssText += '.'+match[0]+'{margin-left:'+width*(+match[2])+';}';
          }else if(match[1] == 'mid'){
            cssText += '.'+match[0]+'{margin:0 '+width*(+match[2])+';}';
          }
        });
      });
    });
    fs.writeFile('../css/ie/layout.css',cssText,function(err){
      if(err)throw err;
      console.log('ok');
    });
  });
});
