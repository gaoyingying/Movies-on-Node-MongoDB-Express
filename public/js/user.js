$(function(){
    $('.del').click(function(e){
        var target=$(e.target)
        var name=target.data('name')
        var tr=$('.item-name-'+name)
        $.ajax({
            type:'DELETE',
            url:"/admin/user/list?name="+name
            
        })
        .done(function(res){
            if(res.success===1){
                if(tr.length>0){
                    tr.remove()
                }
            }
        })

    })
})