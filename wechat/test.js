var token = '7x3vLIitqNiNdPEI6XqD4ACJ8cY1QUkkXI9hZe8VFltRGSUQDBqc9oBfkIRi1sgcuulr_9v0ptGueacG2IYJLbWBWPBgBzVRrC75PNTOrC4FsQsAAI3utc0Ru7G22-6mQURhAAAZDA';

var api = require('./api');


api.menu.createMenu(token).then(function(a){
	console.log(a)
});