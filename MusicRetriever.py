import facebook
import json

OAUTH="CAACEdEose0cBAPZBg0AZBqOrub1FnMXgFURFuDZCsZA0YTiKBMDncZB6P3QbEbhC8234CX0H7zcEsXSqyXVyWUTUOpEIfteT76HoslrnhL7EMzOfUuU0j1uZA82bpAyG2mvbZCga6INxNA3APQX8gMfkLZC6ScMSs5oZD"

class Song:
    def __init__(self,resultStr):
        self.jsonObj = json.loads(json.dumps(resultStr))
        if('site_name' in self.jsonObj.keys()):
            self.siteName = self.jsonObj['site_name']
        if('description' in self.jsonObj.keys()):
            self.description = self.jsonObj['description']
        if('title' in self.jsonObj.keys()):
            self.title = self.jsonObj['title']
        if('title' in self.jsonObj.keys()):
            self.url = self.jsonObj['url']
        if('image' in self.jsonObj.keys()):
            self.imageUrl = self.jsonObj['image'][0]['url']

    def getSiteName(self):
        return self.siteName

    def getDescription(self):
        return self.description

    def getTitle(self):
        return self.title

    def getImageUrl(self):
        return self.imageUrl

    def getUrl(self):
        return getUrl

    def __str__():
        return self.getTitle() + "  " + self.getUrl() + "  "+  self.getImageUrl()


class MusicRetriever:
    def __init__(self,oauth=OAUTH):
        self.graph = facebook.GraphAPI(oauth)

    def getFriendsList(self):
        frsInfo = []
        result = self.graph.get_object("me/friends")
        resultObj = json.loads(json.dumps(result))
        for _frInfo in resultObj['data']:
            _name = _frInfo["name"]
            _id = _frInfo["id"]
            _fr = {}
            _fr[_id] = _name
            profileInfo = self.graph.get_object(_id)
            if("location" in profileInfo.keys()):
                locationInfo = self.graph.get_object(profileInfo["location"]["id"])
                _fr["location"] = locationInfo["location"]
            _fr["songInterest"] = self.getFriendsMusicInterests(_id)
            print json.dumps(_fr)
            frsInfo.append(_fr)
        return frsInfo

    def getFriendsMusicInterests(self,id,lim=10):
        result = self.graph.get_object(id+"/music.listens",limit=lim)
        songInterests = []
        for songs in result["data"]:
            songInterest = {}
            if("data" in songs.keys()):
                if("song" in songs["data"].keys()):
                    songId = songs["data"]["song"]["id"]
                    songInterest["songId"] = songId
                    result = self.graph.get_object(songId);
                    if('site_name' in result.keys()):
                        result['siteName'] = result['site_name']
                    if('description' in result.keys()):
                        result['description'] = result['description']
                    if('title' in result.keys()):
                        songInterest['title'] = result['title']
                    if('url' in result.keys()):
                        songInterest['url'] = result['url']
                    if('image' in result.keys()):
                        songInterest['imageUrl'] = result['image'][0]['url']
                    #songInterest["song"] = Song(self.graph.get_object(songId))
                    songInterest["publishTime"] = songs["publish_time"]
                    songInterests.append(songInterest)
        return songInterests

if __name__ == "__main__":
    retriever = MusicRetriever(oauth="CAACEdEose0cBAOXq1iDz2jvhXzED9yz2MUCxTpS3YEe0bGLb0HbNjy4GbRHX6CdLvl4NcTVNK7FeyPzZB1Gb3ub1KTmpZBZAEpPSxlz4vRyV8wNrWxE4otT9MXc4hE7HwnxAKhEIga5TqJ9v6z02v9uvBZCDG5zaU2Lw0AlfngZDZD")
    friendsInfo = retriever.getFriendsList()
    print json.dumps(friendsInfo)


            
        
            
