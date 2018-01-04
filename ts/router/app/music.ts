import { RouterWrap } from "../../lib/routerwrap"
import { BaseHandler } from "../lib/basehandler"
import musicUtil = require("../../lib/music")
export const router = new RouterWrap({ prefix: "/musicapi" })
// const captchapng = require("captchapng")


export class Music extends BaseHandler {
    //登录
    public static async Search(req: any): Promise<any> {

        let keywords = req.query.keywords;
        let type = req.query.type || 1;
        let limit = req.query.limit || 100;
        let offset = req.query.offset || 0;
        let data = { csrf_token: "", limit, type, s: keywords, offset };
        let obj = { data }
        let result = JSON.parse(await musicUtil.search(obj))
        let ids = []
        for (let s of result.result.songs) {
            ids.push(s.id)
        }
        //处理数据
        let data2 = {
            ids: ids,
            br: 999000,
            csrf_token: ''
        }
        let obj2 = { data: data2 }
        let result2 = JSON.parse(await musicUtil.SongUrl(obj2))
        let map = new Map()
        for (let s of result2.data) {
            map.set(s.id, s.url)
        }

        for (let s of result.result.songs) {
            s.rUrl = map.get(s.id)
        }
        return result
    }

    public static async Album(req: any): Promise<any> {
        let data = {
            csrf_token: ''
        }
        let id = req.query.id
        let obj = { data, id }
        let result = await musicUtil.ablum(obj)
        return result
    }

    public static async highqualitylist(req: any): Promise<any> {
        const data = {
            cat: req.query.cat || "全部",
            offset: req.query.offset || 0,
            limit: req.query.limit || 20,
            csrf_token: ""
        };
        let obj = { data }
        let result = await musicUtil.highqualitylist(obj)
        return result
    }

    public static async SongDetail(req: any): Promise<any> {
        let id = parseInt(req.query.ids)
        //获取歌曲详情
        let data1 = {
            // "id": id,
            c: JSON.stringify([{ id: id }]),
            ids: '[' + id + ']',
            csrf_token: ''
        }
        let obj1 = { data: data1 }
        let result1 = JSON.parse(await musicUtil.SongDetail(obj1))
        //获取url
        let data2 = {
            ids: [id],
            br: 999000,
            csrf_token: ''
        }
        let obj2 = { data: data2 }
        let result2 = JSON.parse(await musicUtil.SongUrl(obj2))
        let result = { "songId": "", "songName": "", "authorName": "", "authorId": "", "albumName": "", "albumId": "", "albumImg": "", "url": "", }
        let song = result1.songs[0]
        result.songId = song.id
        result.songName = song.name
        result.authorId = song.ar[0].id
        result.authorName = song.ar[0].name
        result.albumId = song.al.id
        result.albumName = song.al.name
        result.albumImg = song.al.picUrl
        result.url = result2.data[0].url
        return result
    }


    public static async getUrls(req: any): Promise<any> {
        let ids = JSON.parse(req.query.ids)
        let br = req.query.br || 999000
        let data2 = {
            ids: ids,
            br: br,
            csrf_token: ''
        }
        let obj2 = { data: data2 }
        let result2 = JSON.parse(await musicUtil.SongUrl(obj2))
        return result2
    }
}


/**
 * 图片上传
 */
router.handle("get", "/search", async (ctx, next) =>
    BaseHandler.handlerResult(ctx, await Music.Search(ctx.request)))

router.handle("get", "/ablum", async (ctx, next) =>
    BaseHandler.handlerResult(ctx, await Music.Album(ctx.request)))

router.handle("get", "/songDetail", async (ctx, next) =>
    BaseHandler.handlerResult(ctx, await Music.SongDetail(ctx.request)))

router.handle("get", "/highqualitylist", async (ctx, next) =>
    BaseHandler.handlerResult(ctx, await Music.highqualitylist(ctx.request)))


router.handle("get", "/getsongUrls", async (ctx, next) =>
    BaseHandler.handlerResult(ctx, await Music.getUrls(ctx.request)))