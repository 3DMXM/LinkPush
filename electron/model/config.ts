import { join } from 'node:path'
import { readFileSync, writeFile } from 'node:fs'
import { IConfig } from './Interfaces'

const configFile = function () {
    process.env.DIST_ELECTRON = join(__dirname, '..')
    process.env.DIST = join(process.env.DIST_ELECTRON, '../dist')
    process.env.PUBLIC = process.env.VITE_DEV_SERVER_URL
        ? join(process.env.DIST_ELECTRON, '../public')
        : process.env.DIST
    // const configPath = path.join(__dirname, '../config.json')
    const configPath = join(process.env.PUBLIC, 'config.json')
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