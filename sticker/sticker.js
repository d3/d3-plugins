(function() {
  d3.sticker = function(selector) {
    var string;
    var node;
    var svgElement; //for deserializing svg elements
    
    var sticker = function(selection) {
      return sticker.append(selection);
    }
    
    sticker.copy = function(selector) {
      node = d3.select(selector).node();
      if(!node) return sticker;
      //we keep track of svg element 
      if(d3_isSVG(node)) {
        sticker.isSVG = true;
        svgElement = node.ownerSVGElement;
      }
      node = node.cloneNode(true);
      node.removeAttribute("id");
      return sticker;
    }

    sticker.paste = function() {
      if(!node) return;
      return node.cloneNode(true);
    }
    
    sticker.node = function(_) {
      if(!arguments.length) return node;
      node = _;
      if(d3_isSVG(node)) {
        sticker.isSVG = true;
        svgElement = node.ownerSVGElement;
      }
      return sticker;
    }
    
    //append a copy of the sticker to the selection
    sticker.append = function(selection) {
      return selection.select(function() {
        return this.appendChild(sticker.paste());
      });
    }
    
    //insert a copy of the sticker into a selection similar to the d3 insert API 
    sticker.insert = function(selection, before) {
      if(!string) return selection;
      return selection.select(before).select(function() {
        return this.parentNode.insertBefore(sticker.paste(), this);
      });
    }
    
    sticker.string = function(_) {
      if(!arguments.length) return string;
      string = _;
      return sticker;
    }
    
    sticker.serialize = function() {
      //Serialize the selected element into a string
      string = new XMLSerializer().serializeToString(node);
    }
    sticker.deserialize = function () {
      //check if our element is SVG
      if(sticker.isSVG) {
        node = d3_makeSVGFragment(string, svgElement);
      } else {
        node = d3_makeFragment(string);
      }
      return node;
    }
    
    sticker.toString = function() {
      sticker.serialize();
      return string;
    }

    if(selector) {
      return sticker.copy(selector);
    }
    return sticker;
  }

  function d3_isSVG(el) {
    if(!el) return false
    return !!el.ownerSVGElement;// || el.tagName === "svg";
  }
  function d3_makeFragment(fragment) {
    var range = document.createRange()
    return range.createContextualFragment(fragment);
  }
  function d3_makeSVGFragment(fragment, svgElement) {
    //we need to wrap our element in a temporarary intermediate svg element
    //so that the browser knows to instanciate the Node properly.
    //for some reason having the range select an svg element isn't enough.
    // TODO: Allow optional namespace declarations
    var pre = '<svg xmlns=http://www.w3.org/2000/svg xmlns:xlink=http://www.w3.org/1999/xlink>';
    var post = '</svg>';
    var range = document.createRange();
    range.selectNode(svgElement);
    var contextFragment = range.createContextualFragment(pre + fragment + post)
    var intermediateSvg = contextFragment.childNodes[0]
    var node = intermediateSvg.childNodes[0]
    return node;
  }
}());
