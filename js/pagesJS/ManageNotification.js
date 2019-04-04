//判断是否登陆
checkLogin();

var notificationManage = {

    count: 0,
    pageSize: 8,

    init: function() {
        var self = this;

        self.getCount();

        $("#noticetable").bootstrapTable({ // 对应table标签的id
            uniqueId: 'boardid',
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
                    field: 'boardname', // 返回json数据中的name
                    title: '标题', // 表格表头显示文字
                    align: 'center', // 左右居中
                    valign: 'middle', // 上下居中
                    width: '14%'
                }, {
                    field: 'boardvalue',
                    title: '内容',
                    align: 'center',
                    valign: 'middle',
                    width: '26%'
                },{
                    field: 'username',
                    title: '相关人员',
                    align: 'center',
                    valign: 'middle',
                    width: '20%'
                },{
                    field: 'logtime',
                    title: '发布时间',
                    align: 'center',
                    valign: 'middle',
                    width: '20%'
                }, {
                    title: "操作",
                    align: 'center',
                    valign: 'middle',
                    width: 180, // 定义列的宽度，单位为像素px
                    formatter: function (value, row, index) {
                        return '<button class="btn btn-link btn-sm" data-toggle="modal" data-target="#checkNotice" onclick="notificationManage.check(' +
                            row.boardid + ');">查看</button>' +
                            '<button class="btn btn-danger btn-sm" onclick="notificationManage.delete(' + row.boardid + ');">删除</button>';
                    }
                }
            ]
        });

        $("#addfile").fileinput({
            theme: 'fa',
            uploadUrl: '#',
            dropZoneEnabled: false,
            showPreview: false,
            showUpload: false
        });

    },

    getCount: function() {
        var self = this;

        notification.getCount(function(data, err) {
            if (err) {
                swal({
                    title: "error",
                    type: "error"
                });
                return false;
            }
            var count = data.object.number;
            console.log(count);
            self.count = count;
            self.getAll();
        });
    },

    getAll: function() {
        var self = this;

        notification.getData(self.count, function(data, err) {
            if (err) {
                swal({
                    title: "error",
                    type: "error"
                });
                return false;
            }
            var dataList = data.data;
            console.log(dataList);
            self.renderTable(dataList);
        });
    },

    renderTable: function(dataList) {
        var self = this;
        $("#noticetable").bootstrapTable('load', dataList);
    },

    addData: function() {
        var self = this;

        swal({
            title: "确定添加？",
            type: "warning",
            showCancelButton: true,
            allowOutsideClick: true,
            closeOnConfirm: false,
            showLoaderOnConfirm: true
        }, function () {
            $('#addNotice').modal('hide');

            var file = $('#addfile')[0].files[0];
            var formData = new FormData();
            formData.append("boardname", $('#addboardname').val());
            formData.append("boardvalue", $('#addboardvalue').val());
            formData.append("username", $('#addusername').val());
            formData.append("logtime", getNowFormatDate());
            if(file) formData.append("file", file);

            notification.add(formData, function(data, err) {
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
                    $('#addForm')[0].reset();//重置表单
                    self.getCount();
                    return false;
                }
                swal({
                    title: data.error,
                    type: "error"
                });
            });
        });
    },

    delete: function(id) {
        var self = this;

        swal({
            title: "确定删除？",
            type: "warning",
            showCancelButton: true,
            allowOutsideClick: true,
            closeOnConfirm: false
        }, function () {
            notification.delete(id, function(data, err) {
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
                    self.getCount();
                }
            });
        });
    },

    check: function(id) {
        var noticeInfo = $("#noticetable").bootstrapTable('getRowByUniqueId', id);
        console.log(noticeInfo);

        $('#boardname').text(noticeInfo.boardname);
        $('#boardvalue').text(noticeInfo.boardvalue);
        $('#username').text(noticeInfo.username);
        $('#file').attr('href', fileUrl + noticeInfo.fileurl);
        if(!noticeInfo.fileurl) {
            $('#file').text('未添加');
        }
        else {
            $('#file').text('查看');
        }
    }

};

notificationManage.init();


