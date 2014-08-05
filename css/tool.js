var fs = require('fs');
var $ = require('jQuery');
function h(fn) {
    return fn.toString().split('\n').slice(1,-1).join('\n') + '\n'
}

fs.readFile('./layout.css','utf8',function(err,data){
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
      if(err)console.log(err);
      console.log('ok');
    });
  });
});
// try{
// 	str="<p>abcdefg</p><p>abcdefghijkl</p>";
//
// 	re1=str.match(/<p>[\W\w]+?<\/p>/ig);
// 	console.log("非贪婪模式:\r\n\r\n１："+re1[0]+"\r\n２："+re1[1]);
//
// 	re1=str.match(/<p>[\W\w]+<\/p>/ig);
// 	console.log("贪婪模式:\r\n\r\n"+re1);
//
// 	re1=str.match(/<p>(.+?)<\/p>/i);
// 	console.log("非贪婪模式，且不要标记:\r\n\r\n１："+re1[1]);
//
// 	re1=str.match(/<p>(.+)<\/p>/i);
// 	console.log("贪婪模式，且不要标记:\r\n\r\n"+re1[1]);
// }catch(e){
// 	console.log(e.description)
// }

//
// var body = /<body>(.*?)<\/body>/g.exec(html)[1];
// var gReg = /<div\s?\w+(grids)+.*?>.+?(\<\/div\>)/g;

// function getGrids(){
//   var ln = html.match(gReg).length;
//   var g = body.match(gReg);
//   var grids = [];
//   for(var i=0;i<ln;i++){
//     grids[i] = g.match(//);
//   }
//   return grids;
// }
// var n = self.find('.g-d').length;
// if(!!self.find('.auto-left').length){
//   console.log('.auto-left{margin-right:'+width*n+';}');
// }else if(!!self.find('.auto-right').length){
//   console.log('.auto-right{margin-left:'+width*n+';}');
// }else if(!!self.find('.auto-mid').length){
//   console.log('.auto-mid{margin-left:'+width*n+';}');
// }
