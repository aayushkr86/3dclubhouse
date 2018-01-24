$('document').ready(function () {
    var imgHolder = $("#imgs-home");
    loadImages();
    //parseCura();

    function loadImages() {
        $.ajax({
            url:'/admin/homeimgs/gethomeimages',
            type:'GET',
            success:function (data) {
                calculateImages(data);
            },
            error:function (err) {
                console.log(err)
            }
        })
    }

    function parseCura() {
        $.ajax({
            url:'/dev/v2/fs/download',
            type:'GET',
            success:function (finalData) {
                // var parsed  =   JSON.parse(finalData);
                // var obj     =   {};
                //
                // for(var i=0;i<parsed.data.length;i++){
                //     var eachString = parsed.data[i];
                //     eachString  =   eachString.replace("=",":");
                //     eachString  =   eachString.replace(/["']/g, "");
                //
                //     var keySplit    =   eachString.split(":");
                //     obj[keySplit[0]] = keySplit[1];
                // }
                console.log("CURA_PARSER: ",finalData);
                var infills = {};
                var pr_time = {};
                var filaments = {};
                var updatedObj = {};


                var keys = Object.keys(finalData);
                for(var i=0;i<keys.length;i++){
                    if(keys[i].indexOf("infill") != -1){
                        updatedObj[keys[i]] = finalData[keys[i]];
                    }
                    if(keys[i].indexOf("print") != -1 || keys[i].indexOf("Print") != -1){
                        updatedObj[keys[i]] = finalData[keys[i]];
                    }
                    if(keys[i].indexOf("filament") != -1 || keys[i].indexOf("Filament") != -1){
                        updatedObj[keys[i]] = finalData[keys[i]];
                    }

                }
                console.log(updatedObj)
            },
            error:function (err) {
                console.log(err)
            }
        })
    }

    function calculateImages(images) {
        var mainImgArray    =   [];
        var twoImgArray     =   [];
        for(var i=0;i<images.length;i++){
            var imageObj    =   images[i];
            if(imageObj != undefined) {
                var image = imageObj.homeimageurl
                console.log(image);
                if (twoImgArray.length == 2) {
                    mainImgArray.push(twoImgArray);
                    twoImgArray = [];
                } else {
                    twoImgArray.push(image);
                }
            }
        }
        if(twoImgArray.length > 0){
            mainImgArray.push(twoImgArray);
        }
       //mainImgArray[mainImgArray.length-1].push(mainImgArray[mainImgArray.length-1][0])
        console.log(mainImgArray);
        renderImages(mainImgArray);
    }

    function renderImages(images) {

        var twoImgContainerStart = '';
        var oneImageStart = '';
        for(var i=0;i<images.length;i++){
            oneImageStart = '';
            var imageArr = images[i];
            if(i == (images.length - 1)){
                twoImgContainerStart += '<div class="products-grid__column js-last-column">';
            }else
                twoImgContainerStart += '<div class="products-grid__column">';

            for(var j=0;j<imageArr.length;j++){
                var imgName = imageArr[j];
                oneImageStart += '<div class="products-grid__item-container"> <div id="tttrrr" class="products-grid__item"><picture>';
                oneImageStart += '<source srcset='+imgName+'?w=320&amp;h=280&amp;fit=fill&amp;fm=webp&amp;fl=&amp;q=80&amp;f=,'+imgName+'?w=640&amp;h=560&amp;fit=fill&amp;fm=webp&amp;fl=&amp;q=80&amp;f=2x type="image/webp" media="(min-width: 1800px)"/> <source srcset='+imgName+'?w=320&amp;h=280&amp;fit=fill&amp;fm=jpg&amp;fl=progressive&amp;q=80&amp;f=,'+imgName+'?w=640&amp;h=560&amp;fit=fill&amp;fm=jpg&amp;fl=progressive&amp;q=80&amp;f=2x type="image/jpeg" media="(min-width: 1800px)"/> <source srcset='+imgName+'?w=300&amp;h=260&amp;fit=fill&amp;fm=webp&amp;fl=&amp;q=80&amp;f=,'+imgName+'?w=600&amp;h=520&amp;fit=fill&amp;fm=webp&amp;fl=&amp;q=80&amp;f=2x type="image/webp" media="(min-width: 1400px)"/> <source srcset='+imgName+'?w=300&amp;h=260&amp;fit=fill&amp;fm=jpg&amp;fl=progressive&amp;q=80&amp;f=,'+imgName+'?w=600&amp;h=520&amp;fit=fill&amp;fm=jpg&amp;fl=progressive&amp;q=80&amp;f=2x type="image/jpeg" media="(min-width: 1400px)"/> <source srcset='+imgName+'?w=240&amp;h=240&amp;fit=fill&amp;fm=webp&amp;fl=&amp;q=80&amp;f=,'+imgName+'?w=480&amp;h=480&amp;fit=fill&amp;fm=webp&amp;fl=&amp;q=80&amp;f=2x type="image/webp" media="(min-width: 1000px)"/> <source srcset='+imgName+'?w=240&amp;h=240&amp;fit=fill&amp;fm=jpg&amp;fl=progressive&amp;q=80&amp;f=,'+imgName+'?w=480&amp;h=480&amp;fit=fill&amp;fm=jpg&amp;fl=progressive&amp;q=80&amp;f=2x type="image/jpeg" media="(min-width: 1000px)"/> <source srcset='+imgName+'?w=200&amp;h=200&amp;fit=fill&amp;fm=webp&amp;fl=&amp;q=80&amp;f=,'+imgName+'?w=400&amp;h=400&amp;fit=fill&amp;fm=webp&amp;fl=&amp;q=80&amp;f=2x type="image/webp" media="(min-width: 600px)"/> <source srcset='+imgName+'?w=200&amp;h=200&amp;fit=fill&amp;fm=jpg&amp;fl=progressive&amp;q=80&amp;f=,'+imgName+'?w=400&amp;h=400&amp;fit=fill&amp;fm=jpg&amp;fl=progressive&amp;q=80&amp;f=2x type="image/jpeg" media="(min-width: 600px)"/> <source srcset='+imgName+'?w=160&amp;h=160&amp;fit=fill&amp;fm=webp&amp;fl=&amp;q=80&amp;f=,'+imgName+'?w=320&amp;h=320&amp;fit=fill&amp;fm=webp&amp;fl=&amp;q=80&amp;f=2x type="image/webp"/><img alt="Bocca" srcset='+imgName+'?w=160&amp;h=160&amp;fit=fill&amp;fm=jpg&amp;fl=progressive&amp;q=80&amp;f=,'+imgName+'?w=320&amp;h=320&amp;fit=fill&amp;fm=jpg&amp;fl=progressive&amp;q=80&amp;f=2x/>'
                oneImageStart += '</picture></div></div>';
            }
            twoImgContainerStart += oneImageStart+'</div>';
        }

        console.log(twoImgContainerStart);
        imgHolder.empty();
        imgHolder.append(twoImgContainerStart);
        var box = document.getElementById("tttrrr");
        box.style.animationName = null;
        setTimeout(function () {
            box.style.animationName = "card-jiggle"
            $('head').append('<link rel="stylesheet" type="text/css" href="/main/landing/css/unni.css">');
        },1000)
    }
    /*
    <source srcset="/main/landing/images/home/home-thumb-10.jpg?w=160&amp;h=160&amp;fit=fill&amp;fm=webp&amp;fl=&amp;q=80&amp;f=, /main/landing/images/home/home-thumb-10.jpg?w=320&amp;h=320&amp;fit=fill&amp;fm=webp&amp;fl=&amp;q=80&amp;f= 2x" type="image/webp">

    <source srcset="/main/landing/images/home/home-thumb-18.jpg?w=160&amp;h=160&amp;fit=fill&amp;fm=webp&amp;fl=&amp;q=80&amp;f=," main="" landing="" images="" home="" home-thumb-18.jpg?w="320&amp;h=320&amp;fit=fill&amp;fm=webp&amp;fl=&amp;q=80&amp;f=2x" type="image/webp" class="">

     <img alt="Deliveroo" srcset="/main/landing/images/home/home-thumb-10.jpg?w=160&amp;h=160&amp;fit=fill&amp;fm=jpg&amp;fl=progressive&amp;q=80&amp;f=, /main/landing/images/home/home-thumb-10.jpg?w=320&amp;h=320&amp;fit=fill&amp;fm=jpg&amp;fl=progressive&amp;q=80&amp;f= 2x">
     */
});