import { createWebAPIRequest } from "./utils"

export async function search(obj: any): Promise<any> {
    return await createWebAPIRequest(
        "music.163.com",
        "/weapi/search/get",
        "POST",
        obj.data
    )
}

export async function ablum(obj: any): Promise<any> {

    return await createWebAPIRequest(
        'music.163.com',
        `/weapi/v1/album/${obj.id}`,
        'POST',
        obj.data
    )
}

export async function SongDetail(obj: any): Promise<any> {
    return await createWebAPIRequest(
        'music.163.com',
        '/weapi/v3/song/detail',
        'POST',
        obj.data
    )
}


export async function SongUrl(obj: any): Promise<any> {
    return await createWebAPIRequest(
        'music.163.com',
        '/weapi/song/enhance/player/url',
        'POST',
        obj.data
    )
}


export async function highqualitylist(obj: any): Promise<any> {
    return await createWebAPIRequest(
        "music.163.com",
        "/weapi/playlist/highquality/list",
        "POST",
        obj.data
    )
}

