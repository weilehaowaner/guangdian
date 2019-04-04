
$("#messageList").delegate("span","click",function () {//动态添加的勾选框的点击切换
        toggleIcon(this);
});
$("#choiceAll_selectIcon").click(function () {//全选框的点击
    toggleIcon(this);
    changeAllIcon(this);
});


function toggleIcon(obj) {//切换勾选状态
    var imgLongUrl=$(obj).css("backgroundImage");
    imgLongUrl=imgLongUrl.split("/");
    var imgUrl=imgLongUrl[imgLongUrl.length-1];
    if(imgUrl==='unselected.png")')
    {
        imgUrl='selected.png")';
    }
    else if( imgUrl==='selected.png")')
    {
        imgUrl='unselected.png")';
    }
    imgLongUrl[imgLongUrl.length-1]=imgUrl;
    imgLongUrl=imgLongUrl.join("/");
    $(obj).css("backgroundImage",imgLongUrl);
   // console.log(imgLongUrl);
}

function changeAllIcon(obj) {//全选——全不选
    var imgLongUrl=$(obj).css("backgroundImage");
    $(".selectIcon").each(function () {
        $(this).css("backgroundImage",imgLongUrl);
    })

}