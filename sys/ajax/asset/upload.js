/*
 * author bh-lay
 * demo 
 */

var fs = require('fs');
var parse = require('../../core/parse');
var assetPath = "../../asset/";

exports.upload = function (req,callback){
	parse.request(req,function(err,fields, files){
		var errorFiles = [];
		if(err){
			callback && callback(err);
		}else if(files.length){
			var newFiles = [];
			var root = fields.root;
			//消除参数中首尾的｛/｝
			root = root.replace(/^\/|\/$/g,'');
			
			
			for(var i in files){
				var newPath = assetPath  + '/' + root + '/' + files[i].name;
				
				//禁止上传同名文件
				var exists = fs.existsSync(newPath);
				if(exists){
					errorFiles.push({
						'name' : files[i]['name']
					});
				}else{
					fs.rename(files[i].path,newPath);
					newFiles.push({
	 	    			'name' : files[i]['name'],
	 	    			'path' : 'http://asset.bh-lay.com/' + root + '/' + files[i]['name']
	 	    		});
				}
			}
			callback && callback(null,newFiles);
		}
	});
}
