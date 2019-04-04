var user={
    getAll:function (callback) {
        $.ajax({
            type: "get",
            url: urlstring+"user/queryAlluser",
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
    add:function (postData,callback) {
        console.log(postData);
        $.ajax({
            type: "post",
            url: urlstring+"user/register",
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
    edit: function(postData,callback) {//修改除了密码外的用户信息
        $.ajax({
            type: "post",
            url: urlstring+"user/updateUser",
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
    editPassword:function (postData,callback) {
        $.ajax({
            type: "post",
            url: urlstring+"user/modifyPwd",
            contentType: "application/json",
            dataType: "json",
            data:JSON.stringify(postData),
            success: function(data) {
               callback && callback(data);
                console.log("password "+data.data);
            },
            error: function (err) {
                callback && callback(null, err);
            }
        });
    },
    deleteData:function (postData,callback) {
        $.ajax({
            type: "post",
            url: urlstring+"user/deleteById",
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
