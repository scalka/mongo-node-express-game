let gulp = require('gulp');
let browserSync = require('browser-sync');

let reload = browserSync.reload;
let nodemon = require('gulp-nodemon');

gulp.task('browser-sync', ['nodemon'], function() {
  browserSync.init(null, {
    proxy: 'http://localhost:8000', // port of node server
  });
});

gulp.task('default', ['browser-sync'], function() {
  gulp.watch(['./public/*.html'], reload);
  gulp.watch('./public/*.js', reload);
});

gulp.task('nodemon', function(cb) {
  let callbackCalled = false;
  return nodemon({script: 'server.js'}).on('start', function() {
    if (!callbackCalled) {
      callbackCalled = true;
      cb();
    }
  });
});
