var notification = {

    getCount: function(callback) {//获取通知公告数量
        $.ajax({
            type: "get",
            url: urlstring+"board/count",
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

    getData: function(num, callback) {//获取num条数据
        var formData = new FormData();
        formData.append("number", num);
        $.ajax({
            type: "post",
            url: urlstring+"board/getboard",
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
        //var postData = {
        //    "number": num
        //};
        //$.ajax({
        //    type: "post",
        //    url: urlstring+"board/getboard",
        //    contentType: "application/json",
        //    dataType: "json",
        //    data:JSON.stringify(postData),
        //    success: function (data) {
        //        callback && callback(data);
        //    },
        //    error: function (err) {
        //        callback && callback(null, err);
        //    }
        //});
    },
    add: function(newData, callback) {
        $.ajax({
            type: "post",
            url: urlstring + "board/addlog",
            cache: false,
            processData: false,
            contentType: false,
            dataType: "json",
            data: newData,
            success: function (data) {
                callback && callback(data);
            },
            error: function (err) {
                callback && callback(null, err);
            }
        });
    },

    delete: function(id, callback) {
        var formData = new FormData();
        formData.append("boardid", id);
        $.ajax({
            type: "post",
            url: urlstring + "board/delete",
            cache: false,
            processData: false,
            contentType: false,
            dataType: "json",
            data: formData,
            success: function (data) {
                callback && callback(data);
            },
            error: function (err) {
                callback && callback(null, err);
            }
        });
    }

};
