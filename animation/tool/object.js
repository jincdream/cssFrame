var fs = require('fs');
module.exports = function(path){
    var Obj = {};
    var obj = [];
    var data = fs.readFileSync(path,'utf8');

    (function handle(data){
        var css = data.replace(/[\t\r\n]/g,'');
        var animation = css.match(/\.ani\-.*?\{.*?animation:\s?(.+?)\;.+?\}/);
        var ani = animation[1].split(' ');
        var timer = {};

        var key = css.match(/@keyframes\s?(\D+?)\s?\{\s?(.+?)\}[\.\@]/)[2].replace(/\s\s+/g,'');
        var key2 = key.replace(/\}/g,'');
        var key3 = '';
        var percent = [];

        if(ani[5] && ani[5]==='alternate')timer.direction = true;
        if(ani[4])timer.count = ani[4];
        if(ani[3])timer.delay = +ani[3].replace('s','') * 1000;
        if(ani[2])timer.timing = ani[2];
        if(ani[1])timer.duration = +ani[1].replace('s','') * 1000;

        if(/from|to/.test(key)){
            key3 = key2.split(/from\s*?\s\{|to\s*?\s\{/g).slice(1);
            percent = ['0%','100%'];
        }else{
            key3 = key2.split(/\d+?\%\s*?\s\{/g).slice(1);
            percent = key2.match(/(\d+?)\%/g);
        }

        for(var i=0;i<percent.length;i++){
            var m = {};
            percent[i] = (+percent[i].replace('%',''))/100;
            key3[i] = key3[i].split(';');
            key3[i].pop();
            m.percent = percent[i];

            var k = key3[i];
            for(var j=0;j<k.length;j++){
                var reg = /\((.+?)\)/;
                var kk = k[j];
                var n = kk.indexOf(':');
                var name = kk.slice(0,n);
                var val = kk.slice(n+1);
                var left = 0;
                var top = 0;
                var sX = 1;
                var sY = 1;
                var wait = val.match(reg);


                if(/scale/.test(val)){
                    wait = wait[1];
                    if(/X/.test(val)){
                        sX = wait;
                    }else if(/Y/.test(val)){
                        sY = wait;
                    }else{
                        sX = wait.split(',')[0];
                        sY = wait.split(',')[1];
                    }
                    m.sX = sX;
                    m.sY = sY;
                }else if(/translate/.test(val)){
                    wait = wait[1];
                    if(/X/.test(val)){
                        left = wait;
                    }else if(/Y/.test(val)){
                        top = wait;
                    }else{
                        left = wait.split(',')[0];
                        top = wait.split(',')[1];
                    }
                    m.left ='"'+left+'"';
                    m.top = '"'+top+'"';
                }else{
                    m[name] = '"'+val+'"';
                }
            }
            obj[i] = m;
        }
        Obj[ani[0]] = [timer];
        Obj[ani[0]].push(obj);
    })(data);
    return Obj;
}
