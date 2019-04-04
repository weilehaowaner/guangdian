var maintain = {

    getCount: function(callback) {//获取维护日志数量
        $.ajax({
            type: "get",
            url: urlstring+"log/maintain/count",
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

    getById: function(id, callback) {//获取单个维护日志
        var formData = new FormData();
        formData.append("mainlogid", id);
        $.ajax({
            type: "post",
            url: urlstring+"log/maintain/log",
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

    getOnePage: function(startRow, pageSize, callback) {//获取一页维护日志
        var postData = {
            "startRow": startRow,
            "pageSize": pageSize
        };
        $.ajax({
            type: "post",
            url: urlstring+"log/maintain/logs",
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

    add: function(newSub, callback) {//添加维护日志
        var formData = newSub;
        $.ajax({
            type: "post",
            url: urlstring+"log/maintain/addlog",
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

    edit: function(newSub, callback) {//修改维护日志
        var formData = newSub;
        $.ajax({
            type: "post",
            url: urlstring+"log/maintain/addlog",
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

    delete: function(id, callback) {//删除维护日志
        var formData = new FormData();
        formData.append("mainlogid", id);
        $.ajax({
            type: "post",
            url: urlstring+"log/maintain/delete",
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

    screen: function(postData, callback) {//筛选维护日志
        $.ajax({
            type: "post",
            url: urlstring+"log/maintain/screen",
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

    exportById: function(postData, callback) {
        var formData = postData;
        $.ajax({
            type: "post",
            url: urlstring+"log/maintain/output",
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

    queryByTime: function(postData, callback) {
        $.ajax({
            type: "post",
            url: urlstring+"log/maintain/logsbytime",
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
