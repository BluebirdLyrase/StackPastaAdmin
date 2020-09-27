var url = "/api/viewHistory/";

$(function () {

  var sUserID = sessionStorage.getItem("userID");
  var sPassword=  sessionStorage.getItem("password");
 
      var authen = {
        UserID: sUserID,
        Password: sPassword
      }

      $.ajax({
        url: "api/authenAdmin",
        type: 'POST',
        data: authen,
        success: function (result) {
          if(!result){
          sessionStorage.setItem("session", "ViewHistory.html");
          window.location.href = "login.html";
         }
        }
      });

  // Get data when first time open
  $.get(url, function (data, status) {
    if (status == 'success') {
      console.log(data);
      $(data).ready( function () {
        var table = $('#dataTable').DataTable({
          destroy: true,
          searching: true,
          data: data,
          columns: [
            // { data: '_id' },
            { data: 'ID' },
            { data: 'Title' },
            { data: 'Tags' },
            { data: 'Site' },
            { data: 'Date' },
            { data: 'UserID' },
            { data: '_id' , render : function ( data, type, row, meta ) {
              return type === 'display'  ?
              '<botton onclick="Delete(`'+data+'`)" class="btn btn-danger" >Delete</botton>' : data;
            }},
          ]
        });
    } );
    }
});
});

  
function Delete(id){
  Model(id);
}

function Model(id){
  $('#confirmModal').modal('toggle');
  $("#confirmdelete").click(function () {
    console.log("delete "+id);``
    $.ajax({
        url: url+id,
        type: 'DELETE',
        success: function (result) {
            window.location.href = "ViewHistory.html";
        }
    });
});
}