/**
 * Created by anooj on 14/09/17.
 */
$("document").ready(function () {

    let currentPath     =   window.location.pathname + window.location.search;

    if(currentPath.indexOf("/tutorials") != -1) {
        getAllTutorials();
    }

    function getAllTutorials() {
        $("div#divLoading").addClass('show');
        $.ajax({
            url: '/admin/tutorials/getalltutorialswithmedia',
            type: 'GET',
            success: function (data) {
                console.log("TUTORIALS: ",data);
                $("div#divLoading").removeClass('show');
                if (data.success == true) {
                    categoriseTutorial(data.data);
                }
            }
        });
    }

    function categoriseTutorial(tutorials) {
        var _tuts   =   {};
        for(var i=0;i<tutorials.length;i++){
            var tutorial    =   tutorials[i];
            if(_tuts[tutorial.tutorialCategoryName] != undefined){
                var arr =   _tuts[tutorial.tutorialCategoryName];
                arr.push(tutorial);
                _tuts[tutorial.tutorialCategoryName]    =   arr;
            }else{
                _tuts[tutorial.tutorialCategoryName]    =   [tutorial];
            }
        }
        console.log("TUYT: ",_tuts);
        buildTutorialTimeLineView(_tuts);
    }


    function buildTutorialTimeLineView(tutorials) {
        var chapters = Object.keys(tutorials);
        var timelineForm = '';
        $("#tutorial-timeline").empty();
        for(var i=0;i<chapters.length;i++){
            var chapter =   chapters[i];
            timelineForm    +=  '<li class="time-label"> <span class="bg-red">'+chapter+'</span> </li>'
            var contents    =   tutorials[chapter];
            for(var j=0;j<contents.length;j++){
                var pageObj =   contents[j];
                var media   =   pageObj.media;
                if(media != undefined && media.length > 0){
                    timelineForm    +=  '<li><i class="fa bg-purple fa-camera"></i>' +
                        '<div class=timeline-item>' +
                        '<h3 class=timeline-header>' +pageObj.tutorialTitle+
                        '</h3><div class=timeline-body>' +pageObj.tutorialDesc+'<br>';
                    for(var k=0;k<media.length;k++) {
                        var currentMedia    =   media[k].resourceLink;
                        console.log("Current: ",currentMedia)
                        var mediaUrl    =   '<img alt=... class=margin src=http://placehold.it/150x100>';
                        // if(currentMedia.indexOf(".png") != -1 || currentMedia.indexOf(".jpg") != -1){
                        //     mediaUrl    =   '<img alt=... class=margin src='+currentMedia+'>'
                        // }else if(checkYoutube(currentMedia)){
                        //
                        // }
                        mediaUrl    =   getResourceType(currentMedia);
                        console.log(mediaUrl)
                        timelineForm   +=   mediaUrl;
                    }
                     timelineForm   +=   '</div></div>';
                }else{
                    timelineForm    +=  '<li><i class="fa bg-blue fa-envelope"></i>' +
                        '<div class=timeline-item>' +
                        '<h3 class=timeline-header>'+pageObj.tutorialTitle+'</h3>' +
                        '<div class=timeline-body>'+pageObj.tutorialDesc+'</div><div class=timeline-footer>' +
                        '</div></div>'
                }
            }
        }
        timelineForm    +=  '<li><i class="bg-gray fa fa-clock-o"></i>';
        $("#tutorial-timeline").append(timelineForm);
    }


    function getResourceType(filename) {
        if(filename.indexOf(".png") != -1 || filename.indexOf(".jpg") != -1 || filename.indexOf(".jpeg") != -1){
            console.log("is Image")
            //<img alt=... class=margin src=http://placehold.it/150x100>
            return "<img width='150' height='150' alt=... class='margin' src='" + filename + "'> ";
        }
        if(checkYoutube(filename) != 0){
            var yForm='<img><iframe style="vertical-align: middle;" id="videoObject" type="text/html" width="200" height="150" frameborder="0" allowfullscreen src="'+checkYoutube(filename)+'"></iframe></img>'
            return yForm;
        }
        return "<a target='_blank' href='"+filename+"'><img class='margin' width='150' height='150' src='https://3dclubhouse.s3.amazonaws.com/categories/category_default.png' data-id=''></a> ";


    }
    function checkIsImage(filename) {
        let ext =   (/[.]/.exec(filename)) ? /[^.]+$/.exec(filename) : undefined;
        if(ext.length >0) {
            ext = ext[0];
            console.log("Extension: ", ext);
            var availableImgExt = ['jpg', 'png', 'gif', 'bmp', 'jpeg'];
            if (availableImgExt.indexOf(ext) != -1) {
                return 1;
            }else{
                return 0;
            }
        }else{
            return 0;
        }
    }

    function checkYoutube(url) {
        if (url != undefined || url != '') {
            var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;
            var match = url.match(regExp);
            if (match && match[2].length == 11) {
                //$('#videoObject').attr('src', 'https://www.youtube.com/embed/' + match[2] + '?autoplay=1&enablejsapi=1');
                return 'https://www.youtube.com/embed/' + match[2] + '?autoplay=0&enablejsapi=1';
            } else {
                return 0;
            }
        }else{
            return 0;
        }
    }

});