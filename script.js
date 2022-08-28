var canvas = document.getElementById("image-canvas");
var ctx = canvas.getContext("2d");

function make_base() {
  ctx.canvas.height = canvas.width;
  var img = new Image();
  img.src = 'area.png';
  img.onload = function() {
    ctx.drawImage(img, 0, 0, canvas.height, canvas.width);
  }
};

make_base();

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function drawPoint(x, y, r) {
  ctx.fillStyle=getRandomColor();
  ctx.fillRect(canvas.height*((1/2)+(2/5)*(x/r))-canvas.height/80,canvas.height*((1/2)-(2/5)*(y/r))-canvas.height/80,canvas.height/40,canvas.width/40);
}

$('#input-form').submit(function(event) {
  event.preventDefault();
  $.ajax({
    type: "GET",
    url: "check_dot.php",
    data: $(this).serialize(),
    dataType: "json",
    success: function(data) {
      row = '<tr>';
      row += '<td>' + data.x + '</td>';
      row += '<td>' + data.y + '</td>';
      row += '<td>' + data.r + '</td>';
      row += '<td>' + data.currentTime + '</td>';
      row += '<td>' + data.executionTime + '</td>';
      row += '<td>' + data.hitResult + '</td>';
      $('#result-table').append(row);
      drawPoint(data.x, data.y, data.r);
    }
  })
});

$('#name').on('click', function() {
  var audio = new Audio();
  audio.src = "audio.mp3";
  audio.play();
});
