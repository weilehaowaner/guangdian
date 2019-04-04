/***********************设置根字体大小**************/
var WinWidth=window.innerWidth;
var rootFontSize=WinWidth*100.0/1920;//100px为根元素，屏幕宽1920px
$("html").css("font-size",rootFontSize+"px");

/***********************字体随窗口动态变化**************/
$(window).resize(function () {
    WinWidth=window.innerWidth;
    rootFontSize=WinWidth*100.0/1920;//100px为根元素，屏幕宽1920px
    $("html").css("font-size",rootFontSize+"px");
});


$("#find_paswd").click(function(){
    var username = $("#username").val();
    var newpassword = $("#newpassword").val();
    var phonenumber = $("#phonenumber").val();
    var vertify_code = $("#vertify_code").val();
    var vertify_number = vertify_code.match();
    //console.log(vertify_number);
    var checkdata = {
        "username": username,
        "password": newpassword,
    };

    if(username == ""){
        showAlert("用户名不能为空");
        return false;
    }
    if(!validPsw(newpassword)) {
        return false;
    }
    if(vertify_code == ""){
        showAlert("请输入验证码");
        return false;
    }
    else{
        if(!checkVertify_code()) {
            return false;
        }
    }

    $.ajax({
        type: "post",
        contentType: "application/json;charset=UTF-8",
        url: urlstring+"user/modifyPwd",
        dataType: "json",
        data: JSON.stringify(checkdata),
        success: function(data){

            console.log(data);
            //console.log(JSON.stringify(data));
            if(data.state == 200) {
                swal({
                    title: '修改密码成功',
                    text: '返回登录',
                    type: 'success'
                }, function() {
                    window.location.href = "./loginpage.html";
                });

                /*if( ){
                 if (data.state == 200) {
                 alert("密码修改成功!")
                 window.location.href = "loginpage.html";
                 }
                 if (data.state == 101)
                 alert("用户名不正确！")
                 }*/
            }
            else{
                showAlert(data.error);
                return false;
            }
        },
        error: function() {

        }
    })
});

function validPsw(password) {

    if(password == "") {
        showAlert("密码不能为空");
        return false;
    }
    if(password.length < 5 || password.length > 10) {
        showAlert("密码应为5~10位");
        return false;
    }

    return true;
}

var InterValObj;
var count = 60;
var curCount;
var backCode = '';//获取的验证码

function sendMessage() {
    var phonenum = $("#phonenumber").val();
    var checkphone = {"phonenum": phonenum};
    //console.log(checkphone);
    if (phonenum == "") {
        showAlert("请输入手机号！");
        return false;
    }
    $.ajax({
        type: "post",
        dataType: "json",
        contentType: "application/json;charset=UTF-8",
        url: urlstring + "message/send",
        data: JSON.stringify(checkphone),
        success: function (data) {
            //console.log(checkphone);
            console.log(JSON.stringify(data));
            backCode = data.data;
            console.log(backCode);
            //var vertifycode = JSON.stringify(datacode.match());
            //console.log(vertifycode)
            if (data.state === "OK") {
                curCount = count;
                $("#verification_code").attr("disabled", "true");
                $("#verification_code").val(curCount + "s");
                InterValObj = window.setInterval(SetRemainTime, 1000);
            }
            else {
                showAlert("短时间内发送短信次数太多，请稍后再来！");
                //alert("短时间内发送短信次数太多，请稍后再来！")
                // alert(data.state);//阿里短信验证码模板限制每小时发信息5条
            }
            /*先设置禁用注册按钮*/
            $("#vertify_code").blur(function(){

            });

        }
    })
}
function SetRemainTime(){
    if (curCount == 0) {
        showAlert("重新获取验证码");
        backCode = '';
        window.clearInterval(InterValObj);
        $("#verification_code").removeAttr("disabled");
        $("#verification_code").val("获取");
    }
    else {
        curCount--;
        $("#verification_code").val(curCount + "s");
    }
}
//判断输入验证码是否正确
function checkVertify_code() {
    var vertify_code = '验证码：' + $("#vertify_code").val();
    console.log(vertify_code);
    if(vertify_code != backCode){
        showAlert("验证码不正确！");
        //alert("密码不能为空");
        return false
    }
    return true;
}

function showAlert(string) {
    swal({
        title: string,
        type: 'error'
    })
}