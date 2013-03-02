NODE_PATH ?= ./node_modules
JS_UGLIFY = uglifyjs
JS_TESTER = $(NODE_PATH)/vows/bin/vows

all: \
	d3.geo.projection.js \
	d3.geo.projection.min.js

d3.geo.projection.js: \
	geo/projection/start.js \
	geo/projection/projection.js \
	geo/projection/parallel1.js \
	geo/projection/parallel2.js \
	geo/projection/quincuncial.js \
	geo/projection/interrupt.js \
	geo/projection/elliptic.js \
	geo/projection/aitoff.js \
	geo/projection/guyou.js \
	geo/projection/mollweide.js \
	geo/projection/sinusoidal.js \
	geo/projection/sinu-mollweide.js \
	geo/projection/armadillo.js \
	geo/projection/august.js \
	geo/projection/baker.js \
	geo/projection/berghaus.js \
	geo/projection/boggs.js \
	geo/projection/bonne.js \
	geo/projection/bromley.js \
	geo/projection/collignon.js \
	geo/projection/conic-conformal.js \
	geo/projection/conic-equidistant.js \
	geo/projection/craig.js \
	geo/projection/craster.js \
	geo/projection/cylindrical-equal-area.js \
	geo/projection/eckert1.js \
	geo/projection/eckert2.js \
	geo/projection/eckert3.js \
	geo/projection/eckert4.js \
	geo/projection/eckert5.js \
	geo/projection/eckert6.js \
	geo/projection/eisenlohr.js \
	geo/projection/fahey.js \
	geo/projection/gringorten.js \
	geo/projection/hammer-retroazimuthal.js \
	geo/projection/hammer.js \
	geo/projection/hatano.js \
	geo/projection/healpix.js \
	geo/projection/hill.js \
	geo/projection/homolosine.js \
	geo/projection/kavrayskiy7.js \
	geo/projection/lagrange.js \
	geo/projection/larrivee.js \
	geo/projection/laskowski.js \
	geo/projection/littrow.js \
	geo/projection/loximuthal.js \
	geo/projection/miller.js \
	geo/projection/modified-stereographic.js \
	geo/projection/mt-flat-polar-parabolic.js \
	geo/projection/mt-flat-polar-quartic.js \
	geo/projection/mt-flat-polar-sinusoidal.js \
	geo/projection/natural-earth.js \
	geo/projection/nell-hammer.js \
	geo/projection/peirce-quincuncial.js \
	geo/projection/polyconic.js \
	geo/projection/rectangular-polyconic.js \
	geo/projection/robinson.js \
	geo/projection/satellite.js \
	geo/projection/times.js \
	geo/projection/two-point-azimuthal.js \
	geo/projection/two-point-equidistant.js \
	geo/projection/van-der-grinten.js \
	geo/projection/van-der-grinten2.js \
	geo/projection/van-der-grinten3.js \
	geo/projection/van-der-grinten4.js \
	geo/projection/wagner4.js \
	geo/projection/wagner6.js \
	geo/projection/wagner7.js \
	geo/projection/wiechel.js \
	geo/projection/winkel3.js \
	geo/projection/end.js

test: all
	@$(JS_TESTER) $(shell find . -name "*-test.js" \! -path "./node_modules/*")

%.min.js: %.js Makefile
	@rm -f $@
	$(JS_UGLIFY) $< -c -m -o $@

d3%js: Makefile
	@rm -f $@
	@cat $(filter %.js,$^) > $@.tmp
	$(JS_UGLIFY) $@.tmp -b indent-level=2 -o $@
	@rm $@.tmp
	@chmod a-w $@

clean:
	rm -f d3.*.js
