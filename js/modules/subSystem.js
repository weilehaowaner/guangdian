var subSystem = {

    getById: function(systemId, callback) {//根据系统id获取子系统
        var postData = {
            "systemid":systemId
        };
        $.ajax({
            type: "post",
            url: urlstring+"sub/getByCluster",
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

    add: function(newSub, callback) {//添加子系统
        var formData = newSub;
        $.ajax({
            type: "post",
            url: urlstring+"sub/addSub",
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

    edit: function(newSub, callback) {//修改子系统
        var formData = newSub;
        $.ajax({
            type: "post",
            url: urlstring+"sub/addSub",
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

    delete: function(subsystemid, callback) {//删除子系统
        var datajson = {
            "subsystemid": subsystemid
        };
        $.ajax({
            type: "post",
            url: urlstring+"sub/deleteSub",
            contentType: "application/json;charset=UTF-8",
            dataType: "json",
            data:JSON.stringify(datajson),
            success: function(data) {
                callback && callback(data);
            },
            error: function (err) {
                callback && callback(null, err);
            }
        });
    }

};
