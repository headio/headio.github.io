var sound = (function(){
    var e_ = { };
    
    var bgm;
    var bgmplaying = false;
    var beaten_sounds = [];
    var endbgm;
    
    e_.SetBGM = function(path) {
        bgm = ult.audio.CreateAudio(path, {preload: true, loop: true, autoplay: true});
        bgmplaying = bgm.autoplay;
    };
    
    e_.PlayBGM = function() {
        try{
            if (bgm && !bgmplaying) {
                bgm.play();
                bgmplaying = true;
            }
        }catch(e){
            console.log(e.message)
        }
        
    };

    e_.ReplayBGM = function(){
        try{
            bgm.currentTime = 0;
            e_.PlayBGM();
        }catch(e){
            console.log(e.message);
        }
        
    }
    
    e_.PauseBGM = function() {
        try{
            if (bgm && bgmplaying) {
                bgm.pause();
                bgmplaying = false;
            }
        }catch(e){
            console.log(e.message)
        }
        
    };
    
    e_.AddBeatenSound = function(source) {
        beaten_sounds.push(ult.audio.CreateAudio(source));
    };
    
    e_.RandomPlayBeatenSound = function() {
        var randSound = beaten_sounds[ult.GetRandom(0, beaten_sounds.length)];
        randSound.play();
    };
    
    e_.PreloadEndMusic = function(source) {
        endbgm = ult.audio.CreateAudio(source, {preload: true, loop: true})
    }
    
    e_.PlayEndMusic = function() {
        endbgm.play();
    }
    
    return e_;
})();



var page1 = (function(){
    var e_ = { };
    
    var ani_playing = false;
    var beaten_status = false;
    var ani_class = [".boss"];
    var ani_interval;
    
    e_.Start = function() {
        $("#beat-button").click(function() {
            sound.PauseBGM();
            beat.startRound();
        });
        
    };
    
    Reset = function() {
        ani_playing = false;
        beaten_status = false;
        clearInterval(ani_interval);
    };
    
    return e_;
})();

var beat_boss1 = (function() {
    var e_ = { };
    
    var time_out = 50;
    var left_time = time_out;
    var game_timer = 0;
    var last_hand = 0; // 0 for left, 1 for right
    var beat_count = 0;
    var first_beat = true;
    var hp = 70;
    var parent = '#boss1 ';
    var beat_stage = [
        {min_count: 0, max_count: 10, boss_head: "boss-head-1", boss_body: "boss-body-1"},
        {min_count: 11, max_count: 20, boss_head: "boss-head-2", boss_body: "boss-body-2"},
        {min_count: 21, max_count: 30, boss_head: "boss-head-3", boss_body: "boss-body-3"},
        {min_count: 31, max_count: 40, boss_head: "boss-head-4", boss_body: "boss-body-3"},
        {min_count: 41, max_count: 50, boss_head: "boss-head-5", boss_body: "boss-body-4"},
        {min_count: 51, max_count: 60, boss_head: "boss-head-6", boss_body: "boss-body-4"},
        {min_count: 61, max_count: 999, boss_head: "boss-head-7", boss_body: "boss-body-5"}
    ];  
    var beat_text = [
        '叫你丫加班','叫你丫','工作多','没提成','人家休假我加班','房贷没还清','保险自己买',
        '好在不用交停车费','根本买不起车'
    ];
    var beat_timeout = 0;

    var BeatenOnce = function() {
        console.log("beat once");
        if (first_beat) {
            beat.timer.start(function(time){
                $(parent+'.top-time-wrap p').eq(0).text(time);
            });
            first_beat = false;
        }
        
        sound.RandomPlayBeatenSound();
        beat.SetBeatText(beat_text[beat_count%beat_text.length], $(parent+'.beat-text'));
        if (last_hand == 0) {
            RightBeatBoss();
        } else if (last_hand == 1) {
            LeftBeatBoss();
        }
        SetScore(beat_count, hp);
        SetBossWithStage();

        if ( beat_count === hp ){
            beat.timer.stop();
            setTimeout(function(){
                beat.startRound();
            }, 1000);
            $(this).unbind();
            $(parent+".beaten-area").unbind("touchstart");
        }
    };
    
    e_.Start = function() {

        $(parent+'.beat-count .count').text(hp);

        sound.ReplayBGM();
        
        setTimeout(function(){
            
            sound.PauseBGM();
            
            $(parent+'.round').hide();
            
            $(parent+".beaten-area").bind("touchstart", function(){
                BeatenOnce();
            });
        }, 4000);
        
    };

    var SetBossWithStage = function() {
        var stage_count = beat_stage.length;
        var stage_picked = { };
        var stage_getted = false;
        for (var i in beat_stage) {
            if (beat_count >= beat_stage[i].min_count && beat_count <= beat_stage[i].max_count) {
                stage_picked = beat_stage[i];
                stage_getted = true;
                break;
            }
        }
        if (stage_getted) {
            $(parent+".boss-body").attr("class", "boss-body");
            $(parent+".boss-head").attr("class", "boss-head");
            $(parent+".boss-body").addClass(stage_picked.boss_body);
            $(parent+".boss-head").addClass(stage_picked.boss_head);
        }
    };
    
    var LeftBeatBoss = function() {
        if (last_hand == 1) {
            ++beat_count;
            $(parent+".boss-head").hide();
            $(parent+".boss-beaten-right").hide();
            $(parent+".boss-beaten-left").show();
            clearTimeout(beat_timeout);
            beat_timeout = setTimeout(function() {
                $(parent+".boss-beaten-left").hide();
                $(parent+".boss-head").show();
            }, 400);
            
            last_hand = 0;
        }
    };
    
    var RightBeatBoss = function() {
        if (last_hand == 0) {
            ++beat_count;
            $(parent+".boss-head").hide();
            $(parent+".boss-beaten-left").hide();
            $(parent+".boss-beaten-right").show();
            clearTimeout(beat_timeout);
            beat_timeout = setTimeout(function() {
                $(parent+".boss-beaten-right").hide();
                $(parent+".boss-head").show();
            }, 400);
            
            last_hand = 1;
        }
    };

    var SetScore = function(count, hp) {
        var score = count/hp ,
            p = 100-Math.floor(score * 100);
        $(parent+".hp").css('width', p+'%');
        var l = '69', t = 69, left=l;
        left =  l - score*t;
        $(parent+".top-hp-wrap > span").css('left', left+'%');
        $(parent+".beat-count-wrap .count").text(hp-count);
        $(parent+".beat-count-wrap .beat-count-line").css('width' ,p+'%');
        if ( p===0 ){
            $(parent+".beat-count-wrap .beat-count-line").css('border','none');
        }
    };
    
    
    return e_;
})();

var beat_boss2 = (function() {
    var e_ = { };
    
    var time_out = 50;
    var left_time = time_out;
    var game_timer = 0;
    var last_hand = 0; // 0 for left, 1 for right
    var beat_count = 0;
    var first_beat = true;
    var hp = 80;
    var parent = '#boss2 ';
    var beat_stage = [
        {min_count: 0, max_count: 79, boss_head: "boss-head-1", boss_body: "boss-body-1"},
        {min_count: 80, max_count: 80, boss_head: "boss-head-2", boss_body: "boss-body-1"}
    ];
    var beat_text = [
        '改你妹的需求','抄袭你妹','节操呢','流氓','工作多','没提成','人家休假我加班','房贷没还清','保险自己买','好在不用交停车费','根本买不起车'
    ];
    var beat_timeout = 0;

    
    e_.Start = function() {


        $(parent+'.beat-count .count').text(hp);
        $(parent+'.top-time-wrap p').eq(0).text(beat.timer.use);
        
        sound.ReplayBGM();

        setTimeout(function(){

            sound.PauseBGM();

            $(parent+'.round').hide();

            $(parent+".beaten-area").bind("touchstart", function() {
                console.log("beat once");
                if (first_beat) {
                    beat.timer.start(function(time){
                        $(parent+'.top-time-wrap p').eq(0).text(time);
                    });
                    first_beat = false;
                }
                
                sound.RandomPlayBeatenSound();
                beat.SetBeatText(beat_text[beat_count%beat_text.length], $(parent+'.beat-text'));
                // if (last_hand == 0) {
                    RightBeatBoss();
                // } else if (last_hand == 1) {
                //     LeftBeatBoss();
                // }
                SetScore(beat_count, hp);console.log(beat_count)
                SetBossWithStage();

                if ( beat_count === hp ){
                    beat.timer.stop();
                    setTimeout(function(){
                        beat.startRound();
                    },1000);
                    $(this).unbind();
                    $(parent+".beaten-area").unbind("touchstart");
                }
                
            });
        }, 4000);
        
    };
    
    
    var SetBossWithStage = function() {
        var stage_count = beat_stage.length;
        var stage_picked = { };
        var stage_getted = false;
        for (var i in beat_stage) {
            if (beat_count >= beat_stage[i].min_count && beat_count <= beat_stage[i].max_count) {
                stage_picked = beat_stage[i];
                stage_getted = true;
                break;
            }
        }
        if (stage_getted) {
            $(parent+".boss-body").attr("class", "boss-body");
            $(parent+".boss-head").attr("class", "boss-head");
            $(parent+".boss-body").addClass(stage_picked.boss_body);
            $(parent+".boss-head").addClass(stage_picked.boss_head);
        }
    };
    
    var RightBeatBoss = function() {
        ++beat_count;
        
        $(parent+".boss-head").hide();
        $(parent+".boss-beaten-right").show();
        if (beat_timeout != 0) {
            clearTimeout(beat_timeout);
            beat_timeout = 0;
            $(parent+".boss-beaten-right").hide();
            $(parent+".boss-head").show();
            setTimeout(function(){
                $(parent+".boss-head").hide();
                $(parent+".boss-beaten-right").show();
            }, 100);
        }
        beat_timeout = setTimeout(function() {
            $(parent+".boss-beaten-right").hide();
            $(parent+".boss-head").show();
            beat_timeout = 0;
        }, 400);
            
        last_hand = 1;
    };

    var SetScore = function(count, hp) {
        var score = count/hp ,
            p = 100-Math.floor(score * 100);
        $(parent+".hp").css('width', p+'%');
        var l = '80', t = 72, left=l;
        left =  l - score*t;
        $(parent+".top-hp-wrap > span").css('left', left+'%');
        $(parent+".beat-count-wrap .count").text(hp-count);
        $(parent+".beat-count-wrap .beat-count-line").css('width' ,p+'%');
        if ( p===0 ){
            $(parent+".beat-count-wrap .beat-count-line").css('border','none');
        }
    };
    
    
    return e_;
})();

var beat_boss3 = (function() {
    var e_ = { };
    
    var time_out = 50;
    var left_time = time_out;
    var game_timer = 0;
    var last_hand = 1; // 0 for left, 1 for right
    var beat_count = 0;
    var first_beat = true;
    var hp = 100;
    var parent = '#boss3 ';
    var beat_stage = [
        {min_count: 0, max_count: 99, boss_head: "boss-head-1", boss_body: "boss-body-1"},
        {min_count: 100, max_count: 100, boss_head: "boss-head-2", boss_body: "boss-body-1"},
    ];
    var beat_text = [
        '装啥','说好的红包呢','上市又怎样','说好的5折呢','工作多','没提成','人家休假我加班','房贷没还清','保险自己买','好在不用交停车费','根本买不起车'
    ]
    var beat_timeout = 0;

    
    e_.Start = function() {


        $(parent+'.beat-count .count').text(hp);
        $(parent+'.top-time-wrap p').eq(0).text(beat.timer.use);

        sound.ReplayBGM();
        sound.PreloadEndMusic("res/end-bgm.mp3");

        setTimeout(function() {

            sound.PauseBGM();

            $(parent+'.round').hide();
        
            $(parent+".beaten-area").bind("touchstart", function() {
                if (first_beat) {
                    beat.timer.start(function(time){
                        $(parent+'.top-time-wrap p').eq(0).text(time);
                    });
                    first_beat = false;
                }
                
                sound.RandomPlayBeatenSound();
                beat.SetBeatText(beat_text[beat_count%beat_text.length], $(parent+'.beat-text'));
                // if (last_hand == 0) {
                    // RightBeatBoss();
                // } else if (last_hand == 1) {
                    LeftBeatBoss();
                // }
                SetScore(beat_count, hp);console.log(beat_count)
                SetBossWithStage();

                if ( beat_count === hp ){
                    beat.timer.stop();
                    setTimeout(function(){
                        beat.startRound();
                    },1000);
                    $(this).unbind();
                    $(parent+".beaten-area").unbind("touchstart");
                }
                
            });
        
        }, 4000);
    };
    
    
    var SetBossWithStage = function() {
        var stage_count = beat_stage.length;
        var stage_picked = { };
        var stage_getted = false;
        for (var i in beat_stage) {
            if (beat_count >= beat_stage[i].min_count && beat_count <= beat_stage[i].max_count) {
                stage_picked = beat_stage[i];
                stage_getted = true;
                break;
            }
        }
        if (stage_getted) {
            $(parent+".boss-body").attr("class", "boss-body");
            $(parent+".boss-head").attr("class", "boss-head");
            $(parent+".boss-body").addClass(stage_picked.boss_body);
            $(parent+".boss-head").addClass(stage_picked.boss_head);
        }
    };
    
    var LeftBeatBoss = function() {
        ++beat_count;
        $(parent+".boss-head").hide();
        $(parent+".boss-beaten-left").show();
        if (beat_timeout != 0) {
            clearTimeout(beat_timeout);
            beat_timeout = 0;
            $(parent+".boss-beaten-left").hide();
            $(parent+".boss-head").show();
            setTimeout(function(){
                $(parent+".boss-head").hide();
                $(parent+".boss-beaten-left").show();
            }, 100);
        }
        beat_timeout = setTimeout(function() {
            $(parent+".boss-beaten-left").hide();
            $(parent+".boss-head").show();
        }, 400);
        
        last_hand = 0;
    };

    var SetScore = function(count, hp) {
        var score = count/hp ,
            p = 100-Math.floor(score * 100);
        $(parent+".hp").css('width', p+'%');
        var l = '80', t = 72, left=l;
        left =  l - score*t;
        $(parent+".top-hp-wrap > span").css('left', left+'%');
        $(parent+".beat-count-wrap .count").text(hp-count);
        $(parent+".beat-count-wrap .beat-count-line").css('width' ,p+'%');
        if ( p===0 ){
            $(parent+".beat-count-wrap .beat-count-line").css('border','none');
        }
    };
    
    
    return e_;
})();

var beat_end = (function() {
    var e_ = { };
    
    var bgno = 0;
    var bgclass = ["end-bg-1", "end-bg-2"];
    var bgswitchInteval = 0;
    
    e_.Start = function() {
        sound.PlayEndMusic();
        document.title = "我使用了" + beat.timer.use + "秒三杀了老板，不服来战！";
        $('#usetime').text(beat.timer.use+'秒');
        $('#defeat').text( beat.defeat(beat.timer.use) );
        
        $("#share-button").bind("webkitAnimationEnd", function() {
            $("#share-text").show();
            
            $("#share-button-click-area").click(function() {
                $("#share-guide").show();
                setTimeout(function(){
                    $("#share-guide").click(function(){
                        $("#share-guide").hide();
                    });
                }, 1500);
            });
        });
        
        bgswitchInteval = setInterval(function() {
            var oldbgno = bgno;
            bgno = (bgno + 1) % bgclass.length;
            $("#end").removeClass(bgclass[oldbgno]);
            $("#end").addClass(bgclass[bgno]);
        }, 200);
    }; 

    return e_;
})();

var beat_ad = (function() {
    var e_ = {};
    
    e_.Start = function() {
        $("#challenge-now").click(function() {
            alert("开始玩游戏！")
        });
    }
    
    return e_;
})();

var wxWrapper = (function() {
    var e_ = {};
    
    var para = $.extend({
        title : document.title,
         text : document.title,
          url : document.location.href,
          img : ""
    }, para);
    
    var OnBridgeReady = function() {
        WeixinJSBridge.call('hideOptionMenu');
        //微信朋友圈
        WeixinJSBridge.on("menu:share:timeline", function(){
            WeixinJSBridge.invoke("shareTimeline", {
                img_url : para.img,
                   link : para.url,
                   desc : para.text,
                  title : para.text
            }, function (res) {
                alert("share callback");
                if (res.err_msg == "share_timeline:ok") {
                    alert("ok")
                    //分享成功
                }
            });
        });
        /*
        //微信朋友
        WeixinJSBridge.on("menu:share:appmessage", function(){
            WeixinJSBridge.invoke("sendAppMessage", {
                img_url : para.img,
                   link : para.url,
                   desc : para.text,
                  title : para.title
            });
        });
        */
    };
    
    e_.Init = function() {
    };
    return e_;
})();

$(document).ready(function() {
    //FastClick.attach(document.body);
    sound.SetBGM("res/bgm.mp3");
    sound.AddBeatenSound("res/beat1.mp3");
    sound.AddBeatenSound("res/beat2.mp3");
    page1.Start();
});

window.onload = function(){
    loadImg('res/1.png');
    loadImg('res/2.png');
    loadImg('res/3.png');
    loadImg('res/head-1.png');
    loadImg('res/body-1.png');
    loadImg('res/beaten-head-left.png');
    loadImg('res/beaten-head-right.png');
    loadImg('res/hand-left.png');
    loadImg('res/hand-right.png');
    loadImg('res/beaten-effect-left.png');
    loadImg('res/beaten-effect-right.png');
    loadImg('res/head-2.png');
    loadImg('res/body-2.png');
    loadImg('res/head-3.png');
    loadImg('res/body-3.png');
    loadImg('res/head-4.png');
    loadImg('res/body-4.png');
    loadImg('res/head-5.png');
    loadImg('res/body-5.png');
    loadImg('res/head-6.png');
    loadImg('res/head-7.png');
    loadImg('res/boss2-beaten.png');
    loadImg('res/boss2-beating.png');
    loadImg('res/boss2-body.png');
    loadImg('res/boss2-head.png');
    loadImg('res/boss3-beaten.png');
    loadImg('res/boss3-beating.png');
    loadImg('res/boss3-body.png');
    loadImg('res/boss3-head.png');
    loadImg('res/boss-beaten.png');
    loadImg('res/boss-normal.png');
    loadImg('res/end_boss1.png');
    loadImg('res/end_boss2.png');
    loadImg('res/end_boss3.png');
    loadImg('res/end_text.png');
    loadImg('res/share-button.png');
    loadImg('res/share-bg-1.png');
    loadImg('res/share-bg-2.png');
    loadImg('res/share-boss.png');
    loadImg('res/share-logo.png');
}

var loadImg = function(url){
    var img = [] , 
        loaded = true ,
        load = function(url){
            url && img.push(url);
            if ( img.length ){
                var i = new Image();
                i.src = img[0];
                i.onload = function(){
                    img.shift();
                    load();
                }
                i.onerror = function(e){
                    console.log(e.message)
                }
            }
        };
    return load;
}();

(function(window){
    var beat = {}, tid, timer;

    beat.startRound = function(){
        var round = 1;
        return function(){
            var func = 'boss'+round;
            if(round===4){
                func = 'end';
            }
            $('.page.show').removeClass('show');
            $('#'+func).addClass('show');
            window['beat_'+func].Start();
            round++;
        }
    }();

    timer = function(){
        this.use = 0.00;
    };
    timer.prototype.start = function(callback){
        var _this = this;
        tid = setInterval(function(){
            _this.use = FloatAdd( _this.use, 0.01 ) ;
            var time = (_this.use+'').replace( /\.([\d]*)/ ,function(m){
                return m.length === 2 ? m+'0' : m;
            });
            callback(time);
        },10);
    }
    timer.prototype.stop = function(){
        clearTimeout(tid);
    }
    beat.timer = new timer();

    function FloatAdd(arg1, arg2){
        var r1, r2, m, c;
        try {
            r1 = arg1.toString().split(".")[1].length;
        }
        catch (e) {
            r1 = 0;
        }
        try {
            r2 = arg2.toString().split(".")[1].length;
        }
        catch (e) {
            r2 = 0;
        }
        c = Math.abs(r1 - r2);
        m = Math.pow(10, Math.max(r1, r2));
        if (c > 0) {
            var cm = Math.pow(10, c);
            if (r1 > r2) {
                arg1 = Number(arg1.toString().replace(".", ""));
                arg2 = Number(arg2.toString().replace(".", "")) * cm;
            } else {
                arg1 = Number(arg1.toString().replace(".", "")) * cm;
                arg2 = Number(arg2.toString().replace(".", ""));
            }
        } else {
            arg1 = Number(arg1.toString().replace(".", ""));
            arg2 = Number(arg2.toString().replace(".", ""));
        }
        return (arg1 + arg2) / m;
    }

    beat.defeat = function(time){
        var tempTime = Math.ceil(time);
        if ( tempTime <= 8 ){
            return '99%';
        } else if ( tempTime > 100 ){
            return '0%';
        }else{
            return (107 - tempTime) + '%';
        }
    }

    beat.SetBeatText = function(text, node){
        var show = false;
        return function(text, node){
            if ( !show ){
                show = true;
                // node.removeClass('beat-text-hide');
                node.text( text );
                node.addClass('beat-text-show');
                setTimeout(function(){
                    node.removeClass('beat-text-show');
                    // node.addClass( 'beat-text-hide' );
                    show = false;
                }, 800);
            }
        }
    }()

    window.beat = beat;

})(window, undefined);

 function getURL(){  
    var curWwwPath = window.document.location.href;  
    //获取主机地址之后的目录，如： cis/website/meun.htm  
    var pathName = window.document.location.pathname;  
    var pos = curWwwPath.indexOf(pathName); //获取主机地址，如： http://localhost:8080  
    var localhostPaht = curWwwPath.substring(0, pos); //获取带"/"的项目名，如：/cis  
    var projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);  
    var rootPath = localhostPaht + projectName;  
    return rootPath;  
      
}