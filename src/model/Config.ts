import { join } from 'node:path'
import { homedir } from "os";
import { readFileSync, writeFile, existsSync, writeFileSync, mkdirSync } from 'node:fs'
import { ISettings } from '@src/model/Interfaces';
import { useSettings } from '@src/stores/useSettings';


export class Config {

    // 配置文件路径
    public static configFile() {
        const documents = join(homedir(), 'My Documents', 'Link Push')
        let configPath = join(documents, 'config.json');
        if (!existsSync(documents)) {
            mkdirSync(documents)
        }

        if (!existsSync(configPath)) {
            writeFileSync(configPath, '{}', 'utf8');
        }
        return configPath
    }

    // 读取配置文件
    public static getConfig(): ISettings {
        let config = readFileSync(this.configFile(), 'utf-8')
        let settings: ISettings = JSON.parse(config)

        return {
            sitemap: settings.sitemap || '',
            baidu: {
                token: settings.baidu?.token || '',
                daily: settings.baidu?.daily || false,
                push: settings.baidu?.push || false
            },
            bing: {
                token: settings.bing?.token || '',
                push: settings.bing?.push || false
            }
        }
    }
    // 保存配置文件
    public static setConfig(data: ISettings) {
        let configPath = this.configFile()

        data = JSON.parse(JSON.stringify(data))
        console.log(data);

        // 格式化存入文件
        const config = JSON.stringify(data)
        writeFile(configPath, config, { encoding: 'utf-8', flag: 'w' }, function (err) {
            if (err) {
                console.log(err)
            }
        })
    }


    public static initialization() {
        const settings = useSettings()
        let data = this.getConfig()
        settings.settings = data
    }

}