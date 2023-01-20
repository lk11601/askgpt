import { gray, green } from 'colorette'
import fs from 'fs/promises'
import type { Config } from '../types/config'
import { mergeTruthyObjectValues } from './objects'
import { getDataPath } from './ospath'

const getConfigFilePath = () => {
  const pathToSave = getDataPath()
  return `${pathToSave}/.askgtpconfig`
}

export const readConfigFile = async (): Promise<Config> => {
  try {
    const configPath = getConfigFilePath()
    const config = JSON.parse((await fs.readFile(configPath)).toString())
    return config as Config
  } catch (err) {
    console.log(gray(`Config file does not exist, configure it first with --config`))
    return {}
  }
}

export const writeConfigFile = async (newConfig: Config): Promise<void> => {
  try {
    const configPath = getConfigFilePath()
    const currentConfig = await readConfigFile()
    const jsonConfig = JSON.stringify(
      mergeTruthyObjectValues<Config>(currentConfig, newConfig),
      null,
      2
    )

    await fs.writeFile(configPath, jsonConfig)
    console.log(green(`Saved your config in ${configPath}`))
  } catch (err) {}
}
