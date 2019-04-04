//判断是否登陆
checkLogin();
//判断用户类型
checkUserType();

var deviceShow = {
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

        system.getAll(function(data, err) {
            if (err) {
                swal({
                    title: "error",
                    type: "error"
                });
                return false;
            }
            var dataList = data.data;
            //console.log(dataList);
            var telp = '<option data-systemid="all">全部</option>';
            for(var i = 1,item;item=dataList[i++];){
                telp += '<option data-systemid="'+ item.systemid +'">' + item.systemname + '</option>';
            }
            $('#searchsystem').html(telp);
        });
        $('#searchsystem')[0].onchange=function(){
            var systemid = $($(this)[0].selectedOptions[0]).attr('data-systemid');
            var postString;
            console.log(systemid);
            if(systemid == 'all') {
                $('#searchsubsystem').html('<option data-subsystemid="all">全部</option>');
                self.updateList();
                self.getPageCount();
            }
            else {
                self.updatesearchsubsystem(systemid);

                postString={
                    "systemname": $('#searchsystem').val()
                };
                self.search(postString);
            }
        };

        $('#searchsubsystem')[0].onchange=function(){
            var subsystemid = $($(this)[0].selectedOptions[0]).attr('data-subsystemid');
            var postString;
            console.log(subsystemid);

            if(subsystemid == 'all') {
                postString={
                    "systemname": $('#searchsystem').val()
                };
                self.search(postString);
            }
            else {
                postString={
                    "systemname": $('#searchsystem').val(),
                    "subsystemname": $('#searchsubsystem').val()
                };
                self.search(postString);
            }
        };

        $("#preDevicePage").on('click',function(){
            if(self.page > 1){
                self.page--;
                self.updateList();
                $("#DevicePageNow").text(self.page + '页');
            }
        });
        $("#nextDevicePage").on('click', function(){
            if(self.page < self.pageCount){
                self.page++;
                self.updateList();
                $("#DevicePageNow").text(self.page + '页');
            }
        });

        //回车搜索
        $('#searchdevicename').bind('keyup', function(event) {
            if (event.keyCode == "13") {
                //回车执行查询
                self.search();
            }
        });
    },

    //获取页数
    getPageCount: function() {
        var self = this;
        device.getCount(function(data, err) {
            if (err) {
                swal({
                    title: "error",
                    type: "error"
                });
                return false;
            }
            var dataCount = data.object.number;
            //console.log(dataCount);
            var i = dataCount / self.pageSize;
            var j = dataCount % self.pageSize;
            //console.log(i+","+j);
            if(dataCount < self.pageSize){
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
            $("#devicePageCount").text(self.pageCount + '页');
        });
    },

    //渲染列表
    renderData: function(dataList) {
        var telp = '';
        for(var i= 0,item;item=dataList[i++];) {
            telp += '<div class="informationList_line"><div class="informationList_inline"><p class="equipName">' + item.devicename + '</p>' +
                '<div class="equipIntroduce"><a href=' + (item.docpath ? fileUrl + item.docpath : '"javascript:"') + ' class="blueLink" target="blank">使用手册</a></div>' +
                '<div class="equipExperience"><a href=' + (item.docpath ? fileUrl + item.exppath : '"javascript:"') + ' class="blueLink" target="blank">使用经验</a></div>' +
                '<div class="equipLocation"><a href=' + (item.docpath ? fileUrl + item.devicemap : '"javascript:"') + ' class="blueLink" target="blank">' + item.posinfo +
                '</a></div><div class="informationManage">' +
                '<p class="showInformation" data-toggle="modal" data-target="#checkDevice" onclick="deviceShow.checkData(this)">查看</p>' +
                '</div></div></div>';
        }
        $('#equipDocumentList').html(telp);
    },

    //更新列表
    updateList: function() {
        var self = this;
        var startRow = (self.page-1)*self.pageSize;
        device.getOnePage(startRow, self.pageSize, function(data, err) {
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

    //更新搜索设备子系统下拉框
    updatesearchsubsystem: function(systemid) {
        subSystem.getById(systemid, function(data, err) {
            if (err) {
                swal({
                    title: "error",
                    type: "error"
                });
                return false;
            }
            var dataList = data.data;
            //console.log(dataList);
            var telp = '<option data-subsystemid="all">全部</option>';
            for(var i = 0,item;item=dataList[i++];){
                telp += '<option data-subsystemid="'+ item.subsystemid +'">' + item.subsystemname + '</option>';
            }
            $('#searchsubsystem').html(telp);
        });
    },

    //查看详情
    checkData: function(obj) {
        var self = this;
        var deviceinfo = self.dataCache[$(obj).parent().parent().parent().index()];
        console.log(deviceinfo);
        $('#venderinfo').text(deviceinfo.vender);
        $('#introduction').text(deviceinfo.intro);
    },

    //搜索设备
    search: function(postString) {
        var self = this;
        var systemname = $('#searchsystem').val();
        var subsystemname = $('#searchsubsystem').val();
        var postData = postString || {
                "systemname": systemname == '全部' ? '' : systemname,
                "subsystemname": subsystemname == '全部' ? '' : subsystemname,
                "devicename": $('#searchdevicename').val()
            };
        //console.log(postData);
        device.screen(postData, function(data, err) {
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
            $("#devicePageCount").text('1页');
            $("#DevicePageNow").text('1');
        })
    }
};

deviceShow.init();