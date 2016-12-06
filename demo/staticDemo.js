function stat(path){
    return new Promise((resolve,reject)=>{
        fs.stat(path,(err,stat)=>{
            if(err){
                reject(err);
            }else{
                resolve(stat);
            }
        })
    });
}


app.use(async ctx => {

    if (ctx.path == "/favicon.ico") {
        return;
    }
    // if(ctx.path=="/favicon.ico"){
    //     return;
    // }
    // if(ctx.get('IF-NONE-MATCH')=='SSSSS'){
    //     ctx.status = 304;
    //     return;
    // }
    // console.log('处理');
    // let currentUser = ctx.session.currentUser;
    // console.log(currentUser&&currentUser.name)
    // if(!currentUser){
    //     ctx.session.currentUser = {
    //         name  : 'sunset' 
    //     }
    // }
    // //ctx.fault(500,'查询异常');
    //ctx.body = "<div><img src='/img/gamersky_01origin_01_2016917225273D.jpg''/></div>";
    // ctx.set('ETag', "SSSSS");
    // ctx.set('Expires',new Date(new Date().getTime()+365*24*60*60*1000).toUTCString())
    // //ctx.redirect('http://www.baidu.com');
});
