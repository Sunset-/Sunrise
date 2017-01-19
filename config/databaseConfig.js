
module.exports = {
    host : 'localhost',
    port : '3306',
    username : 'root',
    password : 'root',
    database : 'sunset',
    dialect : 'mysql',
    pool : {
        min : 1,
        max : 20,
        idle : 10000
    }
}

// module.exports = {
//     host : 'localhost',
//     username : 'sangto',
//     password : 'sangto!@#',
//     database : 'heb',
//     dialect : 'mysql',
//     pool : {
//         min : 1,
//         max : 20,
//         idle : 10000
//     }
// }