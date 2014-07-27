var stss = require('stss');
var through2 = require('through2');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;
var path = require('path');

module.exports = function () {

  function transform(file, enc, next) {
    var self = this;

    if (file.isNull()) {
      this.push(file);
      return next();
    }

    if (file.isStream()) {
      this.emit('error', new PluginError('gulp-stss', 'Streaming not supported'));
      return next();
    }

    var stssContent = file.contents.toString('utf8');

    stss.renderSync({
      data: stssContent,
      includePaths: [path.dirname(file.path)],
      success: function (tss) {
        file.contents = new Buffer(tss);
        file.path = gutil.replaceExtension(file.path, '.tss');
        self.push(file);
        next();
      },
      error: function (err) {
        self.emit('error', new PluginError('gulp-stss', err));
        next();
      }
    });
  }

  return through2.obj(transform);
};




