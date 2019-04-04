/*以ManageLog.html里面的日志头为标准*/
/*一个页面只能有一个日志头*/
/*两个日志模块*/
$(".logTitle").click(function () {
    //点击了日志头
    //根据当前日至头的是否选中状态切换两个信息模块
    if($(this).hasClass("selectLog")) {}
    else{
        var thisContainer=$(this).parents(".cutOffContainer_toChange");
        var brotherContainer=thisContainer.siblings(".cutOffContainer_toChange");
        thisContainer.css("display","none");
        brotherContainer.css("display","block");
    }
});