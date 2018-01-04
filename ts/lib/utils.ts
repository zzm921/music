import { createHash, randomBytes } from "crypto"
import { ReqError } from "../lib/reqerror"
import fs = require("fs")
import * as path from "path"

const mv = require('mv')
// import * as child_process from "child_process"

export function checkPassword(real: string, current: string): void {
    let [a, b] = [real.length === 32 ? real : md5sum(real), current.length === 32 ? current : md5sum(current)]
    if (a !== b)
        throw new ReqError("密码不正确！", 400)
}

export function randomInt(from: number, to: number) {
    return Math.floor(Math.random() * (to - from) + from)
}

export function md5sum(str: string): string {
    return createHash('md5').update(str).digest("hex")
}

export function getSalt(): string {
    return randomBytes(16).toString('base64');
}

export function sleepAsync(ms: number): Promise<void> {
    return new Promise<void>(resolve => setTimeout(() => resolve(), ms))
}

export function getPageCount(page: string, count?: string) {
    let limit = parseInt(count)
    let cursor = 0
    if (page) {
        cursor = parseInt(page) * parseInt(count)
    }
    return { cursor, limit }
}

export function checkCursorLimit(cursor: number, limit: number) {
    if (cursor > -1 && limit > 0)
        return false
    return true
}

export async function checkreq(param: Array<any>, sign: string, next: any) {
    param.sort()
    let s = param.join(",")
    if (sign === md5sum(s)) {
        return next()
    }
    return "参数错误!"
}



export function getSign(order: any, key: string) {
    delete order.sign
    let arr = new Array<any>()
    for (let k in order) {
        arr.push(`${k}=${order[k]}`)
    }
    arr.sort()
    arr.push(`key=${key}`)
    return md5sum(arr.join("&")).toUpperCase()
}
export function numcheckundefined(num: any) {
    if (num == undefined) num = 0
    return num
}
export function strcheckundefined(str: any) {
    if (str == undefined) str = ''
    return str
}
export function getRendomQuestions(num: number, arr: any[]) {
    let indexarr: number[], resarr: any[]
    if (num < arr.length) {
        while (indexarr.length < num) {     //取num个小于arr.length的不重复随机数字
            let i = Math.round(Math.random() * (arr.length - 1))
            for (let j = 0; j < indexarr.length; j++) {
                if (i == indexarr[j]) break
                else if (j == indexarr.length - 1) indexarr.push(i)
            }
        }
        for (let i = 0; i < num; i++) {    //根据获取的随机送取得arr中的数据
            if (i >= arr.length) break
            resarr.push(arr[indexarr[i]])
        }
    } else {
        resarr = arr
    }
    return resarr
}

export function getLog(): Promise<any> {
    return new Promise(resolve => {
        let logpath = path.join(__dirname, "..", "..", "logs", "warn.log")
        console.log(logpath)
        fs.readFile(logpath, function (err, data) {
            resolve({ log: data ? data.toString() : "" })
        })
    })
}

export function md5(str: string): string {
    return createHash('md5').update(str).digest("hex")
}

export function accessAsync(path: string, mode = fs.constants.F_OK) {
    return new Promise(resolve => fs.access(path, mode, err => {
        if (err)
            return resolve(false)
        return resolve(true)
    }))
}

export function mkdirAsync(path: string) {
    return new Promise((resolve, reject) => fs.mkdir(path, err => {
        if (err)
            return reject(err)
        return resolve()
    }))
}

export function moveAsync(oldPath: string, newPath: string) {
    return new Promise((resolve, reject) => mv(oldPath, newPath, function (err: any) {
        if (err) {
            return reject(err)
        }
        return resolve()
    }))
}

export function renameAsync(oldPath: string, newPath: string) {
    return new Promise((resolve, reject) => fs.rename(oldPath, newPath, err => {
        if (err) {
            return reject(err)
        }
        return resolve()
    }))
}

export function copyAsync(oldPath: string, newPath: string) {
    return new Promise((resolve, reject) => {
        try {
            let data = fs.readFileSync(oldPath)
            fs.writeFileSync(newPath, data)
            return resolve()
        } catch (error) {
            return reject(error)
        }

    })
}

export function removeAsync(path: string) {
    return new Promise(resolve => fs.unlink(path, err => resolve()))
}

export function removeDirAsync(path: string) {
    return new Promise(resolve => fs.rmdir(path, err => resolve()))
}




import { Encrypt } from './crypto'
import http = require('http')
import querystring = require('querystring')

function randomUserAgent() {
    const userAgentList = [
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36',
        'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1',
        'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1',
        'Mozilla/5.0 (Linux; Android 5.0; SM-G900P Build/LRX21T) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Mobile Safari/537.36',
        'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Mobile Safari/537.36',
        'Mozilla/5.0 (Linux; Android 5.1.1; Nexus 6 Build/LYZ28E) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Mobile Safari/537.36',
        'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_2 like Mac OS X) AppleWebKit/603.2.4 (KHTML, like Gecko) Mobile/14F89;GameHelper',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/603.2.4 (KHTML, like Gecko) Version/10.1.1 Safari/603.2.4',
        'Mozilla/5.0 (iPhone; CPU iPhone OS 10_0 like Mac OS X) AppleWebKit/602.1.38 (KHTML, like Gecko) Version/10.0 Mobile/14A300 Safari/602.1',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.12; rv:46.0) Gecko/20100101 Firefox/46.0',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:46.0) Gecko/20100101 Firefox/46.0',
        'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.0)',
        'Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.0; Trident/4.0)',
        'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0)',
        'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Win64; x64; Trident/6.0)',
        'Mozilla/5.0 (Windows NT 6.3; Win64, x64; Trident/7.0; rv:11.0) like Gecko',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/13.10586',
        'Mozilla/5.0 (iPad; CPU OS 10_0 like Mac OS X) AppleWebKit/602.1.38 (KHTML, like Gecko) Version/10.0 Mobile/14A300 Safari/602.1'
    ]
    const num = Math.floor(Math.random() * userAgentList.length)
    return userAgentList[num]
}
export async function createWebAPIRequest(host: any, path: any, method: any, data: any) {
    return new Promise((resolve, reject) => {
        let music_req = ''
        const cryptoreq = Encrypt(data)
        const http_client = http.request(
            {
                hostname: host,
                method: method,
                path: path,
                headers: {
                    Accept: '*/*',
                    'Accept-Language': 'zh-CN,zh;q=0.8,gl;q=0.6,zh-TW;q=0.4',
                    Connection: 'keep-alive',
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Referer: 'http://music.163.com',
                    Host: 'music.163.com',
                    Cookie: 'appver=1.5.2',
                    'User-Agent': randomUserAgent()
                }
            },
            function (res: any) {
                res.on('error', function (err: any) {
                    reject(err)
                })
                res.setEncoding('utf8')
                if (res.statusCode != 200) {
                    createWebAPIRequest(host, path, method, data)
                    return
                } else {
                    res.on('data', function (chunk: any) {
                        music_req += chunk
                    })
                    res.on('end', function () {
                        if (music_req == '') {
                            createWebAPIRequest(host, path, method, data)
                            return
                        }
                        resolve(music_req)
                    })
                }
            }
        )
        http_client.write(
            querystring.stringify({
                params: cryptoreq.params,
                encSecKey: cryptoreq.encSecKey
            })
        )
        http_client.end()
    })
}



export async function getFile(url: string): Promise<any> {
    return new Promise((resolve, reject) => {
        let http_client = http.get(url, function (res) {
            res.on('error', function (err: any) {
                reject(err)
            })
            res.setEncoding('base64')
            let data = ''
            res.on('data', function (chunk: any) {
                data += chunk
            })
            res.on('end', function () {
                resolve(data)
            })
        })
        http_client.end()
    })
}