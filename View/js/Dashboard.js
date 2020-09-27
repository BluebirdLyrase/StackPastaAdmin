
$(function () {

  var url = "/api/viewHistory/";
  // Get data when first time open
  $.get(url, function (data, status) {
    if (status == 'success') {
      console.log(data);
      $(data).ready(function () {
        //set most tag card
        var most;
        var alltag = [];
        //loop get TagS 
        for (var i = 0; i < data.length; i++) {
          var obj = data[i];
          obj_tag = obj.Tags;
          alltag = alltag.concat(obj_tag);
        }
        console.log(obj_tag);
        most = getMostFrequentElement(alltag);
        console.log(most);
        $("#most_tag").text(most[0]);

        //end of set tag

        var alluse = data.length;
        $('#most_all').text(alluse);
        //set most tag card

        //end of set tag

      });

    }

  });
});

// set most site card
$(function () {

  var url = "/api/searchingHistory/";

  // Get data when first time open
  $.get(url, function (data, status) {
    if (status == 'success') {
      console.log(data);
      $(data).ready(function () {

        var most;
        var allsite = [];
        //loop get TagS 
        for (var i = 0; i < data.length; i++) {
          var obj = data[i];
          obj_site = obj.Site;
          allsite = allsite.concat(obj_site);

        }
        console.log(allsite);
        most = getMostFrequentElement(allsite);
        console.log(most);
        $("#most_site").text(most[0]);

      });

    }

  });
});



// set most site card
$(function () {

  var url = "/api/user/";

  // Get data when first time open
  $.get(url, function (data, status) {
    if (status == 'success') {

      console.log(data);
      $(data).ready(function () {
        $('#most_user').text(data.length)
        for (var i = 0; i < data.length; i++) {
          var obj = data[i];
          obj_userID = obj.UserID;
          console.log('name' + obj_userID);
        }


      });

    }

  });
});




// This is form Stack Overflow : Xotic750 authur
// It's  a function to find most frequent element  
function getMostFrequentElement(inputArg) {
  var type = typeof inputArg,
    length,
    mostFrequent,
    counts,
    index,
    value;

  if (inputArg === null || type === 'undefined') {
    throw TypeError('inputArg was "null" or "undefined"');
  }

  mostFrequent = [];
  if (type === 'function' || !Object.prototype.hasOwnProperty.call(inputArg, 'length')) {
    mostFrequent[0] = inputArg;
    mostFrequent[1] = 1;
  } else {
    counts = {};
    length = inputArg.length;
    for (index = 0; index < length; index += 1) {
      value = inputArg[index];
      type = typeof value;
      counts[type] = counts[type] || {};
      counts[type][value] = (counts[type][value] || 0) + 1;
      if (!mostFrequent.length || counts[type][value] >= mostFrequent[1]) {
        mostFrequent[0] = value;
        mostFrequent[1] = counts[type][value];
      }
    }
  }

  return mostFrequent;
}

function logMostFrequentElement(inputArg) {
  var mostFrequentElement,
    element,
    text;

  try {
    mostFrequentElement = getMostFrequentElement(inputArg)
    if (mostFrequentElement.length) {
      element = mostFrequentElement[0];
      if (typeof element === 'string') {
        element = '"' + element + '"';
      }

      text = element + ' ( ' + mostFrequentElement[1] + ' times )';
    } else {
      text = 'No elements';
    }
  } catch (e) {
    text = e.message;
  }

  // document.getElementById('out').appendChild(document.createTextNode(text + '\n'));
}

// logMostFrequentElement();
// logMostFrequentElement(1);
// logMostFrequentElement(true);
// logMostFrequentElement(function (x) { return x; });
// logMostFrequentElement(/ab/g);
// logMostFrequentElement([]);
// logMostFrequentElement([1, 2]);
// logMostFrequentElement([1, NaN, 2, NaN, 'NaN']);
// logMostFrequentElement([1, Infinity, 2, Infinity, 'Infinity', -Infinity]);
// logMostFrequentElement(['1', '2', 1, '2', 2]);
// logMostFrequentElement([3, 'a', 'a', 'a', 2, 3, 'a', 3, 'a', 2, 4, 9, 3]);
// logMostFrequentElement([34, 'ab', 'ab', 'ab', 21, 34, 'ab', 34, 'ab', 21, 45, 99, 34]);
// logMostFrequentElement('Also works with strings.');


$(function () {
  var url = "/api/user/";
    var   ctz ;
    var   eachUserCard;
  $.get(url, function (data, status) {
    if (status == 'success') {
      $(data).ready(function () {
        for (var ii = 0; ii < data.length; ii++) {
          var obj = data[ii];
          var obj_UserID = obj.UserID;
          var allTags2 = [];
          var allCount2 = [];
          var colorArr2 = [];
          var color;
          var chartCard = ` 
          <div class="col-xl-6 col-lg-6">
          <div class="card shadow mb-4">
            <!-- Card Header - Dropdown -->
            <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
              <h6 class="m-0 font-weight-bold text-primary">`+obj_UserID+`</h6>
            </div>
            <!-- Card Body -->
            <div class="card-body">
              <div class="chart-area-img ">
                  <canvas id="eachUserCard`+ii+`"></canvas>
              </div>
            </div>
            
          </div>
          

        </div>`
             $('#chartContent').append(chartCard);

             var url2 = "/api/distinctTagsByUser/" + obj_UserID;
          $.get(url2, function (data2, status) {
            console.log(data2)
            if (status == 'success') {
              $(data2).ready(function () {

                for (var i = 0; i < data2.length; i++) {
                  var obj2 = data2[i];
                  obj2_tags = obj2.Tags;
                  obj2_count = obj2.count;
                  allCount2 = allCount2.concat([obj2_count]);
                  allTags2 = allTags2.concat([obj2_tags]);
                  color = randomColor(2);
                  colorArr2 = colorArr2.concat([color]);
                }
                console.log(allCount2);
              });

            }
          });
          ctz = document.getElementById("eachUserCard"+ii);
          console.log(ctz);
           eachUserCard = new Chart(ctz, {
            type: 'doughnut',
            data: {
              labels: allTags2, //it's an array can put entire Json element here
              datasets: [{
                data: allCount2, //
                backgroundColor: colorArr2,
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
          }); console.log(eachUserCard);
          
            }
      });

    }

  });



});


