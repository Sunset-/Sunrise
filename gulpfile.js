var gulp = require('gulp'),
	sftp = require('gulp-sftp'),
	zip = require('gulp-zip'),
	path = require('path'),
	moment = require('moment'),
	gulpSequence = require('gulp-sequence'),
	gulpSSH = require('gulp-ssh'),
	config = require('./publishConfig.json');

var publishFileName;

var buildDir = [
	'assets*/**/*',
	'page*/**/*',
	'common*/**/*',
	'components*/**/*',
	'config*/**/*',
	'enum*/**/*',
	'holder*/**/*',
	'middlewares*/**/*',
	'base*/**/*',
	'system*/**/*',
	'business*/**/*',
	'loader*/**/*',
	'wechat*/**/*',
	'logs*/**/*',
	'app.js',
	'package.json',
	'process.json'
];


gulp.task('zip', function() {
	return gulp.src(buildDir)
		.pipe(zip(publishFileName = ('build-' + moment().format("YYYYMMDD-HHmm") + '.zip')))
		.pipe(gulp.dest('publish'));
});
//上传到远程服务器任务
gulp.task('upload', function() {
	return gulp.src(path.resolve(__dirname, config.buildDir) + '/' + publishFileName)
		.pipe(sftp({
			host: config.sftp.host,
			port: config.sftp.port,
			user: config.sftp.user,
			key: config.sftp.key,
			pass: config.sftp.pass,
			remotePath: config.sftp.remotePath
		}));
});
//解压服务器文件
gulp.task('unzip', ['upload'], function() {
	var SSH = new gulpSSH({
		ignoreErrors: false,
		sshConfig: {
			host: config.sftp.host,
			port: config.sftp.port,
			username: config.sftp.user,
			password: config.sftp.pass
		}
	});
	SSH.shell(['cd ' + config.sftp.remotePath, 'unzip -o ' + publishFileName, 'rm -rf ' + publishFileName,'pm2 restart 0'], {
			filePath: 'shell.log'
		})
		.pipe(gulp.dest('logs'));
});

gulp.task('publish', function(cb) {
	gulpSequence('zip', 'unzip', cb);
})