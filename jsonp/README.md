# d3.jsonp

Demo: <http://bl.ocks.org/4494715>

A plugin for supporting the [JSONP](http://json-p.org/) technique of requesting
cross-domain JSON data. This plugin is unstable and in development.

```js
// autogenerate a callback in the form d3.jsonp.foo
d3.jsonp('foo.jsonp?callback={callback}', function() {
  console.log(arguments);
});

// specify a callback
d3.jsonp('foo.jsonp?callback=d3.jsonp.foo', function() {
  console.log(arguments);
});
```

This plugin requires servers to accept callbacks with numeric and `.`
characters. Unlike `d3.xhr` functions, there is no error handling.
