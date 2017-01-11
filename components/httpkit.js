var http = require('http'),
	https = require('https'),
	URL = require('url'),
	querystring = require('querystring');

function request(url, params, headers, method, extOptions) {
	var options = URL.parse(url);
	options.method = method || 'GET';
	options.headers = headers || {};
	var postData = JSON.stringify(params || {});
	var pData = querystring.stringify(params)
	options.headers['Content-Length'] = sizeOfHttpBody(postData);
	var h = (options.protocol == 'https:') ? https : http;
	var data = '';
	return new Promise((resolve, reject) => {
		let req = h.request(options, function (res) {
			res.on('data', function (buffer) {
				data += buffer.toString();
			});
			res.on('end', function () {
				try {
					resolve(JSON.parse(data));
				} catch (e) {
					resolve(data);
				}
			});
		});
		if (postData && postData.length > 0) {
			req.write(postData + '\n');
		}
		req.end();
		req.on('error', function (err) {
			reject(err);
		});
	});
}


function get(options) {
	if (typeof options == 'string') {
		options = {
			url: options
		};
	}
	return request(options.url, options.data, {
		'Content-Type': 'application/x-www-form-urlencoded'
	}, 'GET', options);
}

function post(options) {
	return request(options.url, options.data, {
		"Content-Type": 'application/json'
	}, 'POST', options);
}

function put(options) {
	return request(options.url, options.data, options.headers, 'PUT', options);
}

var sizeOfHttpBody = function (str, charset) {
	var total = 0,
		charCode,
		i,
		len;
	charset = charset ? charset.toLowerCase() : '';
	if (charset === 'utf-16' || charset === 'utf16') {
		for (i = 0, len = str.length; i < len; i++) {
			charCode = str.charCodeAt(i);
			if (charCode <= 0xffff) {
				total += 2;
			} else {
				total += 4;
			}
		}
	} else {
		for (i = 0, len = str.length; i < len; i++) {
			charCode = str.charCodeAt(i);
			if (charCode <= 0x007f) {
				total += 1;
			} else if (charCode <= 0x07ff) {
				total += 2;
			} else if (charCode <= 0xffff) {
				total += 3;
			} else {
				total += 4;
			}
		}
	}
	return total;
}

module.exports = {
	get: get,
	post: post,
	put: put
};