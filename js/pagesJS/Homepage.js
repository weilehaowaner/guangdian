//判断是否登陆
checkLogin();
//判断用户类型
checkUserType();

//轮播图:先从获取所有的图片（getALL），再进行渲染（render）
var bannerManage = {

    init: function() {
        var self = this;

        self.updateList();
    },

    updateList: function() {
        var self = this;
        picture.getAll(function(data, err) {
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
        });
    },

    renderData: function(dataList) {
        var telp = '';
        var carouselInner = $('#myCarousel .carousel-inner');
        var carouselIndicators = $('#myCarousel .carousel-indicators');
        for(var i= 0,item;item=dataList[i++];) {
            if(i == 1) {
                var firstItem = $($('#myCarousel .carousel-inner .item')[0]);
                //console.log($('#myCarousel .carousel-inner .item')[0])
                firstItem.find('img').attr('src',fileUrl + item.imagepath);
                firstItem.find('.carousel-caption h1').text(item.description);
                continue;
            }
            telp = '<div class="item"><img src=' + fileUrl + item.imagepath + '>' +
                   '<div class="carousel-caption"><h1>' + item.description + '</h1></div></div>';
            carouselInner.append(telp);
            carouselIndicators.append('<li data-target="#myCarousel" data-slide-to="' + i + '"></li>');
        }
    }

};

bannerManage.init();

//设备文档
var deviceShow = {
    pageSize: 5,//一页多少数据

    //初始化
    init: function() {
        var self = this;

        self.updateList();
    },

    //渲染列表
    renderData: function(dataList) {
        var telp = '';
        for(var i= 0,item;item=dataList[i++];) {
            // 点击某个设备文档跳转到设备文档的页面
            telp += '<li class="list-group-item"><div class="row">' +
                '<div class="col-md-3 col-sm-3">' + item.devicename + '</div>' +
                '<div class="col-md-3 col-sm-3"><a href=' + (item.docpath ? fileUrl + item.docpath : '"javascript:"') + ' target="blank">用户手册</a></div>' +
                '<div class="col-md-3 col-sm-3"><a href=' + (item.docpath ? fileUrl + item.exppath : '"javascript:"') + ' target="blank">使用经验</a></div>' +
                '<div class="col-md-3 col-sm-3"><a href=' + (item.docpath ? fileUrl + item.devicemap : '"javascript:"') + ' target="blank">位置</a></div>' +
                '</div></li>';
        }
        $('#equipDocumentList').html(telp);
    },

    //更新列表
    updateList: function() {
        var self = this;
        device.getOnePage(0, self.pageSize, function(data, err) {
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
        });
    }
};

deviceShow.init();

//留言板
var normalMessage = {

    dataCache: [],//缓存池
    pageSize: 4,//一页多少数据
    count: 0,

    init: function () {//初始化
        var self=this;
        self.getCount();
    },
    getCount: function() {
        var self=this;
        messageBoard.getCount(function (data, err) {
            if (err) {
                swal({
                    title: "error",
                    type: "error"
                });
                return false;
            }
            var logCount = data.object.number;
            //console.log(logCount);
            self.count = logCount;
            self.updateList();
        });
    },

    renderData: function (dataList) {//渲染数据
        var telp = '';
        for (var i = 0, item; item = dataList[i++];) {
            // 点击某个留言弹框可查看留言详情，弹筐内显示的内柔在页面update时存在缓存池内，在缓存池内通过ID进行调用显示
            telp += '<a href="#" class="list-group-item" data-messagelogid="'+item.messagelogid+'" data-toggle="modal" data-target="#checkMessage" onclick="normalMessage.checkData(this)">\n' +
                '\t\t\t\t\t\t\t\t<div class="row">\n' +
                '\t\t\t\t\t\t\t\t\t<div class="col-md-3 col-sm-3"><p class="text-nowrap autocut">'+item.title+'</p></div>\n' +
                '\t\t\t\t\t\t\t\t\t<div class="col-md-6 col-sm-6"><p class="text-nowrap autocut">' + item.content + '</p></div>\n' +
                '\t\t\t\t\t\t\t\t\t<div class="col-md-3 col-sm-3">'+item.username+'</div>\n' +
                '\t\t\t\t\t\t\t\t</div>\n' +
                '\t\t\t\t\t\t\t</a>';
        }
        $('#messageList').html(telp);
    },
    updateList: function () {//根据页数重新渲染
        var self=this;
        messageBoard.getOnePage(self.count - self.pageSize, self.pageSize, function (data, err) {
            if (err) {
                swal({
                    title: "error",
                    type: "error"
                });
                return false;
            }
            var dataList = data.data;
            //console.log(dataList);
            self.dataCache = dataList;
            self.renderData(dataList);
        });
    },
    checkData: function (obj) {//查看留言
        var self = this;
        console.log(self.dataCache);
        var singleMessagelogid = $(obj).attr('data-messagelogid');
        console.log(singleMessagelogid);
        var singleMessageLoc=self.findAmessage(singleMessagelogid);
        var singleMessage=self.dataCache[singleMessageLoc];
        $("#checkMessageTitle").text(singleMessage.title);
        $("#checkMessageContent").text(singleMessage.content);
        $("#checkMessageUser").text(singleMessage.username);
        $("#checkMessageAddTime").text(singleMessage.addtime);
        $("#checkMessageFile").attr("href",fileUrl+singleMessage.picurl);
        if(!singleMessage.picurl)
        {
            $('#checkMessageFile').text('未添加');
        }
        else{
            $('#checkMessageFile').text('查看');

        }

    },
    findAmessage:function (singleMessagelogid) {
        var self=this;
        for( var i=0,item=self.dataCache[0];item;item=self.dataCache[++i])
        {
            singleMessagelogid=parseInt(singleMessagelogid);
            if(item.messagelogid===singleMessagelogid)
            {
                return i;
            }
        }
    }

};

normalMessage.init();

//通知公告
var notificationShow = {
    pageSize: 4,
    dataCache: [],

    init: function() {
        var self = this;

        self.updateList();
    },

    updateList: function() {
        var self = this;

        notification.getData(self.pageSize, function(data, err) {
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
            self.dataCache = dataList;
        });
    },

    renderData: function(dataList) {
        var telp = '<li class="list-group-item"><div class="row">' +
            '<div class="col-md-8 col-sm-8">演播厅集群简介</div>' +
            '<div class="col-md-4 col-sm-4"><a href=""' +
            ' data-toggle="modal" data-target="#checkIntroduction">查看详情</a></div>' +
            '</div></li>';
        for(var i= 0,item;item=dataList[i++];) {
            telp += '<li class="list-group-item"><div class="row">' +
                '<div class="col-md-4 col-sm-4">' + item.boardname + '</div>' +
                '<div class="col-md-4 col-sm-4">' + item.username + '</div>' +
                '<div class="col-md-4 col-sm-4"><a href="" data-boardid="'+ item.boardid +
                '" data-toggle="modal" data-target="#checkNotice" onclick="notificationShow.checkData(this)">查看详情</a></div>' +
                '</div></li>';
        }
        $('#notificationList').html(telp);
    },

    checkData: function(obj) {
        var self = this;

        var boardid = $(obj).attr('data-boardid');
        console.log(boardid);
        $(self.dataCache).each(function(i,item) {
            if(item.boardid == boardid) {
                console.log(item);
                $('#boardname').text(item.boardname);
                $('#boardvalue').text(item.boardvalue);
                $('#username').text(item.username);
                $('#noticefile').attr('href', fileUrl + item.fileurl);
                if(!item.fileurl) {
                    $('#noticefile').text('未添加');
                }
                else {
                    $('#noticefile').text('查看');
                }
            }
        });
    }

};

notificationShow.init();