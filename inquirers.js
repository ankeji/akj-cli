const inquirer = require('inquirer')

async function chooseTemplate(projectName) {
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
    const answers = await inquirer.prompt(promptList);  // 执行命令行交互，并将交互的结果返回
    const { template } = answers
    console.log(`你选择的模板是：${template}`)
    return template  // 返回我们选择的模板
}

module.exports = {
    chooseTemplate
}