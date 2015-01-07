d3.lasso = function() {

	var	items = null,
		closePathDistance = 75,
		closePathSelect = true,
		isPathClosed = false,
		hoverSelect = true,
		area = null,
		on = {start:function(){}, draw: function(){}, end: function(){}};

	function lasso() {
		var _this = d3.select(this[0][0]);
		var g = _this.append("g")
					.attr("class","lasso");
		var dyn_path = g.append("path")
			.attr("class","drawn");
		var close_path = g.append("path")
			.attr("class","loop_close");
		var complete_path = g.append("path")
			.attr("display","none");
		var origin_node = g.append("circle")
			.attr("class","origin");
		var path;
		var origin;
		var last_known_point;
		var path_length_start;
		var drag = d3.behavior.drag()
			.on("dragstart",dragstart)
			.on("drag",dragmove)
			.on("dragend",dragend);
		area.call(drag);

		function dragstart() {
			// Reset blank lasso path
			path="";
			dyn_path.attr("d",null);
			close_path.attr("d",null);
			// Set path length start
			path_length_start = 0;
			// Set every item to have a false selection and reset their center point and counters
			items[0].forEach(function(d) {
				d.hoverSelected = false;
				d.loopSelected = false;
				var cur_box = d.getBBox();
			  	d.lassoPoint = {
			  		cx: Math.round(cur_box.x + cur_box.width/2),
					cy: Math.round(cur_box.y + cur_box.height/2),
					edges: {top:0,right:0,bottom:0,left:0},
					close_edges: {left: 0, right: 0}
			  	};
			});

			// if hover is on, add hover function
			if(hoverSelect==true) {
				items.on("mouseover.lasso",function() {
					// if hovered, change lasso selection attribute to true
					d3.select(this)[0][0].hoverSelected = true;
				})
			}

			// Run user defined start function
			on.start();
		}

		function dragmove() {
			var x = d3.mouse(this)[0]; 
			var y = d3.mouse(this)[1]; 
			// Initialize the path or add the latest point to it
			if (path=="") {
				path = path + "M " + x + " " + y;
				origin = [x,y];
				// Draw origin node
				origin_node
					.attr("cx",x)
					.attr("cy",y)
					.attr("r",7)
					.attr("display",null);
			}
			else {
				path = path + " L " + x + " " + y;
			}

			// Reset closed edges counter
			items[0].forEach(function(d) {
				d.lassoPoint.close_edges = {left:0,right:0};
			});

			// Calculate the current distance from the lasso origin
			var distance = Math.sqrt(Math.pow(x-origin[0],2)+Math.pow(y-origin[1],2));

			// Set the closed path line
			var close_draw_path = "M " + x + " " + y + " L " + origin[0] + " " + origin[1];

			// Draw the lines
			dyn_path.attr("d",path);


			// If within the closed path distance parameter, show the closed path. otherwise, hide it
			if(distance<=closePathDistance) {
				close_path.attr("display",null);
			}
			else {
			  	close_path.attr("display","none");
			}

			isPathClosed = distance<=closePathDistance;

	  		// create complete path
	  		var complete_path_d = d3.select("path")[0][0].attributes.d.value + "Z";
	  		complete_path.attr("d",complete_path_d);

			// get path length
			var path_node = dyn_path.node();
		  	var path_length_end = path_node.getTotalLength();
		  	var last_pos = path_node.getPointAtLength(path_length_start-1);
		  
		  	for (var i = path_length_start; i<=path_length_end; i++) {
		  		var cur_pos = path_node.getPointAtLength(i);
		  		var cur_pos_obj = {
			  		x:Math.round(cur_pos.x*100)/100,
			  		y:Math.round(cur_pos.y*100)/100
			  	};
			  	var prior_pos = path_node.getPointAtLength(i-1);
			  	var prior_pos_obj = {
			  		x:Math.round(prior_pos.x*100)/100,
			  		y:Math.round(prior_pos.y*100)/100
			  	};

		  		items[0].filter(function(d) {
		  			var a; 
		  			if(d.lassoPoint.cy === cur_pos_obj.y && d.lassoPoint.cy != prior_pos_obj.y) { 
	  					last_known_point = {
	  						x: prior_pos_obj.x,
	  						y: prior_pos_obj.y
	  					};
	  					a=false; 
	  				} 
		  			else if (d.lassoPoint.cy === cur_pos_obj.y && d.lassoPoint.cy === prior_pos_obj.y) {
	  					a = false;
	  				} 
		  			else if (d.lassoPoint.cy === prior_pos_obj.y && d.lassoPoint.cy != cur_pos_obj.y) {
		  				a = sign(d.lassoPoint.cy-cur_pos_obj.y)!=sign(d.lassoPoint.cy-last_known_point.y);
		  			}
		  			else {
		  				last_known_point = {
	  						x: prior_pos_obj.x,
	  						y: prior_pos_obj.y
	  					};
		  				a = sign(d.lassoPoint.cy-cur_pos_obj.y)!=sign(d.lassoPoint.cy-prior_pos_obj.y);
		  			} 
		  			return a;
		  		}).forEach(function(d) {
		  			if(cur_pos_obj.x>d.lassoPoint.cx) {
			  			d.lassoPoint.edges.right = d.lassoPoint.edges.right+1;
			  		}
			  		if(cur_pos_obj.x<d.lassoPoint.cx) {
			  			d.lassoPoint.edges.left = d.lassoPoint.edges.left+1;
			  		}
		  		});
		  	}


			 if(isPathClosed == true && closePathSelect == true) {
			 	close_path.attr("d",close_draw_path);
			  	close_path_node =close_path.node();
			  	var close_path_length = close_path_node.getTotalLength();
			  	var close_path_edges = {left:0,right:0};
			  	for (var i = 0; i<=close_path_length; i++) {
			  		var cur_pos = close_path_node.getPointAtLength(i);
			  		var prior_pos = close_path_node.getPointAtLength(i-1);

			  		items[0].filter(function(d) {return d.lassoPoint.cy==Math.round(cur_pos.y)}).forEach(function(d) {
				  		if(Math.round(cur_pos.y)!=Math.round(prior_pos.y) && Math.round(cur_pos.x)>d.lassoPoint.cx) {
				  			d.lassoPoint.close_edges.right = 1;
				  		}
				  		if(Math.round(cur_pos.y)!=Math.round(prior_pos.y) && Math.round(cur_pos.x)<d.lassoPoint.cx) {
				  			d.lassoPoint.close_edges.left = 1;
				  		}
				  	});

			  	}

			  	items[0].forEach(function(a) {
	  				if((a.lassoPoint.edges.left+a.lassoPoint.close_edges.left)>0 && (a.lassoPoint.edges.right + a.lassoPoint.close_edges.right)%2 ==1) {
	  					a.loopSelected = true;
	  				}
	  				else {
	  					a.loopSelected = false;
	  				}
	  			});
			}
			else {
				items[0].forEach(function(d) {
					d.loopSelected = false;
				})
			}
			
			// Tag possible items
			d3.selectAll(items[0].filter(function(d) {return (d.loopSelected && isPathClosed) || d.hoverSelected}))
				.attr("d",function(d) {return d.possible = true;});

			d3.selectAll(items[0].filter(function(d) {return !((d.loopSelected && isPathClosed) || d.hoverSelected)}))
				.attr("d",function(d) {return d.possible = false;});

			on.draw();

			// Continue drawing path from where it left off
			path_length_start = path_length_end+1;
		}

		function dragend() {
			// Remove mouseover tagging function
			items.on("mouseover.lasso",null);

			// Tag selected items
			items.filter(function(d) {return d.possible === true})
				.attr("d",function(d) {return d.selected = true;});

			items.filter(function(d) {return d.possible === false})
				.attr("d",function(d) {return d.selected = false;});

			// Reset possible items
			items.attr("d",function(d) {return d.possible = false});

			// Clear lasso
			dyn_path.attr("d",null);
			close_path.attr("d",null);
			origin_node.attr("display","none");

			// Run user defined end function
			on.end();
	  		
		}
	}

	lasso.items  = function(_) {

		if (!arguments.length) return items;
    	items = _;
    	items[0].forEach(function(d) {
    		var item = d3.select(d);
    		if(typeof item.datum() === 'undefined') {
    			item.datum({possible:false,selected:false});
    		}
    		else {
    			item.attr("d",function(e) {e.possible = false; e.selected = false; return e;});
    		}
    	});
    	return lasso;
	};

	lasso.closePathDistance  = function(_) {
		if (!arguments.length) return closePathDistance;
    	closePathDistance = _;
    	return lasso;
	};

	lasso.closePathSelect = function(_) {
		if (!arguments.length) return closePathSelect;
    	closePathSelect = _==true;
    	return lasso;
	};

	lasso.isPathClosed = function(_) {
		if (!arguments.length) return isPathClosed;
    	isPathClosed = _==true;
    	return lasso;
	};

	lasso.hoverSelect = function(_) {
		if (!arguments.length) return hoverSelect;
    	hoverSelect = _==true;
    	return lasso;
	};

	lasso.on = function(type,_) {
		if(!arguments.length) return on;
		if(arguments.length===1) return on[type];
		var types = ["start","draw","end"];
		if(types.indexOf(type)>-1) {
			on[type] = _;
		}
		return lasso;
	};

	lasso.area = function(_) {
		if(!arguments.length) return area;
		area=_;
		return lasso;
	};

	function sign(x) {
		return x?x<0?-1:1:0;
	}


	return lasso;

};