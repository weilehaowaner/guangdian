//系统
var system = {

    getAll: function(callback) {//获取所有系统
        $.ajax({
            type: "get",
            url: urlstring+"cluster/listName",
            contentType: "application/json",
            dataType: "json",
            success: function (data) {
                callback && callback(data);
            },
            error: function (err) {
                callback && callback(null, err);
            }
        });
    }

};