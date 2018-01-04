/// <reference path="../typings/index.d.ts" />

import { createServer } from "http"
import { getApp } from "./init"
async function main() {
    let app = await getApp()
    let port = parseInt(process.env.PORT) || 3001
    createServer(app.callback()).listen(port)
    console.log("start on port 3001")
}
main()