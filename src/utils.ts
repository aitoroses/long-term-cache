
export function flatMap(mapper, a: any[]): any[] {
    return a.reduce((acc, a) => acc.concat(mapper(a)), [])
}

let scriptRegex = /(<script[\s]*src=")(.*)(".*<\/script>)/g
let styleRegex = /(<link.*href=")(.*)(".*\/>)/g

const getReferences = (reg: RegExp, group: string) => function(html: string): string[] {
    return (html.match(reg) || [])
        .map(m => m.replace(reg, group))
}

export const getScriptRefs = getReferences(scriptRegex, '$2')
export const getStyleRefs = getReferences(styleRegex, '$2')

export const addTimestamp = (timestamp) => (filename: string) => {
    let s = filename.split('.').reverse()
    return [...s.slice(0, 1), timestamp, ...s.slice(1)]
        .reverse().join('.')
}
