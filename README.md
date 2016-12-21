webpack-async-define
====================
This simple plugin can be used to wrap a webpack bundle in async-define.

How to use it
-------------
Step 1: Set the name of your bundle (optional):
```
output: {
  ...
  library: 'Foo',
  libraryTarget: 'amd' // this is forced automatically by the plugin
},
```
Step 2: Set the external devDependencies (optional)
```
externals: {
  react: 'react-15.3',
  'react-dom': 'reactdom-15.3',
  nameOfTheLib: label,
},
```
Step 3: Use the plugin
```
var WPAsyncDefine = require('webpack-async-define');
...
plugins: [
  ...
  new WPAsyncDefine(),
],
```

You can now use this library with async-define (https://github.com/tes/async-define).

Note: This procedure does not allow to create a bundle that satisfies MULTIPLE dependencies. You can do it manually building something like this:
```
var asyncDefine = require('async-define');
var react = require('react');
var reactDom = require('react-dom');

asyncDefine('react-15.3', function () {
  return react;
});

asyncDefine('reactdom-15.3', function () {
  return reactDom;
});
```
