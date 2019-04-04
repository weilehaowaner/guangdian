//判断是否登陆
checkLogin();
//判断用户类型
checkUserType();
//两个端就渲染数据样式不同
var message = {
    allMessage: [], //所有留言
    myMessage: [], //我的留言
    pageSize: 8,
    state: 0, //当前table状态 0:All 1:My
    userName:"",
    init: function() {
        var self = this;

        //点击恢复原始状态
        $('#refreshBtn').on('click', function() {
            self.state = 0;
            $('#renderAllMessage').addClass('btn-primary').removeClass('btn-default').siblings().addClass('btn-default').removeClass('btn-primary');
            //返回第一页
            $('#messageTable').bootstrapTable('selectPage', 1);
            self.renderAllMessage();
        });

        //回车搜索
        $('#searchmessage').bind('keyup', function(event) {
            if (event.keyCode == "13") {
                //回车执行查询
                self.search();
            }
        });

        $('#searchMessageStarttime').datetimepicker({
            format: 'yyyy-mm-dd hh:ii',
            autoclose: true
        });
        $('#searchMessageEndtime').datetimepicker({
            format: 'yyyy-mm-dd hh:ii',
            autoclose: true
        });

        self.userName=self.getUserName();
        $("#messageTable").bootstrapTable({ // 对应table标签的id
            uniqueId: 'messagelogid',
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
                    field: 'title', // 返回json数据中的name
                    title: '标题', // 表格表头显示文字
                    align: 'center', // 左右居中
                    valign: 'middle' // 上下居中
                }, {
                    field: 'content',
                    title: '内容',
                    align: 'center',
                    valign: 'middle'
                },{
                    field: 'username',
                    title: '上传人员',
                    align: 'center',
                    valign: 'middle'
                },{
                    field: 'addtime',
                    title: '上传时间',
                    align: 'center',
                    valign: 'middle'
                }, {
                    title: "操作",
                    align: 'center',
                    valign: 'middle',
                    width: 180, // 定义列的宽度，单位为像素px
                    formatter: function (value, row, index) {
                        if(self.state === 0)
                        {
                            return '<button class="btn btn-link btn-sm" data-toggle="modal" data-target="#checkMessage" onclick="message.checkMessage(' +
                                row.messagelogid + ');">查看</button>';
                        }
                        else{
                            return '<button class="btn btn-link btn-sm" data-toggle="modal" data-target="#checkMessage" onclick="message.checkMessage(' +
                                row.messagelogid + ');">查看</button>' +
                                '<button class="btn btn-primary btn-sm" data-toggle="modal" data-target="#editMessage" onclick="message.editData(' +
                                row.messagelogid +');">修改</button>&#10;' +
                                '<button class="btn btn-danger btn-sm" onclick="message.deleteMessage(' + row.messagelogid + ');">删除</button>';
                        }

                    }
                }
            ]
        });

        $('#renderAllMessage').on('click', function() {
            self.state = 0;
            $(this).addClass('btn-primary').removeClass('btn-default').siblings().addClass('btn-default').removeClass('btn-primary');
            //返回第一页
            $('#messageTable').bootstrapTable('selectPage', 1);
            self.renderAllMessage();

        });
        $('#renderMyMessage').on('click', function() {
            self.state = 1;
            $(this).addClass('btn-primary').removeClass('btn-default').siblings().addClass('btn-default').removeClass('btn-primary');
            //返回第一页
            $('#messageTable').bootstrapTable('selectPage', 1);
            self.renderMyMessage();

        });

        self.updateTable();

        $("#editMessageFile").fileinput({
            theme: 'fa',
            uploadUrl: '#',
            dropZoneEnabled: false,
            showPreview: false,
            showUpload: false
        });
        $("#newMessageImg").fileinput({
            theme: 'fa',
            uploadUrl: '#',
            dropZoneEnabled: false,
            showPreview: false,
            showUpload: false
        });
    },

    getUserName:function () {
        return  getCookie('zjrtusername');
    },
    updateTable: function() {
        var self = this;
        self.updateMessage();

        switch(self.state) {
            case 0: self.renderAllMessage(); break;
            case 1: self.renderMyMessage(); break;
        }
    },

    //渲染所有用户
    renderAllMessage: function() {
        var self = this;
        $("#messageTable").bootstrapTable('load', self.allMessage);
    },
    //渲染普通用户
    renderMyMessage: function() {
        var self = this;
        $("#messageTable").bootstrapTable('load', self.myMessage);
    },


    //更新留言
    updateMessage: function() {
        var self = this;
        self.getAllMessage();
        self.sortMy(self.allMessage);

    },

    //获取所有留言
    getAllMessage: function() {
        var self = this;
        var pageSize=0;
        messageBoard.getCount(function (data, err) {
            if (err) {
                swal({
                    title: "error",
                    type: "error"
                });
                return false;
            }
            pageSize = data.object.number;
        });

        messageBoard.getAll(pageSize,function(data, err) {
            if (err) {
                swal({
                    title: "error",
                    type: "error"
                });
                return false;
            }
            var dataList = data.data;
            self.allMessage = dataList;
        });

    },

    //将用户分为两个数组
    sortMy: function(dataList) {
        var self = this;
        self.myMessage = [];

        $(dataList).each(function(i, item) {
            if(item.username === self.userName) self.myMessage.push(item);

            //item.type == 0 ? self.commonUser.push(item) : self.manageUser.push(item);
        });
        //console.log(self.commonUser);console.log(self.manageUser);
    },

    addMessage: function () {//添加留言
        var self=this;
        var formData = new FormData();
        var addtime = getNowFormatDate();
        var file = $('#newMessageImg')[0].files[0];
        formData.append("addtime", addtime);
        var username = getCookie('zjrtusername');
        formData.append("username",username);

        formData.append("title", $('#newMessageTitle  ').val());
        formData.append("content", $('#newMessageContent ').val());
        if(file) formData.append("file", file);

        swal({
            title: "确定添加？",
            type: "warning",
            showCancelButton: true,
            allowOutsideClick: true,
            closeOnConfirm: false,
            showLoaderOnConfirm: true
        }, function () {
            $('#addMessage').modal('hide');
            $('#addMessageForm')[0].reset();//重置表单
            messageBoard.add(formData, function (data, err) {
                if (err) {
                    swal({
                        title: "error",
                        type: "error"
                    });
                    return false;
                }
                console.log(data);
                swal({
                    title: "添加成功！",
                    type: "success",
                    allowOutsideClick: true
                });

                self.updateTable();

            });
        });
    },

    editData:function (messagelogid) {
        var self=this;

        function getSingleMessage() {
            var logInfo =$("#messageTable").bootstrapTable('getRowByUniqueId', messagelogid);

            $('#editMessageTitle').val(logInfo.title);
            $('#editMessageContent').val(logInfo.content);
            $('#editMessageUser').val(logInfo.username);
        };
        getSingleMessage();
        $("#editSub").unbind().click(function () {
            var file = $('#editMessageFile')[0].files[0];
            var formData = new FormData();
            var addtime = getNowFormatDate();
            formData.append("addtime", addtime);
            var username = getCookie('zjrtusername');
            formData.append("username",username);
            formData.append("messagelogid", messagelogid);
            formData.append("title", $('#editMessageTitle').val());
            formData.append("content", $('#editMessageContent').val());
            if(file) formData.append("file", file);

            swal({
                title: "确定修改？",
                type: "warning",
                showCancelButton: true,
                allowOutsideClick: true,
                closeOnConfirm: false,
                showLoaderOnConfirm: true
            }, function () {
                $('#editMessage').modal('hide');
                $('#editMessageForm')[0].reset();//重置表单
                messageBoard.edit(formData, function (data, err) {
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



    deleteMessage: function (id) {//删除留言
        var self=this;
        var formData = new FormData();
        var messagelogid = id;
        formData.append("messagelogid", messagelogid);
        swal({
            title: "确定删除？",
            type: "warning",
            showCancelButton: true,
            allowOutsideClick: true,
            closeOnConfirm: false
        }, function () {
            messageBoard.delete(formData, function (data, err) {
                console.log(err);
                if (err) {
                    swal({
                        title: "error",
                        type: "error"
                    });
                    return false;
                }
                swal({
                    title: "删除成功！",
                    type: "success",
                    allowOutsideClick: true
                });
                self.updateTable();
            });
        });
    },

    checkMessage:  function (messagelogid) {//查看留言
        var self = this;
        var logInfo = $("#messageTable").bootstrapTable('getRowByUniqueId', messagelogid);
        console.log(logInfo);
        $("#checkMessageTitle").text(logInfo.title);
        $("#checkMessageContent").text(logInfo.content);
        $("#checkMessageUser").text(logInfo.username);
        $("#checkMessageAddTime").text(logInfo.addtime);
        $("#checkMessageFile").attr("href",fileUrl+logInfo.picurl);
        if(!logInfo.picurl)
        {
            $("#checkMessageFile").text('未添加');
        }
        else{
            $("#checkMessageFile").text('查看');

        }

    },

    //根据时间筛选
    screenByTime: function() {
        var self = this;
        var start = $('#searchMessageStarttime').val();
        var end = $('#searchMessageEndtime').val();
        console.log(start+' '+end);
        if(!start || !end) {
            swal({
                title: "请输入正确时间！",
                type: "info"
            });
            return false;
        }
        var postData = {
            "startTime": start,
            "endTime":  end
        };
        messageBoard.screenByTime(postData, function(data, err) {
            if (err) {
                swal({
                    title: "error",
                    type: "error"
                });
                return false;
            }
            var dataList = data.data;
            console.log(dataList);
            $("#messageTable").bootstrapTable('load', dataList);
            self.state = 0;
            $('#renderAllMessage').addClass('btn-primary').removeClass('btn-default').siblings().addClass('btn-default').removeClass('btn-primary');
        });
    },

    //搜索
    search: function() {
        var self = this;
        var searchmessage = $('#searchmessage').val();
        if(searchmessage.length == 0) {
            self.updateTable();
            return 0;
        }
        var postData = {
            "search": searchmessage
        };
        messageBoard.search(postData, function(data, err) {
            if (err) {
                swal({
                    title: "error",
                    type: "error"
                });
                return false;
            }
            var dataList = data.data;
            console.log(dataList);
            $("#messageTable").bootstrapTable('load', dataList);
            self.state = 0;
            $('#renderAllMessage').addClass('btn-primary').removeClass('btn-default').siblings().addClass('btn-default').removeClass('btn-primary');
        });
    }
};

message.init();

