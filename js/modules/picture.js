var picture = {
    getAll: function(callback) {//获取所有图片
        $.ajax({
            type: "get",
            url: urlstring+"images/list",
            contentType: "application/json",
            dataType: "json",
            success: function (data) {
                callback && callback(data);
            },
            error: function (err) {
                callback && callback(null, err);
            }
        });
    },

    add: function(postData, callback) {//添加首页图片
        var formData = postData;
        $.ajax({
            type: "post",
            url: urlstring+"images/addImage",
            cache: false,
            processData: false,
            contentType: false,
            dataType: "json",
            data:formData,
            success: function(data) {
                callback && callback(data);
            },
            error: function (err) {
                callback && callback(null, err);
            }
        });
    },

    delete: function(id, callback) {//删除首页图片
        var postData={
            "imageid": id
        };console.log(postData)
        $.ajax({
            type: "post",
            url: urlstring+"images/deleteById",
            contentType: "application/json",
            dataType: "json",
            data:JSON.stringify(postData),
            success: function(data) {
                callback && callback(data);
            },
            error: function (err) {
                callback && callback(null, err);
            }
        });
    }

};
