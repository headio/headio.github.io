var game = (function(){
	var _e={}, _p={};
	_p.stage = $("#game");
	_p.result = 0;
	_p.chance = 3;
	_p.rollingLock = false;
	_e.init = function(){
		_p.stage.addClass("ready");
		$(".game-pop-dice-body").on("webkitAnimationEnd", function(){
			if($(this).hasClass("shake")){
				$(this).removeClass("shake");
				$(this).children().appendTo(this);
				_p.rollEnd();
			}
		});
		$(".game-pop b").on("click", function(){
			if(_p.chance<=0) _e.end();
			$(this).parents(".game-pop").removeClass("on");
			$(".game-dice-hint").removeClass("off");
			_p.enableShaking();
		});
	};
	_e.start = function(){
		_p.result = 0;
		_p.chance = 3;
		_p.stage.addClass("playing");
		$(".game-pop-dice-sure").on("click",_p.shipping);
		$(".game-city1, .game-city2").removeClass("on");
		$(".game-pop").removeClass("star");
		_p.enableShaking();
	}
	_e.end = function(){
		_p.disableShaking();
		_p.stage.removeClass("playing");
		$("#game-ship").removeClass();
		$(".game-pop-dice-sure").off("click",_p.shipping);
		page.end(_p.result);
	};
	_p.enableShaking = function(){
		$(window).on("devicemotion", _p.shaking);
		$(".game-dice-hint").click(_p.rollStart);
	};
	_p.disableShaking = function(){
		$(window).off("devicemotion", _p.shaking);
		$(".game-dice-hint").off("click",_p.rollStart);
	};
	_p.shaking = function(e){
		var acc = e.originalEvent.accelerationIncludingGravity;
		if(Math.abs(acc.x)+Math.abs(acc.y)+Math.abs(acc.z) > 30) _p.rollStart();
	};
	_p.rollStart = function(){
		$(".game-dice-hint").addClass("off");
		$("#game-pop-dice").addClass("on");
		_p.roll();
		_p.rollingLock = true;
	};
	_p.roll = function(){
		$(".game-pop-dice-body").addClass("shake");
	};
	_p.rollEnd = function(){
		_p.point = Math.floor(Math.random() * Math.min(6, 17-_p.result)) + 1;
		$(".game-pop-dice-body b").removeClass().addClass("point"+_p.point);
		_p.rollingLock = false;
	};
	_p.shipping = function(){
		if(_p.rollingLock) return;
		_p.disableShaking();
		_p.chance--;
		_p.result = Math.max(_p.result + _p.point,0);
		$("#game-pop-dice").removeClass("on");
		setTimeout(function(){
			$("#game-ship").removeClass().addClass("route"+_p.result);
		},500);
		setTimeout(function(){
			var popNum = Math.floor((_p.result-1)/6)+1;
			$(".game-city"+(Math.floor((_p.result)/6))).addClass("on");
			//
			if(_p.chance>0) {
				$(".game-pop b").text("继续前进");
			} else {
				$(".game-pop").addClass("star");
				$(".game-pop b").one("click", function(){
					page.audio.play("win");
				}).text("获奖情况");
			}
			setTimeout(function(){
				$("#game-pop-"+popNum).addClass("on");
			},800);
		},2500);
	}
	
	return _e;
})();