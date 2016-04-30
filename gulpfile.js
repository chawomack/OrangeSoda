var gulp = require('gulp');
var gulpUtil = require('gulp-util');
var childProcess = require('child_process');

gulp.task('default', function(){
  childProcess.exec('mongod', function(err, stdout, stderr){
    gulpUtil.log(stdout);
  });
  childProcess.exec('mongorestore 6DegreesCRM 6DegreesCRM', function(err, stdout, stderr){
    gulpUtil.log(stdout);
  });
  childProcess.exec('npm start', function(err, stdout, stderr){
    gulpUtil.log(stdout);
  });
});
