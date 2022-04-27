const inquirer = require('inquirer')
const chalk = require('chalk');
const fs = require('fs-extra');
const path = require("path");
const ora = require('ora');
const createCommand = require('./command-create.js')

async function chooseTemplate(projectName, options) {
    const promptList = [
        {
            type: "list", // type决定交互的方式，比如当值为input的时候就是输入的形式，list就是单选，checkbox是多选...
            name: "template",
            message: "请选择要使用的模板",
            choices: [
                {
                    name: "vue2-template (js版本的vue2全家桶工程化模板)",
                    value: "vue2-template",
                },
                {
                    name: "nest-server-template (一个基于nest.js的服务端模板)",
                    value: "nest-server-template",
                }
            ],
            filter: function (val) {
                // 使用filter将回答变为大写
                return val.toLowerCase();
            },
        },
    ];

    const cwd = process.cwd();
    // 拼接到目标文件夹
    const targetDirectory = path.join(cwd, projectName);
    // 如果目标文件夹已存在
    if (fs.existsSync(targetDirectory)) {
        if (!options.force) {
            // 如果没有设置-f则提示，并退出
            console.error(chalk.red(`项目已经存在！请更改项目名称`))
            return;
        }
        // 如果设置了-f则二次询问是否覆盖原文件夹
        const { isOverWrite } = await inquirer.prompt([{
            name: "isOverWrite",
            type: "confirm",
            message: "目标目录已存在，是否覆盖它?",
            choices: [
                { name: "Yes", value: true },
                { name: "No", value: false }
            ]
        }]);
        // 如需覆盖则开始执行删除原文件夹的操作
        if (isOverWrite) {
            const spinner = ora(chalk.blackBright('项目正在删除，请稍候...'));
            spinner.start();
            await fs.removeSync(targetDirectory);
            spinner.succeed();
            console.info(chalk.green("✨ 删除成功，启动初始化项目..."));
            console.log();
            // 删除成功后，开始初始化项目
            const { template } = await inquirer.prompt(promptList);  // 执行命令行交互，并将交互的结果返回
            console.log(chalk.rgb(69, 39, 160)('你选择的模板是  '), chalk.bgRgb(69, 39, 160)(template))
            createCommand(projectName, template)
        } else {
            console.error(chalk.red(`项目已经存在！请更改项目名称去创建`))
            return;
        }
    } else {
        const { template } = await inquirer.prompt(promptList);  // 执行命令行交互，并将交互的结果返回
        console.log(chalk.rgb(69, 39, 160)('你选择的模板是  '), chalk.bgRgb(69, 39, 160)(template))
        createCommand(projectName, template)
    }
}

module.exports = {
    chooseTemplate
}