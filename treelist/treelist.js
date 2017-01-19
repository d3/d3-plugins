/**
 * Implements a simple layout for rendering trees in a list style view as seen in file system browsers
 * @author Patrick Oladimeji
 * @date 5/24/14 12:21:50 PM
 */
/*jshint unused: true, undef: true*/
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global d3*/
(function (d3) {
    d3.layout.treelist = function () {
        "use strict";
        var hierarchy = d3.layout.hierarchy().sort(null).value(null),
            nodeHeight = 20,
            childIndent = 20;
        
        var treelist = function (d, i) {
            var nodes = hierarchy.call(this, d, i),
                root = nodes[0];

            function visit(f, t, index, parent) {
                if (t) {
                    f(t, index, parent);
                }
                var children = t.children;
                if (children && children.length) {
                    children.forEach(function (child, ci) {
                        visit(f, child, ci, t);
                    });
                }
            }
            /**
             visit all nodes in the tree and set the x, y positions
            */
            function layout(node) {
                //all children of the same parent are rendered on the same  x level
                //y increases every time a child is added to the list 
                var x = 0, y = 0;
                visit(function (n, index, parent) {
                    x = parent ? parent.x + childIndent : 0;
                    y = y + nodeHeight;
                    n.y = y;
                    n.x = x;

                }, node);
            }

            layout(root);
            return nodes;
        };
        
        treelist.nodeHeight = function (d) {
            if (arguments.length) {
                nodeHeight = d;
                return treelist;
            }
            return nodeHeight;
        };

        treelist.childIndent = function (d) {
            if (arguments.length) {
                childIndent = d;
                return treelist;
            }
            return childIndent;
        };

        treelist.nodes = treelist;

        return treelist;
    };

}(d3));

