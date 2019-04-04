//判断是否登陆
checkLogin();

var pictureManage = {

    init: function() {
        var self = this;
        self.updateList();

        $("#newPicture").fileinput({
            theme: 'fa',
            allowedFileExtensions: ['jpg', 'gif', 'png'],//接收的文件后缀
            dropZoneEnabled: false,
            //showPreview: false,
            showUpload: false
        });
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
        for(var i= 0,item;item=dataList[i++];) {
            telp += '<div class="col-sm-6 col-md-3"><div class="thumbnail"><img src=' + fileUrl + item.imagepath + '>' +
                '<div class="caption"><h4>文字描述</h4><p class="text-nowrap autocut">' + item.description + '</p>' +
                '<p><a href="' + fileUrl + item.imagepath + '" class="btn btn-primary" role="button" target="blank">查看</a>&#10;' +
                '<a href="#" class="btn btn-danger" data-imageid="' + item.imageid + '" role="button" onclick="pictureManage.deleteData(this);">删除</a>' +
                '</p></div></div></div>';
        }
        $('#pictureList').html(telp);
    },

    addData: function() {
        var self = this;
        var formData = new FormData();
        formData.append("description", $('#newDescription').val());
        formData.append("file", $('#newPicture')[0].files[0]);

        swal({
            title: "确定添加？",
            type: "warning",
            showCancelButton: true,
            allowOutsideClick: true,
            closeOnConfirm: false,
            showLoaderOnConfirm: true
        }, function () {
            $('#addPicture').modal('hide');
            $('#addPictureForm')[0].reset();//重置表单
            picture.add(formData, function(data, err) {
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
            });
        });
    },

    deleteData: function(obj) {
        var self = this;
        var imageid = $(obj).attr('data-imageid');
        console.log(imageid);
        swal({
            title: "确定删除？",
            type: "warning",
            showCancelButton: true,
            allowOutsideClick: true,
            closeOnConfirm: false
        }, function () {
            picture.delete(imageid, function(data, err) {
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
            });
        });
    }

};

pictureManage.init();
