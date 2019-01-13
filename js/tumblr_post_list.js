(function($){
    $.fn.extend({
        jq_tumblrPostList: function(options){

            var defaults={
                api_key: "foMNsHwX5MRxNsfIHsOhVg0IHUqtJQyA0yVe4QkVLEPPuqLgCZ",
                domain: "pupuakachan.tumblr.com",
                limit: 20,
                width: 250,
                tag: null,
                text_max: 1000 //キャプションの最大文字数
            }
            var o = $.extend(defaults, options);
            var objList = this;

            return this.each(function() {

                $.getJSON(
                    "https://api.tumblr.com/v2/blog/"+o.domain+"/posts?api_key="+o.api_key+"&limit="+o.limit+(o.tag ? "&tag="+o.tag : "")+"&jsonp=?",
                    function(data){
                        //console.log(data);
                        var post_no = 0;
                        
                        if( data['meta']['status']==200){
            
                            $(objList).append('<ul class="tumblr_post_list" style="list-style-type: none"></ul>');
            
                            $.each(data['response']['posts'],function(){
                                post_no = post_no +1;
                                //var post_url = "http://"+o.domain+"/post/"+ this['id'];
                                var post_url = this['post_url'];
                                var post_class = 'postno_'+post_no;
                                
                                $(".tumblr_post_list",objList).append('<li class="tpl_post '+post_class+'"></li>');
                                
                                //タイトルの取得
                                if( this['title'] !== void 0 ){
                                    $('.'+post_class,objList).append('<div class="post_title" ><a href="' + post_url + '" >' + this['title'] + '</a></div>');
                                }
                                
                                if( this['body'] !== void 0 ){
                                    //本文の第一画像の取得
                                    var img_url = $(this['body']).find('img').attr('src');
                                    //alert(img_url);
                                    $('.'+post_class,objList).append('<div class="photo" ><a href="' + post_url + '" >' + '<img src="' + img_url + '" width="'+o.width+'" />' + '</a></div>');
                                    //本文のテキストの取得
                                    str = $(this['body']).text();
                                    if(str.length > o.text_max){
                                      str = str.substring(0,o.text_max) + "…";
                                    }
                                    $('.'+post_class,objList).append('<div class="post_body" ><a href="' + post_url + '" >' + str + '</a></div>');
                                }
                                else if(this['photos'] === void 0 ){
                                    objDate = new Date(this['timestamp']*1000);
                                    date_str = (objDate.getMonth()+1) +"/" + objDate.getDate() +" ";
                                    date_str += (objDate.getHours()) +":" + objDate.getMinutes();
                                    $('.'+post_class,objList).append('<div class="post_title" ><a href="' + post_url + '" >' + date_str +':'+ this['type'] + '</a></div>');
                                }
                                
                                //画像の取得
                                if( this['photos'] !== void 0 && this['photos'].length > 0 ){
                                    for( var no=0; no < this['photos'][0]['alt_sizes'].length; no++ ){
                                        if( o.width >= this['photos'][0]['alt_sizes'][no]['width'] ){
                                            break;
                                        }
                                    }
                                    var img_url = this['photos'][0]['alt_sizes'][no]['url'];
                                    $('.'+post_class,objList).append('<div class="photo" ><a href="' + post_url + '" >' + '<img src="' + img_url + '" width="'+o.width+'" />' + '</a></div>');
                                    
                                }
                                if( this['caption'] !== void 0 ){
                                    str = $(this['caption']).text();
                                    if(str.length > o.text_max){
                                      str = str.substring(0,o.text_max) + "…";
                                    }
                                    $('.'+post_class,objList).append('<div class="post_body" ><a href="' + post_url + '" >' + str + '</a></div>');
                                }
                                //$('.'+post_class,objList).find("img").css('max-width','200px');
                            });
            
                        }
                    }
                );
            });            
        }
    });
})(jQuery);
