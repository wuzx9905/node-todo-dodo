const db = require("./db.js");
const inquirer = require('inquirer');

module.exports.add = async (title)=>{
    const list = await db.read();
    list.push({title, done: false});
    await db.write(list);
}

module.exports.clear = async ()=>{
    await db.write([]);
}

function editDone(list,index){
    inquirer.prompt({
        type: 'input',
        name: 'title',
        message: 'New title',
        default: list[index].title
    }).then(answer => {
        list[index].title = answer.title;
        db.write(list);
    })
}

function remove(list,index){
    list.splice(index,1);
    db.write(list);
}

function markAsUnDone(list,index){
    list[index].done = false;
    db.write(list);
}

function markAsDone(list,index){
    list[index].done = true;
    db.write(list);
}

function askForCreateTasks(list){
    inquirer.prompt({
        type: 'input',
        name: 'title',
        message: 'please add a task'
    }).then(answer => {
        list.push({
            title: answer.title,
            done: false
        })
        db.write(list);
    })
}

function askForAction(list,index){
    const actions = {
        markAsUnDone,
        markAsDone,
        remove,
        editDone,
    }
    inquirer.prompt({
        type: 'list',
        name: 'action',
        message: 'please choose an action',
        choices: [
            {name: 'exit', value: 'quit'},
            {name: 'Done', value: 'markAsDone'},
            {name: 'Undone', value: 'markAsUnDone'},
            {name: 'Remove', value: 'remove'},
            {name: 'Edit title', value: 'editDone'},
        ]
    }).then(answer2=>{
        const action = actions[answer2.action];
        action && action(list,index);
    })
}

function printTasks(list){
    inquirer
        .prompt(
            {
                type: 'list',
                name: 'index',
                message: 'Please choose what task do you want to do ?',
                choices:
                    [{name: 'exit',value: '-1'},
                        ...list.map((task,index)=>{
                            return {name: `${task.done ? '[X]' : '[_]'} ${index + 1} - ${task.title}`,
                                value: index.toString()
                            }
                        }),
                        {name: 'Add a task', value: '-2'}
                    ]
            },
        )
        .then((answer) => {
            const index = parseInt(answer.index);
            if (index >= 0){
                //选中了一个任务
                askForAction(list,index);
            }else if (index === -2){
                // 创建了任务
                askForCreateTasks(list);
            }
        });
}

module.exports.showAll = async ()=>{
    //读取之前的任务
    const list = await db.read();
    //打印之前的任务
    printTasks(list);
}