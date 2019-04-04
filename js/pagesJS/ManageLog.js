//判断是否登陆
checkLogin();

//工作日志管理
var worklogManage = {
    dataCache: [],//缓存池
    pageSize: 8,//一页多少数据
    page: 1,//当前页
    pageCount: 0,//页数

    //初始化
    init: function() {
        var self = this;

        $("#worklogtable").bootstrapTable({ // 对应table标签的id
            uniqueId: 'worklogid',
            striped: true,  //表格显示条纹，默认为false
            pagination: true, // 在表格底部显示分页组件，默认false
            pageList: [self.pageSize, 2*self.pageSize], // 设置页面可以显示的数据条数
            pageSize: self.pageSize, // 页面数据条数
            pageNumber: 1, // 首页页码
            //clickToSelect: true, //点击行时，自动选择rediobox 和 checkbox
            sidePagination: 'client', // 设置为客户端分页
            columns: [
                {
                    checkbox: true, // 显示一个勾选框
                    align: 'center' // 居中显示
                }, {
                    field: 'mallname', // 返回json数据中的name
                    title: '演播厅名称', // 表格表头显示文字
                    align: 'center', // 左右居中
                    valign: 'middle' // 上下居中
                }, {
                    field: 'programename',
                    title: '节目名称',
                    align: 'center',
                    valign: 'middle'
                }, {
                    field: 'channelname',
                    title: '频道',
                    align: 'center',
                    valign: 'middle'
                },{
                    field: 'username',
                    title: '联系人',
                    align: 'center',
                    valign: 'middle'
                },{
                    field: 'starttime',
                    title: '开始时间',
                    align: 'center',
                    valign: 'middle'
                }, {
                    title: "操作",
                    align: 'center',
                    valign: 'middle',
                    width: 180, // 定义列的宽度，单位为像素px
                    formatter: function (value, row, index) {
                        return '<button class="btn btn-link btn-sm" data-toggle="modal" data-target="#checkWorklog" onclick="worklogManage.checkData(' +
                               row.worklogid + ');">查看</button>' +
                               '<button class="btn btn-primary btn-sm" data-toggle="modal" data-target="#editWorklog" onclick="worklogManage.editData(' +
                               row.worklogid + ');">修改</button>&#10;' +
                               '<button class="btn btn-danger btn-sm" onclick="worklogManage.deleData(' + row.worklogid + ');">删除</button>';
                    }
                }
            ]
        });

        //点击恢复原始状态
        $('#refreshBtn').on('click', function() {
            self.updateTable();
        });

        self.updateTable();

        $('#searchWorkStarttime').datetimepicker({
            format: 'yyyy-mm-dd hh:ii',
            autoclose: true
        });
        $('#searchWorkEndtime').datetimepicker({
            format: 'yyyy-mm-dd hh:ii',
            autoclose: true
        });

        $("#newWorklogFile").fileinput({
            theme: 'fa',
            uploadUrl: '#',
            dropZoneEnabled: false,
            showPreview: false,
            showUpload: false
        });
        $('#newWorkStarttime').datetimepicker({
            format: 'yyyy-mm-dd hh:ii',
            autoclose: true
        });
        $('#newWorkEndtime').datetimepicker({
            format: 'yyyy-mm-dd hh:ii',
            autoclose: true
        });
        $("#editWorklogFile").fileinput({
            theme: 'fa',
            uploadUrl: '#',
            dropZoneEnabled: false,
            showPreview: false,
            showUpload: false
        });
        $('#editWorkStarttime').datetimepicker({
            format: 'yyyy-mm-dd hh:ii',
            autoclose: true
        });
        $('#editWorkEndtime').datetimepicker({
            format: 'yyyy-mm-dd hh:ii',
            autoclose: true
        });

        //回车搜索
        $('#searchWorklogCon').bind('keyup', function(event) {
            if (event.keyCode == "13") {
                //回车执行查询
                self.search();
            }
        });
    },

    updateTable: function() {
        worklog.screen({}, function(data, err) {
            if (err) {
                swal({
                    title: "error",
                    type: "error"
                });
                return false;
            }
            var dataList = data.data;
            console.log(dataList);
            $("#worklogtable").bootstrapTable('load', dataList);
        });
    },

    //获取页数
    getPageCount: function() {
        var self = this;
        worklog.getCount(function(data, err) {
            if (err) {
                swal({
                    title: "error",
                    type: "error"
                });
                return false;
            }
            var logCount = data.object.number;
            //console.log(logCount);
            var i = logCount / self.pageSize;
            var j = logCount % self.pageSize;
            //console.log(i+","+j);
            if(logCount < self.pageSize){
                self.pageCount = 1;
            }
            else {
                if(j==0){
                    self.pageCount = Math.floor(i);
                }
                else{
                    self.pageCount = Math.floor(i)+1;
                }
            }
            $("#worklogPageCount").text(self.pageCount + '页');
        });
    },

    //渲染列表
    renderData: function(dataList) {
        var telp = '';
        for(var i= 0,item;item=dataList[i++];) {
            telp += '<div class="informationList_line" data-worklogid="' + item.worklogid + '"><div  class="informationList_inline">' +
                '<p class="studio">' + item.mallname + '</p>' + '<div class="program">' + item.programename + '</div>' +
                '<div class="channel">' + item.channelname + '</div>' + '<div class="ContactPerson">' + item.username + '</div>' + '<div class="informationManage">' +
                '<p class="showInformation" data-toggle="modal" data-target="#checkWorklog" onclick="worklogManage.checkData(this)">查看</p>' +
                '<p class="changeInformation" data-toggle="modal" data-target="#editWorklog" onclick="worklogManage.editData(this);">修改</p>' +
                '<p class="deleteInformation" onclick="worklogManage.deleData(this);">删除</p>' +
                '</div></div></div>';
        }
        $('#worklogList').html(telp);
    },

    //更新列表
    updateList: function() {
        var self = this;
        var startRow = (self.page-1)*self.pageSize;
        worklog.getOnePage(startRow, self.pageSize, function(data, err) {
            if (err) {
                swal({
                    title: "error",
                    type: "error"
                });
                return false;
            }
            var dataList = data.data;
            console.log(dataList);
            self.dataCache = dataList;
            self.renderData(dataList);
        });
    },

    //添加
    addData: function() {
        var self = this;
        var file = $('#newWorklogFile')[0].files[0];

        var startTime = $('#newWorkStarttime').val();
        var endTime = $('#newWorkEndtime').val();
        if(!startTime || !endTime) {
            swal({
                title: "请选择时间",
                type: "warning",
                allowOutsideClick: true
            });
            return false;
        }
        //判断开始时间是否大于结束日期
        if (!compareTime(startTime, endTime)) {
            swal({
                title: "error",
                text: "开始时间不能大于结束时间！",
                type: "error",
                allowOutsideClick: true
            });
            return false;
        }

        var formData = new FormData();
        formData.append("mallname", $('#newMallname').val());
        formData.append("channelname", $('#newChannelname').val());
        formData.append("programename", $('#newProgramename').val());
        formData.append("starttime", startTime);
        formData.append("endtime", endTime);
        formData.append("eventtime", getNowFormatDate());
        formData.append("workers", $('#newWorkers').val());
        formData.append("username", $('#newUsername').val());
        formData.append("usertel", $('#newUsertel').val());
        formData.append("loginfo", $('#newLoginfo').val());
        if(file) formData.append("file", file);
        //formData.append("file", file);

        swal({
            title: "确定添加？",
            type: "warning",
            showCancelButton: true,
            allowOutsideClick: true,
            closeOnConfirm: false,
            showLoaderOnConfirm: true
        }, function () {
            $('#addWorklog').modal('hide');
            $('#addWorklogForm')[0].reset();//重置表单
            worklog.add(formData, function(data, err) {
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

    //修改
    editData: function(id) {
        var self = this;
        var worklogid = id;
        var logInfo = $("#worklogtable").bootstrapTable('getRowByUniqueId', worklogid);
        console.log(logInfo);

        $('#editMallname').val(logInfo.mallname);
        $('#editChannelname').val(logInfo.channelname);
        $('#editProgramename').val(logInfo.programename);
        $('#editWorkers').val(logInfo.workers);
        $('#editWorkStarttime').val(logInfo.starttime);
        $('#editWorkEndtime').val(logInfo.endtime);
        $('#editUsername').val(logInfo.username);
        $('#editUsertel').val(logInfo.usertel);
        $('#editLoginfo').val(logInfo.loginfo);

        $('#doEditWorklog').unbind().click(function() {
            var startTime = $('#editWorkStarttime').val();
            var endTime = $('#editWorkEndtime').val();
            //判断开始时间是否大于结束日期
            if (!compareTime(startTime, endTime)) {
                swal({
                    title: "error",
                    text: "开始时间不能大于结束时间！",
                    type: "error",
                    allowOutsideClick: true
                });
                return false;
            }
            var file = $('#editWorklogFile')[0].files[0];

            var formData = new FormData();
            formData.append("worklogid", worklogid);
            formData.append("mallname", $('#editMallname').val());
            formData.append("channelname", $('#editChannelname').val());
            formData.append("programename", $('#editProgramename').val());
            formData.append("starttime", startTime);
            formData.append("endtime", endTime);
            formData.append("eventtime", getNowFormatDate());
            formData.append("workers", $('#editWorkers').val());
            formData.append("username", $('#editUsername').val());
            formData.append("usertel", $('#editUsertel').val());
            formData.append("loginfo", $('#editLoginfo').val());
            if(file) formData.append("file", file);
            //formData.append("file", $('#editWorklogFile')[0].files[0]);

            swal({
                title: "确定修改？",
                type: "warning",
                showCancelButton: true,
                allowOutsideClick: true,
                closeOnConfirm: false,
                showLoaderOnConfirm: true
            }, function () {
                $('#editWorklog').modal('hide');
                $('#editWorklogForm')[0].reset();//重置表单
                worklog.edit(formData, function(data, err) {
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

    //删除
    deleData: function(id) {
        var self = this;
        var worklogid = id;
        //console.log(worklogid);
        swal({
            title: "确定删除？",
            type: "warning",
            showCancelButton: true,
            allowOutsideClick: true,
            closeOnConfirm: false
        }, function () {
            worklog.delete(worklogid, function(data, err) {
                if (err) {
                    swal({
                        title: "error",
                        type: "error"
                    });
                    return false;
                }
                console.log(data);
                swal({
                    title: "删除成功！",
                    type: "success",
                    allowOutsideClick: true
                });
                self.updateTable();
            });
        });
    },

    //查看详情
    checkData: function(worklogid) {
        var self = this;
        var logInfo = $("#worklogtable").bootstrapTable('getRowByUniqueId', worklogid);
        var usedtime = 0;
        if(logInfo.starttime && logInfo.endtime) {
            var minutes = TimeDifference(logInfo.starttime, logInfo.endtime);
            usedtime = minutes/60;
        }
        console.log(usedtime);
        $('#mallname').text(logInfo.mallname);
        $('#channelname').text(logInfo.channelname);
        $('#programename').text(logInfo.programename);
        $('#workers').text(logInfo.workers);
        $('#workStarttime').text(logInfo.starttime);
        $('#workEndtime').text(logInfo.endtime);
        $('#usedtime').text(usedtime.toFixed(1) || 0 + '小时');
        $('#username').text(logInfo.username);
        $('#usertel').text(logInfo.usertel);
        $('#loginfo').text(logInfo.loginfo);
        $('#worklogFileDownload').attr('href', fileUrl + logInfo.fileurl);
        if(!logInfo.fileurl) {
            $('#worklogFileDownload').text('未添加');
        }
        else {
            $('#worklogFileDownload').text('查看');
        }
    },

    //搜索
    search: function() {
        var self = this;
        var searchCon = $('#searchWorklogCon').val();

        var postData = {
            "search": searchCon,
            "isoutput": 0
        };
        worklog.screen(postData, function(data, err) {
            if (err) {
                swal({
                    title: "error",
                    type: "error"
                });
                return false;
            }
            var dataList = data.data;
            console.log(dataList);
            $("#worklogtable").bootstrapTable('load', dataList);
        });
    },

    //根据时间筛选
    screenByTime: function() {
        var self = this;
        var start = $('#searchWorkStarttime').val();
        var end = $('#searchWorkEndtime').val();
        console.log(start+' '+end);
        if(!start || !end) {
            swal({
                title: "请输入正确时间！",
                type: "info"
            });
            return false;
        }
        var postData = {
            "mallname": null,
            "channelname": null,
            "programename": null,
            "starttime": start,
            "endtime":  end,
            "isoutput": 0
        };
        worklog.screen(postData, function(data, err) {
            if (err) {
                swal({
                    title: "error",
                    type: "error"
                });
                return false;
            }
            var dataList = data.data;
            console.log(dataList);
            $("#worklogtable").bootstrapTable('load', dataList);
        });
    },

    //导出数据
    exportData: function() {
        var list = $("#worklogtable").bootstrapTable('getSelections');
        console.log(list);
        var len = list.length;
        if(len==0) {
            swal({
                title: "请选择日志！",
                type: "info"
            });
            return false;
        }
        swal({
            title: "确定导出？",
            type: "warning",
            text: '共选择' + len + '条数据',
            showCancelButton: true,
            allowOutsideClick: true,
            closeOnConfirm: false,
            showLoaderOnConfirm: true
        }, function () {
            var formData = new FormData();
            $(list).each(function(i, item) {
                //console.log(item.worklogid);
                formData.append("worklogid", item.worklogid);
            });
            worklog.exportById(formData, function(data, err) {
                if (err) {
                    swal({
                        title: "error",
                        type: "error"
                    });
                    return false;
                }
                var url = data.url;
                console.log(data);
                console.log(url);
                swal({
                    title: "成功导出excel！",
                    type: "success",
                    showCancelButton: true,
                    allowOutsideClick: true,
                    confirmButtonText: "下载"
                }, function() {
                    window.open(fileUrl + url);
                });
            });
        });
    }

};

worklogManage.init();

//维护日志管理
var mainlogManage = {
    dataCache: [],//缓存池
    pageSize: 8,//一页多少数据
    page: 1,//当前页
    pageCount: 0,//页数

    //初始化
    init: function() {
        var self = this;

        $("#mainlogtable").bootstrapTable({ // 对应table标签的id
            uniqueId: 'mainlogid',
            striped: true,  //表格显示条纹，默认为false
            pagination: true, // 在表格底部显示分页组件，默认false
            pageList: [self.pageSize, 2*self.pageSize], // 设置页面可以显示的数据条数
            pageSize: self.pageSize, // 页面数据条数
            pageNumber: 1, // 首页页码
            //clickToSelect: true, //点击行时，自动选择rediobox 和 checkbox
            sidePagination: 'client', // 设置为客户端分页
            columns: [
                {
                    checkbox: true, // 显示一个勾选框
                    align: 'center' // 居中显示
                }, {
                    field: 'devicename', // 返回json数据中的name
                    title: '设备名称', // 表格表头显示文字
                    align: 'center', // 左右居中
                    valign: 'middle' // 上下居中
                }, {
                    field: 'title',
                    title: '标题',
                    align: 'center',
                    valign: 'middle'
                }, {
                    field: 'username',
                    title: '维护人员',
                    align: 'center',
                    valign: 'middle'
                },{
                    field: 'addtime',
                    title: '维护时间',
                    align: 'center',
                    valign: 'middle'
                }, {
                    title: "操作",
                    align: 'center',
                    valign: 'middle',
                    width: 180, // 定义列的宽度，单位为像素px
                    formatter: function (value, row, index) {
                        return '<button class="btn btn-link btn-sm" data-toggle="modal" data-target="#checkMainlog" onclick="mainlogManage.checkData(' +
                            row.mainlogid + ');">查看</button>' +
                            '<button class="btn btn-primary btn-sm" data-toggle="modal" data-target="#editMainlog" onclick="mainlogManage.editData(' +
                            row.mainlogid + ');">修改</button>&#10;' +
                            '<button class="btn btn-danger btn-sm" onclick="mainlogManage.deleData(' + row.mainlogid + ');">删除</button>';
                    }
                }
            ]
        });

        //点击恢复原始状态
        $('#refreshBtn_1').on('click', function() {
            self.updateTable();
        });

        self.updateTable();

        $('#searchMainStarttime').datetimepicker({
            format: 'yyyy-mm-dd hh:ii',
            autoclose: true
        });
        $('#searchMainEndtime').datetimepicker({
            format: 'yyyy-mm-dd hh:ii',
            autoclose: true
        });

        $("#newMaintainFile").fileinput({
            theme: 'fa',
            uploadUrl: '#',
            dropZoneEnabled: false,
            showPreview: false,
            showUpload: false
        });
        $("#editMaintainFile").fileinput({
            theme: 'fa',
            uploadUrl: '#',
            dropZoneEnabled: false,
            showPreview: false,
            showUpload: false
        });

        //回车搜索
        $('#searchMainlogCon').bind('keyup', function(event) {
            if (event.keyCode == "13") {
                //回车执行查询
                self.search();
            }
        });
    },

    updateTable: function() {
        maintain.screen({}, function(data, err) {
            if (err) {
                swal({
                    title: "error",
                    type: "error"
                });
                return false;
            }
            var dataList = data.data;
            console.log(dataList);
            $("#mainlogtable").bootstrapTable('load', dataList);
        });
    },

    //获取页数
    getPageCount: function() {
        var self = this;
        maintain.getCount(function(data, err) {
            if (err) {
                swal({
                    title: "error",
                    type: "error"
                });
                return false;
            }
            var logCount = data.object.number;
            //console.log(logCount);
            var i = logCount / self.pageSize;
            var j = logCount % self.pageSize;
            //console.log(i+","+j);
            if(logCount < self.pageSize){
                self.pageCount = 1;
            }
            else {
                if(j==0){
                    self.pageCount = Math.floor(i);
                }
                else{
                    self.pageCount = Math.floor(i)+1;
                }
            }
            $("#mainlogPageCount").text(self.pageCount + '页');
        });
    },

    //渲染列表
    renderData: function(dataList) {
        var telp = '';
        for(var i= 0,item;item=dataList[i++];) {
            telp += '<div class="informationList_line" data-mainlogid="' + item.mainlogid + '"><div  class="informationList_inline">' +
                '<p class="studio">' + item.devicename + '</p>' + '<div class="program">' + item.title + '</div>' +
                '<div class="channel">' + item.username + '</div>' + '<div class="ContactPerson">' + item.addtime + '</div>' + '<div class="informationManage">' +
                '<p class="showInformation" data-toggle="modal" data-target="#checkMainlog" onclick="mainlogManage.checkData(this)">查看</p>' +
                '<p class="changeInformation" data-toggle="modal" data-target="#editMainlog" onclick="mainlogManage.editData(this);">修改</p>' +
                '<p class="deleteInformation" onclick="mainlogManage.deleData(this);">删除</p>' +
                '</div></div></div>';
        }
        $('#mainlogList').html(telp);
    },

    //更新列表
    updateList: function() {
        var self = this;
        var startRow = (self.page-1)*self.pageSize;
        maintain.getOnePage(startRow, self.pageSize, function(data, err) {
            if (err) {
                swal({
                    title: "error",
                    type: "error"
                });
                return false;
            }
            var dataList = data.data;
            console.log(dataList);
            self.dataCache = dataList;
            self.renderData(dataList);
        });
    },

    //添加
    addData: function() {
        var self = this;
        var file = $('#newMaintainFile')[0].files[0];
        var formData = new FormData();
        formData.append("title", $('#newTitle').val());
        formData.append("devicename", $('#newDeviceName').val());
        formData.append("username", $('#newMaintainUser').val());
        formData.append("usertel", $('#newMaintainTel').val());
        formData.append("addtime", getNowFormatDate());
        formData.append("description", $('#newMaintaininfo').val());
        if(file) formData.append("file", file);

        swal({
            title: "确定添加？",
            type: "warning",
            showCancelButton: true,
            allowOutsideClick: true,
            closeOnConfirm: false,
            showLoaderOnConfirm: true
        }, function () {
            $('#addMainlog').modal('hide');
            $('#addMainlogForm')[0].reset();//重置表单
            maintain.add(formData, function(data, err) {
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

    //修改
    editData: function(id) {
        var self = this;
        var mainlogid = id;
        var logInfo = $("#mainlogtable").bootstrapTable('getRowByUniqueId', mainlogid);
        console.log(logInfo);

        $('#editTitle').val(logInfo.title);
        $('#editDeviceName').val(logInfo.devicename);
        $('#editMaintainUser').val(logInfo.username);
        $('#editMaintainTel').val(logInfo.usertel);
        $('#editMaintaininfo').val(logInfo.description);

        $('#doEditMainlog').unbind().click(function() {
            var file = $('#editMaintainFile')[0].files[0];
            var formData = new FormData();
            formData.append("mainlogid", mainlogid);
            formData.append("title", $('#editTitle').val());
            formData.append("devicename", $('#editDeviceName').val());
            formData.append("username", $('#editMaintainUser').val());
            formData.append("usertel", $('#editMaintainTel').val());
            formData.append("addtime", getNowFormatDate());
            formData.append("description", $('#editMaintaininfo').val());
            if(file) formData.append("file", file);

            swal({
                title: "确定修改？",
                type: "warning",
                showCancelButton: true,
                allowOutsideClick: true,
                closeOnConfirm: false,
                showLoaderOnConfirm: true
            }, function () {
                $('#editMainlog').modal('hide');
                $('#editMainlogForm')[0].reset();//重置表单
                maintain.edit(formData, function(data, err) {
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

    //删除
    deleData: function(id) {
        var self = this;
        var mainlogid = id;
        console.log(mainlogid);
        swal({
            title: "确定删除？",
            type: "warning",
            showCancelButton: true,
            allowOutsideClick: true,
            closeOnConfirm: false
        }, function () {
            maintain.delete(mainlogid, function(data, err) {
                if (err) {
                    swal({
                        title: "error",
                        type: "error"
                    });
                    return false;
                }
                console.log(data);
                swal({
                    title: "删除成功！",
                    type: "success",
                    allowOutsideClick: true
                });
                self.updateTable();
            });
        });
    },

    //查看详情
    checkData: function(mainlogid) {
        var self = this;
        var logInfo = $("#mainlogtable").bootstrapTable('getRowByUniqueId', mainlogid);

        $('#title').text(logInfo.title);
        $('#deviceName').text(logInfo.devicename);
        $('#maintainUser').text(logInfo.username);
        $('#maintainTime').text(logInfo.addtime);
        $('#maintaininfo').text(logInfo.description);
        $('#maintainFile').attr('href', fileUrl + logInfo.fileurl);
        if(!logInfo.fileurl) {
            $('#maintainFile').text('未添加');
        }
        else {
            $('#maintainFile').text('查看');
        }
    },

    //搜索
    search: function() {
        var self = this;
        var devicename = $('#searchMainlogCon').val();

        var postData = {
            "search": devicename,
            "isoutput": 0
        };
        maintain.screen(postData, function(data, err) {
            if (err) {
                swal({
                    title: "error",
                    type: "error"
                });
                return false;
            }
            var dataList = data.data;
            console.log(dataList);
            $("#mainlogtable").bootstrapTable('load', dataList);
        });
    },

    //导出数据
    exportData: function() {
        var list = $("#mainlogtable").bootstrapTable('getSelections');
        console.log(list);
        var len = list.length;
        if(len==0) {
            swal({
                title: "请选择日志！",
                type: "info"
            });
            return false;
        }
        swal({
            title: "确定导出？",
            type: "warning",
            text: '共选择' + len + '条数据',
            showCancelButton: true,
            allowOutsideClick: true,
            closeOnConfirm: false,
            showLoaderOnConfirm: true
        }, function () {
            var formData = new FormData();
            $(list).each(function(i, item) {
                //console.log(item.worklogid);
                formData.append("mainlogid", item.mainlogid);
            });
            maintain.exportById(formData, function(data, err) {
                if (err) {
                    swal({
                        title: "error",
                        type: "error"
                    });
                    return false;
                }
                var url = data.url;
                console.log(data);
                console.log(url);
                swal({
                    title: "成功导出excel！",
                    type: "success",
                    showCancelButton: true,
                    allowOutsideClick: true,
                    confirmButtonText: "下载"
                }, function() {
                    window.open(fileUrl + url);
                });
            });
        });
    },

    //根据时间筛选
    screenByTime: function() {
        var self = this;
        var start = $('#searchMainStarttime').val();
        var end = $('#searchMainEndtime').val();
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
        maintain.queryByTime(postData, function(data, err) {
            if (err) {
                swal({
                    title: "error",
                    type: "error"
                });
                return false;
            }
            var dataList = data.data;
            console.log(dataList);
            $("#mainlogtable").bootstrapTable('load', dataList);
        });
    }

};

mainlogManage.init();

//var worklogCache = [];//工作日志缓存池
//var pageSize = 8;
//var worklogPage = 1;//工作日志当前页
//var worklogPageCount = 0;//工作日志页数
//
//getWorklogPageCount();
//updateWorklogList();
//
//$("#preWorklogPage").on('click',function(){
//    if(worklogPage > 1){
//        worklogPage--;
//        updateWorklogList();
//        $("#worklogPageNow").text(worklogPage + '页');
//    }
//});
//$("#nextWorklogPage").on('click',function(){
//    if(worklogPage < worklogPageCount){
//        worklogPage++;
//        updateWorklogList();
//        $("#worklogPageNow").text(worklogPage + '页');
//    }
//});
//
//$("#newWorklogFile").fileinput({
//    theme: 'fa',
//    uploadUrl: '#',
//    dropZoneEnabled: false,
//    showPreview: false,
//    showUpload: false
//});
//$('#newWorkStarttime').datetimepicker({
//    format: 'yyyy-mm-dd hh:ii',
//    autoclose: true
//});
//$('#newWorkEndtime').datetimepicker({
//    format: 'yyyy-mm-dd hh:ii',
//    autoclose: true
//});
//$("#editWorklogFile").fileinput({
//    theme: 'fa',
//    uploadUrl: '#',
//    dropZoneEnabled: false,
//    showPreview: false,
//    showUpload: false
//});
//$('#editWorkStarttime').datetimepicker({
//    format: 'yyyy-mm-dd hh:ii',
//    autoclose: true
//});
//$('#editWorkEndtime').datetimepicker({
//    format: 'yyyy-mm-dd hh:ii',
//    autoclose: true
//});
//
////获取工作日志页数
//function getWorklogPageCount() {
//    worklog.getCount(function(data, err) {
//        if (err) {
//            swal({
//                title: "error",
//                type: "error"
//            });
//            return false;
//        }
//        var logCount = data.object.number;
//        //console.log(logCount);
//        var i = logCount/pageSize;
//        var j = logCount%pageSize;
//        //console.log(i+","+j);
//        if(logCount < pageSize){
//            worklogPageCount = 1;
//        }
//        else {
//            if(j==0){
//                worklogPageCount = Math.floor(i);
//            }
//            else{
//                worklogPageCount = Math.floor(i)+1;
//            }
//        }
//        $("#worklogPageCount").text(worklogPageCount + '页');
//    });
//}
////更新工作日志列表
//function updateWorklogList() {
//    var startRow = (worklogPage-1)*pageSize;
//    worklog.getOnePage(startRow, pageSize, function(data, err) {
//        if (err) {
//            swal({
//                title: "error",
//                type: "error"
//            });
//            return false;
//        }
//        var dataList = data.data;
//        console.log(dataList);
//        worklogCache = dataList;
//        randerWorklog(dataList);
//    });
//}
////渲染工作日志列表
//function randerWorklog(dataList) {
//    var telp = '';
//    for(var i= 0,item;item=dataList[i++];) {
//        telp += '<div class="informationList_line" data-worklogid="' + item.worklogid + '"><div  class="informationList_inline">' +
//            '<p class="studio">' + item.mallname + '</p>' + '<div class="program">' + item.programename + '</div>' +
//            '<div class="channel">' + item.channelname + '</div>' + '<div class="ContactPerson">' + item.username + '</div>' + '<div class="informationManage">' +
//
//            '<p class="changeInformation" data-toggle="modal" data-target="#editWorklog" onclick="editWorklog(this);">修改</p>' +
//            '<p class="deleteInformation" onclick="deleWorklog(this);">删除</p>' +
//            '</div></div></div>';
//    }
//    $('#worklogList').html(telp);
//}
//
////添加工作日志
//function addWorklog() {
//    var formData = new FormData();
//    formData.append("mallname", $('#newMallname').val());
//    formData.append("channelname", $('#newChannelname').val());
//    formData.append("programename", $('#newProgramename').val());
//    formData.append("starttime", $('#newWorkStarttime').val());
//    formData.append("endtime", $('#newWorkEndtime').val());
//    formData.append("eventtime", getNowFormatDate());
//    formData.append("workers", $('#newWorkers').val());
//    formData.append("username", $('#newUsername').val());
//    formData.append("usertel", $('#newUsertel').val());
//    formData.append("loginfo", $('#newLoginfo').val());
//    formData.append("file", $('#newWorklogFile')[0].files[0]);
//
//    swal({
//        title: "确定添加？",
//        type: "warning",
//        showCancelButton: true,
//        allowOutsideClick: true,
//        closeOnConfirm: false,
//        showLoaderOnConfirm: true
//    }, function () {
//        $('#addWorklog').modal('hide');
//        $('#addWorklogForm')[0].reset();//重置表单
//        worklog.add(formData, function(data, err) {
//            if (err) {
//                swal({
//                    title: "error",
//                    type: "error"
//                });
//                return false;
//            }
//            console.log(data);
//            swal({
//                title: "添加成功！",
//                type: "success",
//                allowOutsideClick: true
//            });
//            updateWorklogList();
//            getWorklogPageCount();
//        });
//    });
//
//}
////修改工作日志
//function editWorklog(obj) {
//    var worklogid = $(obj).parent().parent().parent().attr('data-worklogid');
//    //console.log(worklogid);
//    worklog.getById(worklogid, function(data, err) {
//        if (err) {
//            swal({
//                title: "error",
//                type: "error"
//            });
//            return false;
//        }
//        var logInfo = data.object;
//        console.log(data.object);
//        $('#editMallname').val(logInfo.mallname);
//        $('#editChannelname').val(logInfo.channelname);
//        $('#editProgramename').val(logInfo.programename);
//        $('#editWorkers').val(logInfo.workers);
//        $('#editWorkStarttime').val(logInfo.starttime);
//        $('#editWorkEndtime').val(logInfo.endtime);
//        $('#editUsername').val(logInfo.username);
//        $('#editUsertel').val(logInfo.usertel);
//        $('#editLoginfo').val(logInfo.loginfo);
//    });
//
//    $('#editSub').unbind().click(function() {
//        var formData = new FormData();
//        formData.append("worklogid", worklogid);
//        formData.append("mallname", $('#editMallname').val());
//        formData.append("channelname", $('#editChannelname').val());
//        formData.append("programename", $('#editProgramename').val());
//        formData.append("starttime", $('#editWorkStarttime').val());
//        formData.append("endtime", $('#editWorkEndtime').val());
//        formData.append("eventtime", getNowFormatDate());
//        formData.append("workers", $('#editWorkers').val());
//        formData.append("username", $('#editUsername').val());
//        formData.append("usertel", $('#editUsertel').val());
//        formData.append("loginfo", $('#editLoginfo').val());
//        formData.append("file", $('#editWorklogFile')[0].files[0]);
//
//        swal({
//            title: "确定修改？",
//            type: "warning",
//            showCancelButton: true,
//            allowOutsideClick: true,
//            closeOnConfirm: false,
//            showLoaderOnConfirm: true
//        }, function () {
//            $('#editWorklog').modal('hide');
//            $('#editWorklogForm')[0].reset();//重置表单
//            worklog.edit(formData, function(data, err) {
//                if (err) {
//                    swal({
//                        title: "error",
//                        type: "error"
//                    });
//                    return false;
//                }
//                console.log(data);
//                swal({
//                    title: "修改成功！",
//                    type: "success",
//                    allowOutsideClick: true
//                });
//                updateWorklogList();
//                getWorklogPageCount();
//            });
//        });
//    });
//}
////删除工作日志
//function deleWorklog(obj) {
//    var worklogid = $(obj).parent().parent().parent().attr('data-worklogid');
//    //console.log(worklogid);
//    swal({
//        title: "确定删除？",
//        type: "warning",
//        showCancelButton: true,
//        allowOutsideClick: true,
//        closeOnConfirm: false
//    }, function () {
//        worklog.delete(worklogid, function(data, err) {console.log(err);
//            if (err) {
//                swal({
//                    title: "error",
//                    type: "error"
//                });
//                return false;
//            }
//            console.log(data);
//            swal({
//                title: "删除成功！",
//                type: "success",
//                allowOutsideClick: true
//            });
//            updateWorklogList();
//            getWorklogPageCount();
//        });
//    });
//}
////查看工作日志详情
//function checkWorklog(obj) {
//    var worklogid = $(obj).parent().parent().parent().attr('data-worklogid');
//    worklog.getById(14, function(data, err) {
//        if (err) {
//            swal({
//                title: "error",
//                type: "error"
//            });
//            return false;
//        }
//        var logInfo = data.object;
//        console.log(data.object);
//        $('#mallname').text(logInfo.mallname);
//        $('#channelname').text(logInfo.channelname);
//        $('#programename').text(logInfo.programename);
//        $('#workers').text(logInfo.workers);
//        $('#workStarttime').text(logInfo.starttime);
//        $('#workEndtime').text(logInfo.endtime);
//        $('#username').text(logInfo.username);
//        $('#usertel').text(logInfo.usertel);
//        $('#loginfo').text(logInfo.loginfo);
//        $('#worklogFileDownload').attr('href', fileUrl + logInfo.fileurl);
//    });
//}

//var postData = {
//    "mallname": null,
//    "channelname": null,
//    "programename": null,
//    "starttime": null,
//    "endtime": null,
//    "isoutput": 1
//};
//worklog.screen(postData, function(data, err) {
//    if (err) {
//        swal({
//            title: "error",
//            type: "error"
//        });
//        return false;
//    }
//    console.log(data);
//});


