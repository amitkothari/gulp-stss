gulp-stss [![Build Status](https://travis-ci.org/amitkothari/gulp-stss.png?branch=master)](https://travis-ci.org/amitkothari/gulp-stss)
=========

Gulp plugin for [stss](https://github.com/RonaldTreur/STSS) 

## Installation

[![NPM](https://nodei.co/npm/gulp-stss.png)](https://nodei.co/npm/gulp-stss/)

~~~
$ npm install -g gulp-stss
~~~


## Usage

```

var stss = require('gulp-stss');

gulp.task('styles', function () {
    gulp.src(['app/**/*.stss', '!**/_*.stss'])
        .pipe(stss())
        .pipe(gulp.dest('app'));
});
```

## Licence
Licensed under the [MIT License](http://opensource.org/licenses/MIT)
