    
const config = {
    PORT:4000,
    DATABASE : "mongodb://localhost:27017/Duel",
    SECRET : "lakjsnf9awr9",
    SERVER : "http://localhost:4000"
}

exports.get = function get(){
    return config;
};