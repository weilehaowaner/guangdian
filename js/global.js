//var urlstring = 'http://106.14.210.170:8080/zjrt/';
//var fileUrl = 'http://106.14.210.170:8080/zjrt/upload/';

// var urlstring = 'http://139.224.164.183:1285/zjrt/';
// var fileUrl = 'http://139.224.164.183:1285/zjrt/upload/';

//var urlstring = 'http://120.79.223.83:8081/zjrt/';
swal.setDefaults({
    confirmButtonColor: "#337ab7",
    confirmButtonText: "确定",
    cancelButtonText: "取消"
});
// cookie的名字为zjrtusername,每个用户对应不同的属性值；
function getCookie(c_name) {
    if (document.cookie.length > 0) {
        c_start = document.cookie.indexOf(c_name + "=");
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1;
            c_end = document.cookie.indexOf(";", c_start);
            if (c_end == -1) c_end = document.cookie.length;
            return unescape(document.cookie.substring(c_start, c_end));
        }
    }
    return "";
}
//判断是否登陆
// function checkLogin() {
//     var username = getCookie('zjrtusername');
//     if (username != null && username != "") {
//         //alert('Welcome again '+username+'!')
//         //alert(getCookie('zjrtusertype'));
//     }
//     else {
//         swal({
//             title: "请先登陆!"
//         }, function () {
//             window.location.href = "loginpage.html";
//         });
//         //if (username!=null && username!="")
//         //{
//         //    setCookie('username',username,365)
//         //}
//     }
// }
//判断用户类型
function checkUserType() {
    var usertype = getCookie('zjrtusertype');
    var html = '';
    if (usertype == 1) {
        html = '<li class="content"><a href="ManageUser.html"><p>后台管理</p></a></li>';
    }
    else {
        $('#moreNotice').show();
        html = '<li class="content"><a href="Notification.html"><p>通知公告</p></a></li>';
    }
    $('#top-nav').append(html);
}

$("#quitLogin").click(function () {
    //$("#floatWrapper_mask").css("display","block");
    //$("#floatWrapper_content").css("display","block");
    swal({
        title: "确定退出？",
        text: "你将返回登陆页面！",
        type: "warning",
        allowOutsideClick: true,
        showCancelButton: true
    }, function () {
        window.location.href = "loginpage.html";
    });
});

//获取当前时间，格式YYYY-MM-DD hh:mm
function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    var hour = date.getHours();
    var minute = date.getMinutes();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate;
    var currenttime = year + seperator1 + month + seperator1 + strDate + ' ' + hour + ':' + minute;
    return currenttime;
}

//修改密码
var editMyPSW = {
    username: '',
    password: '',
    password_confirm: '',
    phoneNumber: '',
    codeBtn: $('#codeBtn'), //获取验证码按钮
    code: '', //获取到的验证码
    count: 60, //点获取验证码后时间
    curCount: 0,
    codeInput: '',//输入的验证码

    init: function () {
        var self = this;
        this.username = getCookie('zjrtusername');
        $('#editPSWuser').text(self.username);

        this.codeBtn.on('click', function () {
            self.phoneNumber = $('#editphonePSW').val();
            if (!self.phoneNumber) {
                self.showAlert('请输入手机号');
                return false;
            }
            self.getCode();
        });
    },

    edit: function () {
        var self = this;
        this.password = $('#editnewPSW').val();
        this.password_confirm = $('#editconfirmPSW').val();
        this.phoneNumber = $('#editphonePSW').val();
        this.codeInput = $('#codeInput').val();
        if (this.check()) {
            var checkdata = {
                "username": this.username,
                "password": this.password
            };
            $.ajax({
                type: "post",
                contentType: "application/json;charset=UTF-8",
                url: urlstring + "user/modifyPwd",
                dataType: "json",
                data: JSON.stringify(checkdata),
                success: function (data) {

                    console.log(data);
                    if (data.state == 200) {
                        swal({
                            title: '修改密码成功',
                            type: 'success'
                        }, function () {
                            location.reload();
                        });
                    }
                    else {
                        self.showAlert(data.error);
                        return false;
                    }
                },
                error: function () {
                    self.showAlert('error');
                }
            })
        }
    },

    check: function () {
        if (!this.username) {
            swal({
                title: '请登陆'
            }, function () {
                window.location.href = "loginpage.html";
            });
            return false;
        }
        if (!this.password) {
            this.showAlert('请输入密码');
            return false;
        }
        if (this.password.length < 6 || this.password.length > 12) {
            this.showAlert('密码长度为6~12');
            return false;
        }
        if (this.password !== this.password_confirm) {
            this.showAlert('密码不一致');
            return false;
        }
        if (!this.phoneNumber) {
            this.showAlert('请输入手机号');
            return false;
        }
        if (!this.codeInput) {
            this.showAlert('请输入验证码');
            return false;
        }
        if ('验证码：' + this.codeInput !== this.code) {
            this.showAlert('验证码错误');
            return false;
        }

        return true;
    },

    getCode: function () {
        var self = this;
        var checkphone = {"phonenum": this.phoneNumber};
        $.ajax({
            type: "post",
            dataType: "json",
            contentType: "application/json;charset=UTF-8",
            url: urlstring + "message/send",
            data: JSON.stringify(checkphone),
            success: function (data) {
                console.log(data);
                self.code = data.data;
                console.log(self.code);
                if (data.state === "OK") {
                    self.curCount = self.count;
                    self.codeBtn.attr("disabled", "true");
                    self.codeBtn.text(self.curCount + "s");
                    self.InterValObj = window.setInterval(self.SetRemainTime, 1000);
                }
                else {
                    self.showAlert(data.state);
                }
            },
            error: function (error) {
                self.showAlert('error');
            }
        })
    },

    SetRemainTime: function () {
        if (editMyPSW.curCount == 0) {
            editMyPSW.showAlert("超时!验证码失效");
            editMyPSW.code = '';
            window.clearInterval(editMyPSW.InterValObj);
            editMyPSW.codeBtn.removeAttr("disabled");
            editMyPSW.codeBtn.text("获取");
        }
        else {
            editMyPSW.curCount--;
            editMyPSW.codeBtn.text(editMyPSW.curCount + "s");
        }
    },

    showAlert: function (text) {
        swal({
            title: text,
            type: 'error'
        });
    }
};
editMyPSW.init();

//比较两个时间
function compareTime(t1, t2) {
    return t1 <= t2 ? 1 : false;
}

function TimeDifference(time1, time2) {
    //定义两个变量time1,time2分别保存开始和结束时间
    //var time1 = "2009-12-02 12:25";
    //var time2 = "2009-12-03 12:35";

    //判断开始时间是否大于结束日期
    if (!compareTime(time1, time2)) {
        swal({
            title: "error",
            text: "开始时间不能大于结束时间！",
            type: "error",
            allowOutsideClick: true
        });
        return false;
    }

    //截取字符串，得到日期部分"2009-12-02",用split把字符串分隔成数组
    var begin1 = time1.substr(0, 10).split("-");
    var end1 = time2.substr(0, 10).split("-");

    //将拆分的数组重新组合，并实例成化新的日期对象
    var date1 = new Date(begin1[1] + -+begin1[2] + -+begin1[0]);
    var date2 = new Date(end1[1] + -+end1[2] + -+end1[0]);

    //得到两个日期之间的差值m，以分钟为单位
    //Math.abs(date2-date1)计算出以毫秒为单位的差值
    //Math.abs(date2-date1)/1000得到以秒为单位的差值
    //Math.abs(date2-date1)/1000/60得到以分钟为单位的差值
    var m = parseInt(Math.abs(date2 - date1) / 1000 / 60);

    //小时数和分钟数相加得到总的分钟数
    //time1.substr(11,2)截取字符串得到时间的小时数
    //parseInt(time1.substr(11,2))*60把小时数转化成为分钟
    var min1 = parseInt(time1.substr(11, 2)) * 60 + parseInt(time1.substr(14, 2));
    var min2 = parseInt(time2.substr(11, 2)) * 60 + parseInt(time2.substr(14, 2));

    //两个分钟数相减得到时间部分的差值，以分钟为单位
    var n = min2 - min1;

    //将日期和时间两个部分计算出来的差值相加，即得到两个时间相减后的分钟数
    var minutes = m + n;
    console.log(minutes);
    return minutes;
}
