var ult = (function() {
    var e_ = { };
    
    e_.IsIos = function() {
        return /ipad|iphone|ipod/g.test(navigator.userAgent.toLowerCase());
    };
    
    e_.PhoneInputCorrect = function(phone_number) {
        var patern = /^1[3,4,5,8]\d{9}$/;
        return patern.test(phone_number);
    };
    
    // get random number from [begin, end)
    e_.GetRandom = function(begin_number, end_number) {
        return Math.floor(Math.random() * (end_number - begin_number) + begin_number)
    };
    
    return e_;
})();

ult.audio = (function(){
    var e_ = { }, p_ = { };
    
    e_.CreateAudio = function(path, param) {
        return $.extend(document.createElement("audio"),
                        { src: path }, param);
    };
    
    return e_;
})();