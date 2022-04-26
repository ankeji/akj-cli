const inquirer = require('inquirer');
const semver = require('semver');
const download = require('download-git-repo');
const fs = require('fs');
const ora = require('ora');
const chalk = require('chalk');
const templateMap = require('./templateMap');
const createCommand = async function (projectName, template) {
    console.log(projectName, template)
    const projectInfo = await inquirer
        .prompt([{
            type: 'input',
            name: 'projectName',
            message: '请输入项目名称',
            default: projectName,
            validate: function (v) {
                // 规则一：输入的首字符为英文字符
                // 规则二：尾字符必须为英文或数字
                // 规则三：字符仅允许-和_两种
                // Declare function as asynchronous, and save the done callback
                const done = this.async();
                // Do async stuff
                setTimeout(function () {
                    if (!/^[a-zA-Z]+([-][a-zA-Z][a-zA-Z0-9]*|[_][a-zA-Z][a-zA-Z0-9]*|[a-zA-Z0-9])*$/.test(v)) {
                        done(`请输入合法名称：
                  规则一：输入的首字符为英文字符
                  规则二：尾字符必须为英文或数字
                  规则三：字符仅允许-和_两种
                `);
                        return;
                    }
                    done(null, true);
                }, 0);
            },
            filter: (v) => {
                return v
            }
        },
        { type: 'input', message: '请输入作者名称', name: 'authorName', default: 'finget' },
        {
            type: 'input', message: '请输入版本号', name: 'version',
            default: '1.0.0',
            validate: function (v) {
                const done = this.async();
                // Do async stuff
                setTimeout(function () {
                    if (!!!semver.valid(v)) {
                        done(`请输入合法版本号`);
                        return;
                    }
                    done(null, true);
                }, 0);
            },
            filter: (v) => {
                if (semver.valid(v)) {
                    return semver.valid(v)
                } else {
                    return v
                }
            }
        },
        ])
    downloadTemplate(projectInfo, template);
}

function downloadTemplate(projectInfo, template) {
    // 下载前提示loading
    const spinner = ora({
        text: '正在下载模板...',
        color: "yellow",
        spinner: {
            interval: 80,
            frames: ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"],
        },
    });
    spinner.start();
    const { projectName, version, authorName } = projectInfo;
    const downloadUrl = templateMap.get(template)
    if (projectName) {
        download(downloadUrl, projectName, { clone: true }, function (error) {
            if (!error) {
                editFile({ version, projectName, authorName }).then(() => {
                    spinner.succeed(`下载完成：${projectName}`)
                    console.log('✌✌✌', chalk.rgb(69, 39, 160)('成功创建项目     '), chalk.bgRgb(69, 39, 160)(projectName))
                });
            } else {
                spinner.fail(`下载失败!`);
                console.log(chalk.bgRgb(220, 0, 8)(`  创建项目失败：${projectName} `), '   ')
                console.log('    失败原因：', chalk.bgRgb(220, 0, 8)(error.message))
            }
        })
    }
}
function editFile({ version, projectName, authorName }) {
    return new Promise((resolve, reject) => {
        // 读取文件
        fs.readFile(`${process.cwd()}/${projectName}/package.json`, (err, data) => {
            if (err) throw err;
            // 获取json数据并修改项目名称和版本号
            let _data = JSON.parse(data.toString())
            _data.name = projectName;
            _data.version = version;
            _data.author = authorName;
            let str = JSON.stringify(_data, null, 4);
            // 写入文件
            fs.writeFile(`${process.cwd()}/${projectName}/package.json`, str, function (err) {
                if (err) throw err;
            })
            resolve()
        });
    })
};
module.exports = createCommand;