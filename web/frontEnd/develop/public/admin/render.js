/*
 * 作者:剧中人
 * 博客：http://bh-lay.com/
 * Copyright (c) 2012-2018 小剧客栈
**/

window.admin = window.admin || {};
window.admin.render = window.admin.render || {};

/**
 * 博文列表页
 * @param {Object} dom
 * @param {String|Number} [id] article ID
 **/
(function(exports){
	var tpl = ['<tr>',
		'<td><a title="查看博文" href="/blog/{id}" target="_blank">{title}</a></td>',
		'<td>{time_show}</td>',
		'<td>',
			'<a class="btn btn-default btn-xs custom-publish" title="修改" href="javascript:void(0)" data-type="article" data-id="{id}"><span class="glyphicon glyphicon-edit"></span></a>',
			'<a class="btn btn-default btn-xs" title="删除" href="/ajax/del?from=blog&id={id}" data-item-selector="tr" data-action-del="三思啊，删了可就没啦！"><span class="glyphicon glyphicon-remove"></span></a>',
		'</td>',
	'</tr>'].join('');
	function render(tpl,data){
		var txt = '';
		for(var i=0 in data){
			txt += tpl.replace(/{(\w*)}/g,function(){
				var key = arguments[1];
				return data[i][key] || '';
			});
		}
		return txt;
	}
	//获取文章列表
	function getList(start,limit,callback){
		$.ajax({
			'url' : '/ajax/blog',
			'type' : 'GET',
			'data' : {
				'act' : 'get_list',
				'skip' : start,
				'limit' : limit
			},
			'success' : function(data){
				for(var i in data.list){
					data.list[i].time_show = parse.time(data.list[i].time_show,'{y}-{m}-{d}');
				}
				callback(null,data);	
			}
		});
	}
	function listPage(dom){
		var list_html = ['<div class="col-md-12 custom-mb10">',
			'<a class="btn btn-default custom-publish" href="javascript:void(0)" data-type="article">写博文</a>',
		'</div>',
		'<div class="col-md-12">',
			'<div class="panel panel-default">',
				'<table class="table table-hover custom-listTable">',
					'<tr><th>标题</th><th>发布时间</th><th>操作</th></tr>'].join('');
		//每页显示条数
		var page_list_num = 8;
		getList(0,page_list_num,function(err,data){
			if(err){
				console.log('error');
				return
			}
			list_html += render(tpl,data.list);
			list_html += '</table></div></div>';
			
			list_html += '<div class="page col-md-12"></div>';
			dom.html(list_html);
			//分页组件
			var page = admin.pageList(dom.find('.page'),{
				'list_count' : data.count,
				'page_cur' : 0,
				'page_list_num' : page_list_num,
				'max_page_btn' : 5
			});
			page.jump = function(num){
				//console.log(num,12);
				getList((num-1)*page_list_num,page_list_num,function(err,data){
					if(err){
						console.log('error');
						return
					}
					var new_html = render(tpl,data.list);
					dom.find('tr').eq(0).siblings().remove();
					dom.find('.table').append(new_html);
				});
			};
		});
	}
	exports.article = function(dom){
		listPage(dom);
	};
})(window.admin.render);


/**
 * 分享列表页
 * 分享内容页
 * @param {Object} dom
 * @param {String|Number} [id] article ID
 **/
(function(exports){
	var list_tpl = ['<tr>',
		'<td class="arLiTitle"><a title="查看分享" href="/share/{id}" target="_blank">{title}</a></td>',
		'<td class="arLiTime">{time_show}</td>',
		'<td class="arLiEdit">',
			'<a class="btn btn-default btn-xs custom-publish" title="修改"  href="javascript:void(0)" data-type="share" data-id="{id}"><span class="glyphicon glyphicon-edit"></span></a>',
			'<a class="btn btn-default btn-xs" title="删除" href="/ajax/del?from=share&id={id}" data-item-selector="tr" data-action-del="三思啊，删了可就没啦！"><span class="glyphicon glyphicon-remove"></span></a>',
		'</td>',
	'</tr>'].join('');
	
	function render(tpl,data){
		var txt = '';
		for(var i=0 in data){
			txt += tpl.replace(/{(\w*)}/g,function(){
				var key = arguments[1];
				return data[i][key] || '';
			});
		}
		return txt;
	}
	function getList(start,limit,callback){
		$.ajax({
			'url' : '/ajax/share',
			'type' : 'GET',
			'data' : {
				'act' : 'get_list',
				'skip' : start,
				'limit' : limit
			},
			'success' : function(data){
				for(var i in data.list){
					data.list[i].time_show = parse.time(data.list[i].time_show,'{y}-{m}-{d}');
				}
				callback(null,data);
			}
		});
	}
	function listPage(dom){
		var list_html = ['<div class="col-md-12 custom-mb10">',
			'<a class="btn btn-default custom-publish" href="javascript:void(0)" data-type="share">发分享</a>',
		'</div>',
		'<div class="col-md-12">',
			'<div class="panel panel-default">',
				'<table class="table table-hover custom-listTable">',
					'<tr><th>标题</th><th>发布时间</th><th>操作</th></tr>'].join('');
				//每页显示条数
		var page_list_num = 10;
		getList(0,page_list_num,function(err,data){
			if(err){
				console.log('error');
				return
			}
			list_html += render(list_tpl,data.list);
			list_html += '</table></div></div>';
			
			list_html += '<div class="page col-md-12"></div>';
			dom.html(list_html);
			var page = admin.pageList(dom.find('.page'),{
				'list_count' : data.count,
				'page_cur' : 0,
				'page_list_num' : page_list_num
			});
			page.jump = function(num){
				//console.log(num,12);
				getList((num-1)*page_list_num,page_list_num,function(err,data){
					if(err){
						console.log('error');
						return
					}
					var new_html = render(list_tpl,data.list);
					dom.find('tr').eq(0).siblings().remove();
					dom.find('.table').append(new_html);
				});
			};
		});
	}
	exports.share = function(dom,id){
		//列表页
		listPage(dom);
	};
})(window.admin.render);



/**
 * 作品列表页
 * 作品内容页
 * @param {Object} dom
 * @param {String|Number} [id] article ID
 **/
(function(exports){
	var list_tpl = ['<tr>',
		'<td class="arLiTitle"><a title="查看作品" href="/opus/{id}" target="_blank">{title}</a></td>',
		'<td class="arLiTime">{time_show}</td>',
		'<td class="arLiEdit">',
			'<a class="btn btn-default btn-xs custom-publish" title="修改"  href="javascript:void(0)" data-type="opus" data-id="{id}"><span class="glyphicon glyphicon-edit"></span></a>',
			'<a class="btn btn-default btn-xs" title="删除" href="/ajax/del?from=opus&id={id}" data-item-selector="tr" data-action-del="三思啊，删了可就没啦！"><span class="glyphicon glyphicon-remove"></span></a>',
		'</td>',
	'</tr>'].join('');
	
	function render(tpl,data){
		var txt = '';
		for(var i=0 in data){
			txt += tpl.replace(/{(\w*)}/g,function(){
				var key = arguments[1];
				return data[i][key] || '';
			});
		}
		return txt;
	}
	function getList(start,limit,callback){
		$.ajax({
			'url' : '/ajax/opus',
			'type' : 'GET',
			'data' : {
				'act' : 'get_list',
				'skip' : start,
				'limit' : limit
			},
			'success' : function(data){
				for(var i in data.list){
					data.list[i].time_show = parse.time(data.list[i].opus_time_create,'{y}-{m}-{d}');
				}
				callback(null,data);
			}
		});
	}
	function OPUS(dom){
		var list_html = ['<div class="col-md-12 custom-mb10">',
			'<a class="btn btn-default custom-publish" href="javascript:void(0)" data-type="opus">传作品</a>',
		'</div>',
		'<div class="col-md-12">',
			'<div class="panel panel-default">',
				'<table class="table table-hover custom-listTable">',
					'<tr><th>标题</th><th>发布时间</th><th>操作</th></tr>'].join('');
				//每页显示条数
		var page_list_num = 10;
		getList(0,page_list_num,function(err,data){
			if(err){
				console.log('error');
				return
			}
			list_html += render(list_tpl,data.list);
			list_html += '</table></div></div>';
			
			list_html += '<div class="page col-md-12"></div>';
			dom.html(list_html);
			var page = admin.pageList(dom.find('.page'),{
				'list_count' : data.count,
				'page_cur' : 0,
				'page_list_num' : page_list_num
			});
			page.jump = function(num){
				//console.log(num,12);
				getList((num-1)*page_list_num,page_list_num,function(err,data){
					if(err){
						console.log('error');
						return
					}
					var new_html = render(list_tpl,data.list);
					dom.find('tr').eq(0).siblings().remove();
					dom.find('.table').append(new_html);
				});
			};
		});
	}
	exports.opus = OPUS;
})(window.admin.render);


/**
 * 实验室列表页
 * @param {Object} dom
 * @param {String|Number} [id] article ID
 **/
(function(exports){
	var tpl = ['<tr>',
		'<td class="arLiTitle"><a title="查看博文" href="/labs/{name}" target="_blank">{title}</a></td>',
		'<td class="arLiTime">{time_show}</td>',
		'<td class="arLiEdit">',
			'<a class="btn btn-default btn-xs custom-publish" title="修改"  href="javascript:void(0)" data-type="labs" data-id="{id}"><span class="glyphicon glyphicon-edit"></span></a>',
			'<a class="btn btn-default btn-xs" title="删除" href="/ajax/del?from=labs&id={id}" data-item-selector="tr" data-action-del="三思啊，删了可就没啦！"><span class="glyphicon glyphicon-remove"></span></a>',
		'</td>',
	'</tr>'].join('');
	function render(tpl,data){
		var txt = '';
		for(var i=0 in data){
			txt += tpl.replace(/{(\w*)}/g,function(){
				var key = arguments[1];
				return data[i][key] || '';
			});
		}
		return txt;
	}
	//获取文章列表
	function getList(start,limit,callback){
		$.ajax({
			'url' : '/ajax/labs',
			'type' : 'GET',
			'data' : {
				'act' : 'get_list',
				'skip' : start,
				'limit' : limit
			},
			'success' : function(data){
				for(var i in data.list){
					data.list[i].time_show = parse.time(data.list[i].time_create,'{y}-{m}-{d}');
				}
				callback(null,data);	
			}
		});
	}
	function listPage(dom){
		var list_html = ['<div class="col-md-12 custom-mb10">',
			'<a class="btn btn-default custom-publish" href="javascript:void(0)" data-type="labs">发插件</a>',
		'</div>',
		'<div class="col-md-12">',
			'<div class="panel panel-default">',
				'<table class="table table-hover custom-listTable">',
					'<tr><th>标题</th><th>发布时间</th><th>操作</th></tr>'].join('');
		//每页显示条数
		var page_list_num = 8;
		getList(0,page_list_num,function(err,data){
			if(err){
				console.log('error');
				return
			}
			list_html += render(tpl,data.list);
			list_html += '</table></div></div>';
			
			list_html += '<div class="page col-md-12"></div>';
			dom.html(list_html);
			//分页组件
			var page = admin.pageList(dom.find('.page'),{
				'list_count' : data.count,
				'page_cur' : 0,
				'page_list_num' : page_list_num
			});
			page.jump = function(num){
				
				//console.log(num,12);
				getList((num-1)*page_list_num,page_list_num,function(err,data){
					if(err){
						console.log('error');
						return
					}
					var new_html = render(tpl,data.list);
					dom.find('tr').eq(0).siblings().remove();
					dom.find('.table').append(new_html);
				});
			};
		});
	}
	exports.labs = function(dom,id){
		listPage(dom);
	};
})(window.admin.render);


/**
 * 友情链接页面
 * @param {Object} dom
 * @param {String|Number} [id] article ID
 **/
(function(exports){
	var tpl = ['<tr>',
		'<td class="arLiTitle" title="{title}{url}">{title}</td>',
		'<td class="arLiTitle" title="添加时间">{time_create}</td>',
		'<td class="arLiEdit">',
			'<a class="btn btn-default btn-xs custom-publish" title="修改"  href="javascript:void(0)" data-type="friends" data-id="{id}"><span class="glyphicon glyphicon-edit"></span></a>',
			'<a class="btn btn-default btn-xs" title="删除" href="/ajax/del?from=blog_friend&id={id}" data-item-selector="tr" data-action-del="三思啊，删了可就没啦！"><span class="glyphicon glyphicon-remove"></span></a>',
		'</td>',
	'</tr>'].join('');
	function render(tpl,data){
		var txt = '';
		for(var i=0 in data){
			txt += tpl.replace(/{(\w*)}/g,function(){
				var key = arguments[1];
				return data[i][key] || '';
			});
		}
		return txt;
	}
	//获取友情链接列表
	function getList(start,limit,callback){
		$.ajax({
			'url' : '/ajax/friends',
			'type' : 'GET',
			'data' : {
				'act' : 'get_list',
				'skip' : start,
				'limit' : limit
			},
			'success' : function(data){
				for(var i in data.list){
					data.list[i].time_create = parse.time(data.list[i].time_create,'{y}-{m}-{d}');
				}
				callback(null,data);	
			}
		});
	}
	function listPage(dom){
		var list_html = ['<div class="col-md-12 custom-mb10">',
			'<a class="btn btn-default custom-publish" href="javascript:void(0)" data-type="friends">加友链</a>',
		'</div>',
		'<div class="col-md-12">',
			'<div class="panel panel-default">',
				'<table class="table table-hover custom-listTable">',
					'<tr><th>标题</th><th>发布时间</th><th>操作</th></tr>'].join('');
		//每页显示条数
		var page_list_num = 8;
		getList(0,page_list_num,function(err,data){
			if(err){
				console.log('error');
				return
			}
			list_html += render(tpl,data.list);
			list_html += '</table></div></div>';
			
			list_html += '<div class="page col-md-12"></div>';
			dom.html(list_html);
			//分页组件
			var page = admin.pageList(dom.find('.page'),{
				'list_count' : data.count,
				'page_cur' : 0,
				'page_list_num' : page_list_num
			});
			page.jump = function(num){
				
				//console.log(num,12);
				getList((num-1)*page_list_num,page_list_num,function(err,data){
					if(err){
						console.log('error');
						return
					}
					var new_html = render(tpl,data.list);
					
					dom.find('table').html(new_html);
				});
			};
		});
	}
	exports.friends = function(dom,id){
		listPage(dom);
	};
})(window.admin.render);

/**
 * 用户首页
 **/
(function(exports){
	var userIndex_tpl = ['<div class="navItem">',
	'</div>'].join('');
	
	function userIndex(dom){
		dom.html(userIndex_tpl);
	}
	
	exports.userIndex = userIndex;
})(window.admin.render);


/**
 * 用户列表
 **/
(function(exports){
	var userItem = ['<tr>',
		'<td>{username}</td>',
		'<td>{email}</td>',
		'<td>{user_group}</td>',
		'<td>',
			'<a class="btn btn-default btn-xs custom-publish"  href="javascript:void(0)" data-type="user" data-id="{id}"><span class="glyphicon glyphicon-edit"></span></a>',
			'<a class="btn btn-default btn-xs" title="删除" href="/ajax/del?from=user&id={id}" data-item-selector="tr" data-action-del="三思啊，删了可就没啦！"><span class="glyphicon glyphicon-remove"></span></a>',
		'</td>',
	'</tr>'].join('');
	
	function render(tpl,data){
		var txt = '';
		for(var i=0 in data){
			txt += tpl.replace(/{(\w*)}/g,function(){
				var key = arguments[1];
				return data[i][key] || '';
			});
		}
		return txt;
	}
	
	function userList(dom){
		$.ajax({
			'url' : '/ajax/user/list',
			'success' : function(d){
				var html = ['<div class="col-md-12 custom-mb10">',
					'<a href="/admin/publish/user" class="btn btn-primary btn-sm custom-lofox" role="button">增加用户</a>',
				'</div>',
				'<div class="col-md-12">',
					'<div class="panel panel-default">',
						'<table class="table table-hover">',
						'<tr><th>标题</th><th>邮箱</th><th>用户组</th><th>操作</th></tr>'].join('');
				html += render(userItem,d.list);
				html += '</table></div></div>';
				dom.html(html);
			},
			'error' : function(){
				dom.html('error');
			}
		})
	}
	
	exports.userList = userList;
})(window.admin.render);


/**
 * 权限列表
 **/
(function(exports){
	var userItem = ['<tr>',
		'<td>{id}</td>',
		'<td>{name}</td>',
		'<td>{discription}</td>',
		'<td>',
			'<a class="btn btn-default btn-xs custom-publish" href="javascript:void(0)" data-type="power" data-id="{id}"><span class="glyphicon glyphicon-edit"></span></a>',
			'<a class="btn btn-default btn-xs" title="删除" href="/ajax/del?from=power&id={id}" data-item-selector="tr" data-action-del="三思啊，删了可就没啦！"><span class="glyphicon glyphicon-remove"></span></a>',
		'</td>',
	'</tr>'].join('');
	
	function render(tpl,data){
		var txt = '';
		for(var i=0 in data){
			txt += tpl.replace(/{(\w*)}/g,function(){
				var key = arguments[1];
				return data[i][key] || '';
			});
		}
		return txt;
	}
	
	function userList(dom){
		$.ajax({
			'url' : '/ajax/power',
			'data' : {
				'act' : 'get_list',
				'limit' : 60
			},
			'success' : function(d){
				var html = ['<div class="col-md-12 custom-mb10">',
					'<a href="/admin/publish/power" class="btn btn-primary btn-sm custom-lofox" role="button">加权限</a>',
				'</div>',
				'<div class="col-md-12">',
					'<div class="panel panel-default">',
						'<table class="table table-hover custom-listTable">',
						'<tr><th>#</th><th>权限名</th><th>权限描述</th><th>操作</th></tr>'].join('');
				html += render(userItem,d.list);
				html += '</table></div></div>';
				dom.html(html);
			},
			'error' : function(){
				dom.html('error');
			}
		})
	}
	exports.powerList = userList;
})(window.admin.render);