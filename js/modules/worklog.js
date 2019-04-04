var worklog = {

    getCount: function(callback) {//获取工作日志数量
        $.ajax({
            type: "get",
            url: urlstring+"log/work/count",
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

    getById: function(id, callback) {//获取单个工作日志
        var formData = new FormData();
        formData.append("worklogid", id);
        $.ajax({
            type: "post",
            url: urlstring+"log/work/log",
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

    getOnePage: function(startRow, pageSize, callback) {//获取一页工作日志
        var postData = {
            "startRow": startRow,
            "pageSize": pageSize
        };
        $.ajax({
            type: "post",
            url: urlstring+"log/work/logs",
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

    add: function(newSub, callback) {//添加工作日志
        var formData = newSub;
        $.ajax({
            type: "post",
            url: urlstring+"log/work/addlog",
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

    edit: function(newSub, callback) {//修改工作日志
        var formData = newSub;
        $.ajax({
            type: "post",
            url: urlstring+"log/work/addlog",
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

    delete: function(worklogid, callback) {//删除工作日志
        var formData = new FormData();
        formData.append("worklogid", worklogid);
        $.ajax({
            type: "post",
            url: urlstring+"log/work/delete",
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

    screen: function(postData, callback) {//筛选工作日志
        $.ajax({
            type: "post",
            url: urlstring+"log/work/screen",
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
            url: urlstring+"log/work/output",
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
    }

};
