// Set new default font family and font color to mimic Bootstrap's default styling
$(function () {

  var url = "/api/distinctTags/";

  $.get(url, function (data, status) {
    if (status == 'success') {
      console.log('Pie Chart');
      $(data).ready(function () {

        Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
        Chart.defaults.global.defaultFontColor = '#858796';

        // Pie Chart

        var allTags = [];
        var allCount = [];
        var other_Count = 0;
        var colorArr = [];
        var color;
        for (var i = 0; i < data.length; i++) {
          var obj = data[i];
          obj_tags = obj.Tags;
          obj_count = obj.count;
          console.log([obj_tags] + [obj_count]);
            allCount = allCount.concat([obj_count]);
            allTags = allTags.concat([obj_tags]);
            color = randomColor(2);
            colorArr = colorArr.concat([color]);
        }


        var ctx = document.getElementById("myPieChart");
     console.log(ctx);
        var myPieChart = new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: allTags, //it's an array can put entire Json element here
            datasets: [{
              data: allCount, //
              backgroundColor: colorArr,
              hoverBackgroundColor: [],
              hoverBorderColor: "rgba(234, 236, 244, 1)",
            }],
          },
          options: {
            maintainAspectRatio: false,
            tooltips: {
              backgroundColor: "rgb(255,255,255)",
              bodyFontColor: "#858796",
              borderColor: '#dddfeb',
              borderWidth: 1,
              xPadding: 15,
              yPadding: 15,
              displayColors: false,
              caretPadding: 10,
            },
            legend: {
              display: false
            },
            cutoutPercentage: 70,
          },
        });
        console.log(myPieChart);
      });
    }
  })
});

function randomColor(brightness) { //bright =0-255
  function randomChannel(brightness) {
    var r = 255 - brightness;
    var n = 0 | ((Math.random() * r) + brightness);
    var s = n.toString(16);
    return (s.length == 1) ? '0' + s : s;
  }
  return '#' + randomChannel(brightness) + randomChannel(brightness) + randomChannel(brightness);
}