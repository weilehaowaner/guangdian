

var messageBoard ={
    getCount: function(callback) {//获取留言数量
        $.ajax({
            type: "get",
            url: urlstring+"message/count",
            contentType: "application/json",
            dataType: "json",
            async:false,
            success: function (data) {
                callback && callback(data);
            },
            error: function (err) {
                callback && callback(null, err);
            }
        });
    },

    getOnePage: function(startRow, pageSize, callback) {//获取一页留言
        var postData = {
            "startRow": startRow,
            "pageSize": pageSize
        };
        $.ajax({
            type: "post",
            url: urlstring+"message/logs",
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

    getAll: function(pageSize, callback) {//获取所有留言
        var postData = {
            "startRow": 0,
            "pageSize": pageSize
        };
        $.ajax({
            type: "post",
            url: urlstring+"message/logs",
            contentType: "application/json",
            dataType: "json",
            async:false,
            data:JSON.stringify(postData),
            success: function (data) {
                callback && callback(data);
            },
            error: function (err) {
                callback && callback(null, err);
            }
        });
    },

    add: function(newSub, callback) {//添加留言
        var formData = newSub;
        $.ajax({
            type: "post",
            url: urlstring+"message/addlog",
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

    edit: function(newSub, callback) {//修改留言
        var formData = newSub;
        $.ajax({
            type: "post",
            url: urlstring+"message/addlog",
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

    delete: function(newSub, callback) {//删除留言
        var formData = newSub;
        $.ajax({
            type: "post",
            url: urlstring+"message/delete",
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

    myMessage: function (newSub,callback) {//我的留言板
        var formData = newSub;
        $.ajax({
            type:"post",
            url:urlstring+"message/user",
            cache: false,
            processData: false,
            contentType: false,
            dataType: "json",
            data:formData,
            success:function (data) {
                callback&&callback(data);
            },
            error:function (err) {
                callback&&callback(null,err);
            }
        })
    },

    search: function(postData, callback) {
        $.ajax({
            type: "post",
            url: urlstring+"message/screen",
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

    screenByTime: function(postData, callback) {
        $.ajax({
            type: "post",
            url: urlstring+"message/logsbytime",
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