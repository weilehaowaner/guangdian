//判断是否登陆
checkLogin();

var deviceManage = {
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
            $('#newsystem').html(telp);
            $('#searchsystem').html(telp);
        });
        $('#newsystem')[0].onchange=function(){
            var systemid = $($(this)[0].selectedOptions[0]).attr('data-systemid');
            console.log(systemid);
            if(systemid !== 'all') {
                self.updatenewsubsystem(systemid);
            }
            else {
                $('#newsubsystem').empty();
            }
        };
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

        $("#newdeviceFile").fileinput({
            theme: 'fa',
            uploadUrl: '#',
            dropZoneEnabled: false,
            showPreview: false,
            showUpload: false
        });
        $("#newexperience").fileinput({
            theme: 'fa',
            uploadUrl: '#',
            dropZoneEnabled: false,
            showPreview: false,
            showUpload: false
        });
        $("#newdevicemap").fileinput({
            theme: 'fa',
            uploadUrl: '#',
            dropZoneEnabled: false,
            showPreview: false,
            showUpload: false
        });
        $("#editdeviceFile").fileinput({
            theme: 'fa',
            uploadUrl: '#',
            dropZoneEnabled: false,
            showPreview: false,
            showUpload: false
        });
        $("#editexperience").fileinput({
            theme: 'fa',
            uploadUrl: '#',
            dropZoneEnabled: false,
            showPreview: false,
            showUpload: false
        });
        $("#editdevicemap").fileinput({
            theme: 'fa',
            uploadUrl: '#',
            dropZoneEnabled: false,
            showPreview: false,
            showUpload: false
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
                '<p class="showInformation" data-toggle="modal" data-target="#checkDevice" onclick="deviceManage.checkData(this)">查看</p>' +
                '<p class="changeInformation" data-toggle="modal" data-target="#editDevice" onclick="deviceManage.editData(this);">修改</p>' +
                '<p class="deleteInformation" onclick="deviceManage.deleData(this);">删除</p></div></div></div>';
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

    //更新添加设备子系统下拉框
    updatenewsubsystem: function(systemid) {
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
            var telp = '';
            for(var i = 0,item;item=dataList[i++];){
                telp += '<option data-subsystemid="'+ item.subsystemid +'">' + item.subsystemname + '</option>';
            }
            $('#newsubsystem').html(telp);
        });
    },

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

    //添加
    addData: function() {
        var self = this;
        var selectedOption = $('#newsubsystem')[0].selectedOptions[0];
        if(!selectedOption) {
            swal({
                title: "请选择子系统",
                type: "error"
            });
            return false;
        }
        var subsystemid = $(selectedOption).attr('data-subsystemid');
        var docfile = $('#newdeviceFile')[0].files[0];
        var devicefile = $('#newdevicemap')[0].files[0];
        var expfile = $('#newexperience')[0].files[0];
        var formData = new FormData();
        formData.append("devicename", $('#newdevicename').val());
        formData.append("subsystemid", subsystemid);
        formData.append("posinfo", $('#newposinfo').val());
        formData.append("vender", $('#newvenderinfo').val());
        formData.append("intro", $('#newintroduction').val());
        if(docfile) formData.append("docfile", docfile);
        if(devicefile) formData.append("devicefile", devicefile);
        if(expfile) formData.append("expfile", expfile);
        //formData.append("docfile", $('#newdeviceFile')[0].files[0]);
        //formData.append("devicefile", $('#newdevicemap')[0].files[0]);
        //formData.append("expfile", $('#newexperience')[0].files[0]);

        //for(var pair of formData.entries()) {
        //    console.log(pair[0]+ ', '+ pair[1]);
        //}
        swal({
            title: "确定添加？",
            type: "warning",
            showCancelButton: true,
            allowOutsideClick: true,
            closeOnConfirm: false,
            showLoaderOnConfirm: true
        }, function () {
            $('#addDevice').modal('hide');
            $('#addDeviceForm')[0].reset();//重置表单
            device.add(formData, function(data, err) {
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
                self.updateList();
                self.getPageCount();
            });
        });
    },

    //修改
    editData: function(obj) {
        var self = this;
        var deviceinfo = self.dataCache[$(obj).parent().parent().parent().index()];
        console.log(deviceinfo);
        $('#editdevicename').val(deviceinfo.devicename);
        $('#editposinfo').val(deviceinfo.posinfo);
        $('#editvenderinfo').val(deviceinfo.vender);
        $('#editintroduction').val(deviceinfo.intro);

        $('#doEditDevice').unbind().click(function() {
            var docfile = $('#editdeviceFile')[0].files[0];
            var devicefile = $('#editdevicemap')[0].files[0];
            var expfile = $('#editexperience')[0].files[0];
            var formData = new FormData();
            formData.append("deviceid", deviceinfo.deviceid);
            formData.append("devicename", $('#editdevicename').val());
            formData.append("subsystemid", deviceinfo.subsystemid);
            formData.append("posinfo", $('#editposinfo').val());
            formData.append("vender", $('#editvenderinfo').val());
            formData.append("intro", $('#editintroduction').val());
            if(docfile) formData.append("docfile", docfile);
            if(devicefile) formData.append("devicefile", devicefile);
            if(expfile) formData.append("expfile", expfile);
            //formData.append("docfile", $('#editdeviceFile')[0].files[0]);
            //formData.append("devicefile", $('#editdevicemap')[0].files[0]);
            //formData.append("expfile", $('#editexperience')[0].files[0]);

            //for(var pair of formData.entries()) {
            //    console.log(pair[0]+ ', '+ pair[1]);
            //}

            swal({
                title: "确定修改？",
                type: "warning",
                showCancelButton: true,
                allowOutsideClick: true,
                closeOnConfirm: false,
                showLoaderOnConfirm: true
            }, function () {
                $('#editDevice').modal('hide');
                $('#editDeviceForm')[0].reset();//重置表单
                device.edit(formData, function(data, err) {
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
                    self.updateList();
                    self.getPageCount();
                });
            });
        });
    },

    //删除
    deleData: function(obj) {
        var self = this;
        var deviceid = self.dataCache[$(obj).parent().parent().parent().index()].deviceid;
        console.log(deviceid);
        swal({
            title: "确定删除？",
            type: "warning",
            showCancelButton: true,
            allowOutsideClick: true,
            closeOnConfirm: false
        }, function () {
            device.delete(deviceid, function(data, err) {
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
                self.updateList();
                self.getPageCount();
            });
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

deviceManage.init();

