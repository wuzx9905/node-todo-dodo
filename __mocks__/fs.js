// const path = require('path');
//
const fs = jest.genMockFromModule('fs');
const _fs = jest.requireActual('fs');

Object.assign(fs,_fs);

let readMocks = {};

fs.setReadFileMock = (path, error, data)=>{
    readMocks[path] = [error,data]
}

fs.readFile = (path, options, callback)=>{
    if (callback === undefined){
        callback = options
    }
    if (path in readMocks){
        callback(...readMocks[path])
    }else{
        _fs.readFile(path,options,callback)
    }
}

let writeMocks = {};
fs.setWriteFileMock = (path,fn)=>{
    writeMocks[path] = fn;
}

fs.writeFile = (path, data, options, callback)=>{
    if (path in writeMocks){
        writeMocks[path](path, data, options, callback)
    }else{
        _fs.writeFile(path, data, options, callback)
    }
}

fs.clearMocks = ()=>{
    readMocks = {}
    writeMocks = {}
}

module.exports = fs;
//
// let mockFiles = Object.create(null);
// function __setMockFiles(newMockFiles){
//     mockFiles = Object.create(null);
//     for (const file in newMockFiles){
//         const dir = path.dirname(file);
//
//         if (!mockFiles[dir]){
//             mockFiles[dir] = [];
//         }
//         mockFiles[dir].push(path.basename(file));
//     }
// }
//
// function readdirSync(directoryPath){
//     return mockFiles[directoryPath] || []
// }
// fs.__setMockFiles = __setMockFiles;
// fs.readdirSync = readdirSync;
//
// module.exports = fs;

