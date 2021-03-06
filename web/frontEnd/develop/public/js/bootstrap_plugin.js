/**
 * @author bh-lay
 * @github https://github.com/bh-lay/tie.js
 * @modified 2014-7-25 0:37
 *  location fox
 * 处理既要相对于某个模块固定，又要在其可视时悬浮的页面元素
 * util.tie({
		'dom' : ,			//需要浮动的元素
		'scopeDom' : ,		//页面显示时的参照元素
		'fixed_top' : 20	//悬浮时，距顶部的距离
	});
 * 
 */
window.util=window.util||{};(function(c){var b=false;if(navigator.appName=="Microsoft Internet Explorer"){var a=navigator.appVersion.split(";")[1].replace(/[ ]/g,"");if(a=="MSIE6.0"||a=="MSIE7.0"){b=true}}var f=(function(){if(b){return function(h){var g;if(this.state=="min"){g=0}else{if(this.state=="max"){g=this.maxScrollTop-this.minScrollTop}else{if(this.state=="mid"){g=h-this.minScrollTop}}}alert(this.state+g);this.dom.animate({"top":g},100).css({"position":"absolute"})}}else{return function(g){if(this.state=="min"){this.dom.css({"top":0,"position":this._position_first})}else{if(this.state=="max"){this.dom.css({"top":this.maxScrollTop-this.minScrollTop,"position":"absolute"})}else{this.dom.css({"top":this.fix_top,"position":"fixed"})}}}}})();function d(j){var h=this;var j=j||{};this.dom=j["dom"];this.scopeDom=j["scopeDom"];this._position_first=this.dom.css("position");this.fix_top=j["fixed_top"]||0;this.height=null;this.cntH=null;this.minScrollTop=null;this.maxScrollTop=null;this.state="min";var i=j["scrollDom"]||$(window);this.refresh();var g;i.on("scroll",function(){clearTimeout(g);g=setTimeout(function(){h.refresh()},10)})}var e=$(document);d.prototype.refresh=function(){this.height=this.dom.height();this.cntH=this.scopeDom.outerHeight();this.minScrollTop=this.scopeDom.offset().top-this.fix_top;this.maxScrollTop=this.minScrollTop+this.cntH-this.height;var g=e.scrollTop();if(g<this.minScrollTop){this.state="min"}else{if(g>this.maxScrollTop){this.state="max"}else{this.state="mid"}}f.call(this,g)};c.tie=function(g){return new d(g)}})(window.util);

/**
 * 今天是否已经显示过弹框
 */
function isShowedToday(){
	var cookie_str = document.cookie || '';
	var time_match = cookie_str.match(/last_show_version_time=(.+?)(;|$)/);
	if(!time_match){
		return false;
	}else{
		var DATE = new Date();
		var month = DATE.getMonth() + 1;
		var date = DATE.getDate();
		if(time_match[1] == month + '-' + date){
			return true;
		}else{
			return false;
		}
	} 
}

var tips_tpl = ['<div class="newVersionTips">',
	'<div class="container">',
		'<button type="button" class="btn btn-success btn-sm toNewVersion"><i class="glyphicon glyphicon-send"></i> 进入尝鲜版</button>',
	'</div>',
'</div>'].join('');
var changeVersionTpl = ['<div class="newVersionPop">',
    '<div class="nVP_bj"><img src="http://layasset.qiniudn.com/images/version_switch.jpg" /></div>',
    '<div class="nVP_txt">',
        '<p class="nVP_1">你竟然还在使用<span>屌丝版</span></p>',
        '<p class="nVP_2">小剧已为高级浏览器单独做了开发</p>',
        '<p class="nVP_3"><a href="javascript:void(0)" class="toNewVersion">使用尝鲜版</a></p>',
        '<p class=nVP_4><a target="_blank" href="/blog/14955f2a02b">搞什么鬼，还分版本？</a></p>',
    '</div>',
    '<a href="javascript:void(0)" class="nVP_close">×</a>',
'</div>'].join('');
/**
 * 显示版本提示框
 *
 */
function version_init(){
	//检测浏览器
	if( blog.isAdvancedBrowser){
		var $tips = $(tips_tpl);
		$('.navbar').parent().before($tips);
		//检测是否已经显示过
		if(!isShowedToday()){
			$tips.find('.container').hide();
			var $pop = $(changeVersionTpl).hide();
			$tips.prepend($pop);
			$pop.slideDown(2000);
			$pop.on('click','.nVP_close',function(){
				$pop.slideUp(200);
				$tips.find('.container').slideDown(200);
			});
			
			var DATE = new Date();
			var month = DATE.getMonth() + 1;
			var date = DATE.getDate();
			document.cookie = 'last_show_version_time=' + month + '-' + date + ';path=/;';
		}
	}
}
$.getScript(app_config.frontEnd_base + 'UI/dialog.js',function(){
	version_init();
	
	util.tie({
		'dom' : $('.navbar'),
		'scopeDom' : $('.page-body'),
		'fixed_top' : 0
	});
	$('body').on('click','.toNewVersion',function(){
		blog.jumpToNewVersion();
	});
	$('.nav_comment_link').click(function(){
		if( blog.isAdvancedBrowser){
			UI.confirm({
				'text' : '仅在“尝鲜版”下可用',
				'from' : $(this)[0],
				'mask' : false,
				'btns' : ['进入尝鲜版','保持现状'],
				'callback' : function(){
					blog.jumpToNewVersion();
				}
			});
		}else{
			UI.confirm({
				'text' : '浏览器太老旧，请升级！'
			});
		}
		return false;
	});
});


//评论模块
var $comments = $('.comments_area');
if($comments.length){
	var html;
	if( blog.isAdvancedBrowser){
		html = ['<div class="panel panel-default">',
			'<div class="panel-heading">评论</div>',
			'<div class="panel-body">',
				'<h3>评论功能，仅在“尝鲜版”下可用！</h3><a href="javascript:void(0)" type="button" class="btn btn-info">进入尝鲜版</a>',
			'</div>',
		'</div>'].join('');
	}
	$comments.html(html);
	
	$comments.on('click','.btn',function(){
		blog.jumpToNewVersion();
	});
	
}