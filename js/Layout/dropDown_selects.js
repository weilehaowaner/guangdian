    /****************总的下拉框的代码*********************************/
    //点击P标签切换下拉框
    $('.select > p').on('click', function(event) {
        var select= $(this).parents(".select");
        select.toggleClass('open');
        event.stopPropagation();
    });
    //点击li标签,赋值、切换下拉框、给选中的li标签添加选中样式同级元素移除选中样式、阻止事件冒泡
    $('.select ul li').on('click',function(event){
        var _this = $(this);
        var select= $(this).parents(".select");
        var p=select.children("p");
        p.text(_this.attr('data-value'));
        select.toggleClass('open');
        _this.addClass('selected').siblings().removeClass('selected');
        event.stopPropagation();
    })


    //点击除下拉框的其它地方，收起下拉框
    $(document).on('click',function(){
        $('.select').removeClass('open');
    })
    /****************总的下拉框的代码*********************************/
