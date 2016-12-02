
module.exports = app=>{
    app.on('error', (err) => {
        console.error(err);
    });
};

