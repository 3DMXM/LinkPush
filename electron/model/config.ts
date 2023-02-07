import { join } from 'node:path'
import { readFileSync, writeFile } from 'node:fs'
import { IConfig } from './Interfaces'

const configFile = function () {

    // 开发环境
    if (process.env.NODE_ENV === 'development') {
        let publicPath = join(process.env.DIST_ELECTRON, '../public')
        const configPath = join(publicPath, 'config.json')
        return configPath
    }

    // 生产环境
    const configPath = join(process.resourcesPath, 'config.json')
    console.log(configPath);
    return configPath

}

export function GetConfig() {
    // 读取 config.json 文件
    let configPath = configFile()

    const config = readFileSync(configPath, 'utf-8')
    return JSON.parse(config)
}

export function SetConfig(data: IConfig) {
    let configPath = configFile()
    // 格式化存入文件
    const config = JSON.stringify(data, null, "\t")
    writeFile(configPath, config, { encoding: 'utf-8', flag: 'w' }, function (err) {
        if (err) {
            console.log(err)
        }
    })
}