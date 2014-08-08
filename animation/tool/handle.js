var fs = require('fs');
var obj = require('./object');
var o = obj('../css/animation.css');
var codes = '';

function _reverse(ary){
    var raw = [];
    var raw2 = [];
    var index = ary.length;
    for(var i=0;i<ary.length;i++){
        raw[--index] = ary[i];
    }
    raw.shift();
    raw2 = ary.concat(raw);
    return raw2;
}

var handle = function(name,o){
    var element = '".' + name + '"';
    var nAmE = name.replace(/\-(\S+?)/,function(a,s){return s.toUpperCase()});
    var timer = o[name][0];
    var animate = o[name][1];

    var direction = timer.direction;
    var anm = [];
    var cN = nAmE+'Count';
    var sN = nAmE+'Ele';
    var code = '';

    var reverse = [];
    var raw = [];
    var ln = animate.length;
    var rTime = [];

    var oOrg = {};
    var org = '';
    var orgFn = '';

    var delay = 0;
    var timing ='';
    var fn = '';
    var count = 1;
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

    if(!!direction){
        anm = _reverse(animate);
    }else{
        anm = raw;
    }
    code = 'var '+cN+'='+count+';function '+nAmE+'(){' + code;

    for(var i=0;i<anm.length;i++){
        var ani = anm[i];
        var n = Object.keys(ani);
        for(var k=1;k<n.length;k++){
            if(!oOrg[n[k]])oOrg[n[k]] = 'var '+nAmE+'_'+n[k]+'='+sN+'.css("'+n[k]+'");\r';
        }
    }
    var na = Object.keys(oOrg);
    for(var n=0;n<na.length;n++){
        org+=oOrg[na[n]];
    }
    code = 'var '+ sN +'=$('+element+');\r'+ org + code;

    orgFn+='$('+element+').css({';
    for(var n=0;n<na.length;n++){
        orgFn += na[n]+':'+nAmE+'_'+na[n];
        if(n!==na.length-1)orgFn+=','
    }
    orgFn+='});';

    code += '\rfunction inf(){';
    code += 'if(!'+cN+'){'+orgFn+'return;}\r';
    code += 'if(typeof '+cN+'=="number")'+cN+'--;\r';


    for(var i=0;i<anm.length;i++){
        var ani = anm[i];
        var time = timer.duration * ani.percent;

        if(ln!==anm.length && i>ln-1){
            time = timer.duration * anm[--ln].percent;
        }

        var n = Object.keys(ani);
        var codeJ = '';
        if(i==0){
            codeJ = sN+'.';
        };
        codeJ += 'animate({';
        for(var k=1;k<n.length;k++){
            codeJ += n[k]+':'+ani[n[k]];
            if(k!==n.length-1)codeJ += ',';
        }
        if(i==anm.length-1)fn = ',function(){inf()}';
        codeJ += '},'+time+timing+fn+')';
        if(i!==anm.length-1)codeJ += '.\r';
        code += codeJ;
    }

    code += '};setTimeout(function(){inf()},'+timer.delay+');}\r';
    return code;
}
for(var name in o){
    codes += handle(name,o);
    // console.log(animate);
    // console.log(timer);
};
fs.writeFile('../js/test.js',codes,function(err){console.log(err)})
