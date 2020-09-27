$("#loginBtn").click(function () {

    var sUserID = $("#userID").val();
    var sPassword=  $("#password").val();
        var authen = {
          UserID: sUserID,
          Password: sPassword
        }
  
        $.ajax({
          url: "api/authenAdmin",
          type: 'POST',
          data: authen,
          success: function (result) {
            if(result){
            sessionStorage.setItem("userID",sUserID);
            sessionStorage.setItem("password",sPassword);
            window.location.href = sessionStorage.getItem("session");
           }
          }
        });

});

$(function () {

  $.post('api/addDefaultAdmin', function (data, status) {

    console.log(data);

  });

});
