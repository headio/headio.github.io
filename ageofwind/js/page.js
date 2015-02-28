var page={
	/*工具类*/
	isIos:function(){
		return /ipad|iphone|ipod/g.test(navigator.userAgent.toLowerCase());
	},
	setViewPort:function(){
		var e = parseInt(window.screen.width),
		i = navigator.userAgent,
		n = 640 / e * window.devicePixelRatio * 160;
		if (/Android.*?(\d+\.\d+)/.test(i)) {
			var t = parseFloat(RegExp.$1);
			document.getElementById("viewport").content = 2.3 >= t ? "target-densitydpi=device-dpi,width=640,initial-scale=1.0": "target-densitydpi=device-dpi,width=640,initial-scale=1.0, user-scalable=no"
		}
	},
	pop:{
		mod:$('#pop'),
		con:$('.pop-con'),
		show:function(id){
			this.mod.show();
			this.con.hide();
			this.mod.find(id).show();
		},
		close:function(id){
			this.con.hide();
			this.mod.hide();
		}
	},
	/*......*/
	phone:0,
	result:0,
	now:0,
	pages:$('.page'),
	next:function(){
		var _this=this;
		_this.pages.eq(_this.now).hide();
		_this.pages.eq(_this.now+1).show();
		_this.now++;
	},
	end:function(result){
		var _this=this;
		_this.result=result;
		_this.next();
		if(_this.result<6){
			$('.page3').attr('id','no');
		}else{
			$('.page3').attr('id','yes');
			if(_this.result<12){$('.page3-con-Yes').find('p').eq(1).hide();}
		}
	},
	phoneAlreadyExist:function(){
		$('.pop-con-input-tips').text('这个号码已经领过');
	},
	phoneError:function(){
		$('.pop-con-input-tips').text('请输入正确格式的手机号').addClass('pop-con-input-tips-ani');
	},
	phoneInputCorrect:function(){
		var v=$('.pop-con-input').val();
		var patrn = /^(13[0-9]{9})|(14[0-9])|(18[0-9])|(15[0-9][0-9]{8})$/;
		if(patrn.test(v)){
			page.phone=v;
			$('.pop-con-input-tips').text('');
			return true;
		}else{
			return false;
		}
	},
	init:function(){
		var _this=this;
		_this.setViewPort();
		$('.page1 .start').click(function(){
			page.pop.show('#intro');
		});
		$('#intro .pop-con-redBtn').click(function(){
			page.pop.close();
			game.init();
			_this.next();
			game.start();
		});
		$('.page3-btn-Yes').click(function(){
			page.pop.show('#getGift');
		});
		$('.pop-con-input').focus(function(){
			$('.pop-con-input-tips').removeClass('pop-con-input-tips-ani');
		});
	}
};

//分享模块
page.share = function(para){
	var _e = {};
	//初始化参数
	para = $.extend({
		title : document.title,
		 text : document.title,
		  url : document.location.href,
		  img : ""
	},para);
	//
	document.addEventListener("WeixinJSBridgeReady", function() {
		//微信朋友圈
		WeixinJSBridge.on("menu:share:timeline", function(){
			WeixinJSBridge.invoke("shareTimeline", {
				img_url : para.img,
				   link : para.url,
				   desc : para.text,
				  title : para.text
			});
		});
		//微信朋友
		WeixinJSBridge.on("menu:share:appmessage", function(){
			WeixinJSBridge.invoke("sendAppMessage", {
				img_url : para.img,
				   link : para.url,
				   desc : para.text,
				  title : para.title
			});
		});
	});
	//
	_e.setText = function(value){
		para.text = value;
	};
	return _e;
}
//音乐模块
page.audio = (function(){
	var _e={}, _p={};
	_p.pool = {};
	_e.add = function(src, para){
		var sp = src.split(/\/|\./);
		var name = sp[sp.length-2];
		_p.pool[name] = $.extend(new Audio(src), {
			preload : true
		}, para);
		$(_p.pool[name]).on("ended", function(e){
			e.target.currentTime=0;
			if(e.target.currentTime) e.target.src = e.target.src;
			if(e.target.loop) {
				e.target.play();
			}else {
				e.target.pause();
				if(_p.bgmusic && _p.bgmusicPlaying) _p.bgmusic.play();
			}
		});
	};
	_e.play = function(name, posTime){
		if(!name || name=="bgmusic"){
			if(_p.bgmusic) {
				_p.bgmusicPlaying = true;
				_p.bgmusic.play();
			}
			return;
		}
		var tar = _p.pool[name];
		if(!tar) return;
		try{
			tar.currentTime = posTime || 0;
		}catch(e){}
		if(_p.bgmusic) _p.bgmusic.pause();
		tar.play();
	};
	_e.pause = function(name){
		if(!name || name=="bgmusic"){
			if(_p.bgmusic) {
				_p.bgmusicPlaying = false;
				_p.bgmusic.pause();
			}
			for(var i in _p.pool) _p.pool[i].pause();
			return;
		}

		var tar = _p.pool[name];
		if(tar) tar.pause();
		if(_p.bgmusic && _p.bgmusicPlaying) _p.bgmusic.play();
	};
	//背景音乐
	_e.bgmusic = function(src, para){
		_p.bgmusic = $.extend(new Audio(src), {
			 preload : true,
			    loop : true,
			autoplay : true,
		}, para);
		_p.bgmusicPlaying = _p.bgmusic.autoplay;
	}
	_e.getBgmusic = function(){
		return _p.bgmusic;
	}
	return _e;
})();