'use strict';

var ConcatSource = require('webpack-core/lib/ConcatSource');
var ModuleFilenameHelpers = require('webpack/lib/ModuleFilenameHelpers');
var path = require('path');
var fs = require('fs');
var adPath = require.resolve('async-define');
var adTemplatePath = path.join(adPath, '../../templates/main.hbs');
var adTemplateFragments = fs.readFileSync(adTemplatePath, 'utf8').split('__placeholder__');
var header = adTemplateFragments[0];
var footer = adTemplateFragments[1];

function WrapperPlugin() {
}

function apply(compiler) {
  var options = compiler.options;
	options.test = options.test || /\.js($|\?)/i;

  options.output.libraryTarget = 'amd'; // the plugin is compatible with amd only

  compiler.plugin('compilation', function (compilation) {
    compilation.plugin('optimize-chunk-assets', function (chunks, done) {
      wrapChunks(compilation, chunks);
      done();
    })
  });

  function wrapFile(compilation, fileName) {
    console.log('FileName', fileName);

    compilation.assets[fileName] = new ConcatSource(
        header,
        compilation.assets[fileName],
        footer);
  }

  function wrapChunks(compilation, chunks) {
    var files = [];
    chunks.forEach(function(chunk) {
      chunk.files.forEach(function(file) {
        files.push(file);
      });
    });
    compilation.additionalChunkAssets.forEach(function(file) {
      files.push(file);
    });
    files = files.filter(ModuleFilenameHelpers.matchObject.bind(undefined, options));

    files.forEach(function (fileName) {

      wrapFile(compilation, fileName);
    });
  }
}

Object.defineProperty(WrapperPlugin.prototype, 'apply', {
  value: apply,
  enumerable: false
});

module.exports = WrapperPlugin;
