// JavaScript Document
define(function(require, exports, module){
	require('jquery');
	
	function Login(options){
		this.empPkgExist = options.empPkgExist || function(){};
		this.popup = options.popup || function(){};
		this.init();
	}
	
	Login.prototype = {
		isDX: false,
		countdownType: false,
		init: function(){
			var _this = this;
			//绑定发送验证码
			$('.sendCode').on('click', function(){
				var _btn = $(this),
					_form = _btn.parents('form');
				(_btn.hasClass('emp') || _btn.hasClass('zs')) ? _this.sendEmpCode(_btn[0], _form[0], _this.empPkgExist) : _this.sendCode(_btn[0], _form[0]);
			});
		},
		//发送验证码
		sendCode: function(obj, form){
			var _this = this,
				_form = $(form),
				tips = _form.find('.tip'),
				phone = _form.find('input[name=phone]');
			
			if(_this.phoneVerify2(phone) === false) return;
			
			$.ajax({
				url: '/ajax/biz/login/sendValidCode.ajax',
				async: true,
				type: 'POST',
				data: {'mobile' : phone.val(), 'pType': $(obj).data('ptype')},
				dataType: 'json',
				beforeSend: function(xhr){
					_this.countdown(60, obj, form);
				},
				success: function(data){
					if(data == null) return;
					tips.html(data.code === '0000' ? '' : data.desc);
				},
				error: function(){
					tips.html('验证码发送失败！系统繁忙，请稍后再试！');
				}		
			});	
		},
		//发送验证码
		sendEmpCode: function(obj, form, exist){
			var _this = this,
				_obj = $(obj),
				_form = $(form),
				tips = _form.find('.tip'),
				phone = _form.find('input[name=phone]');
			
			if(_this.phoneVerify(phone) === false) return;
			
			$.ajax({
			    url: '/ajax/biz/package/payLaunch.ajax',
			    type: 'POST',
			    data: {'pid': _obj.data('pkg'), 'mobile': phone.val()},
			    timeout: 30000,
			    async: true,
			    dataType: 'json',
			    beforeSend: function(xhr){
			    	_this.countdown(60, obj, form);
			    },
			    error: function(){
			    },
			    success: function(data){
			    	if(data == null) return;
			    	if(typeof(exist) == 'function'){
			    		data.code == '0000' ? tips.html('') : (data.desc.indexOf('重复开通') > -1 ? exist() : tips.html(data.desc));
			    	}else{
			    		tips.html(data.code == '0000' ? '' : (data.desc.indexOf('重复开通') > -1 ? '您已经是套餐用户，无需重复开通！' : data.desc));
			    	}
			    }
			});
		},
		//登录
		submit: function(obj, form, suc){
			var _this = this,
				_obj = $(obj),
				_form = $(form),
				tips = _form.find('.tip'),
				phone = _form.find('input[name=phone]'),
				code  = _form.find('input[name=code]');
			if(_this.phoneVerify2(phone) === false) return;
			if(_this.codeVerify(code) === false) return;
			
			$.ajax({
				url: '/ajax/biz/login/matchValidCode.ajax',
				async: true,
				type: 'POST',
				data: {'mobile' : phone.val(), 'validCode' : code.val()},
				dataType: 'json',
				success: function(data){
					
				}
			}).done(function(data){
				if(data == null) return;
				if(data.res_code === '0000'){
					suc ? suc() : null;
				}else{
					_this.tip(code);
					tips.html(data.res_desc);
				}
			});	
		},
		//开通包月服务
		openPKG: function(obj, form, suc, fail){
			var _this = this,
				btn = $(obj),
				_form = $(form),//				_form = btn.parents('form'),
				box = btn.parents('.box'),
				tips = _form.find('.tip'),
				phone = _form.find('input[name=phone]'),
				vcode = _form.find('input[name=code]'),
				deal  = _form.find('input[name=deal]'),
				pkg = _form.find('.sendCode').data('pkg'),
				extext = btn.text();
			
			if(_this.phoneVerify(phone) === false) return;
			if(_this.codeVerify(vcode) === false) return;
			if(deal.length > 0 && deal.attr('checked') != 'checked') return _this.tip(deal.parent());
			
			$.ajax({
				url: '/ajax/biz/package/payConfirm.ajax',
			    type: 'POST',
			    data: {'pid': pkg, 'mobile': phone.val(), 'vcode': vcode.val()},
			    timeout: 30000,
			    dataType: 'json',
			    beforeSend: function(xhr){
					btn.off('click').text('处理中...');
				},
			    success: function(json){
			    	if(json.code === '0000'){
			    		tips.html('');
			    		_this.popup.hide(box.attr('id'), function(){
			    			suc ? suc() : _this.popup.alert(json.desc);
			    		});
			    	}else{
			    		vcode.val('');
			    		tips.html(json.desc);
			    		fail ? fail() : null;
			    	}
			    },
			    complete: function(){
			    	setTimeout(function(){
				    	//重置文字
			    		btn.text(extext).on('click', function(){
			    			_this.openPKG(this, form, suc, fail);
			    		});
			    	}, 1000);
			    }
			});
		},
		//是否写好转网号码
		isDXMobile : function(str, suc){
			var _this = this;
			
			$.ajax({
			    url: '/ajax/biz/hcode/isDXMobile.ajax',
			    type: 'POST',
			    data: {'mobile': str},
			    timeout: 3000,
			    async: true,
			    dataType: 'json',
			    error: function(){
			    },
			    success: function(json){
			    	_this.isDX = json.flag;
			    }
			}).done(function(data){
//				suc(data ? data.flag : _this.isDXHcode(str));
			});
		},
		//验证纯数字
		isNum : function(str){
			return /^\d+$/.test(str);
		},
		//验证验证码
		isCode : function(str){
			return /^\d{4,6}$/.test(str);
		},
		//验证手机号
		isMobile : function(str){
			return  /^1\d{10}$/.test(str);
		},
		//是否电信号段
		isDXHcode : function(str){
			return  /^(133|153|180|189|181|170|171|173|177)\d{8}$/.test(str);
		},
		//是否移动号段
		isYDHcode: function(str){
			return  /^(134|135|136|137|138|139|150|151|152|158|159|182|183|184|157|187|188|178)\d{8}$/.test(str);
		},
		//是否联通号段
		isLTHcode: function(str){
			return  /^(130|131|132|155|156|185|186|176)\d{8}$/.test(str);
		},
		//验证手机号码
		phoneVerify: function(obj){
			if(!this.isMobile(obj.val()) || !this.isDXHcode(obj.val())){
				this.tip(obj);
				return false;
			}
			return true;	
		},
		//验证是否三网手机号码
		phoneVerify2: function(obj){
			if(!this.isMobile(obj.val()) || !(this.isDXHcode(obj.val()) || this.isLTHcode(obj.val()) || this.isYDHcode(obj.val()))){
				this.tip(obj);
				return false;
			}
			return true;	
		},
		//验证“验证码”文本
		codeVerify: function(obj){
			if(obj.val() == '' || !this.isCode(obj.val())){
				this.tip(obj);
				return false;
			}
			return true;
		},
		//验证码再次发送倒计时
		countdown: function(time, obj, form){
			var _this = this;
			if(time > 0){
				$(obj).off('click').html('<b class="red">'+time+'</b>秒后重新发送').css('cursor','default');
				time--;
				_this.interval = setTimeout(function(){
					_this.countdownType = true;
					_this.countdown(time, obj, form);
				},1000);
			}else{
				clearTimeout(_this.interval);
				_this.countdownType = false;
				//60秒重新绑定方法
				$(obj).html('免费获取验证码').css('cursor','pointer').on('click', function(){
					if($(obj).hasClass('emp') || $(obj).hasClass('zs')){
						_this.sendEmpCode(this, form);	
					}else{
						_this.sendCode(this, form);	
					}
				});
			}		
		},
		//文本框提示错误
		tip: function(obj){
			var obj = typeof(obj) == 'string' ? $('#' + obj) : obj,
				no = 1,
				bg = '#ffb06d',
				interval = setInterval(function(){
					obj.css('background',bg);
					no++;
					bg = bg === '#ffb06d' ? '' : '#ffb06d';
					if (no === 7) {
						clearInterval(interval);
					}
			},100);	
		}
	};
	
	module.exports = Login;
});