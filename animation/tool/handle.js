var fs = require('fs');
var obj = require('./object');
var o = obj('../css/animation.css');
for(var name in o){
    var element = '".' + name + '"';
    var timer = o[name][0];
    var animate = o[name][1];
    var code ='';

    var reverse = [];
    var raw = [];
    var ln = animate.length;
    var rTime = [];

    var delay = 0;
    var timing ='';
    var fn = '';
    var count = 0;
    if(timer.delay)delay = timer.delay;
    if(timer.timing)timing = timer.timing=='linear'?',"linear"':',"swing"';
    if(timer.count)count = timer.count=='infinite'?'"inf"':timer.count;

    for(var i=0;i<animate.length;i++){
        var width = 0;
        var height = 0;

        raw[i] = animate[i];
        var ani = animate[i];
        if(ani.sX){
            code = 'var w'+i+'=$('+element+').width()*'+ani.sX+';\r';
            code += 'var f'+i+'=$('+element+').css("fontSize")*'+ani.sX+';\r';
            ani.width = 'w'+i;
            ani.fontSize = 'f'+i;
            delete ani.sX;
        }
        if(ani.sY){
            code += 'var h'+i+'=$('+element+').height()*'+ani.sY+';\r';
            ani.height = 'h'+i;
            delete ani.sY;
        }
    }

    if(!!count){
        code += 'var count='+count+';\r';
        reverse = animate.reverse();
        reverse.shift();
        animate = raw.concat(reverse);
        code += 'function inf(){';
    }

    for(var i=0;i<animate.length;i++){
        var ani = animate[i];
        var time = timer.duration * ani.percent;

        if(ln!==animate.length && i>ln-1){
            time = timer.duration * animate[--ln].percent;
        }

        var n = Object.keys(ani);
        var codeJ = '';
        if(i==0){
            codeJ = '$('+element+').';
        };
        codeJ += 'animate({';
        for(var k=1;k<n.length;k++){
            codeJ += n[k]+':'+ani[n[k]];
            if(k!==n.length-1)codeJ += ',';
        }
        if(!!count && i==animate.length-1)fn = ',function(){inf()}';
        codeJ += '},'+time+timing+fn+')';
        if(i!==animate.length-1)codeJ += '.\r';
        code += codeJ;
    }
    if(!!count){
        code += '};setTimeout(function(){inf()},'+timer.delay+');'
    }
    fs.writeFile('../js/test.js',code,function(err){console.log(err)})
    // console.log(animate);
    // console.log(timer);
};
