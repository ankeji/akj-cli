#!/usr/bin/env node
const { program } = require('commander');
const chalk = require('chalk');
const { chooseTemplate } = require('../lib/inquirers')
const { checkUpdate } = require('../lib/checkUpdate')
const fs = require('fs');
const inquirer = require("inquirer");
const path = require("path");
const __dirnameNew = path.dirname(__dirname)
// 获取当前模板列表
const templateList = JSON.parse(fs.readFileSync(__dirnameNew + '/lib/template.json', 'utf8'))
function start() {
    console.log(chalk.rgb(216, 27, 96)('\n      你好啊, 靓仔~~'))
    console.log(chalk.cyanBright('      您正在使用akj-cli命令行工具...\n'))

    program
        .version(`${require('../package.json').version}`)
        .usage('<command> [option]')

    program
        .command('create [projectName]') // <必填> [可选]
        .description('用于创建一个项目')
        .option("-f, --force", "overwrite target directory if it exists")
        .action(async function (projectName, options) {
            if (!projectName) {
                projectName = 'project' + new Date().getTime();
                console.log(chalk.rgb(0, 255, 127)(`由于你没有写项目名，系统以为你默认匹配名字：${projectName}`))
            }
            await chooseTemplate(projectName, options)
        })

    program.command("update")
        .description("将cli更新至最新版本")
        // update命令执行后做的事情，自动检测更新
        .action(async () => {
            await checkUpdate();
            console.log('update');
        });

    program
        .command("list")
        .description('查看所有的模板')
        .action(function () {
            console.clear()
            console.table(templateList);
        })


    // 添加模板的命令
    let addQuestion = [
        {
            name: 'name',
            type: 'input',
            message: '请输入模板名称',
            validate(val) {
                if (!val) {
                    return '名称为必填项！'
                } else if (templateList.some(item => item.name === val)) {
                    return '名称重复！'
                } else {
                    return true
                }
            }
        }, {
            name: 'description',
            type: 'input',
            message: '请输入模板描述'
        }, {
            name: 'link',
            type: 'input',
            message: '请输入模板地址',
            validate(val) {
                return !val ? '模板地址为必填项' : true
            }
        }
    ]


    program
        .command('add')
        .description('添加一个新的模板')
        .action(() => {
            inquirer.prompt(addQuestion).then(answer => {
                // 将模板的name赋值给valuelet 
                template = { value: answer.name, ...answer }
                // 放入模板集合中
                templateList.push(template)
                // 重新写入到文件中进行保存
                fs.writeFile(__dirnameNew + '/lib/template.json', JSON.stringify(templateList), function (err) {
                    if (err) {
                        console.log(chalk.redBright('添加失败'))
                        console.log(err)
                        return;
                    }
                    console.log(chalk.greenBright('添加成功'))
                    console.table(templateList)
                })
            })
        });

    // 删除模板的命令
    let removeQuestion = [
        {
            name: 'name',
            type: 'input',
            message: '请输入要删除的模板名称',
            validate(val) {
                if (!val) {
                    return '名称为必填项！'
                } else if (!templateList.some(item => item.name === val)) {
                    return '名称不存在！'
                } else {
                    return true
                }
            }
        }
    ]

    program
        .command('remove')
        .description('删除一个新的模板')
        .action(() => {
            inquirer.prompt(removeQuestion).then(
                answer => {
                    // 获取要删除的模板为第几个
                    let index = templateList.findIndex(item => item.name === answer.name)
                    // 删除该模板信息
                    templateList.splice(index, 1)
                    // 重新写入文件
                    fs.writeFile(__dirnameNew + '/lib/template.json', JSON.stringify(templateList), function (err) {
                        if (err) {
                            console.log(chalk.redBright('删除失败'))
                            console.log(err)
                            return;
                        }
                        console.log(chalk.greenBright('删除成功'))
                        console.table(templateList)
                    })
                })
        });

    program.on('command:*', function (obj) {
        console.log(obj);
        console.error('未知的命令：' + obj[0])
        const availableCommands = program.commands.map(cmd => cmd.name())
        console.log('可用命令：' + availableCommands.join(','))
    })

    program.parse(process.argv);
}


start()