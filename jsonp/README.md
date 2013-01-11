# d3.jsonp

Demo: <http://bl.ocks.org/4494715>

A plugin for supporting the [JSONP](http://json-p.org/) technique of requesting
cross-domain JSON data. This plugin is unstable and in development.

Whenever possible, _use [CORS](http://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
instead of JSONP_. CORS handles errors properly, has better security, and
supports formats besides JSON. See [enable-cors.org](http://enable-cors.org/) for more
information.

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
