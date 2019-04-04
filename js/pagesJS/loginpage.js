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
$(".landing_checkbox input").click(function () {
    var inputId=$(this).attr("id");
    $(".landing_checkbox input").each(function () {
        $(this).css("border","#0380ba");
    });
    $("label").each(function () {
        $(this).css("color","#797979");
    });

    $("label").each(function () {
        var labelFor=$(this).attr("for");
        if(inputId==labelFor)
        {
            $(this).css("color","#0380ba");
        }
    });

});

$(document).keyup(function (e) {
    if (e.keyCode == 13) {
        login();
    }
});

/*点击登录*/
function login(){
    var username = $("#username").val();
    var password = $("#password").val();
    var idents = document.getElementsByName("ident");
    var checkdata = { "username": username, "password": password};
    $.ajax({
        type: "post",
        url: urlstring+"user/login",
        contentType: "application/json;charset=UTF-8",
        dataType: "json",
        data:JSON.stringify(checkdata),
        success: function (data) {
            console.log(data);
            if(data.state == 200){
                for(var i = 0; i < idents.length; i++) {
                    if(idents[i].checked) {
                        if(idents[i].value === "user" && data.object.type === 0 ) {
                            SetCookie("zjrtusername",data.object.username);
                            SetCookie("zjrtusertype",data.object.type);
                            window.location.href = "./Homepage.html";
                        }
                        else if(idents[i].value === "manager" && data.object.type === 1 ) {
                            SetCookie("zjrtusername",data.object.username);
                            SetCookie("zjrtusertype",data.object.type);
                            window.location.href = "./Homepage.html";
                        }
                        else{
                            swal("您没有登录权限");
                        }
                    }
                }
            }
            else{
                swal("用户名或密码错误！");
            }
        },
        error: function(err) {
            swal({
                title: "error",
                type: "error"
            });
        }

    });
}

function SetCookie(name,value,hours,path,domain,secure) {
    var expire = "";
    var pathstr = "";
    var domainstr = "";
    var securestr = "";
    if(hours != null){
        expire = new Date((new Date()).getTime() + hours * 3600000);
        expire = "; expires=" + expire.toGMTString();
    }
    if(path != null)
        pathstr = "; path=" + path;
    if(domain != null)
        domainstr = "; domain=" + domain;
    if(secure != null)
        securestr = "; secure"
    var c = name + "=" + escape (value) +  expire + pathstr + domainstr + securestr;
    document.cookie = c;
}
