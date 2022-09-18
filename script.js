let head_of_table = '<tr><th>X</th><th>Y</th><th>Z</th><th>R</th><th>Current time</th><th>Execution time</th><th>Hit result</th></tr>'

function valid_message (text) {
  $("#valid_text").animate({opacity:0}, 100, function () {
    $("#valid_text").text(text);
    $("#valid_text").animate({opacity:1}, 100);
  });
}

function validate_x() {
  checkboxes = $('input[type="checkbox"][name="x"]');
  for (var i = 0; i < checkboxes.length; i++) {
    if (checkboxes[i].checked) {
      return true;
    }
  }
  valid_message("None of the values X were selected");
  return false;
}

function validate_y() {
  if (!$("#input_y")[0].value) {
    valid_message("Y is non-valid");
    return false;
  }
  x = Number($("#input_y")[0].value);
  if (x != null) {
    if (x >= 0 && x <= 10) {
      return true;
    } else {
      valid_message("Y is non-valid");
      return false;
    }
  } else {
    valid_message("Y is non-valid");
    return false;
  }
}

function validate_z() {
  if (!$("#input_z")[0].value) {
    valid_message("Z is non-valid");
    return false;
  }
  x = Number($("#input_z")[0].value);
  if (x != null) {
    if (x >= 0 && x <= 10) {
      return true;
    } else {
      valid_message("Z is non-valid");
      return false;
    }
  } else {
    valid_message("Z is non-valid");
    return false;
  }
}

function validate_r() {
  radios = $('input[type="radio"][name="r"]');
  for (var i = 0; i < radios.length; i++) {
    if (radios[i].checked) {
      return true;
    }
  }
  valid_message("None of the values R were selected");
  return false;
}

function validate() {
  let x = validate_x();
  let y = validate_y();
  let z = validate_z();
  let r = validate_r();
  if (!(x && y && z && r)) {
    $("#warning_text").animate({opacity:0}, 200, function () {
      $("#warning_text").css({'color': 'rgba(255,0,0,1)'}).text("WRONG").animate({opacity:1}, 200);
    });
  }
  return x && y && z && r;
}

function draw_point() {
  let _x = parseInt($('input[name="x"]:checked').val());
  let _y = parseInt($("#input_y")[0].value);
  let _z = parseInt($("#input_z")[0].value);
  let _r = parseInt($('input[name="r"]:checked').val());
  init(_x, _z, _y, _r);
}

function reset_names() {
  $("#warning_text").animate({opacity:0}, 100, function () {
    $("#warning_text").css({'color': 'rgba(0,0,0,0.8)'}).text("Cheremnov Konstantin");
    $("#warning_text").animate({opacity:1}, 100);
  });
  valid_message("P32131, var: 1319");
}

$('#input-form').submit(function(event) {
  event.preventDefault();
  if (validate()) {
    $.ajax({
      method: "post",
      url: "check_dot.php",
      data: $(this).serialize(),
      success: function(data) {
        reset_names();
        $('#result-table').html(head_of_table + data);
        draw_point();
      },
      error: function(data) {
        $("#warning_text").text("ERROR ON SERVER").fadeIn("slow");
      }
    })
  }
});

$(document).ready(function() {
  $('input[name="x"]').click(function() {
    $('input[name="x"]').not(this).prop('checked', false);
  });
});

$(document).ready(function() {
  $.ajax({
    method: "GET",
    url: "check_dot.php",
    success: function (data) {
      $('#result-table').html(head_of_table + data);
    }
  })
});

$("#clear").click(function () {
  reset_names();
  $('#result-table').html(head_of_table);
  clear_init();
  $.ajax({
    method: "DELETE",
    url: "check_dot.php"
  })
});

// Draw 3d

const shift = -10;
let origin = [240, 220], scale = 16, scatter = [], xLine = [], yLine = [], zLine = [], cubesData = [];
let cnt = 0, j = 10, beta = 0, alpha = 0;
let key = function(d){ return d.id; };
let startAngle = Math.PI/8, tt = 0;
let svg = d3.select('svg').call(d3.drag().on('drag', dragged).on('start', dragStart).on('end', dragEnd)).append('g');
let color = d3.scaleOrdinal(d3.schemeCategory20);
let mx, my, mouseX, mouseY;

d3.range(-1, 11, 1).forEach(function(d){ yLine.push([-j, -d, -j]); });
d3.range(0, 12, 1).forEach(function(d){ xLine.push([-d, 0, -j]); });
d3.range(0, 12, 1).forEach(function(d){ zLine.push([-j, 0, -d]); });

var point3d = d3._3d()
  .x(function(d){ return d.x; })
  .y(function(d){ return d.y; })
  .z(function(d){ return d.z; })
  .origin(origin)
  .rotateY( startAngle)
  .rotateX(-startAngle)
  .scale(scale);

var xScale3d = d3._3d()
  .shape('LINE_STRIP')
  .origin(origin)
  .rotateY( startAngle)
  .rotateX(-startAngle)
  .scale(scale);

var yScale3d = d3._3d()
  .shape('LINE_STRIP')
  .origin(origin)
  .rotateY( startAngle)
  .rotateX(-startAngle)
  .scale(scale);

var zScale3d = d3._3d()
  .shape('LINE_STRIP')
  .origin(origin)
  .rotateY( startAngle)
  .rotateX(-startAngle)
  .scale(scale);

var cubes3D = d3._3d()
  .shape('CUBE')
  .x(function(d){ return d.x; })
  .y(function(d){ return d.y; })
  .z(function(d){ return d.z; })
  .rotateY( startAngle)
  .rotateX(-startAngle)
  .origin(origin)
  .scale(scale);

function processData(data){
  drawCube(data[4]);

  drawPoints(data[0]);

  drawScales(data);

  drawTexts(data);
}

function posPointX(d){
  return d.projected.x;
}

function posPointY(d){
  return d.projected.y;  }

function init(_x, _y, _z, _r){
  scatter.push({x: shift+Number(_x), y: -Number(_y), z: shift+Number(_z), id: 'point_' + cnt++});

  if (_r != null) {
    var _cube = makeCube(Number(_r), -6, -6);
    _cube.id = 'cube_' + _r;
    if (cubesData.length == 0) {
      cubesData.push(_cube);
    } else {
      cubesData[0] = _cube;
    }
  }

  var data = [
    point3d(scatter),
    yScale3d([yLine]),
    xScale3d([xLine]),
    zScale3d([zLine]),
    cubes3D(cubesData),
  ];
  processData(data);
}

function clear_init() {
  scatter = [];
  cubesData = [];

  var data = [
    point3d(scatter),
    yScale3d([yLine]),
    xScale3d([xLine]),
    zScale3d([zLine]),
    cubes3D(cubesData),
  ];
  processData(data);
}

function dragStart(){
  mx = d3.event.x;
  my = d3.event.y;
}

function dragged(){
  mouseX = mouseX || 0;
  mouseY = mouseY || 0;
  beta   = (d3.event.x - mx + mouseX) * Math.PI / 230 ;
  alpha  = (d3.event.y - my + mouseY) * Math.PI / 230  * (-1);
  var data = [
    point3d.rotateY(beta + startAngle).rotateX(alpha - startAngle)(scatter),
    yScale3d.rotateY(beta + startAngle).rotateX(alpha - startAngle)([yLine]),
    xScale3d.rotateY(beta + startAngle).rotateX(alpha - startAngle)([xLine]),
    zScale3d.rotateY(beta + startAngle).rotateX(alpha - startAngle)([zLine]),
    cubes3D.rotateY(beta + startAngle).rotateX(alpha - startAngle)(cubesData),
  ];
  processData(data);
}

function dragEnd(){
  mouseX = d3.event.x - mx + mouseX;
  mouseY = d3.event.y - my + mouseY;
}

function makeCube(h, x, z){
  return [
    {x: x - h, y: h-5, z: z + h},
    {x: x - h, y: -h-5, z: z + h},
    {x: x + h, y: -h-5, z: z + h},
    {x: x + h, y: h-5, z: z + h},
    {x: x - h, y: h-5, z: z - h},
    {x: x - h, y: -h-5, z: z - h},
    {x: x + h, y: -h-5, z: z - h},
    {x: x + h, y: h-5, z: z - h},
  ];
}

function drawCube(data) {
  var cubes = svg.selectAll('g.cube').data(data, function(d){ return d.id });

  var ce = cubes
      .enter()
      .append('g')
      .attr('class', 'cube')
      .attr('fill', function(d){ return color(d.id); })
      .attr('stroke', function(d){ return d3.color(color(d.id)).darker(2); })
      .merge(cubes);

  cubes.exit().remove();

  var faces = svg.selectAll('g.cube').selectAll('path.face').data(function(d){ return d.faces; }, function(d){ return d.face; });

  faces.enter()
      .append('path')
      .attr('class', 'face')
      .attr('fill-opacity', 0.4)
      .classed('_3d', true)
      .merge(faces)
      .transition().duration(tt)
      .attr('d', cubes3D.draw);

  faces.exit().remove();
}

function drawPoints(data) {
  var points = svg.selectAll('circle').data(data, key);

  points
      .enter()
      .append('circle')
      .attr('class', '_3d')
      .attr('opacity', 0)
      .attr('cx', posPointX)
      .attr('cy', posPointY)
      .merge(points)
      .transition().duration(tt)
      .attr('r', 3)
      .attr('stroke', function(d){ return d3.color(color(d.id)).darker(3); })
      .attr('fill', function(d){ return color(d.id); })
      .attr('opacity', 1)
      .attr('cx', posPointX)
      .attr('cy', posPointY);

  points.exit().remove();
}

function drawScales(data) {
  drawXScale(data[2]);
  drawYScale(data[1]);
  drawZScale(data[3]);
}

function drawTexts(data) {
  drawXText(data[2]);
  drawYText(data[1]);
  drawZText(data[3]);
}

function drawXScale(data) {
  var xScale = svg.selectAll('path.xScale').data(data);

  xScale
      .enter()
      .append('path')
      .attr('class', '_3d xScale')
      .merge(xScale)
      .attr('stroke', 'black')
      .attr('stroke-width', .5)
      .attr('d', xScale3d.draw);

  xScale.exit().remove();
}

function drawYScale(data) {
  var yScale = svg.selectAll('path.yScale').data(data);

  yScale
      .enter()
      .append('path')
      .attr('class', '_3d yScale')
      .merge(yScale)
      .attr('stroke', 'black')
      .attr('stroke-width', .5)
      .attr('d', yScale3d.draw);

  yScale.exit().remove();

}

function drawZScale(data) {
  var zScale = svg.selectAll('path.zScale').data(data);

  zScale
      .enter()
      .append('path')
      .attr('class', '_3d zScale')
      .merge(zScale)
      .attr('stroke', 'black')
      .attr('stroke-width', .5)
      .attr('d', zScale3d.draw);

  zScale.exit().remove();
}

function drawXText(data) {
  var xText = svg.selectAll('text.xText').data(data[0]);

  xText
      .enter()
      .append('text')
      .attr('class', '_3d xText')
      .attr('dx', '.3em')
      .merge(xText)
      .each(function(d){
          d.centroid = {x: d.rotated.x, y: d.rotated.y, z: d.rotated.z};
      })
      .attr('x', function(d){ return d.projected.x; })
      .attr('y', function(d){ return d.projected.y; })
      .text(function(d){ return d[0]+10 >= 0 ? d[0]+10 : ""; });

  xText.exit().remove();
}

function drawYText(data) {
  var yText = svg.selectAll('text.yText').data(data[0]);

  yText
      .enter()
      .append('text')
      .attr('class', '_3d yText')
      .attr('dx', '.3em')
      .merge(yText)
      .each(function(d){
          d.centroid = {x: d.rotated.x, y: d.rotated.y, z: d.rotated.z};
      })
      .attr('x', function(d){ return d.projected.x; })
      .attr('y', function(d){ return d.projected.y; })
      .text(function(d){ return d[1] <= 0 ? -d[1] : ''; });

  yText.exit().remove();
}

function drawZText(data) {
  var zText = svg.selectAll('text.zText').data(data[0]);

  zText
      .enter()
      .append('text')
      .attr('class', '_3d zText')
      .attr('dx', '.3em')
      .merge(zText)
      .each(function(d){
          d.centroid = {x: d.rotated.x, y: d.rotated.y, z: d.rotated.z};
      })
      .attr('x', function(d){ return d.projected.x; })
      .attr('y', function(d){ return d.projected.y; })
      .text(function(d){ return d[2]+10 >= 0 ? d[2]+10 : ''; });

  zText.exit().remove();
}
