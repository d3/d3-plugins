d3.funnel = function() {
  var size = [1,1],
      mouth = [1,1],
      sort_data,
      value = function(d) { return d.value},
      coordinates;

  var percentageValues = function (data) {
    var values = data.map(value);
    var percentValues = data.map(function (d,i){
      d.value = +values[i];
      var weight_max = d3.max(data, function (d,i) {
        return d.value;
      })
      return d.value/weight_max*100;
    });
    percentValues.sort(function(a,b){
      return b-a;
    });
    return percentValues;
  }

  var coordinatesCalculation = function(data){
    var w = size[0],
        h = size[1],
        rw = mouth[0], //rect width
        rh = mouth[1], //rect height
        tw = (w - rw)/2, //triangle width
        th = h - rh, //triangle height
        height1=0,
        height2=0,
        height3=0,
        merge = 0,
        coordinates = [],
        ratio = tw/th,
        area_of_trapezium = (w + rw) / 2 * th,
        area_of_rectangle = rw * rh,
        total_area = area_of_trapezium + area_of_rectangle,
        percent_of_rectangle = area_of_rectangle / total_area * 100;

    for (var i=data.length-1; i>=0; i--){
      var selectedPercentValues = percentageValues(data)[i];

      // If the percentage of area of rectangle is greater than the lowest percentage data, then the data fits into the rectangle else that data will be partially in the rectangle and partially in the trapezium.
      if (percent_of_rectangle>=selectedPercentValues){
        height3 = selectedPercentValues / percent_of_rectangle * rh;
        height1 = h - height3;

        // If its the first data point then use the given weight to calculate the co-ordinate else take the co-ordinates from the previous data.
        if (i===data.length-1){
          coordinates[i] = {"values":[{"x":(w-rw)/2,"y":height1},{"x":(w-rw)/2,"y":h},{"x":((w-rw)/2)+rw,"y":h},{"x":((w-rw)/2)+rw,"y":height1}]};
        }else{
          coordinates[i] = {"values":[{"x":(w-rw)/2,"y":height1},coordinates[i+1].values[0],coordinates[i+1].values[3],{"x":((w-rw)/2)+rw,"y":height1}]};
        }
      }else{
        var area_of_element = ((selectedPercentValues)/100 * total_area) - area_of_rectangle,
            a = 2 * ratio,
            b = 2 * rw,
            c = 2 * area_of_element;
        height2 = (-b + Math.sqrt(Math.pow(b,2) - (4 * a * -c))) / (2 * a); //Quadratic equation
        height1 = h - height2 - rh;
        var base = 2*(ratio * height2)+rw,
        xwidth = (w-base)/2;

        // If the data is sharing the rectangle and trapeziums area (merge=0) or is the data using the area of trapezium only (merge=1).
        if(merge===0){
          if (i===data.length-1){
            coordinates[i] = {"values":[{"x":xwidth,"y":height1},{"x":(w-rw)/2,"y":th},{"x":(w-rw)/2,"y":h},{"x":((w-rw)/2)+rw,"y":h},{"x":((w-rw)/2)+rw,"y":th},{"x":base+xwidth,"y":height1}]};
          }else{
            coordinates[i] = {"values":[{"x":xwidth,"y":height1},{"x":(w-rw)/2,"y":th},coordinates[i+1].values[0],coordinates[i+1].values[3],{"x":((w-rw)/2)+rw,"y":th},{"x":base+xwidth,"y":height1}]};
          }
        }
        else{
          var coindex;
          if(coordinates[i+1].values.length===6){
            coindex = 5;
          }else{
            coindex = 3;
          }
          coordinates[i] = {"values":[{"x":xwidth,"y":height1},coordinates[i+1].values[0],coordinates[i+1].values[coindex],{"x":base+xwidth,"y":height1}]};
        }
        merge = 1;
      }
    }
    return coordinates;
  }
  function funnel(data) {
    var i = 0,
        coordinates = coordinatesCalculation(data);
    data.sort(function(a,b) {
      return b.value - a.value;
    })
    data.forEach(function(){
      data[i].coordinates = coordinates[i].values;
      i++;
    })
    return data;
  }
  funnel.size = function(s){
    if (s.length!==2){
    } else {
      size = s;
    }
    return funnel;
  }
  funnel.mouth = function(m){
    if (m.length!==2){
    } else {
      mouth = m;
    }
    return funnel;
  }
  funnel.value = function(v) {
    if (!arguments.length) return value;
    value = v;
    return funnel;
  };
  return funnel;
}
