#!/usr/bin/env node

const { program } = require('commander');
const chalk = require('chalk');
const { chooseTemplate } = require('./lib/inquirers')
const { checkUpdate } = require('./lib/checkUpdate')

function start() {
    console.log(chalk.rgb(216, 27, 96)('\n      你好啊, 靓仔~~'))
    console.log(chalk.cyanBright('      您正在使用akj-cli命令行工具...\n'))

    program
        .command('create [projectName]') // <必填> [可选]
        .description('用于创建一个项目模板')
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
        .command('help')
        .description('查看所有可用的模板帮助')
        .action(function () {
            console.log(`在这里可以书写相关的帮助信息`);
        });

    program
        .command('list')
        .description('查看所有的模板')
        .action(function () {
            const templateList = [
                'vue2-template',
                'nest-server-template'
            ]
            templateList.forEach((temp, index) => {
                console.log(chalk.rgb(69, 39, 160)(`(${index + 1})  ${temp}`))
            })
        })
    program.on('command:*', function (obj) {
        console.log(obj);
        console.error('未知的命令：' + obj[0])
        const availableCommands = program.commands.map(cmd => cmd.name())
        console.log('可用命令：' + availableCommands.join(','))
    })

    program.parse(process.argv);
}


start()