//判断是否登陆
checkLogin();

var notificationShow = {

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
                        return '<button class="btn btn-link btn-sm" data-toggle="modal" data-target="#checkNotice" onclick="notificationShow.check(' +
                            row.boardid + ');">查看</button>';
                    }
                }
            ]
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

notificationShow.init();
