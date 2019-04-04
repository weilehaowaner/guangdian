//判断是否登陆
checkLogin();
//判断用户类型
checkUserType();

var worklogShow = {
    dataCache: [],//缓存池
    pageSize: 8,//一页多少数据
    page: 1,//当前页
    pageCount: 0,//页数

    //初始化
    init: function() {
        var self = this;

        self.getPageCount();
        self.updateList();

        //点击恢复原始状态
        $('#refreshBtn').on('click', function() {
            self.page = 1;
            self.getPageCount();
            self.updateList();
        });

        //回车搜索
        $('#searchWorklogCon').bind('keyup', function(event) {
            if (event.keyCode == "13") {
                //回车执行查询
                self.search();
            }
        });

        $('#searchWorkStarttime').datetimepicker({
            format: 'yyyy-mm-dd hh:ii',
            autoclose: true
        });
        $('#searchWorkEndtime').datetimepicker({
            format: 'yyyy-mm-dd hh:ii',
            autoclose: true
        });

        $("#preWorklogPage").on('click',function(){
            if(self.page > 1){
                self.page--;
                self.updateList();
                $("#worklogPageNow").text(self.page + '页');
            }
        });
        $("#nextWorklogPage").on('click', function(){
            if(self.page < self.pageCount){
                self.page++;
                self.updateList();
                $("#worklogPageNow").text(self.page + '页');
            }
        });
    },

    //获取页数
    getPageCount: function() {
        var self = this;
        worklog.getCount(function(data, err) {
            // if (err) {
            //     swal({
            //         title: "error",
            //         type: "error"
            //     });
            //     return false;
            // }
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
            telp += '<div class="informationList_line" data-worklogid="' + item.worklogid + '"><div class="informationList_inline">' +
                '<p class="studio">' + item.mallname + '</p> <div class="program">' + item.programename + '</div>' +
                '<div class="channel">' + item.channelname + '</div><div class="ContactPerson">' + item.username + '</div>' +
                '<div class="ContactPerson">' + item.starttime + '</div>' +
                '<div class="informationManage"><p class="showInformation"  data-toggle="modal" data-target="#checkWorklog" onclick="worklogShow.checkData(this)">查看</p>' +
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

    //查看详情
    checkData: function(obj) {
        var self = this;
        var worklogid = $(obj).parent().parent().parent().attr('data-worklogid');
        worklog.getById(worklogid, function(data, err) {
            if (err) {
                swal({
                    title: "error",
                    type: "error"
                });
                return false;
            }
            var logInfo = data.object;
            console.log(data.object);
            var usedtime = 0;
            if(logInfo.starttime && logInfo.endtime) {
                var minutes = TimeDifference(logInfo.starttime, logInfo.endtime);
                usedtime = minutes/60;
            }
            $('#mallname').text(logInfo.mallname);
            $('#channelname').text(logInfo.channelname);
            $('#programename').text(logInfo.programename );
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
        });
    },

    //搜索
    search: function() {
        var self = this;
        var searchCon = $('#searchWorklogCon').val();
        if(searchCon.length == 0) {
            self.updateList();
            self.getPageCount();
            return 0;
        }
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
            self.renderData(dataList);
            $("#worklogPageNow").text('1');
            $("#worklogPageCount").text('1页');
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
            self.renderData(dataList);
            $("#worklogPageNow").text('1');
            $("#worklogPageCount").text('1页');
        });
    }

};

worklogShow.init();

var mainlogShow = {
    dataCache: [],//缓存池
    pageSize: 8,//一页多少数据
    page: 1,//当前页
    pageCount: 0,//页数

    //初始化
    init: function() {
        var self = this;

        self.getPageCount();
        self.updateList();

        //点击恢复原始状态
        $('#refreshBtn_1').on('click', function() {
            self.page = 1;
            self.getPageCount();
            self.updateList();
        });

        //回车搜索
        $('#searchMainlogCon').bind('keyup', function(event) {
            if (event.keyCode == "13") {
                //回车执行查询
                self.search();
            }
        });

        $('#searchMainStarttime').datetimepicker({
            format: 'yyyy-mm-dd hh:ii',
            autoclose: true
        });
        $('#searchMainEndtime').datetimepicker({
            format: 'yyyy-mm-dd hh:ii',
            autoclose: true
        });

        $("#preMainlogPage").on('click',function(){
            if(self.page > 1){
                self.page--;
                self.updateList();
                $("#mainlogPageNow").text(self.page + '页');
            }
        });
        $("#nextMainlogPage").on('click', function(){
            if(self.page < self.pageCount){
                self.page++;
                self.updateList();
                $("#mainlogPageNow").text(self.page + '页');
            }
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
            telp += '<div class="informationList_line" data-mainlogid="' + item.mainlogid + '"><div class="informationList_inline">' +
                '<p class="maintainLog_equipName">' + item.devicename + '</p><div class="maintainLog_title">' + item.title + '</div>' +
                '<div class="maintainLog_person">' + item.username + '</div><div class="maintainLog_time">' + item.addtime + '</div>' +
                '<div class="informationManage"><p class="showInformation" data-toggle="modal" data-target="#checkMainlog" onclick="mainlogShow.checkData(this)">查看</p>' +
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

    //查看详情
    checkData: function(obj) {
        var self = this;
        var mainlogid = $(obj).parent().parent().parent().attr('data-mainlogid');
        maintain.getById(mainlogid, function(data, err) {
            if (err) {
                swal({
                    title: "error",
                    type: "error"
                });
                return false;
            }
            var logInfo = data.object;
            console.log(data.object);
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
        });
    },

    //搜索
    search: function() {
        var self = this;
        var devicename = $('#searchMainlogCon').val();
        if(devicename.length == 0) {
            self.updateList();
            self.getPageCount();
            return 0;
        }
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
            self.renderData(dataList);
            $("#mainlogPageCount").text('1页');
            $("#mainlogPageNow").text('1');
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
            self.renderData(dataList);
            $("#mainlogPageCount").text('1页');
            $("#mainlogPageNow").text('1');
        });
    }
};

mainlogShow.init();