# d3.cie

A plugin for CIE L\*a\*b\* support.

To create a L\*a\*b\* color, use the `d3.cie.lab` constructor:

```js
var color = d3.cie.lab(51.48, -55.52, 52.88);
```

The constructor might also parse a CSS3 string, for convenience:

```js
var color = d3.cie.lab("lab(51.48,-55.52,52.88)");
```

Likewise, to convert from RGB to L\*a\*b\*, simply specify an RGB color. These are
all equivalent:

```js
var color = d3.cie.lab("#048F07");
var color = d3.cie.lab("rgb(4,143,7)");
var color = d3.cie.lab(d3.rgb(4, 143, 7));
```

To convert back to RGB, you can simply toString the object; thus, it is suitable
for us in conjunction with selection.attr and selection.style:

```js
d3.select("body")
    .style("background", d3.cie.lab(51.48, -55.52, 52.88));
```
