//判断是否登陆
checkLogin();

var userManage = {
    allUser: [], //所有用户
    commonUser: [], //普通用户
    manageUser: [], //管理员
    pageSize: 8,
    state: 0, //当前table状态 0:All 1:Common 2:Manage
    pswLenRange: [6, 12], //密码长度范围

    init: function() {
        var self = this;

        $("#usertable").bootstrapTable({ // 对应table标签的id
            uniqueId: 'userid',
            striped: true,  //表格显示条纹，默认为false
            pagination: true, // 在表格底部显示分页组件，默认false
            pageList: [self.pageSize, 2*self.pageSize], // 设置页面可以显示的数据条数
            pageSize: self.pageSize, // 页面数据条数
            pageNumber: 1, // 首页页码
            //showRefresh: true,//是否显示刷新按钮
            //clickToSelect: true, //点击行时，自动选择rediobox 和 checkbox
            sidePagination: 'client', // 设置为客户端分页
            columns: [
                {
                    field: 'jobnum', // 返回json数据中的name
                    title: '工号', // 表格表头显示文字
                    align: 'center', // 左右居中
                    valign: 'middle' // 上下居中
                }, {
                    field: 'username',
                    title: '姓名',
                    align: 'center',
                    valign: 'middle'
                },{
                    field: 'depart',
                    title: '部门',
                    align: 'center',
                    valign: 'middle'
                },{
                    field: 'jobpost',
                    title: '岗位',
                    align: 'center',
                    valign: 'middle'
                }, {
                    title: "操作",
                    align: 'center',
                    valign: 'middle',
                    width: 180, // 定义列的宽度，单位为像素px
                    formatter: function (value, row, index) {
                        return '<button class="btn btn-link btn-sm" data-toggle="modal" data-target="#checkUser" onclick="userManage.checkUser(' +
                            row.userid + ');">查看</button>' +
                            '<button class="btn btn-primary btn-sm" data-toggle="modal" data-target="#editUser" onclick="userManage.editData(' +
                            row.userid + ',' + row.type + ');">修改</button>&#10;' +
                            '<button class="btn btn-danger btn-sm" onclick="userManage.deleteUser(' + row.userid + ');">删除</button>';
                    }
                }
            ]
        });

        $('#renderAllUser').on('click', function() {
            $(this).addClass('btn-primary').removeClass('btn-default').siblings().addClass('btn-default').removeClass('btn-primary');
            //返回第一页
            $('#usertable').bootstrapTable('selectPage', 1);
            self.renderAllUserTable();
            self.state = 0;
        });
        $('#renderCommonUser').on('click', function() {
            $(this).addClass('btn-primary').removeClass('btn-default').siblings().addClass('btn-default').removeClass('btn-primary');
            //返回第一页
            $('#usertable').bootstrapTable('selectPage', 1);
            self.renderCommonUserTable();
            self.state = 1;
        });
        $('#renderManageUser').on('click', function() {
            $(this).addClass('btn-primary').removeClass('btn-default').siblings().addClass('btn-default').removeClass('btn-primary');
            //返回第一页
            $('#usertable').bootstrapTable('selectPage', 1);
            self.renderManageUserTable();
            self.state = 2;
        });

        $('#password').password()
            .password('focus')
            .on('show.bs.password', function(e) {
                $('#eventLog').text('On show event');
                $('#methods').prop('checked', true);
            }).on('hide.bs.password', function(e) {
                $('#eventLog').text('On hide event');
                $('#methods').prop('checked', false);
            });
        $('#methods').click(function() {
            $('#password').password('toggle');
        });

        //点击修改密码
        $('#alterPSW').on('click', function() {
            self.alterPassword.startAlter();
        });

        //取消修改密码
        $('#cancelalterPSW').on('click', function() {
            self.alterPassword.cancelAlter();
        });

        //确定修改密码
        $('#doAlterPSW').on('click', function() {
            self.alterPassword.confirmAlter();
        });

        self.updateTable();
    },

    //修改密码
    alterPassword: {
        username: '',

        //点击开始修改
        startAlter: function() {
            $('#PSWshow').hide();
            $('#alterPSWBox').show();

            this.username = $('#checkusername').text();
        },
        //确定修改
        confirmAlter: function() {
            var self = this;
            var newPSW = self.checkPSW();
            if(!newPSW) {
                return false;
            }
            swal({
                title: "确定修改？",
                type: "warning",
                showCancelButton: true,
                allowOutsideClick: true,
                closeOnConfirm: false,
                showLoaderOnConfirm: true
            }, function () {
                var passwordPost={
                    "username": self.username,
                    "password": newPSW
                };
                user.editPassword(passwordPost,function (data,err) {
                    if (err) {
                        swal({
                            title: "error",
                            type: "error"
                        });
                        return false;
                    }
                    swal({
                        title: "修改成功！",
                        type: "success",
                        allowOutsideClick: true
                    });
                    self.alterSuccess(newPSW);
                });
            });
        },
        //取消修改
        cancelAlter: function() {
            $('#PSWshow').show();
            $('#alterPSWBox').hide();
            $('#newpassword').val('');
            $('#confirmpassword').val('');
        },
        //结束修改
        alterSuccess: function(newPSW) {
            $('#checkpassword').val(newPSW);

            $('#PSWshow').show();
            $('#alterPSWBox').hide();
            $('#newpassword').val('');
            $('#confirmpassword').val('');
        },
        //判断密码是否合法
        checkPSW: function() {
            var self = this;
            var newPSW = $('#newpassword').val();
            var confirmPSW = $('#confirmpassword').val();
            var pswLen = newPSW.length;
            if(pswLen < userManage.pswLenRange[0] || pswLen > userManage.pswLenRange[1]) {
                userManage.showAlert('密码应为'+userManage.pswLenRange[0]+'~'+userManage.pswLenRange[1]+'位');
                return false;
            }
            if(newPSW !== confirmPSW) {
                userManage.showAlert('密码不一致');
                return false;
            }
            return newPSW;
        }
    },

    updateTable: function() {
        var self = this;
        self.updateUsers();
        switch(self.state) {
            case 0: self.renderAllUserTable(); break;
            case 1: self.renderCommonUserTable(); break;
            case 2: self.renderManageUserTable(); break;
        }
    },

    //渲染所有用户
    renderAllUserTable: function() {
        var self = this;
        $("#usertable").bootstrapTable('load', self.allUser);
    },
    //渲染普通用户
    renderCommonUserTable: function() {
        var self = this;
        $("#usertable").bootstrapTable('load', self.commonUser);
    },
    //渲染管理员用户
    renderManageUserTable: function() {
        var self = this;
        $("#usertable").bootstrapTable('load', self.manageUser);
    },

    //更新用户
    updateUsers: function() {
        var self = this;
        self.getAllUser();
        self.sortUser(self.allUser);
    },

    //获取所有用户
    getAllUser: function() {
        var self = this;
        user.getAll(function(data, err) {
            if (err) {
                swal({
                    title: "error",
                    type: "error"
                });
                return false;
            }
            var dataList = data.data;
            console.log(dataList);
            self.allUser = dataList;
        });
    },

    //将用户分为两个数组
    sortUser: function(dataList) {
        var self = this;
        self.commonUser = [];
        self.manageUser = [];
        $(dataList).each(function(i, item) {
            if(item.type == 0) self.commonUser.push(item);
            else self.manageUser.push(item);
            //item.type == 0 ? self.commonUser.push(item) : self.manageUser.push(item);
        });
        //console.log(self.commonUser);console.log(self.manageUser);
    },

    addUser: function() {
        var self = this;
        var postData = {
            "username": $('#addManageUsername').val(),
            "password": $('#addManagePassword').val(),
            "type": $('#addtype')[0].value,
            "phonenum": $('#addManagePhone').val(),
            "jobnum": $('#addManageJobnum').val(),
            "jobpost": $('#addManageJobpost').val(),
            "depart": $('#addManageDepart').val()
        };

        if(!self.checkUploadValid(postData)) {
            return false;
        }

        swal({
            title: "确定添加？",
            type: "warning",
            showCancelButton: true,
            allowOutsideClick: true,
            closeOnConfirm: false,
            showLoaderOnConfirm: true
        }, function () {
            $('#addUser').modal('hide');
            $('#addForm')[0].reset();//重置表单
            user.add(postData, function (data, err) {
                if (err) {
                    swal({
                        title: "error",
                        type: "error"
                    });
                    return false;
                }
                console.log(data);
                if(data.state == 200) {
                    swal({
                        title: "添加成功！",
                        type: "success",
                        allowOutsideClick: true
                    });
                    self.updateTable();
                    return false;
                }
                swal({
                    title: data.error,
                    type: "error"
                });
            });
        });
    },

    editData: function(userid, usertype) {
        var self = this;
        var logInfo = $("#usertable").bootstrapTable('getRowByUniqueId', userid);
        console.log(logInfo);

        $('#editJobnum').val(logInfo.jobnum);
        $('#editUsername').text(logInfo.username);
        //$('#editPassword').val(logInfo.password);
        $('#editDepart').val(logInfo.depart);
        $('#editJobpost').val(logInfo.jobpost);
        $('#editPhone').val(logInfo.phonenum);

        $('#doEditUser').unbind().on('click', function() {
            swal({
                title: "确定修改？",
                type: "warning",
                showCancelButton: true,
                allowOutsideClick: true,
                closeOnConfirm: false,
                showLoaderOnConfirm: true
            }, function () {
                var postData={
                    "username":$("#editUsername").text(),
                    "jobnum":$("#editJobnum").val(),
                    "jobpost":$("#editJobpost").val(),
                    "depart":$("#editDepart").val(),
                    "phonenum":$("#editPhone").val(),
                    "type": usertype
                };console.log(postData);
                $('#editUser').modal('hide');
                $('#editForm')[0].reset();//重置表单
                user.edit(postData, function (data, err) {
                    if (err) {
                        swal({
                            title: "error",
                            type: "error"
                        });
                        return false;
                    }
                    console.log(data);
                    swal({
                        title: "修改成功！",
                        type: "success",
                        allowOutsideClick: true
                    });
                    self.updateTable();
                });
            });
        });
    },

    //检查上传的用户信息是否合理
    checkUploadValid: function(postData) {
        var self = this;
        console.log(postData);
        var newPSW = postData.password;
        var pswLen = postData.password.length;
        if(postData.username.length === 0) {
            self.showAlert('用户名不能为空');
            return false;
        }
        if(pswLen < self.pswLenRange[0] || pswLen > self.pswLenRange[1]) {
            self.showAlert('密码应为'+userManage.pswLenRange[0]+'~'+userManage.pswLenRange[1]+'位');
            return false;
        }
        var confirmPSW = $('#addconfirmpassword').val();
        if(newPSW !== confirmPSW) {
            self.showAlert('密码不一致');
            return false;
        }

        return true;
    },

    deleteUser: function(id) {
        var self=this;
        var userid = id;
        console.log(userid);
        var postData={
            "userid":userid
        };
        swal({
            title: "确定删除？",
            type: "warning",
            showCancelButton: true,
            allowOutsideClick: true,
            closeOnConfirm: false
        }, function () {
            user.deleteData(postData, function (data, err) {
                //console.log(data)
                if (err) {
                    swal({
                        title: "error",
                        type: "error"
                    });
                    return false;
                }
                if(data.state == 200) {
                    swal({
                        title: "删除成功！",
                        type: "success",
                        allowOutsideClick: true
                    });
                    self.updateTable();
                }
                else {
                    swal({
                        title: "该用户不能删除",
                        type: "error"
                    });
                    return false;
                }
            });
        });
    },

    checkUser: function(userid) {
        var self = this;
        var logInfo = $("#usertable").bootstrapTable('getRowByUniqueId', userid);
        console.log(logInfo);

        $('#checkjobnum').text(logInfo.jobnum);
        $('#checkusername').text(logInfo.username);
        $('#checkpassword').val(logInfo.password);
        $('#checkdepart').text(logInfo.depart);
        $('#checkjobpost').text(logInfo.jobpost);
        $('#checkphonenum').text(logInfo.phonenum);
    },

    showAlert: function(text) {
        swal({
            title: '输入错误',
            text: text,
            type: "error"
        });
    }
};

userManage.init();