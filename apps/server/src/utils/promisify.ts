import fs from 'fs'
import path from 'path'
import { promisify } from 'util'

// export const

export const readFile = promisify(fs.readFile)
