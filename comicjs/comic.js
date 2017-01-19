/**
 * @brief Comic style version of common drawing functions.
 *
 * Comic style version of common drawing functions, that is
 * implemented as library agnostic JS extension. Only assuming
 * that given "lib" can be extended the JS way (setting properties)
 * and that if a "path" method is given, it is a drawing method
 * which understands standard SVG path format strings.
 * If no "path" is given, it will check if "lib" is a 2d canvas context
 * and use context drawing functions. If "lib" is not a 2d canvas
 * context, as last guess it will try to call an SVG "path" method
 * directly on the "lib" object.
 *
 * Credits:
 * Inspired by and based on Jonas Wagner's work
 * http://29a.ch/2010/2/10/hand-drawn-lines-algorithm-javascript-canvas-html5
 * which is based on this paper
 * http://iwi.eldoc.ub.rug.nl/FILES/root/2008/ProcCAGVIMeraj/2008ProcCAGVIMeraj.pdf
 *
 * @author Balint Morvai <balint@morvai.de>
 * @license http://en.wikipedia.org/wiki/MIT_License MIT License
 */
// global object
COMIC = { version: 0.94 };

(function() {
/**
 * @var object global "C" object
 */
var C = COMIC;
/**
 * @var int length of one step - each step means new "hand jitter"
 */
var fsteps = 50;
/**
 * @var int min number of steps
 */
var msteps = 4;
/**
 * @var float fuzzyness factor
 */
var ff = 8.0;
/**
 * @var float fuzzyness factor for circle & ellipse
 */
var ffc = ff / 20;
/**
 * @var object 2d canvas context (if any)
 */
var context = undefined;
/**
 * @var function code to execute when starting drawing a shape
 */
var begin = function() {};
/**
 * @var function code to execute when finished drawing a shape
 */
var finish = function() {};
/**
 * @var function code to draw comic path using specific user lib
 */
var path = function() {};
/**
 * @var string path string built upon subsequent calls of "path" function
 */
var pathStr = "";
/**
 * @var int decimal precision to which all drawing coordinates will be rounded
 */
var precision = 10;
/**
 * @var int factor used by local "round" function, auto calculated from precision
 */
var roundFactor = Math.pow(10, precision);
/**
 * @var point current drawing point of path - needed for continuous paths
 */
C.pathPos = { x:0, y:0 };

/**
 * Public function to allow user defined options, also
 * setting a 2d canvas context for drawing.
 *
 * @param options object with options
 * @return C object
 */
C.init = function(options) {
    // no need to deep copy & no need to drop unknown options
    for(var prop in options) {
        if(options.hasOwnProperty(prop)) {
            C[prop] = options[prop];
        }
    }
    
    if(typeof options["context"] == "object") {
        bindTo("canvas", C.context);
    }
    
    return C;
}

/**
 * Public function to init drawing functions on the given
 * 2d canvas context.
 *
 * @param context 2d canvas context
 * @return C object
 */
C.ctx = function(context) {
    C.init({ "context": context });

    return C;
}

/**
 * Binds comic drawing functions to the given library using the
 * given method to draw svg paths. If no method is given (2nd param),
 * it tries to call "path" directly on lib.
 *
 * @param libName root object to hook in to
 * @param lib root object to hook in to
 * @return void
 */
var bindTo = function(libName, lib) {
    /**
     * WRAPPER for real, private "cBezier3"
     * hand draw a cubic Bezier curve
     *
     * @param x0 x starting point
     * @param y0 y starting point
     * @param cx0 x 1st control point
     * @param cy0 y 1st control point
     * @param cx1 x 2nd control point
     * @param cy1 y 2nd control point
     * @param x1 x end point
     * @param y1 y end point
     * @return native library object
     */
    lib.cBezier3 = function(x0, y0, cx0, cy0, cx1, cy1, x1, y1) {
        begin.call(this);
        cBezier3.call(this, x0, y0, cx0, cy0, cx1, cy1, x1, y1);
        return finish.call(this);
    }
    
    /**
     * Private version that does not call "begin" or "finish".
     * Wrapped by "cBezier3" public.
     * hand draw a cubic Bezier curve
     *
     * @param x0 x starting point
     * @param y0 y starting point
     * @param cx0 x 1st control point
     * @param cy0 y 1st control point
     * @param cx1 x 2nd control point
     * @param cy1 y 2nd control point
     * @param x1 x end point
     * @param y1 y end point
     * @return native library object
     */
    var cBezier3 = function(x0, y0, cx0, cy0, cx1, cy1, x1, y1) {
        // number of steps - this is a very primitive approach to
        // estimate the Bezier arc length
        var d = dist2(x0, y0, x1, y1) * 3;
        var steps = Math.ceil(Math.pow(d / C.fsteps, 0.9));
        // fuzzyness
        var f = C.ff * 0.8;
        
        var p0 = [x0, y0];
        var pc0 = [cx0, cy0];
        var pc1 = [cx1, cy1];
        var p1 = [x1, y1];
        var curve2 = [p0, pc0, pc1, p1];
        for(var i = steps; i > 0; i--) {
            // split curve2
            var points = bsplit(curve2, 1/i);
            var curve1 = points[0];
            var curve2 = points[1];
            // set points for drawing from curve1
            p0 = curve1[0]; pc0 = curve1[1];  pc1 = curve1[2]; p1 = curve1[3];
            
            path.call(this, p0[0], p0[1],
                fuzz((pc0[0]+pc1[0])/2, f), // just make one control point
                fuzz((pc0[1]+pc1[1])/2, f),
                p1[0], p1[1]);
        }
        
        return this;
    }

    /**
     * WRAPPER for real, private "cBezier2"
     * hand draw a quadratic Bezier curve
     *
     * @param x0 x starting point
     * @param y0 y starting point
     * @param cx x control point
     * @param cy y control point
     * @param x1 x end point
     * @param y1 y end point
     * @return native library object
     */
    lib.cBezier2 = function(x0, y0, cx, cy, x1, y1) {
        begin.call(this);
        cBezier2.call(this, x0, y0, cx, cy, x1, y1);
        return finish.call(this);
    }
    
    /**
     * Private version that does not call "begin" or "finish".
     * Wrapped by "cBezier2" public.
     * hand draw a quadratic Bezier curve
     *
     * @param x0 x starting point
     * @param y0 y starting point
     * @param cx x control point
     * @param cy y control point
     * @param x1 x end point
     * @param y1 y end point
     * @return native library object
     */
    var cBezier2 = function(x0, y0, cx, cy, x1, y1) {
        // number of steps - this is a very primitive approach to
        // estimate the Bezier arc length
        var d = dist2(x0, y0, x1, y1) * 3;
        var steps = Math.ceil(Math.pow(d / C.fsteps, 0.9));
        // fuzzyness
        var f = C.ff * 0.8;
        
        var p0 = [x0, y0];
        var pc = [cx, cy];
        var p1 = [x1, y1];
        var curve2 = [p0, pc, p1];
        for(var i = steps; i > 0; i--) {
            // split curve2
            var points = bsplit(curve2, 1/i);
            var curve1 = points[0];
            var curve2 = points[1];
            // set points for drawing from curve1
            p0 = curve1[0]; pc = curve1[1]; p1 = curve1[2];
            
            path.call(this, p0[0], p0[1], fuzz(pc[0], f), fuzz(pc[1], f), p1[0], p1[1]);
        }
        
        return this;
    }

    /**
     * WRAPPER for real, private "cEllipse"
     * Draw a comic style / hand drawn cEllipse
     *
     * @param x x center
     * @param y y center
     * @param rh horizontal radius
     * @param rv vertical radius
     * @param rot rotation in radians (< 2*PI)
     * @param start start in radians (< 2*PI) for drawing an arc only (optional)
     * @param end end in radians (< 2*PI) for drawing an arc only (optional)
     * @return native library object
     */
    lib.cEllipse = function(x, y, rh, rv, rot, start, end) {
        begin.call(this);
        cEllipse.call(this, x, y, rh, rv, rot, start, end);
        return finish.call(this);
    }
    
    /**
     * Private version that does not call "begin" or "finish".
     * Wrapped by "cEllipse" public.
     * hand draw an ellipse
     *
     * @param x x center
     * @param y y center
     * @param rh horizontal radius
     * @param rv vertical radius
     * @param rot rotation in radians (< 2*PI)
     * @param start start in radians (< 2*PI) for drawing an arc only (optional)
     * @param end end in radians (< 2*PI) for drawing an arc only (optional)
     * @return native library object
     */
    var cEllipse = function(x, y, rh, rv, rot, start, end) {
        var PI2 = Math.PI * 2;
        // sanitize input
        start = (typeof start == "undefined") ? 0 : Math.min(PI2-0.005*PI2, start);
        end = (typeof end == "undefined") ? PI2 : Math.min(PI2, end);
        rot = (typeof rot == "undefined") ? 0 : Math.min(PI2, rot);
        // rotation
        var cosRot = Math.cos(rot);
        var sinRot = Math.sin(rot);
        // number of steps
        var steps = Math.ceil(Math.pow(rh * rv, 0.25) * 3);
        // fuzzyness dependent on radius
        var fh = C.ffc * Math.pow(rh * 3, 0.35)
                * Math.sqrt((rh < 25) ? 25 / rh : 1); // boost fuzz for small ellipses
        var fv = C.ffc * Math.pow(rv * 3, 0.35)
                * Math.sqrt((rv < 25) ? 25 / rv : 1);
        // distortion of the ellipse
        var xs = 0.95 + Math.random() * 0.1;
        var ys = 0.95 + Math.random() * 0.1;
        var rxs = rh * xs;
        var rys = rv * ys;
        // lenght of one segment
        var arcLength = end - start;
        var segLength = arcLength / steps;

        // initial values for i = 0
        var t1 = start; var t0, x0, y0;
        var cosT1rxs = rxs * Math.cos(t1);
        var sinT1rys = rys * Math.sin(t1);
        var x1 = x + cosT1rxs * cosRot - sinT1rys * sinRot;
        var y1 = y + cosT1rxs * sinRot + sinT1rys * cosRot;

        // correct startpoint deviation (through fuzzed radius) by drawing a line
        cLine.call(this,
                   x + rh * Math.cos(t1) * cosRot - rv * Math.sin(t1) * sinRot, // would be start x
                   y + rh * Math.cos(t1) * sinRot + rv * Math.sin(t1) * cosRot, // would be start y
                   x1,  // actual start x
                   y1); // actual start y

        for(var i = 1; i <= steps; i++) {
            t1 = t1 + segLength;
            t0 = t1 - segLength;
            var x0 = x1;
            var y0 = y1;
            var cosT1rxs = rxs * Math.cos(t1);
            var sinT1rys = rys * Math.sin(t1);
            var x1 = x + cosT1rxs * cosRot - sinT1rys * sinRot;
            var y1 = y + cosT1rxs * sinRot + sinT1rys * cosRot;

            path.call(this, x0, y0, fuzz(x0, fh), fuzz(y0, fv), x1, y1);
        }
        // correct endpoint deviation (through fuzzed radius) by drawing a line
        cLine.call(this,
                   x1, // actual end x
                   y1, // actual end y
                   x + rh * Math.cos(t1) * cosRot - rv * Math.sin(t1) * sinRot,  // would be end x
                   y + rh * Math.cos(t1) * sinRot + rv * Math.sin(t1) * cosRot); // would be end y
        
        return this;
    }
    
    /**
     * WRAPPER for real, private "cCircle"
     * Draw a comic style / hand drawn circle
     *
     * @param x x center
     * @param y y center
     * @param r radius
     * @param start start in radians (< 2*PI) for drawing an arc only (optional)
     * @param end end in radians (< 2*PI) for drawing an arc only (optional)
     * @return native library object
     */
    lib.cCircle = function(x, y, r, start, end) {
        begin.call(this);
        cCircle.call(this, x, y, r, start, end);
        return finish.call(this);
    }
    
    /**
     * Private version that does not call "begin" or "finish".
     * Wrapped by "cCircle" public.
     * hand draw a circle
     *
     * @param x x center
     * @param y y center
     * @param r radius
     * @param start start in radians (< 2*PI) for drawing an arc only (optional)
     * @param end end in radians (< 2*PI) for drawing an arc only (optional)
     * @return native library object
     */
    var cCircle = function(x, y, r, start, end) {
        var PI2 = Math.PI * 2;
        // sanitize input
        start = (typeof start == "undefined") ? 0 : Math.min(PI2-0.005*PI2, start);
        end = (typeof end == "undefined") ? PI2 : Math.min(PI2, end);
        // number of steps
        var steps = Math.ceil(Math.sqrt(r) * 3);
        // fuzzyness dependent on on radius
        var f = C.ffc * Math.pow(steps, 0.75)
                * Math.sqrt((r < 25) ? 25 / r : 1); // boost fuzz for small circles
        // distortion of the circle
        var xs = 0.95 + Math.random() * 0.1;
        var rxs = r * xs;
        var rys = r * (2.0 - xs);
        // lenght of one segment
        var arcLength = end - start;
        var segLength = arcLength / steps;

        // initial values for i = 0
        var t1 = start; var t0, x0, y0;
        var x1 = x + Math.cos(t1) * rxs;
        var y1 = y + Math.sin(t1) * rys; // initial values for i = 0
        
        // correct startpoint deviation (through fuzzed radius) by drawing a line
        cLine.call(this,
                   x + Math.cos(t1) * r, // would be start x
                   y + Math.sin(t1) * r, // would be start y
                   x1,  // actual start x
                   y1); // actual start y

        for(var i = 1; i <= steps; i++) {
            t1 = t1 + segLength;
            t0 = t1 - segLength;
            x0 = x1;
            y0 = y1;
            x1 = x + Math.cos(t1) * rxs;
            y1 = y + Math.sin(t1) * rys;

            path.call(this, x0, y0, fuzz(x0, f), fuzz(y0, f), x1, y1);
        }
        // correct endpoint deviation (through fuzzed radius) by drawing a line
        cLine.call(this,
                   x1, // actual end x
                   y1, // actual end y
                   x + Math.cos(t1) * r,  // would be end x
                   y + Math.sin(t1) * r); // would be end y
        
        return this;
    }

    /**
     * Draw a triangle using line function
     *
     * @param x0 x first point
     * @param y0 y first point
     * @param x1 x second point
     * @param y1 y second point
     * @param x2 x third point
     * @param y2 y third point
     * @return native library object
     */
    lib.cTrian = function(x0, y0, x1, y1, x2, y2) {
        begin.call(this);
        cLine.call(this, x0, y0, x1, y1);
        cLine.call(this, x1, y1, x2, y2);
        cLine.call(this, x2, y2, x0, y0);
        return finish.call(this);
    }
    
    /**
     * WRAPPER for real, private "cRect"
     * Draw a comic style / hand drawn rectangle using line function
     *
     * @param x0 x upper left corcer
     * @param y0 y upper left corner
     * @param width width of the rectangle
     * @param height height of the rectangle
     * @param rh horizontal radius of rounded corners
     * @param rv vertical radius of rounded corners
     * @return native library object
     */
    lib.cRect = function(x0, y0, width, height, rh, rv) {
        begin.call(this);
        cRect.call(this, x0, y0, width, height, rh, rv);
        return finish.call(this);
    }

    /**
     * Private version that does not call "begin" or "finish".
     * Wrapped by "cRect" public.
     * Draw a comic style / hand drawn rectangle using line function
     *
     * @param x0 x upper left corcer
     * @param y0 y upper left corner
     * @param width width of the rectangle
     * @param height height of the rectangle
     * @param rh horizontal radius of rounded corners
     * @param rv vertical radius of rounded corners
     * @return native library object
     */
    var cRect = function(x0, y0, width, height, rh, rv) {
        var halfPI;
        // sanitize input
        rh = (typeof rh == "undefined") ? 0 : Math.min(rh, width/2);
        rv = (typeof rv == "undefined") ? rh : Math.min(rv, height/2);
        // calculate lower left corner
        var x1 = x0 + width;
        var y1 = y0 + height;
        
        cLine.call(this, x0+rh, y0, x1-rh, y0);
        if(rh > 0) {
            halfPI = Math.PI / 2;
            cEllipse.call(this, x1-rh, y0+rv, rh, rv, 0, halfPI*3, Math.PI*2);
        }
        cLine.call(this, x1, y0+rv, x1, y1-rv);
        if(rh > 0) {
            cEllipse.call(this, x1-rh, y1-rv, rh, rv, 0, 0, halfPI);
        }
        cLine.call(this, x1-rh, y1, x0+rh, y1);
        if(rh > 0) {
            cEllipse.call(this, x0+rh, y1-rv, rh, rv, 0, halfPI, Math.PI);
        }
        cLine.call(this, x0, y1-rv, x0, y0+rv);
        if(rh > 0) {
            cEllipse.call(this, x0+rh, y0+rv, rh, rv, 0, Math.PI, halfPI*3);
        }
        
        return this;
    }
    
    /**
     * WRAPPER for real, private "cLine"
     * Draw a comic style / hand drawn line
     *
     * @param x0 x start
     * @param y0 y start
     * @param x1 x end
     * @param y1 y end
     * @return native library object
     */
    lib.cLine = function(x0, y0, x1, y1) {
        begin.call(this);
        cLine.call(this, x0, y0, x1, y1);
        return finish.call(this);
    }

    /**
     * Private version that does not call "begin" or "finish".
     * Wrapped by "cLine" public.
     * Draw a comic style / hand drawn line
     *
     * @param x0 x start
     * @param y0 y start
     * @param x1 x end
     * @param y1 y end
     * @return native library object
     */
    var cLine = function(x0, y0, x1, y1) {
        /**
         * Estimate the movement of the arm
         * Reuses 3rd param from last call if omitted
         *
         * @param x0 x start
         * @param x1 x end
         * @param t step from 0 to 1
         * @return number
         */
        var ft; // store this outside function to preserve
        var handMovement = function(x0, x1, t) {
            // calculate ft or use old value if no "t" given
            if(typeof t != "undefined") {
                var pow3 = Math.pow(t, 3);
                var pow4 = pow3 * t;
                var pow5 = pow4 * t;
                ft = (15 * pow4 -
                      6 * pow5 -
                      10 * pow3);
            }
            
            return x0 + (x0 - x1) * ft;
        }
        
        // calculate number of steps
        var d = dist2(x0, y0, x1, y1);
        var steps = Math.ceil(d / C.fsteps);
        if(steps < C.msteps) {
            steps = C.msteps;
        }
        // fuzz factor
        f = C.ff / ((steps == C.msteps) ? 1.4 : 1); // reduce for small lines
        // draw line step by step using quadratic Bézier path
        var xt1 = handMovement(x0, x1, 0); // bezier control point
        var yt1 = handMovement(y0, y1); // bezier control point (reuse t0)

        for(var i = 1; i <= steps; i++) {
            t1 = i / steps;
            var xt0 = xt1; // bezier control point
            var yt0 = yt1; // bezier control point
            var xt1 = handMovement(x0, x1, t1); // bezier end point
            var yt1 = handMovement(y0, y1); // bezier end point (reuse t1)
            
            path.call(this, xt0, yt0, fuzz(xt0, f), fuzz(yt0, f), xt1, yt1);
        }

        return this;
    }

    /**
     * Smart function for digesting input given to "magic" function.
     * It looks for valid drawing elements, svg & g, and tries to find
     * them in SVGDocument, Node and in direct children and parent 
     * elements.
     *
     * @param e Node or Element
     * @return element
     */
    var unWrap = function(e) {
        var msg = "error: no drawing element given"; // in case of error
        found = false; // false until valid drawing object found
        tags = ["svg", "g"] // array of valid drawing tags
        var unArray = function(e) {
            while(isArray(e)) {
                e = e[0];
            }
            return e;
        }
        // unwrap from e.g. SVGDocument
        var unCD = function(e) {
            if(e.contentDocument) e = e.contentDocument;
            return e;
        }
        // look in the "node"
        var unNode = function(e) {
            if(typeof e.node == "object") {
                if(typeof e.node.tagName == "string")
                    e = e.node;
            }
            return e;
        }
        var checkTag = function(e) {
            return (typeof e.tagName != "string") ?
                    false : tags.indexOf(e.tagName) >= 0;
        }
        e = unArray(e);
        e = unCD(e);
        e = unNode(e);
        // looking for an element, not any node, thus with "tagName"
        if(! (found = checkTag(e)) ) {
            // look in direct "child" elements
            if(typeof e.children == "object") {
                var i = 0;
                while(!found && i < e.children.length) {
                    eTmp = unCD(e.children[i]);
                    eTmp = unNode(e.children[i]);
                    if(found = checkTag(eTmp)) e = eTmp;
                    i++;
                }
            }
            // look in direct "parent" element if not yet found
            if(typeof e.parent == "object" && !found) {
                eTmp = unCD(e.children[i]);
                eTmp = unNode(e.children[i]);
                if(found = checkTag(eTmp)) e = eTmp;
            }
        }
        if(!found) throw msg;
        
        return e;
    }

    /**
     * Wrapper calling C.magic with the object called on.
     *
     * @return native lib object
     */
    lib.magic = function() {
        return C.magic.call(this, this);
    }
    
    /**
     * Function to cartoonize any given svg.
     *
     * @param svgs source svg / selection with source svgs to cartoonize
     * @return native lib object
     */
    C.magic = function(svgs) {
        svgs = isArray(svgs) ? svgs : [svgs];
        // rerun for list[i>0]; wont happen in reruns since then svgList.length = 1
        for(var i = 1; i < svgs.length; i++) {
            C.magic.call(this, unWrap(svgs[i]));
        }
        var svg = unWrap(svgs[0]);
        
        // do depth-frist tree traversal & skip branches at unknown tags
        (function walk(e) {
            // recursion if known, unvisited tag - skip branch otherwise
            var adj = e.children;
            for(var i = 0; i < adj.length; i++) {
                if( ! adj[i].hasOwnProperty("walked") ) {
                    adj[i].walked = true;
                    if(["rect", "circle", "ellipse", "line", "polyline", "polygon",
                        "path", "g", "svg"].indexOf(adj[i].tagName) >= 0) {
                        walk.call(this, adj[i]);
                    }
                }
            }
            // do changes on the element
            begin(); // we are using "begin" but wont be using "finish"
            switch(e.tagName) {
                case "rect":
                    reRect.call(this, e);
                    break;
                case "circle":
                    reCircle.call(this, e);
                    break;
                case "ellipse":
                    reEllipse.call(this, e);
                    break;
                case "line":
                    reLine.call(this, e);
                    break;
                case "polyline":
                    rePolyline.call(this, e);
                    break;
                case "polygon":
                    rePolygon.call(this, e);
                    break;
                case "path":
                    rePath.call(this, e);
                    break;
                case "g":
                    // nothing to do for "g"
                    break;
                case "svg":
                    // nothing to do for "svg"
                    break;
                default:
            }
            // if a basic shape encountered replace it with path
            // NOTE: we copy attributes, but loose event listeners!
            var p = e;
            if(["rect", "circle", "ellipse", "line",
                "polyline", "polygon"].indexOf(e.tagName) >= 0) {
                p = document.createElementNS("http://www.w3.org/2000/svg", "path");
                // copy attributes, avoid those specific to non-paths
                var atts = e.attributes;
                for (var i = 0; i < atts.length; i++) {
                    if(["x", "y", "rx", "ry", "width", "height", "cx", "cy", "r",
                        "x1", "y1", "x2", "y2", "points"].indexOf(atts[i].name) < 0)
                        p.setAttribute(atts[i].name, atts[i].value);
                }
                e.parentNode.replaceChild(p, e);
            }
            // if a path has been prepared adjust "d" attribute
            if(pathStr.length > 0) {
                p.setAttribute("d", pathStr);
            }
        }).call(this, svg);
        
        return svg;
    }

    /**
     * Function to get SVGAnimatedLength values.
     * @param e svg element
     * @return number
     */
    var g = function(e) { return e.animVal.value; };

    /**
     * Function to redraw an svg rect in cartoon style.
     *
     * @param e svg rect element
     * @return void
     */
    var reRect = function(e) {
        // call internal method that only builds pathStr
        cRect.call(this, g(e.x), g(e.y),
                   g(e.width), g(e.height),
                   g(e.rx), g(e.ry));
    }
    
    /**
     * Function to redraw an svg circle in cartoon style.
     *
     * @param e svg circle element
     * @return void
     */
    var reCircle = function(e) {
        cCircle.call(this, g(e.cx), g(e.cy), g(e.r));
    }
    
    /**
     * Function to redraw an svg ellipse in cartoon style.
     *
     * @param e svg ellipse element
     * @return void
     */
    var reEllipse = function(e) {
        cEllipse.call(this, g(e.cx), g(e.cy), g(e.rx), g(e.ry));
    }
    
    /**
     * Function to redraw an svg line in cartoon style.
     *
     * @param e svg line element
     * @return void
     */
    var reLine = function(e) {
        cLine.call(this, g(e.x1), g(e.y1), g(e.x2), g(e.y2));
    }
    
    /**
     * Function to redraw an svg polyline in cartoon style.
     *
     * @param e svg polyline element
     * @return void
     */
    var rePolyline = function(e) {
        var points = e.points;
        var p1 = points.getItem(0);
        for(var j = 1; j < points.length; j++) {
            var p2 = points.getItem(j);
            cLine.call(this, p1.x, p1.y, p2.x, p2.y);
            p1 = p2;
        }
    }
    
    /**
     * Function to redraw an svg polygon in cartoon style.
     *
     * @param e svg polygon element
     * @return void
     */
    var rePolygon = function(e) {
        var points = e.points;
        var p1 = points.getItem(0);
        for(var j = 1; j < points.length; j++) {
            var p2 = points.getItem(j);
            cLine.call(this, p1.x, p1.y, p2.x, p2.y);
            p1 = p2;
        }
        p1 = points.getItem(0);
        cLine.call(this, p2.x, p2.y, p1.x, p1.y);
    }
    
    /**
     * Function to redraw an svg path in cartoon style.
     *
     * @param e svg path element
     * @return void
     */
    var rePath = function(e) {
        var pos = { x:0, y:0 };  // SVG drawing position
        var ipos = { x:0, y:0 }; // SVG initial position
        var cpos = undefined;    // SVG last cubic bezier control point
        var qpos = undefined;    // SVG last cubic bezier control point
        var org = { x:0, y:-0 }; // coordinate origin
        var cmds = parsePath(e);
        for(var j = 0; j < cmds.length; j++) {
            var cmd = cmds[j];
            var name = cmd.shift();
            var moveMadeAbs = false;
            // special W3C rule if first cmd is rel. moveTo (impossible)
            if(j == 0 && name == "m") {
                name = "M";
                moveMadeAbs = true;
            }
            // set origin either to absolute (0,0) or to relative (current pos)
            var setOrg = function() {
                org = (name == name.toUpperCase()) ?
                      { x:0, y:0 } : { x:pos.x, y:pos.y };
            };
            setOrg();
            switch(name) {
                case "M": // "move to"
                case "m":
                    cpos = undefined; // unset last cubic bezier control point
                    qpos = undefined; // unset last quadratic bezier control point
                    // move pos
                    pos = { x:org.x+cmd.shift(), y:org.y+cmd.shift() };
                    ipos = pos; // set initial pos to pos moved to
                    // revert special W3C rule if in effect
                    name = moveMadeAbs ? "m" : "M";
                    // further points are "line to"
                    while(cmd.length > 1) {
                        var p = { x:org.x+cmd.shift(), y:org.y+cmd.shift() };
                        cLine.call(this, pos.x, pos.y, p.x, p.y);
                        pos = p;
                        setOrg();
                    }
                    break;
                case "Q": // quadratic bezier
                case "q":
                    cpos = undefined; // unset last cubic bezier control point
                    while(cmd.length > 3) {
                        // control point & end point
                        var p1 = { x:org.x+cmd.shift(), y:org.y+cmd.shift() };
                        var p2 = { x:org.x+cmd.shift(), y:org.y+cmd.shift() };
                        cBezier2.call(this, pos.x, pos.y, p1.x, p1.y, p2.x, p2.y);
                        pos = p2;
                        qpos = p1;
                        setOrg();
                    }
                    break;
                case "T": // smooth / short hand quadratic bezier
                case "t":
                    cpos = undefined; // unset last cubic bezier control point
                    while(cmd.length > 1) {
                        // end point
                        var p2 = { x:org.x+cmd.shift(), y:org.y+cmd.shift() };
                        // control point is last control point reflection
                        var p1 = (typeof qpos == "undefined") ? pos :
                                  { x:2*pos.x-qpos.x, y:2*pos.y-qpos.y };
                        cBezier2.call(this, pos.x, pos.y, p1.x, p1.y, p2.x, p2.y);
                        pos = p2;
                        qpos = p1;
                        setOrg();
                    }
                    break;
                case "C": // cubic bezier
                case "c":
                    qpos = undefined; // unset last quadratic bezier control point
                    while(cmd.length > 5) {
                        // control points & end point
                        var p1 = { x:org.x+cmd.shift(), y:org.y+cmd.shift() };
                        var p2 = { x:org.x+cmd.shift(), y:org.y+cmd.shift() };
                        var p3 = { x:org.x+cmd.shift(), y:org.y+cmd.shift() };
                        cBezier3.call(this, pos.x, pos.y, p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);
                        pos = p3;
                        cpos = p2;
                        setOrg();
                    }
                    break;
                case "S": // smooth / short hand cubic bezier
                case "s":
                    qpos = undefined; // unset last quadratic bezier control point
                    while(cmd.length > 3) {
                        // 2nd control point & end point
                        var p2 = { x:org.x+cmd.shift(), y:org.y+cmd.shift() };
                        var p3 = { x:org.x+cmd.shift(), y:org.y+cmd.shift() };
                        // 1st control point is last control point reflection
                        var p1 = (typeof cpos == "undefined") ? pos :
                                  { x:2*pos.x-cpos.x, y:2*pos.y-cpos.y };
                        cBezier3.call(this, pos.x, pos.y, p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);
                        pos = p3;
                        cpos = p2;
                        setOrg();
                    }
                    break;
                case "A": // elliptic arc
                case "a":
                    cpos = undefined; // unset last cubic bezier control point
                    qpos = undefined; // unset last quadratic bezier control point
                    while(cmd.length > 6) {
                        var rx = Math.abs(cmd.shift()); // horizontal radius
                        var ry = Math.abs(cmd.shift()); // vertical radius
                        var rot = cmd.shift() % 360; // ellipse rotation
                        var fa = !! cmd.shift(); // large arc flag
                        var fs = !! cmd.shift(); // sweep flag
                        var p1 = { x:org.x+cmd.shift(), // end point
                                   y:org.y+cmd.shift() };
                        // skip if end equals start & if rx & ry are 0
                        if(p1.x == pos.x && p1.y == pos.y) continue;
                        if(rx == 0 && ry == 0) continue;
                        // do "line to" if rx XOR ry are 0
                        if(rx == 0 || ry == 0) {
                            // do horizontal or vertical "line to"
                            p1 = (ry == 0) ? { x:p1.x, y:pos.y }
                                 : { x:pos.x, y:p1.y };
                            cLine.call(this, pos.x, pos.y, p1.x, p1.y);
                            pos = p1;
                            setOrg();
                            continue;
                        }
                        // do normal elliptic arc if we got this far
                        var retval = getEllipse(pos, p1, rx, ry, rot, fa, fs);
                        var cp = retval[0];      // center point
                        var start = retval[1].x; // start in radians
                        var end = retval[1].y;   // end in radians
                        cEllipse.call(this, cp.x, cp.y, rx, ry, rot, start, end);
                        pos = p1;
                        setOrg();
                    }
                    break;
                case "L": // "line to"
                case "l":
                    cpos = undefined; // unset last cubic bezier control point
                    qpos = undefined; // unset last quadratic bezier control point
                    while(cmd.length > 1) {
                        var p1 = { x:org.x+cmd.shift(), y:org.y+cmd.shift() };
                        cLine.call(this, pos.x, pos.y, p1.x, p1.y);
                        pos = p1;
                        setOrg();
                    }
                    break;
                case "H": // horizontal "line to"
                case "h":
                    cpos = undefined; // unset last cubic bezier control point
                    qpos = undefined; // unset last quadratic bezier control point
                    while(cmd.length > 0) {
                        var p1 = { x:org.x+cmd.shift(), y:pos.y };
                        cLine.call(this, pos.x, pos.y, p1.x, p1.y);
                        pos = p1;
                        setOrg();
                    }
                    break;
                case "V": // vertical "line to"
                case "v":
                    cpos = undefined; // unset last cubic bezier control point
                    qpos = undefined; // unset last quadratic bezier control point
                    while(cmd.length > 0) {
                        var p1 = { x:pos.x, y:org.y+cmd.shift() };
                        cLine.call(this, pos.x, pos.y, p1.x, p1.y);
                        pos = p1;
                        setOrg();
                    }
                    break;
                case "Z": // "close path"
                case "z":
                    cpos = undefined; // unset last cubic bezier control point
                    qpos = undefined; // unset last quadratic bezier control point
                    cLine.call(this, pos.x, pos.y, ipos.x, ipos.y);
                    pathStr = pathStr + "z";
                    pos = ipos;
                    break;
                default:
            }
        }
    }

    /**
     * @brief getEllipse calculates the center point and the start angle
     * and end angle of an ellipse from the obscure SVG parameters of an
     * elliptic arc. It returns an array with two points, the center
     * point and a point with the start and end angles.
     * 
     * @param ps starting point
     * @param pe end point
     * @param rh horizontal radius
     * @param rv vertical radius
     * @param rot rotation in degree
     * @param fa large arc flag
     * @param fs sweep flag
     * @return array
     */
    var getEllipse = function(ps, pe, rh, rv, rot, fa, fs) {
        // function for calculating angle between two vectors
        var angle = function(u, v) {
            var sign = ((u.x * v.y - u.y * v.x) > 0) ? 1 : -1;
            return sign * Math.acos(
                (u.x * v.x + u.y * v.y) /
                (Math.sqrt(u.x*u.x + u.y*u.y) * Math.sqrt(u.x*u.x + u.y*u.y))
            );
        }
        // sanitize input
        rot = rot % 360;
        rh = Math.abs(rh);
        rv = Math.abs(rv);
        // do calculation
        var cosRot = Math.cos(rot);
        var sinRot = Math.sin(rot);
        var x = cosRot * (ps.x - pe.x) / 2 + sinRot * (ps.y - pe.y) / 2;
        var y = -1 * sinRot * (ps.x - pe.x) / 2 + cosRot * (ps.y - pe.y) / 2;
        var rh2 = rh * rh; var rv2 = rv * rv; var x2 = x * x; var y2 = y * y;
        var fr = ((fa == fs) ? -1 : 1) * Math.sqrt(
                    (rh2 * (rv2 - y2) - rv2 * x2) /
                    (rh2 * y2 + rv2 * x2)
                 );
        var xt = fr * rh * y / rv;
        var yt = -1 * fr * rv * x / rh;
        var cx = cosRot * xt - sinRot * yt + (ps.x + pe.x) / 2;
        var cy = sinRot * xt + cosRot * yt + (ps.y + pe.y) / 2;
        var vt = { x:(x-xt)/rh, y:(y-yt)/rv };
        var phi1 = angle({ x:1, y:0 }, vt);
        var phiD = angle(vt, { x:(-x-xt)/rh, y:(-y-yt)/rv }) % 360;
        var phi2 = phi1 + phiD;

        return [{ x:cx, y:cy }, { x:phi1, y:phi2 }];
    }
    
    /**
     * @brief De Casteljau's algorithm splitting n-th degree Bezier curve
     *
     * Given n+1 control points for an n-th degree Bezier curve and
     * a number t between 0 and 1, it will return two arrays, each
     * with n+1 new control points. The returned control points define
     * two Bezier curves that together form the original Bezier curve
     * in two peaces, split at the t-th point.
     *
     * @author Balint Morvai <balint@morvai.de>
     * @license http://en.wikipedia.org/wiki/MIT_License MIT License
     */
    var bsplit = function(points, t0) {
        var n = points.length - 1; // number of control points
        var b = [];       // coefficients as in De Casteljau's algorithm
        var res1 = [];    // first curve resulting control points
        var res2 = [];    // second curve resulting control points
        var t1 = 1 - t0;
            
        // multiply point with scalar factor
        var pf = function(p, f) {
            var res = [];
            for(var i = 0; i < p.length; i++) {
                res.push(f * p[i]);
            }
            return res;
        };
        // add points as vectors
        var pp = function(p1, p2) {
            var res = [];
            for(var i = 0; i < Math.min(p1.length, p2.length); i++) {
                res.push(p1[i] + p2[i]);
            }
            return res;
        };
            
        // set original coefficients: b[i][0] = points[i]
        for(var i = 0; i <= n; i++) {
            points[i] = (typeof points[i] == "object") ? points[i] : [points[i]];
            b.push([ points[i] ]);
        }
        // get all coefficients
        for(var j = 1; j <= n; j++) {
            for(var i = 0; i <= (n-j); i++) {
                b[i].push( pp(
                        pf(b[i][j-1], t1),
                        pf(b[i+1][j-1], t0)
                ));
            }
        }
        // set result: res1 & res2
        for(var j = 0; j <= n; j++) {
            res1.push(b[0][j]);
            res2.push(b[j][n-j]);
        }
            
        return [res1, res2];
    };
    
    /**
     * Shift given value randomly by fuzzyness factor f
     * @param val value to shift randomly
     * @param f fuzzyness factor
     * @return number
     */
    var fuzz = function(val, f) {
        return val + f * (Math.random() - 0.5);
    }
    
    /**
     * Distance between 2 numbers in 2 dim space
     * @param x0 1st point x
     * @param y0 1st point y
     * @param x1 2nd point x
     * @param y1 2nd point y
     * @return number
     */
    var dist2 = function(x0, y0, x1, y1) {
        var dx = x1 - x0;
        var dy = y1 - y0;
        return Math.sqrt(dx * dx + dy * dy);
    }
    
    /**
     * Test whether the given variable is an array.
     * @param a var to test
     * @return bool
     */
    var isArray = function(a) {
        return Object.prototype.toString.call(a) === '[object Array]';
    }
    
    // ----------------------set drawing method-------------------------
    // HTML5 Canvas context
    if(libName == "canvas") {
        path = function(x0, y0, cx, cy, x1, y1) {
            this.moveTo(x0, y0);
            this.quadraticCurveTo(cx, cy, x1, y1);
            C.pathPos = { x:x1, y:y1 };
        }
        finish = function() {
            this.stroke();
            return this;
        };
        begin = function() {
            this.beginPath();
            return this;
        };
    }
    else {
        // for all svg libs let "path" & "begin" be as below
        path = function(x0, y0, cx, cy, x1, y1) {
            x0 = round(x0); y0 = round(y0); cx = round(cx);
            cy = round(cy); x1 = round(x1); y1 = round(y1);
            // "move to" only required if (x0, y0) != current pos AND as first path cmd
            if(C.pathPos.x != x0 || C.pathPos.y != y0 || pathStr.length == 0) {
                pathStr = pathStr + ["M", x0, y0, "Q", cx, cy, x1, y1].join(' ');
            }
            else {
                pathStr = pathStr + ["Q", cx, cy, x1, y1].join(' ');
            }
            C.pathPos = { x:x1, y:y1 };
            return this;
        };
        begin = function() {
            pathStr = "";
            C.pathPos = { x:0, y:0 };
            return this;
        };
    }
    // Raphael.js
    if(libName == "raphael") {
        finish = function() {
            return this.path(pathStr);
        };
    }
    // D3.js
    if(libName == "d3") {
        finish = function() {
            return this.append("svg:path").attr("d", pathStr);
        };
    }
    // SVG.js
    if(libName == "svg") {
        // draws path object from current pathStr on "this" & returns it
        finish = function() {
            return this.path(pathStr);
        };
    }
}

/**
 * @brief Round to the precision defined in local scope.
 *
 * @param {Float} x
 * @return {Float}
 */
function round(x) {
    return Math.round(x * roundFactor) / roundFactor;
}

/**
 * @brief Parse an svg path object and return commands
 * Parse an svg path object and generate an Array of path commands.
 * Each command is an Array of the form `[command, arg1, arg2, ...]`
 * NOTE: parsing is done via "pathSegList" which is faster and more
 * reliable than parsing the path string directly, but might not
 * work in old browsers.
 *
 * @author Balint Morvai <balint@morvai.de>
 * @license http://en.wikipedia.org/wiki/MIT_License MIT License
 * @param {Object} path object
 * @return {Array}
 */
function parsePath(path) {
    var list = path.pathSegList;
    var res = [];
    for(var i = 0; i < list.length; i++) {
        var cmd = list[i].pathSegTypeAsLetter;
        var sub = [];
        switch(cmd) {
            case "C":
            case "c":
                sub.unshift(list[i].y2); sub.unshift(list[i].x2);
            case "Q":
            case "q":
                sub.unshift(list[i].y1); sub.unshift(list[i].x1);
            case "M":
            case "m":
            case "L":
            case "l":
                sub.push(list[i].x); sub.push(list[i].y);
                break;
            case "A":
            case "a":
                sub.push(list[i].r1); sub.push(list[i].r2);
                sub.push(list[i].angle);
                sub.push(list[i].largeArcFlag);
                sub.push(list[i].sweepFlag);
                sub.push(list[i].x); sub.push(list[i].y);
                break;
            case "H":
            case "h":
                sub.push(list[i].x);
                break;
            case "V":
            case "v":
                sub.push(list[i].y);
                break;
            case "S":
            case "s":
                sub.push(list[i].x2); sub.push(list[i].y2);
                sub.push(list[i].x); sub.push(list[i].y);
                break;
            case "T":
            case "t":
                sub.push(list[i].x); sub.push(list[i].y);
                break;
        }
        sub.unshift(cmd);
        res.push(sub);
    }
    return res;
}

// set options
C.init({
    fsteps: fsteps,
    msteps: msteps,
    ff: ff,
    ffc: ffc,
    context: context
});

// Raphael.js
if(typeof Raphael != "undefined") {
    bindTo("raphael",   // library name
           Raphael.fn); // root object to hook in to
}

// SVG.js
if(typeof SVG != "undefined") {
    var dummy = {};
    bindTo("svg", dummy);
    SVG.extend(SVG.Set, dummy);
    SVG.extend(SVG.Group, dummy);
    SVG.extend(SVG.Element, dummy);
}

// D3.js
if(typeof d3 != "undefined") {
    bindTo("d3", d3.selection.prototype);
    bindTo("d3", d3.selection.enter.prototype);
}

// comic.js - bind to self
bindTo("self", COMIC);

})();
