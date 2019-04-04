//判断是否登陆
checkLogin();
//判断用户类型
checkUserType();

var clusterShow = {
    init: function () {
        var self = this;

        self.getClusterList();

        self.pdfShow.init();

        self.toolbox.init();

        self.painting.init();

        self.deviceShow.init();
    },

    //获取集群列表
    getClusterList: function() {
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
                    telp = '<li data-systemid="' + item.systemid + '" class="action"><a><p>' + item.systemname + '</p></a></li>';
                    $("#systemList").append(telp);

                    $('#pdfIframe').attr('src', './systemIframes/' + item.systemname + '.html');

                    self.getsubSystemList(item.systemid);
                    continue;
                }
                telp = '<li data-systemid="' + item.systemid + '"><a><p>' + item.systemname + '</p></a></li>';
                $('#systemList').append(telp);
            }
        });

        $('#systemList').on('click', 'li', function () {
            $(this).addClass('action').siblings().removeClass('action');
            $('#pdfIframe').attr('src', './systemIframes/' + $(this).find('p').text() + '.html');
            var systemid = $(this).attr('data-systemid');
            self.getsubSystemList(systemid);

            self.pdfShow.close();
        });
    },

    //更新子系统列表
    getsubSystemList: function(systemid) {
        var self = this;
        subSystem.getById(systemid, function(data, err) {
            if (err) {
                swal({
                    title: "error",
                    type: "error"
                });
                return false;
            }
            var dataList = data.data;
            console.log(dataList);
            self.pdfShow.subsystemList = dataList;
        });
    },

    //工具栏
    toolbox: {
        controlPanel: $('.control-panel'),
        panelBtn: $('#panelBtn'),
        panelWidth: 180,

        init: function () {
            var self = this;
            this.panelBtn.on('click', function () {
                self.toggleControlPanel();
            });

        },

        //打开工具栏
        open: function () {
            var self = this;
            self.controlPanel.children().show();
            self.controlPanel.css('width', self.panelWidth + 'px');

            self.panelBtn.css('right', self.panelWidth + 'px');
        },

        //关闭工具栏
        close: function () {
            var self = this;
            self.controlPanel.children().hide();
            self.controlPanel.css('width', '0');

            self.panelBtn.css('right', '0');

            //关闭设备列表
            $('#deviceList').hide();
        },

        toggleControlPanel: function () {
            var self = this;
            if (self.controlPanel[0].offsetWidth > 0) {
                self.close();
            }
            else {
                self.open();
            }
        }
    },

    pdfShow: {
        pdfUrl: '',
        stopLoading: 1,
        subsystemList: [],

        init: function () {
            var self = this;

            //放大缩小pdf
            $('#biggerpdf').on('click', function() {
                $('#pdfShowBox iframe')[0].contentWindow.PDFViewerApplication.zoomIn();
                $('#pdfShowBox iframe')[0].contentWindow.finishRender=false;
                $('#pdfShowBox iframe')[0].contentWindow.antiCompressListener();
            });
            $('#smallerpdf').on('click', function() {
                $('#pdfShowBox iframe')[0].contentWindow.PDFViewerApplication.zoomOut();
                $('#pdfShowBox iframe')[0].contentWindow.finishRender=false;
                $('#pdfShowBox iframe')[0].contentWindow.antiCompressListener();
            });

            $('#closepdf').on('click', function () {
                self.close();
            });
        },

        show: function (id) {
            //console.log(btn);
            var self = this;
            var subsystemid = id;
            //console.log(subsystemid);

            //从子系统列表中获取pdfurl
            $(self.subsystemList).each(function(i, item) {
                if(item.subsystemid == subsystemid) {
                    self.pdfUrl = item.subsystemfilepath;
                }
            });

            //console.log(self.pdfUrl);
            if (!self.pdfUrl) {
                //console.log("未添加pdf");
                swal({
                    title: "未添加pdf",
                    type: "info"
                });
                return false;
            }

            //更新设备列表
            clusterShow.deviceShow.updateList(subsystemid);

            //加载圈
            self.loadingSpin();

            $('#pdfShowBox').show().children('iframe').attr('src', 'generic/web/viewer.html');
        },

        close: function () {
            var self = this;
            $('#pdfShowBox').hide().children('iframe').attr('src', '');
            this.stopLoading = 1;

            self.pdfUrl = '';

            //清除画布
            clusterShow.painting.endPaint();
            //关闭工具栏
            clusterShow.toolbox.close();
        },

        //PDF加载提示
        loadingSpin: function () {
            var self = this;
            self.stopLoading = 0;
            $(".spinner").show();
            var total = 10,
                angle = 3 * Math.PI,
                Radius = 30,
                html = '';
            for (var i = 0; i < total; i++) {
                //对每个元素的位置和透明度进行初始化设置
                var loaderL = Radius + Radius * Math.sin(angle) - 10;
                var loaderT = Radius + Radius * Math.cos(angle) - 10;
                html += "<div class='loaderdot' style='left:" + loaderL + "px;top:" + loaderT + "px; opacity:" + i / (total - 1) + "'></div>";
                angle -= 2 * Math.PI / total;
            }
            $(".spinner").empty().html(html);
            var lastLoaderdot = $(".loaderdot").last();
            var spinTimer = setInterval(function () {
                if (self.stopLoading == 1) {
                    $(".spinner").empty().hide();
                    window.clearInterval(spinTimer);
                }
                $(".loaderdot").each(function () {
                    var self = $(this);
                    var prev = self.prev().get(0) ? self.prev() : lastLoaderdot,
                        opas = prev.css("opacity");
                    self.animate({
                        opacity: opas
                    }, 40);
                });
            }, 60);
        }
    },

    //涂鸦
    painting: {
        canvasWidth: 0,
        canvasHeight: 0,
        isPainting: false,//是否正在涂鸦
        isWiping: false,//是否正在使用橡皮擦
        equipment: '',
        isMouseDown: false, //定义鼠标是否按下
        lastLoc: {x: 0, y: 0}, //定义上一次鼠标的位置 初始化为0
        lastTimestamp: 0, //定义时间戳
        lastLineWidth: -1, //定义上一次线条的宽度
        strokeColor: "#ff0000", //当前笔的颜色
        canvas: document.getElementById("paintingCanvas"), //拿到canvas
        context: null,
        //计算笔的宽度
        maxLineWidth: 5,
        minLineWidth: 1,
        maxStrokeV: 10,
        minStrokeV: 0.1,

        init: function() {
            var self = this;
            self.equipment = self.browserRedirect();

            //console.log(self.canvas+' '+self.canvasWidth+' '+self.canvasHeight);

            //更新canvas大小
            $(window).resize(function() {
                self.updateCanvasSize();
            });

            $('#paintingbtn').on('click', function(e) {
                //拿到相应的上下文绘图环境
                self.context = self.canvas.getContext("2d");

                if(self.isWiping) {
                    self.isWiping = false;
                    $('#paintingbtn').find('p').text('取消');
                    self.isPainting = true;
                    return false;
                }

                var target = e.target;
                //console.log($(target)[0].nodeName);
                if(target.id === 'colorNow') {
                    //展开渐变条选颜色
                    $('#colorUl').toggle();
                    return false;
                }
                if($(target)[0].nodeName === 'LI') {
                    //选择颜色
                    $(target).addClass("color_btn_selected").siblings().removeClass("color_btn_selected");
                    self.strokeColor = $(target).css("background-color");
                    $("#colorNow").css("background-color", self.strokeColor);
                    return false;
                }
                if(!self.isPainting) {
                    self.startPaint();
                }
                else {
                    self.endPaint();
                }
            });

            //按ctrl清除画布
            $(document).keydown(function (event) {
                if (event.keyCode === 17) {
                    self.clearCanvas();
                }
            });
            $("#clearCanvas").click(function () {
                self.clearCanvas();
            });
            //使用橡皮擦
            $('#wipe').click(function() {
                $('#paintingbtn').find('p').text('继续');
                self.isWiping=true;
                self.isPainting=false;
            });

            //鼠标事件
            self.canvas.onmousedown = function (e) {
                e.preventDefault();
                self.beginStroke({x: e.clientX, y: e.clientY});
            };

            self.canvas.onmouseup = function (e) {
                e.preventDefault();
                self.endStroke();
            };

            self.canvas.onmouseout = function (e) {
                e.preventDefault();
                self.endStroke();
            };

            self.canvas.onmousemove = function (e) {
                e.preventDefault();
                if (self.isMouseDown && self.equipment === 'pc') {
                    //可以绘图了
                    self.moveStroke(e.clientX, e.clientY);

                }

            };
            //触控事件
            self.canvas.addEventListener('touchstart', function (e) {
                e.preventDefault();
                var touch = e.touches[0];
                self.beginStroke({x: touch.pageX, y: touch.pageY});
            });
            self.canvas.addEventListener('touchmove', function (e) {
                e.preventDefault();
                if (self.isMouseDown) {
                    //可以绘图了
                    var touch = e.touches[0];
                    self.moveStroke(touch.pageX, touch.pageY);
                }
            });
            self.canvas.addEventListener('touchend', function (e) {
                e.preventDefault();
                self.endStroke();
            });
        },

        //更新canvas大小
        updateCanvasSize: function() {
            this.canvasWidth = Math.round($('.paintingbox').width());
            this.canvasHeight = Math.round($('.paintingbox').height());
            //设定画布的宽和高
            this.canvas.width = this.canvasWidth;
            this.canvas.height = this.canvasHeight;
        },

        //开始涂鸦
        startPaint: function() {
            var self = this;

            self.updateCanvasSize();

            $('#paintingbtn').find('p').text('取消');
            self.isPainting = true;
            $(self.canvas).parent().show();
            $(self.canvas).show();
        },

        //结束涂鸦
        endPaint: function() {
            var self = this;
            if(self.isPainting) {
                $('#paintingbtn').find('p').text('涂鸦');
                self.isPainting = false;
                self.clearCanvas();
                $(self.canvas).parent().hide();
                $(self.canvas).hide();
                $('#colorUl').hide();
            }
        },

        //判断是否是移动端
        browserRedirect: function() {
            var sUserAgent = navigator.userAgent.toLowerCase();
            var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
            var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
            var bIsMidp = sUserAgent.match(/midp/i) == "midp";
            var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
            var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
            var bIsAndroid = sUserAgent.match(/android/i) == "android";
            var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
            var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";

            var result = '';
            if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
                result = 'phone';
            } else {
                result = 'pc';
            }
            return result;
        },

        //开始
        beginStroke: function(point) {
            this.isMouseDown = true;
            this.lastLoc = this.windowToCanvas(point.x, point.y);
            this.lastTimestamp = new Date().getTime();
        },

        //结束
        endStroke: function() {
            this.isMouseDown = false;
        },

        //绘图
        moveStroke: function(x, y) {
            //核心代码
            var curLoc = this.windowToCanvas(x, y);
            var curTimestamp = new Date().getTime();
            /****Draw Start****/
            this.context.beginPath();
            /*以下修改*/
            if (this.isPainting) {
                this.context.moveTo(this.lastLoc.x, this.lastLoc.y);
                this.context.lineTo(curLoc.x, curLoc.y);
                this.isWiping = false;
            }
            if (this.isWiping) {
                this.context.clearRect(this.lastLoc.x, this.lastLoc.y, 20, 20);
                this.isPainting = false;
            }
            /*以上修改*/


            //计算速度
            var s = this.calcDistance(curLoc, this.lastLoc);
            var t = curTimestamp - this.lastTimestamp;
            var lineWidth = this.calcLineWidth(t, s);
            this.context.strokeStyle = this.strokeColor;
            this.context.lineWidth = lineWidth;
            this.context.lineCap = "round"; //矩形的帽子 可以绘制出平滑的线条
            this.context.lineJoin = "round";
            this.context.stroke();
            /****Draw End****/
            this.lastLoc = curLoc;
            this.lastTimestamp = curTimestamp;
            this.lastLineWidth = lineWidth;
        },

        //绘制米字格
        drawGrid: function() {

            this.context.save();

            //绘制红色的正方形边框
            this.context.strokeStyle = "rgb(230,11,9)";

            this.context.beginPath();
            this.context.moveTo(3, 3);
            this.context.lineTo(this.canvas.width - 3, 3);
            this.context.lineTo(this.canvas.width - 3, this.canvas.height - 3);
            this.context.lineTo(3, this.canvas.height - 3);
            this.context.closePath();

            this.context.lineWidth = 6;
            this.context.stroke();

            //绘制米字格
            this.context.beginPath();
            this.context.moveTo(0, 0);
            this.context.lineTo(this.canvasWidth, this.canvasHeight);

            this.context.moveTo(this.canvasWidth, 0);
            this.context.lineTo(0, this.canvasHeight);

            this.context.moveTo(this.canvasWidth / 2, 0);
            this.context.lineTo(this.canvasWidth / 2, this.canvasHeight);

            this.context.moveTo(0, this.canvasHeight / 2);
            this.context.lineTo(this.canvasWidth, this.canvasHeight / 2);

            this.context.lineWidth = 1;
            this.context.stroke();

            this.context.restore();
        },

        //窗口到画布的位置
        windowToCanvas: function(x, y) {
            var bbox = this.canvas.getBoundingClientRect();
            return {x: Math.round(x - bbox.left), y: Math.round(y - bbox.top)};
        },

        //计算距离
        calcDistance: function(loc1, loc2) {
            return Math.sqrt((loc1.x - loc2.x) * (loc1.x - loc2.x) + (loc1.y - loc2.y) * (loc1.y - loc2.y));
        },

        //计算笔的宽度
        calcLineWidth: function(t, s) {
            var v = s / t;
            var resultLineWidth;
            if (v <= this.minStrokeV) {
                resultLineWidth = this.maxLineWidth;
            } else if (v >= this.maxStrokeV) {
                resultLineWidth = this.minLineWidth;
            } else {
                //使用差值的方式
                resultLineWidth = this.maxLineWidth - (v - this.minStrokeV) / (this.maxStrokeV - this.minStrokeV) * (this.maxLineWidth - this.minLineWidth);
            }
            if (this.lastLineWidth == -1) {
                return resultLineWidth;
            }
            return this.lastLineWidth * (2 / 3) + resultLineWidth * (1 / 3);
        },

        //清除画布
        clearCanvas: function() {
            this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        }

    },

    deviceShow: {
        deviceCount: 0,
        dataCache: [],
        subsystemid: null,

        init: function() {
            var self = this;
            $('#showDevice').on('click', function() {
                if(self.dataCache.length > 0) {
                    $('#deviceList').toggle();
                }
            });
        },

        updateList: function(subsystemid) {
            var self = this;
            self.subsystemid = subsystemid;

            self.getDataCount();
        },

        getDataCount: function() {
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
                self.deviceCount = dataCount;
                self.getDataList();
            });
        },

        getDataList: function() {
            var self = this;
            device.getOnePage(0, self.deviceCount, function(data, err) {
                if (err) {
                    swal({
                        title: "error",
                        type: "error"
                    });
                    return false;
                }
                var dataList = data.data;
                console.log(dataList);
                self.dataCache = [];
                self.renderData(dataList);
            });
        },

        renderData: function(dataList) {
            var self = this;
            var telp = '';
            for(var i= 0,item;item=dataList[i++];) {
                if(item.subsystemid == self.subsystemid) {
                    telp += '<a href="javascript:" class="list-group-item" data-toggle="modal" data-target="#checkDevice"' +
                        ' onclick="clusterShow.deviceShow.checkData(this)">' + item.devicename + '</a>';

                    self.dataCache.push(item);
                }
            }
            if(self.dataCache.length === 0) {
                $('#showDevice').addClass('none-device');
            }
            else {
                $('#showDevice').removeClass('none-device');
            }
            $('#deviceList').html(telp);
            console.log(self.dataCache)
        },

        checkData: function(obj) {
            var self = this;
            var deviceinfo = self.dataCache[$(obj).index()];
            console.log(deviceinfo);
            $('#devicename').text(deviceinfo.devicename);
            $('#deviceFile').attr('href', fileUrl + deviceinfo.docpath );
            $('#experience').attr('href', fileUrl + deviceinfo.exppath );
            $('#devicemap').attr('href', fileUrl + deviceinfo.devicemap );
            $('#posinfo').text(deviceinfo.posinfo);
        }
    }
};
clusterShow.init();

var saveCanvas={//保存画布
    pdfCvsTop:0,
    pdfCvsLeft:0,
    pdfImageData:0,
    canvasWidth:0,
    canvasHeight:0,
    upLoadCanvas:document.createElement("canvas"),
    init:function () {
        var self=this;
        $("#saveCanvas").click(function () {
                if(clusterShow.painting.isPainting || clusterShow.painting.isWiping)
                {
                    self.prepareImageData();
                    /*var cvs=document.getElementById("paintingCanvas");
                    var ctx=cvs.getContext("2d");
                    self.makeDrawCover(ctx);*/
                }
                else{
                    swal({
                        title: "请打开涂鸦板",
                        type: "error"
                    },function () {
                        $("#upLoadCanvas").modal('hide');
                    });
                }

        });
        $("#canvasSub").click(function () {
            self.addCanvas(self.upLoadCanvas);
        });
    },
    prepareImageData:function () {
        var self=this;
       self.canvasWidth=$("#paintingCanvas").width();
       self.canvasHeight=$("#paintingCanvas").height();
       console.log("Clusterwidth"+ self.canvasWidth);
       self.getScroll();
       //调用子页面获取imageData方法
        $("#pdfJS_iframe")[0].contentWindow.transmitPdfImageData();
        //获取子页面imageData
        self.pdfImageData=$("#pdfJS_iframe")[0].contentWindow.pdfImageData;
        self.upLoadCanvas.width=$("#paintingCanvas").width();
        self.upLoadCanvas.height=$("#paintingCanvas").height();
        var upLoadCtx=self.upLoadCanvas.getContext("2d");
        self.makeDrawCover(upLoadCtx);
    },
    makeDrawCover:function (drawctx) {//两个canvas的ImageData数据处理好之后将涂鸦覆盖在pdf上
        var self=this;
        //获取画画的cvs的画图环境
        var translucentCvs=document.getElementById("paintingCanvas");
        var translucentCtx=translucentCvs.getContext("2d");
        var bottomData=self.pdfImageData;

        //获取两个cvs的imageData的数组
        var bottomPX=bottomData.data;
        var translucentData=translucentCtx.getImageData(0,0,translucentCvs.width,translucentCvs.height);
        var translucentPX=translucentData.data;

        for(var i=0;i<translucentPX.length;i+=4)
        {   //判断透明cvs哪些画的不是透明像素，并覆盖到bottomPX的里面
            if(translucentPX[i+3]!==0)
            {
                bottomPX[i+0]=translucentPX[i+0];
                bottomPX[i+1]=translucentPX[i+1];
                bottomPX[i+2]=translucentPX[i+2];
                bottomPX[i+3]=translucentPX[i+3];
            }
        }
        drawctx.putImageData(bottomData,0,0);
    },
    getScroll:function () {
        this.pdfCvsTop=$("#pdfJS_iframe").contents().find("#viewerContainer").scrollTop();
        this.pdfCvsLeft=$("#pdfJS_iframe").contents().find("#viewerContainer").scrollLeft();
    },
    addCanvas:function (canvas) {
        var dataurl = canvas.toDataURL('image/png');
        var blob = this.dataURLToBlob(dataurl);
        var formData = new FormData();
        var username = getCookie('zjrtusername');
        formData.append("username", username);

        var addtime = getNowFormatDate();
        formData.append("addtime", addtime);

        formData.append("file", blob, "image.png");
        formData.append("title",$("#upLoadCanvasName").val());
        formData.append("content",$("#upLoadCanvasIntro").val());
        console.log($("#upLoadCanvasIntro").val());
        swal({
            title: "确定添加？",
            type: "warning",
            showCancelButton: true,
            allowOutsideClick: true,
            closeOnConfirm: false,
            showLoaderOnConfirm: true
        }, function () {
            $('#upLoadCanvas').modal('hide');
            $('#upLoadCanvasForm')[0].reset();//重置表单
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

            });
        });
    },
    dataURLToBlob:function (dataurl) {
        var arr = dataurl.split(',');
        var mime = arr[0].match(/:(.*?);/)[1];
        var bstr = atob(arr[1]);
        var n = bstr.length;
        var u8arr = new Uint8Array(n);
        while(n--){
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], {type:mime});
    }
};
saveCanvas.init();





