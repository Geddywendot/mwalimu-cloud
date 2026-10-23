declare module 'fs' {
  export function existsSync(path: string): boolean
  export function readFileSync(path: string, encoding: string): string
}

declare module 'node:fs' {
  import fs from 'fs'
  export * from 'fs'
  export default fs
}

declare module 'path' {
  export function resolve(...args: string[]): string
  export function join(...args: string[]): string
}

declare module 'node:path' {
  import path from 'path'
  export * from 'path'
  export default path
}

declare const __dirname: string

declare namespace NodeJS {
  interface Process {
    argv: string[]
    exit(code?: number): never
  }
}

declare const process: NodeJS.Process
