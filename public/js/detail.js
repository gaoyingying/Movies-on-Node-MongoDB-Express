$(function(){
    $('.comment').click(function(e){
        
        var target=$(this)
        var toId=target.data('tid')
        var commentId=target.data('cid')//主评论的id
        var name=target.data('name')
        if($('#toId').length>0){
            $('#toId').val(toId)
        }
        else{
             $('<input>').attr({
            type:'hidden',
            id:'toId',
            name:'comment[tid]',
            value:toId
        }).appendTo('#commentForm')
        }
    
        if($('#commentId').length>0){
            $('#commentId').val(commentId)
        }
        else{
         $('<input>').attr({
            type:'hidden',
            id:'commentId',
            name:'comment[cid]',
            value:commentId
        }).appendTo('#commentForm')
        }
        
        $('.textEditing').attr('placeholder',"回复给："+name)
    })
})