d3.urllib
=========

a simple d3 plugin to manage pushing and pulling the visualization state to the brower url

tests
-----
no test suite, I've tested in in Chrome v35 for reasonable use cases

example
-------
also no simple example, but you can see it in use here:
http://www.uvm.edu/storylab/share/papers/dodds2014a/books.html

documentation
-------------
right now, only works for strings and lists of strings

create an instance of urllib to append some variable to the url: (here we're creating it for a varible lens with the value lensExtent, a list of two numbers

```javascript
lensencoder = d3.urllib.encoder().varname("lens").varval(lensExtent);
```

then we update the url (when a slider is dragged, etc) with:
```javascript
lensencoder.varval(lensExtent);	
```

If you don't want the URL to update until you've called the lensencoder again, don't apply the .varval yet.
