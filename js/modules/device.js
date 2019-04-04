var device = {
    getCount: function(callback) {//获取设备数量
        $.ajax({
            type: "post",
            url: urlstring+"device/countId",
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

    getOnePage: function(startRow, pageSize, callback) {//获取一页设备
        var postData = {
            "startRow": startRow,
            "pageSize": pageSize
        };
        $.ajax({
            type: "post",
            url: urlstring+"device/queryAll",
            contentType: "application/json",
            dataType: "json",
            data:JSON.stringify(postData),
            success: function (data) {
                callback && callback(data);
            },
            error: function (err) {
                callback && callback(null, err);
            }
        });
    },

    add: function(newSub, callback) {//添加设备
        var formData = newSub;
        $.ajax({
            type: "post",
            //url: urlstring+"device/addDevice",
            url: urlstring+"device/addDev",
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

    edit: function(newSub, callback) {//修改设备
        var formData = newSub;
        $.ajax({
            type: "post",
            //url: urlstring+"device/addDevice",
            url: urlstring+"device/addDev",
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

    delete: function(id, callback) {//删除设备
        var postData = {
            "deviceid": id
        };
        $.ajax({
            type: "post",
            url: urlstring+"device/deleteById",
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
    },

    screen: function(postData, callback) {//筛选设备
        $.ajax({
            type: "post",
            url: urlstring+"device/queryByTerm",
            //url: urlstring+"device/screen",
            contentType: "application/json",
            dataType: "json",
            data:JSON.stringify(postData),
            success: function (data) {
                callback && callback(data);
            },
            error: function (err) {
                callback && callback(null, err);
            }
        });
    }
};