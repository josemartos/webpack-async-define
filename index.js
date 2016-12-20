'use strict';

var ConcatSource = require('webpack-core/lib/ConcatSource');
var path = require('path');
var fs = require('fs');
var adPath = require.resolve('async-define');
var adTemplatePath = path.join(adPath, '../../templates/main.hbs');
var adTemplateFragments = fs.readFileSync(adTemplatePath, 'utf8').split('__placeholder__');
var header = adTemplateFragments[0];
var footer = adTemplateFragments[1];

function WrapperPlugin() {

  this.header = header;
  this.footer = footer;
}

function apply(compiler) {
  var header = this.header;
  var footer = this.footer;

  compiler.plugin('compilation', function (compilation) {
    compilation.plugin('optimize-chunk-assets', function (chunks, done) {
      wrapChunks(compilation, chunks, footer, header);
      done();
    })
  });

  function wrapFile(compilation, fileName) {
    var headerContent = (typeof header === 'function') ? header(fileName) : header;
    var footerContent = (typeof footer === 'function') ? footer(fileName) : footer;

    compilation.assets[fileName] = new ConcatSource(
        String(headerContent),
        compilation.assets[fileName],
        String(footerContent));
  }

  function wrapChunks(compilation, chunks) {
    chunks.forEach(function (chunk) {
      chunk.files.forEach(function (fileName) {
        wrapFile(compilation, fileName);
      });
    });
  }
}

Object.defineProperty(WrapperPlugin.prototype, 'apply', {
  value: apply,
  enumerable: false
});

module.exports = WrapperPlugin;
