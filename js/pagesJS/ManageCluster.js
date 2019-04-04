//判断是否登陆
checkLogin();

var clusterManage = {
    systemId: null,
    systemCache: [],
    subsystemCache: [],
    buttonsBoxs: {
        /*演播室群系统框图*/
        studio_innerButton: '<button id="7" class="btn_signal" data-toggle="modal" data-target="#modal_addSub" onclick="clusterManage.checkUpload(this);">光传输系统</button>\n' +
            '\t\t\t\t\t<button id="6" class="light" data-toggle="modal" data-target="#modal_addSub" onclick="clusterManage.checkUpload(this);">信号源输入</button>\n' +
            '\t\t\t\t\t<button id="39" class="control_machineRoom" data-toggle="modal" data-target="#modal_addSub" onclick="clusterManage.checkUpload(this);">总控机房</button>\n' +
            '\t\t\t\t\t<div class="switch_inner">\n' +
            '\t\t\t\t\t                        <button id="8" class="switch1" data-toggle="modal" data-target="#modal_addSub" onclick="clusterManage.checkUpload(this);">切换台A</button>\n' +
            '\t\t\t\t\t                        <button id="9" class="switch2" data-toggle="modal" data-target="#modal_addSub" onclick="clusterManage.checkUpload(this);">切换台B</button>\n' +
            '\t\t\t\t\t                        <button id="10" class="switch3" data-toggle="modal" data-target="#modal_addSub" onclick="clusterManage.checkUpload(this);">矩阵A</button>\n' +
            '\t\t\t\t\t                        <button id="11" class="switch4" data-toggle="modal" data-target="#modal_addSub" onclick="clusterManage.checkUpload(this);">矩阵B</button>\n' +
            '\t\t\t\t\t                        <button id="12" class="switch5" data-toggle="modal" data-target="#modal_addSub" onclick="clusterManage.checkUpload(this);">矩阵M</button>\n' +
            '\t\t\t\t\t                    </div>\n' +
            '\t\t\t\t\t<div class="btn_select_top">\n' +
            '\t\t\t\t\t\t\t\t\t\t\t<button id="19" class="innerTop1" style="width: 100%;height: 100%;top: 0;left:0;" data-toggle="modal" data-target="#modal_addSub" onclick="clusterManage.checkUpload(this);">3选1</button>\n' +
            //'\t\t\t\t\t\t\t\t\t\t\t<button id="20" class="innerTop2" data-toggle="modal" data-target="#modal_addSub" onclick="clusterManage.checkUpload(this);">加嵌器</button>\n' +
            //'\t\t\t\t\t\t\t\t\t\t\t<button id="21" class="innerTop3" data-toggle="modal" data-target="#modal_addSub" onclick="clusterManage.checkUpload(this);">视频分配</button>\n' +
            //'\t\t\t\t\t\t\t\t\t\t\t<button id="22" class="innerTop4" data-toggle="modal" data-target="#modal_addSub" onclick="clusterManage.checkUpload(this);">3选1</button>\n' +
            //'\t\t\t\t\t\t\t\t\t\t\t<button id="23" class="innerTop5" data-toggle="modal" data-target="#modal_addSub" onclick="clusterManage.checkUpload(this);">加嵌器</button>\n' +
            //'\t\t\t\t\t\t\t\t\t\t\t<button id="24" class="innerTop6" data-toggle="modal" data-target="#modal_addSub" onclick="clusterManage.checkUpload(this);">视频分配</button>\n' +
            '\t\t\t\t\t\t\t\t\t\t</div>\n' +
            '\t\t\t\t\t<div class="btn_select_bottom">\n' +
            '\t\t\t\t\t\t\t\t\t\t\t<button id="25" class="innerTop1" style="width: 100%;height: 100%;top: 0;left:0;" data-toggle="modal" data-target="#modal_addSub" onclick="clusterManage.checkUpload(this);">3选1</button>\n',
            //'\t\t\t\t\t\t\t\t\t\t\t<button id="26" class="innerTop2" data-toggle="modal" data-target="#modal_addSub" onclick="clusterManage.checkUpload(this);">加嵌器</button>\n' +
            //'\t\t\t\t\t\t\t\t\t\t\t<button id="27" class="innerTop3" data-toggle="modal" data-target="#modal_addSub" onclick="clusterManage.checkUpload(this);">视频分配</button>\n' +
            //'\t\t\t\t\t\t\t\t\t\t\t<button id="28" class="innerTop4" data-toggle="modal" data-target="#modal_addSub" onclick="clusterManage.checkUpload(this);">3选1</button>\n' +
            //'\t\t\t\t\t\t\t\t\t\t\t<button id="29" class="innerTop5" data-toggle="modal" data-target="#modal_addSub" onclick="clusterManage.checkUpload(this);">加嵌器</button>\n' +
            //'\t\t\t\t\t\t\t\t\t\t\t<button id="30" class="innerTop6" data-toggle="modal" data-target="#modal_addSub" onclick="clusterManage.checkUpload(this);">视频分配</button>\n' +
            //'\t\t\t\t\t\t\t\t\t\t</div>',
        /*1200监看结构图*/
        monitor1200: '<button id="13" class="btn1200_big" data-toggle="modal" data-target="#modal_addSub" onclick="clusterManage.checkUpload(this);">导播</button>\n' +
            '\t\t\t\t\t<button id="3" class="btn1200_B" data-toggle="modal" data-target="#modal_addSub" onclick="clusterManage.checkUpload(this);">制作矩阵B</button>\n' +
            '\t\t\t\t\t<button id="1" class="btn1200_A" data-toggle="modal" data-target="#modal_addSub" onclick="clusterManage.checkUpload(this);">制作矩阵A</button>\n' +
            '\t\t\t\t\t<button id="31" class="btn1200_division" data-toggle="modal" data-target="#modal_addSub" onclick="clusterManage.checkUpload(this);">多画面分割</button>',
        /*2500监看结构图*/
        monitor2500: '<button id="14" class="btn2500_big" data-toggle="modal" data-target="#modal_addSub" onclick="clusterManage.checkUpload(this);">导播</button>\n' +
            '\t\t\t\t\t<button id="5" class="btn2500_B" data-toggle="modal" data-target="#modal_addSub" onclick="clusterManage.checkUpload(this);">制作矩阵B</button>\n' +
            '\t\t\t\t\t<button id="4" class="btn2500_A" data-toggle="modal" data-target="#modal_addSub" onclick="clusterManage.checkUpload(this);">制作矩阵A</button>\n' +
            '\t\t\t\t\t<button id="32" class="btn2500_division" data-toggle="modal" data-target="#modal_addSub" onclick="clusterManage.checkUpload(this);">多画面分割</button>',
        /*分控监看结构图*/
        variousMonitor: '<button id="2" class="variousMonitor_btnM" data-toggle="modal" data-target="#modal_addSub" onclick="clusterManage.checkUpload(this);">矩阵M</button>\n' +
            '\t\t\t\t\t<button id="33" class="variousMonitor_division" data-toggle="modal" data-target="#modal_addSub" onclick="clusterManage.checkUpload(this);">多画面分割</button>\n' +
            '\t\t\t\t\t<button id="15" class="variousMonitor_big" data-toggle="modal" data-target="#modal_addSub" onclick="clusterManage.checkUpload(this);">2500导播、1200导播</button>',
        /*通话结构图*/
        conversation: '<button id="18" class="conversation_btnA" data-toggle="modal" data-target="#modal_addSub" onclick="clusterManage.checkUpload(this);">制作矩阵A</button>\n' +
            '\t\t\t\t\t<button id="16" class="conversation_btnB" data-toggle="modal" data-target="#modal_addSub" onclick="clusterManage.checkUpload(this);">制作矩阵B</button>\n' +
            '\t\t\t\t\t<button id="17" class="conversation_btnWireless" data-toggle="modal" data-target="#modal_addSub" onclick="clusterManage.checkUpload(this);">无线通话基站</button>\n' +
            '\t\t\t\t\t<div class="conversation_sub">\n' +
            '\t\t\t\t\t\t<button id="34" class="conversation_subInner1" data-toggle="modal" data-target="#modal_addSub" onclick="clusterManage.checkUpload(this);">2500导控室</button>\n' +
            '\t\t\t\t\t\t<button id="35" class="conversation_subInner2" data-toggle="modal" data-target="#modal_addSub" onclick="clusterManage.checkUpload(this);">摄像机ENG通道</button>\n' +
            '\t\t\t\t\t\t<button id="36" class="conversation_subInner3" data-toggle="modal" data-target="#modal_addSub" onclick="clusterManage.checkUpload(this);">分控技术区</button>\n' +
            '\t\t\t\t\t\t<button id="37" class="conversation_subInner4" data-toggle="modal" data-target="#modal_addSub" onclick="clusterManage.checkUpload(this);">1200导控室</button>\n' +
            '\t\t\t\t\t\t<button id="38" class="conversation_subInner5" data-toggle="modal" data-target="#modal_addSub" onclick="clusterManage.checkUpload(this);"' +
            '>摄像机PROD通道</button>\n' +
            '\t\t\t\t\t</div>',
        /*同步系统框图*/
        synchronous: '<button id="40" data-toggle="modal" data-target="#modal_addSub" onclick="clusterManage.checkUpload(this);"' +
                     ' style="position: absolute;left: 10%;top:10%;width: 75%;height: 80%;">同步系统框图</button>',
        /*GPS时钟框图*/
        GPSClock: '<button id="41" data-toggle="modal" data-target="#modal_addSub" onclick="clusterManage.checkUpload(this);"' +
                  ' style="position: absolute;left: 10%;top:10%;width: 75%;height: 80%;">GPS时钟框图</button>',
        /*VSM系统框图*/
        VSMSyatem: '<button id="42" data-toggle="modal" data-target="#modal_addSub" onclick="clusterManage.checkUpload(this);"' +
                   ' style="position: absolute;left: 10%;top:10%;width: 75%;height: 80%;">VSM系统框图</button>'
    },

    init: function() {
        var self = this;
        system.getAll(function (data, err) {
            if (err) {
                swal({
                    title: "error",
                    type: "error"
                });
                return false;
            }
            var dataList = data.data;
            console.log(dataList);
            var telp = '';
            for (var i = 1, item; item = dataList[i]; i++) {
                if (i == 1) {
                    self.systemId = item.systemid;
                    telp += '<li class="action">' + item.systemname + '</li>';
                    self.updatesubsystemCache(self.systemId);
                    self.systemCache.push(item);
                    self.changeSystem(item.systemname);
                    continue;
                }
                telp += '<li>' + item.systemname + '</li>';
                self.systemCache.push(item);
            }
            $('#systemList').html(telp);
        });

        $('#systemList').on('click','li', function() {
            $(this).addClass('action').siblings().removeClass('action');

            var index = $(this).index();
            var systemName=self.systemCache[index].systemname;
            self.systemId=self.systemCache[index].systemid;
            self.changeSystem(systemName);
            self.updatesubsystemCache(self.systemId);
        });

        $("#newSubFile").fileinput({
            theme: 'fa',
            uploadUrl: '#',
            dropZoneEnabled: false,
            showPreview: false,
            showUpload: false
        }).on("filebatchselected", function (event, files) {
            var file = $(this).val();
            var fileName = getFileName(file);

            function getFileName(o) {
                var pos = o.lastIndexOf("\\");
                return o.substring(pos + 1);
            }

            fileName = deleteTail(fileName);
            $('#newSubName').val(fileName);
        });
        $("#editSubFile").fileinput({
            theme: 'fa',
            uploadUrl: '#',
            dropZoneEnabled: false,
            showPreview: false,
            showUpload: false
        }).on("filebatchselected", function (event, files) {
            var file = $(this).val();
            var fileName = getFileName(file);

            function getFileName(o) {
                var pos = o.lastIndexOf("\\");
                return o.substring(pos + 1);
            }

            fileName = deleteTail(fileName);
            $('#editSubName').val(fileName);
        });
        function deleteTail(fileName) {
            var dot = fileName.indexOf('.');
            fileName = fileName.slice(0, dot);
            return fileName;
        }
    },

    changeSystem: function(systemName) {
        var self = this;

        var imgSrc='images/';
        var buttonsBox = '';
        switch (systemName) {
            case '演播厅集群系统框图':
                imgSrc += '演播厅集群系统框图.svg';
                buttonsBox = self.buttonsBoxs.studio_innerButton;
                break;
            case '1200监看结构图':
                imgSrc += '1200.svg';
                buttonsBox = self.buttonsBoxs.monitor1200;
                break;
            case '2500监看结构图':
                imgSrc += '2500监看结构图.svg';
                buttonsBox = self.buttonsBoxs.monitor2500;
                break;
            case '分控监看结构图':
                imgSrc += '分控监看结构图.svg';
                buttonsBox = self.buttonsBoxs.variousMonitor;
                break;
            case '通话结构图':
                imgSrc += '通话系统.svg';
                buttonsBox = self.buttonsBoxs.conversation;
                break;
            case '同步系统框图':
                imgSrc += '同步系统框图.svg';
                buttonsBox = self.buttonsBoxs.synchronous;
                break;
            case 'GPS时钟框图':
                imgSrc += 'GPS时钟框图.svg';
                buttonsBox = self.buttonsBoxs.GPSClock;
                break;
            case 'VSM系统框图':
                imgSrc += 'VSM系统框图.svg';
                buttonsBox = self.buttonsBoxs.VSMSyatem;
                break;
        }

        $(".bgPic_img").attr("src",imgSrc);
        $(".buttons_addSubsystem").html(buttonsBox);
    },

    updatesubsystemCache: function(systemId) {//更新子系统缓存池systemCache
        var self = this;
        subSystem.getById(systemId, function (data, err) {
            if (err) {
                swal({
                    title: "error",
                    type: "error"
                });
                return false;
            }
            var dataList = data.data;
            console.log(dataList);
            self.subsystemCache = dataList;
        });
    },

    checkUpload: function(obj) {
        var self = this;
        var btnId = obj.id;
        //console.log("检查按钮：" + btnId);
        for (var i = 0, item; item = self.subsystemCache[i++];) {
            if (item.buttonid == btnId) {
                console.log(item)
                swal({
                    title: "已添加",
                    text: '<a data-subsystemid="' + item.subsystemid + '" style="color:#d9534f;cursor: pointer;" onclick="clusterManage.deleteSubSystem(this)">删除<span>',
                    html: true,
                    confirmButtonText: "修改",
                    showCancelButton: true,
                    allowOutsideClick: true
                }, function () {
                    var subsystemid = item.subsystemid;
                    $('#editSubName').val(item.subsystemname);
                    $('#editSubModal').modal('show');
                    $('#editSub').unbind().click(function() {
                        self.editSubSystem(btnId, subsystemid);
                    });
                });
                return;
            }
        }
        swal({
            title: "未添加",
            confirmButtonText: "添加",
            showCancelButton: true,
            allowOutsideClick: true
        }, function () {
            $('#addSubModal').modal('show');
            $('#addSub').unbind().click(function() {
                self.addSubSystem(btnId);
            });
        });
    },

    addSubSystem: function(btnId) {//添加子系统
        var self = this;
        if ($('#newSubFile').val().length == 0) {
            console.log("未选择文件");
            swal("未选择文件");
            return false;
        }
        var systemid = self.systemId;
        var subsystemname = $("#newSubName").val();
        //创建formdata对象，formData用来存储表单的数据，表单数据时以键值对形式存储的。
        var formData = new FormData();
        formData.append("subsystemname", subsystemname);
        formData.append("systemid", systemid);
        formData.append('file', $('#newSubFile')[0].files[0]);
        formData.append("buttonid", btnId);
        formData.append("type", 1);

        swal({
            title: "确定添加？",
            type: "warning",
            showCancelButton: true,
            allowOutsideClick: true,
            closeOnConfirm: false,
            showLoaderOnConfirm: true
        }, function () {
            $('#addSubsystemForm')[0].reset();
            $('#addSubModal').modal('hide');
            subSystem.add(formData, function (data, err) {
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
                self.updatesubsystemCache(self.systemId);
            });
        });
    },

    editSubSystem: function(btnId, subsystemid) {//修改子系统
        var self = this;
        if ($('#editSubFile').val().length == 0) {
            console.log("未选择文件");
            swal("未选择文件");
            return false;
        }
        var systemid = self.systemId;
        var subsystemname = $("#editSubName").val();
        //创建formdata对象，formData用来存储表单的数据，表单数据时以键值对形式存储的。
        var formData = new FormData();
        formData.append("subsystemid", subsystemid);
        formData.append("subsystemname", subsystemname);
        formData.append("systemid", systemid);
        formData.append('file', $('#editSubFile')[0].files[0]);
        formData.append("buttonid", btnId);
        formData.append("type", 1);

        swal({
            title: "确定修改？",
            type: "warning",
            showCancelButton: true,
            allowOutsideClick: true,
            closeOnConfirm: false,
            showLoaderOnConfirm: true
        }, function () {
            $('#editSubsystemForm')[0].reset();
            $('#editSubModal').modal('hide');
            subSystem.edit(formData, function (data, err) {
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
                self.updatesubsystemCache(self.systemId);
            });
        });
    },

    deleteSubSystem:function(obj) {//删除子系统
        var self = this;
        var subsystemid = $(obj).attr('data-subsystemid');console.log(subsystemid)
        swal({
            title: "确定删除？",
            type: "warning",
            showCancelButton: true,
            allowOutsideClick: true,
            closeOnConfirm: false
        }, function () {
            subSystem.delete(subsystemid, function(data, err) {
                if (err) {
                    swal({
                        title: "error",
                        type: "error"
                    });
                    return false;
                }console.log(data);
                swal({
                    title: "删除成功！",
                    type: "success",
                    allowOutsideClick: true
                });
                self.updatesubsystemCache(self.systemId);
            });
        });
    }
};

clusterManage.init();




