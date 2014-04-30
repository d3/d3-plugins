A D3 linear scale that provides an implementation of Dave Green’s [cubehelix color scheme](http://www.mrao.cam.ac.uk/~dag/CUBEHELIX/).

See [bl.ocks.org/11413789](http://bl.ocks.org/mbostock/11413789) for an example.

<a href="#cubehelix" name="cubehelix">#</a> d3.scale.<b>cubehelix</b>

Constructs a new linear cubehelix scale with the default domain [0, 1] and range parameters.

<a href="#startHue" name="startHue">#</a> cubehelix.<b>startHue</b>([<i>startHue</i>])

Specifies the starting hue of the range in degrees. The smallest value in the domain is mapped to this hue. If no argument is specified, returns the scale’s current starting hue, which defaults to 420°.

To convert from the original color scheme’s <i>START</i> parameter, use the following equality: <i>startHue</i> = <i>(START / 3 + 1) * 360</i>.

<a href="#endHue" name="endHue">#</a> cubehelix.<b>endHue</b>([<i>endHue</i>])

Specifies the ending hue of the range in degrees. The smallest value in the domain is mapped to this hue. If no argument is specified, returns the scale’s current ending hue, which defaults to -120°.

To convert from the original color scheme’s <i>START</i> and <i>ROTS</i> parameters, use the following equality: <i>endHue</i> = <i>(START / 3 + 1 + ROTS) * 360</i>.

<a href="#saturation" name="saturation">#</a> cubehelix.<b>saturation</b>([<i>saturation</i>])

Specifies the average saturation of colors in the output range. If no argument is specified, returns the scale’s current average saturation, which defaults to 0.6.

To convert from the original color scheme’s <i>HUE</i> parameter, use the following equality: <i>saturation</i> = <i>HUE</i> / 2.

<a href="#gamma" name="gamma">#</a> cubehelix.<b>gamma</b>([<i>gamma</i>])

Specifies the gamma correction value. If no argument is specified, returns the scale’s current gamma correction value, which defaults to 1.

<a href="#domain" name="domain">#</a> cubehelix.<b>domain</b>([<i>domain</i>])

Sets the scale’s domain; see [linear.domain](https://github.com/mbostock/d3/wiki/Quantitative-Scales#linear_domain).

<a href="#nice" name="nice">#</a> cubehelix.<b>nice</b>([<i>nice</i>])

Nices the scale’s domain; see [linear.nice](https://github.com/mbostock/d3/wiki/Quantitative-Scales#linear_nice).

<a href="#clamp" name="clamp">#</a> cubehelix.<b>clamp</b>([<i>clamp</i>])

Clamps the scale’s domain; see [linear.clamp](https://github.com/mbostock/d3/wiki/Quantitative-Scales#linear_clamp).
