d3.pyramid = function() {
  var size = [1,1],
      value = function(d) { return d.value},
      coordinates;
  
  var percentageValues = function (data) {
    var values = data.map(value);
    var sum = d3.sum(values, function (d){
      return +d;
    });
    var percentValues = data.map(function (d,i){
      d.value = +values[i];
      return values[i]/sum*100;
    });
    percentValues.sort(function(a,b){
      return b-a;
    });
    return percentValues;
  }
  var coordinatesCalculation = function(data){
    var w = size[0],
        h = size[1],
        ratio = (w/2)/h,
        percentValues = percentageValues(data),
        coordinates = [],
        area_of_triangle = (w * h) / 2;
    function d3Sum (i) {
      return d3.sum(percentValues,function (d, j){
        if (j>=i) {
          return d;
        }
      });
    }
    for (var i=0,len=data.length;i<len; i++){
      var selectedPercentValues = d3Sum(i),
          area_of_element = selectedPercentValues/100 * area_of_triangle,
          height1 = Math.sqrt(area_of_element/ratio),
          base = 2 * ratio * height1,
          xwidth = (w-base)/2;
      if (i===0){
        coordinates[i] = {"values":[{"x":w/2,"y":0},{"x":xwidth,"y":height1},{"x":base+xwidth,"y":height1}]};
      }else{
        coordinates[i] = {"values":[coordinates[i-1].values[1],{"x":xwidth,"y":height1},{"x":base+xwidth,"y":height1},coordinates[i-1].values[2]]};
      }

    }
    coordinates[0].values[1] = coordinates[coordinates.length-1].values[1];
    coordinates[0].values[2] = coordinates[coordinates.length-1].values[2];
    var first_data = coordinates.splice(0,1);
    coordinates = coordinates.reverse();
    coordinates.splice(0,0,first_data[0]);
    return coordinates;
  } 
  function pyramid(data) {
    var i = 0,
        coordinates = coordinatesCalculation(data);
    
    data.sort(function(a,b) {
      return a.value - b.value;
    })
    
    data.forEach(function(){
      data[i].coordinates = coordinates[i].values;
      i++;
    })
    return data;
  }
  pyramid.size = function(s){
    if(s.length === 2) {
      size = s;                    
    }
    return pyramid;
  }
  pyramid.value = function(v) {
    if (!arguments.length) return value;
    value = v;
    return pyramid;
  };
  return pyramid;
}