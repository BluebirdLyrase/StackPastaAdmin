var url = "/api/user/";
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
          sessionStorage.setItem("session", "user.html");
          window.location.href = "login.html";
         }
        }
      });





  // Get data when first time open
  $.get(url, function (data, status) {
    if (status == 'success') {
      console.log(data);
      $(data).ready(function () {
        $('#dataTable').DataTable({
          destroy: true,
          searching: true,
          data: data,
          columns: [
            { data: 'UserID' },
            // { data: 'Password' },
            { data: 'type' },
            {
              data: '_id', render: function (data, type, row, meta) {
                return type === 'display' ?
                  '<botton onclick="Delete(`' + data + '`)" class="btn btn-danger" >Delete</botton> '
                  + '<botton onclick="Edit(`' + data + '`)" class="btn btn-primary" >Edit</botton>'
                  : data;
              }
            },
          ]
        });
      });
    }
  });
});

function Edit(id){
console.log("editclick : "+id+"::")
$("#Editmodal-title").empty()
$("#useridEdit").empty()
$("#passwordEdit").empty()

$.get(url+id, function (data, status) {
  
  $("#Editmodal-title").append("Edit User : "+data.UserID)
  $("#useridEdit").attr("value",data.UserID)
  $("#passwordEdit").attr("value",data.Password)
  $("#typeEdit").val(data.type);
  $("#edituser").attr("onclick","editUser(`" + id + "`,`" + data.UserID + "`)")
  $('#editModal').modal('toggle');

});

}

function editUser(id,Userid){

  var newUserID =  $("#useridEdit").val();
  var newPassword =  $("#passwordEdit").val();
  var newType = $("#typeEdit").val();

  if(newUserID==Userid){
    console.log("not change userID");
    saveUser(id,newUserID,newPassword,newType);
  }else{

    $.post(url + newUserID, function (data, status) {
      if (!data) {
        saveUser(id,newUserID,newPassword,newType);
      }else{
        $('#alertModal').modal('toggle');
        console.log("Duplicate UserID")
      }
    });

  }

}

function saveUser(id,newUserID,newPassword,newType){

  var editeduser = {
    _id: id,
    UserID: newUserID,
    Password: newPassword,
    type: newType
  }
  console.log("add new ");
  $.ajax({
    url: url+id,
    type: 'PUT',
    data: editeduser,
    success: function (result) {
      window.location.href = "user.html";
    }
  });

}

function Delete(id) {
  $('#confirmModal').modal('toggle');
  $("#confirmdelete").click(function () {
    console.log("delete " + id);
    $.ajax({
      url: url + id,
      type: 'DELETE',
      success: function (result) {
        window.location.href = "user.html";
      }
    });
  });
}

$("#adduser").click(function() {
  console.log("addclick")
  $('#addModal').modal('toggle');
});

$("#saveuser").click(function () {
  $.post(url + $("#userid").val(), function (data, status) {
    if (!data) {
      console.log("add/edit user");
      var newuser = {
        _id: null,
        UserID: $("#userid").val(),
        Password: $("#password").val(),
        type: $("#type").val(),
      }
      console.log("add new ");
      $.ajax({
        url: '/api/addUser',
        type: 'POST',
        data: newuser,
        success: function (result) {
          window.location.href = "user.html";
        }
      });

    } else {
      $('#alertModal').modal('toggle');
      console.log("Duplicate UserID")
    }
  });
});




  // addModal