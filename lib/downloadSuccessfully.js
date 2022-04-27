const chalk = require('chalk');
const boxen = require("boxen");
const downloadSuccessfully = (projectName) => {
    const END_MSG = `${chalk.blue(chalk.rgb(0, 0, 255)('成功创建项目：') + chalk.greenBright(projectName))}\n\n   感谢您使用akj-cli脚手架 !`;
    const BOXEN_CONFIG = {
        padding: 1,
        margin: { top: 1, bottom: 1 },
        borderColor: 'cyan',
        align: 'center',
        borderStyle: 'double',
        title: '恭喜您',
        titleAlignment: 'center'
    }

    const showEndMessage = () => process.stdout.write(boxen(END_MSG, BOXEN_CONFIG))
    showEndMessage();

    console.log('  开始使用以下命令:');
    console.log(`\n\r\r cd ${chalk.cyan(projectName)}`);
    console.log("\r\r npm install");
    console.log("\r\r npm run serve \r\n");
}

module.exports = {
    downloadSuccessfully
}