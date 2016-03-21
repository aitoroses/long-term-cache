/**
 * This tool is for parsing and html file and adding
 * long-term-cache to all of its content
 */

import { readFileSync, renameSync, writeFileSync } from 'fs'
import { resolve, join } from 'path'
import { flatMap, getStyleRefs, getScriptRefs, addTimestamp } from './utils'

const filename = process.argv[2].split(/(\/|\\)/g).reverse()[0]
const filepath = process.argv[2].replace(filename, '')

const content = readFileSync(resolve(filepath, filename), 'utf-8')

const hashables = flatMap(f => f(content), [getScriptRefs, getStyleRefs])
    .filter(x => x.match(/\.(css|js|html)$/))

// Find hashables and make those long-term-cache

const timestamp = ((new Date).getTime()/1000).toFixed(0)
const fileWithTime = addTimestamp(timestamp)

const contentOutput = hashables.reduce((acc, h) => {
    // Rename files
    try {
        renameSync(join('./', filepath, h), join('./', filepath, fileWithTime(h)))
    } catch(e) {
        console.error(e)
    }

    return acc.replace(h, fileWithTime(h))
}, content).replace(/<head>([\s\S]*)<\/head>/, `<head>
    $1\t<meta http-equiv="expires" content="0">
</head>`)

// Persist content
writeFileSync(resolve(filepath, filename), contentOutput, 'utf-8')
