$(function(){
    $('.del').click(function(e){
        var target=$(e.target)
        var id=target.data('id')
        var tr=$('.item-id-'+id)
        $.ajax({
            type:'DELETE',
            url:"/admin/movie/list?id="+id
            
        })
        .done(function(res){
            if(res.success===1){
                if(tr.length>0){
                    tr.remove()
                }
            }
        })

    })
    $('#douban').blur(function(){
        var douban=$(this)
        var id=douban.val()
        if(id){
            $.ajax({
                url:'https://api.douban.com/v2/movie/subject/'+id,
                cache:true,
                type:'get',
                dataType:'jsonp',
                crossDomin:true,
                jsonp:'callback',
                success:function(data){
                    $('#inputTitle').val(data.title)
                    $('#inputDirector').val(data.directors[0].name)
                    $('#inputCountry').val(data.countries[0])
                    $('#inputLanguage').val(data.language)
                    $('#inputPoster').val(data.images.large)
                    $('#inputYear').val(data.year)
                    $('#inputSummary').val(data.summary)
                }
            })
        }
    })
})