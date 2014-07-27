var should = require('should');
var stss = require('../');
var gutil = require('gulp-util');
var fs = require('fs');
var pj = require('path').join;

function createVinyl(stssFileName, contents) {
    var base = pj(__dirname, 'fixtures');
    var filePath = pj(base, stssFileName);

    return new gutil.File({
        cwd: __dirname,
        base: base,
        path: filePath,
        contents: contents || fs.readFileSync(filePath)
    });
}

function verifyFileExist(file) {
    should.exist(file);
    should.exist(file.path);
    should.exist(file.relative);
    should.exist(file.contents);
}

describe('gulp-stss', function () {
    describe('stss()', function () {

        it('should pass file when it is null', function (done) {
            var stream = stss();
            var emptyFile = {
                isNull: function () {
                    return true;
                }
            };
            stream.on('data', function (data) {
                data.should.equal(emptyFile);
                done();
            });
            stream.write(emptyFile);
        });

        it('should emit error when file is stream', function (done) {
            var stream = stss();
            var streamFile = {
                isNull: function () {
                    return false;
                },
                isStream: function () {
                    return true;
                }
            };
            stream.on('error', function (err) {
                err.message.should.equal('Streaming not supported');
                done();
            });
            stream.write(streamFile);
        });

        it('should compile single stss file', function (done) {
            var stssFile = createVinyl('file1.stss');

            var stream = stss();
            stream.on('data', function (cssFile) {
                verifyFileExist(cssFile);
                cssFile.path.should.equal(pj(__dirname, 'fixtures', 'file1.tss'));
                String(cssFile.contents).should.equal(
                    fs.readFileSync(pj(__dirname, 'expect/file1.tss'), 'utf8'));
                done();
            });
            stream.write(stssFile);
        });

        it('should emit error when stss contains errors', function (done) {
            var stream = stss();
            var errorFile = createVinyl('somefile.stss',
                new Buffer('.container {      backgroundColor: $undefinedVariable;    }'));
            stream.on('error', function () {
                done();
            });
            stream.on('data', function () {
                should.fail('should emit error');
                done();
            });
            stream.write(errorFile);
        });

        it('should continue to process next files when stss error occurs', function (done) {
            var stream = stss();

            var errorFile = createVinyl('somefile.stss',
                new Buffer('.container {      backgroundColor: $undefinedVariable;    }'));
            var normalFile = createVinyl('file1.stss');

            var errorHandled = false;
            var dataHandled = false;

            stream.on('error', function () {
                errorHandled = true;
                if (dataHandled) {
                    done();
                }
            });
            stream.on('data', function () {
                dataHandled = true;
                if (errorHandled) {
                    done();
                }
            });
            stream.write(errorFile);
            stream.write(normalFile);
        });

        it('should compile multiple stss files', function (done) {
            var files = [
                createVinyl('file1.stss'),
                createVinyl('file2.stss'),
                createVinyl('file3.stss')
            ];

            var stream = stss();
            var count = files.length;
            stream.on('data', function (cssFile) {
                verifyFileExist(cssFile);
                if (!--count) {
                    done();
                }
            });

            files.forEach(function (file) {
                stream.write(file);
            });
        });
    });
});
