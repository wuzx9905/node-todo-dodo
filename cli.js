#!/usr/bin/env node
const program = require('commander');
const api = require('./index.js');
const pkg = require('./package.json')

program
    .version(pkg.version);
program
    .command('add')
    .description('add a task')
    .action((...args) => {
        const words = args.slice(0,-1).join(' ');
        api.add(words).then(()=>{
            console.log("Add successfully")
        },()=>{
            console.log("Add failed")
        });
    });

program
    .command('clear')
    .description('clear all tasks')
    .action(() => {
        api.clear().then(()=>{
            console.log("Clear successfully")
        },()=>{
            console.log("Clear failed")
        });
    });

program.parse(process.argv);

if (process.argv.length === 2){
    //说明用户直接运行了node cli.js
    void api.showAll();
}

