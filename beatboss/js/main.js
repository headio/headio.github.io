var sound = (function(){
    var e_ = { };
    
    var bgm;
    var bgmplaying = false;
    var beaten_sounds = [];
    
    e_.SetBGM = function(path) {
        bgm = ult.audio.CreateAudio(path, {preload: true, loop: true, autoplay: true});
        bgmplaying = bgm.autoplay;
    };
    
    e_.PlayBGM = function() {
        if (bgm && !bgmplaying) {
            bgm.play();
            bgmplaying = true;
        }
    };
    
    e_.PauseBGM = function() {
        if (bgm && bgmplaying) {
            bgm.pause();
            bgmplaying = false;
        }
    };
    
    e_.AddBeatenSound = function(source) {
        beaten_sounds.push(ult.audio.CreateAudio(source));
    };
    
    e_.RandomPlayBeatenSound = function() {
        var randSound = beaten_sounds[ult.GetRandom(0, beaten_sounds.length)];
        randSound.play();
    };
    
    return e_;
})();

var page1 = (function(){
    var e_ = { };
    
    var ani_playing = false;
    var beaten_status = false;
    var ani_class = [".boss", ".beat-effect", ".beat-button"];
    var ani_interval;
    
    e_.Start = function() {
        $("#beat-button").click(function() {
            if (page1.AniPlaying()) {
                page1.AniStop();
                //sound.PauseBGM();
            } else {
                page1.AniStart();
                sound.PlayBGM();
            }
            $("#popup-rule").show();
        });
        
        $("#beat-title").on("webkitAnimationEnd", function() {
            $(this).removeClass("normal");
            $(this).addClass("beaten");
        });
        
        $("#popup-rule-confirm").click(function() {
            $("#popup-rule").hide();
            e_.PageEnd();
            page2.Start();
        });
        
        sound.SetBGM("res/bgm.mp3");
        e_.AniStart();
    };
    
    e_.AniStart = function() {
        if (!ani_playing) {
            ani_interval = setInterval(function() {
                if (beaten_status) {
                    SwitchToNormalStatus();
                } else {
                    SwitchToBeatenStatus();
                }
            }, 200);
            ani_playing = true;
        }
    };
    
    e_.AniPlaying = function() {
        return ani_playing;
    };
    
    e_.AniStop = function() {
        if (ani_playing) {
            clearInterval(ani_interval);
            if (beaten_status) {
                SwitchToNormalStatus();
            }
            ani_playing = false;
        }
    };
    
    e_.PageEnd = function() {
        $("#startpage").hide();
        e_.AniStop();
        sound.PauseBGM();
    };
    
    SwitchToNormalStatus = function() {
        for (var ele in ani_class) {
            $(ani_class[ele]).removeClass("beaten");
            $(ani_class[ele]).addClass("normal");
        }
        beaten_status = false;
    };
    
    SwitchToBeatenStatus = function() {
        for (var ele in ani_class) {
            $(ani_class[ele]).removeClass("normal");
            $(ani_class[ele]).addClass("beaten");
        }
        beaten_status = true;
    };
    
    Reset = function() {
        ani_playing = false;
        beaten_status = false;
        clearInterval(ani_interval);
    };
    
    return e_;
})();

var page2 = (function() {
    var e_ = { };
    
    var time_out = 5;
    var left_time = time_out;
    var game_timer = 0;
    var last_hand = 0; // 0 for left, 1 for right
    var beat_count = 0;
    var first_beat = true;
    var beat_stage = [
        {min_count: 0, max_count: 10, boss_head: "boss-head-1", boss_body: "boss-body-1"},
        {min_count: 11, max_count: 20, boss_head: "boss-head-2", boss_body: "boss-body-2"},
        {min_count: 21, max_count: 30, boss_head: "boss-head-3", boss_body: "boss-body-3"},
        {min_count: 31, max_count: 40, boss_head: "boss-head-4", boss_body: "boss-body-3"},
        {min_count: 41, max_count: 50, boss_head: "boss-head-5", boss_body: "boss-body-4"},
        {min_count: 51, max_count: 60, boss_head: "boss-head-6", boss_body: "boss-body-4"},
        {min_count: 61, max_count: 999, boss_head: "boss-head-7", boss_body: "boss-body-5"}
    ];
    var beat_timeout = 0;
    
    e_.Start = function() {
        Reset();
        
        $("#restart-button").click(function() {
            Reset();
        });
        
        $(".beaten-area").click(function() {
            if (first_beat) {
                game_timer = setInterval(function() {
                    --left_time;
                    SetLeftTime(left_time);
                    if (left_time == 0) {
                        clearInterval(game_timer);
                        SetLeftTime(0);
                        SetPopupShareCount(beat_count);
                        $("#popup-share").show();
                    }
                }, 1000);
                
                first_beat = false;
            }
            
            sound.RandomPlayBeatenSound();
            if (last_hand == 0) {
                RightBeatBoss();
            } else if (last_hand == 1) {
                LeftBeatBoss();
            }
            SetScore(beat_count);
            SetBossWithStage();
        });
        
        $("#popup-share-confirm").click(function() {
            if (ult.PhoneInputCorrect($("#phone-number").val())) {
                alert("开始分享");
                $("#popup-share").hide();
                Reset();
            } else {
                alert("手机号错误");
            }
        });
        
        $("#beatpage").show();
        
        sound.AddBeatenSound("res/beat1.mp3");
        sound.AddBeatenSound("res/beat2.mp3");
    };
    
    
    SetScore = function(score) {
        $("#beat-score").html(String(score));
    };
    
    SetLeftTime = function(left_time) {
        $("#left-time").html(String(left_time));
    };
    
    GetScore = function() {
        return Number($("#beat-score").html());
    };
    
    GetLeftTime = function() {
        return Number($("#left-time").html());
    };
    
    SetBossWithStage = function() {
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
            $("#boss-body").attr("class", "boss-body");
            $("#boss-head").attr("class", "boss-head");
            $("#boss-body").addClass(stage_picked.boss_body);
            $("#boss-head").addClass(stage_picked.boss_head);
        }
    };
    
    ResetBoss = function() {
        $("#boss-body").attr("class", "boss-body boss-body-1");
        $("#boss-head").attr("class", "boss-head boss-head-1");
    };
    
    LeftBeatBoss = function() {
        if (last_hand == 1) {
            ++beat_count;
            $("#boss-head").hide();
            $("#boss-beaten-right").hide();
            $("#boss-beaten-left").show();
            clearTimeout(beat_timeout);
            beat_timeout = setTimeout(function() {
                $("#boss-beaten-left").hide();
                $("#boss-head").show();
            }, 400);
            
            last_hand = 0;
        }
    };
    
    RightBeatBoss = function() {
        if (last_hand == 0) {
            ++beat_count;
            $("#boss-head").hide();
            $("#boss-beaten-left").hide();
            $("#boss-beaten-right").show();
            clearTimeout(beat_timeout);
            beat_timeout = setTimeout(function() {
                $("#boss-beaten-right").hide();
                $("#boss-head").show();
            }, 400);
            
            last_hand = 1;
        }
    };
    
    SetPopupShareCount = function(count) {
        $("#share-count").html(String(count));
    };
    
    Reset = function() {
        clearInterval(game_timer);
        left_time = time_out;
        game_timer = 0;
        last_hand = 0; // 0 for left, 1 for right
        beat_count = 0;
        first_beat = true;
        SetLeftTime(left_time);
        last_hand = ult.GetRandom(0, 2);
        SetScore(beat_count);
    };
    
    return e_;
})();

$(document).ready(function() {
    page1.Start();
    //page2.Start();
});