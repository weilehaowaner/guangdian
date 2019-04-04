var urlstring = parent.urlstring;

//获取子系统
function getBySystem(systemId) {
    var postData = {
        "systemid":systemId
    };
    $.ajax({
        type: "post",
        url: urlstring+"sub/getByCluster",
        contentType: "application/json",
        dataType: "json",
        data:JSON.stringify(postData),
        success: function (dataString) {
            var dataList=dataString.data;
            console.log(dataList);
            var telp = '';
            for(var i=0,item;item=dataList[i++];)
            {
                var button = $('#'+item.buttonid);
                button.val(item.subsystemid);
                //button.siblings('.subsystem_id').text(item.subsystemid);

                telp += '<li data-subsystemid="' + item.subsystemid + '" class="To_button">'+item.subsystemname+'</li>'
            }
            $('#subsystemList').html(telp);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert("error");
        }
    });
}



$('.turnTo_pdf').on('click', function() {
    var subsystemid = $(this).val();
    parent.clusterShow.pdfShow.show(subsystemid);
});
$('#subsystemList').on('click','.To_button',function() {
    var subsystemid = $(this).attr('data-subsystemid');console.log(subsystemid)
    parent.clusterShow.pdfShow.show(subsystemid);
});
