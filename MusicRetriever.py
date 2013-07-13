import facebook
import json

OAUTH="CAACEdEose0cBAPZBg0AZBqOrub1FnMXgFURFuDZCsZA0YTiKBMDncZB6P3QbEbhC8234CX0H7zcEsXSqyXVyWUTUOpEIfteT76HoslrnhL7EMzOfUuU0j1uZA82bpAyG2mvbZCga6INxNA3APQX8gMfkLZC6ScMSs5oZD"

class Song:
    def __init__(self,resultStr):
        self.jsonObj = json.loads(json.dumps(resultStr))
        self.siteName = self.jsonObj['site_name']
        if('description' in self.jsonObj.keys()):
            self.description = self.jsonObj['description']
        self.title = self.jsonObj['title']
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
            frsInfo.append(_fr)
            _fr["songInterest"] = self.getFriendsMusicInterests(_id)
        return frsInfo

    def getFriendsMusicInterests(self,id,lim=10):
        result = self.graph.get_object(id+"/music.listens",limit=lim)
        songInterests = []
        for songs in result["data"]:
            songInterest = {}
            songId = songs["data"]["song"]["id"]
            songInterest["songId"] = songId
            songInterest["song"] = Song(self.graph.get_object(songId))
            songInterest["publishTime"] = songs["publish_time"]
            songInterests.append(songInterest)
        return songInterests

if __name__ == "__main__":
    retriever = MusicRetriever(oauth="CAACEdEose0cBAEySFT2FFSsYywF26eZAWdjzVg6ptDtzm8U9vWfiiDKcZBlRRvd9n2LKaRAXvcTCPwSF8RWZCvzHk8ZCZA91huVJZBUMAFtEuozosGD0rkuW6xy4cnkjXgYwscK6ZCWazgXzB2XYb4uZCo1FyxX71TMZD")
    friendsInfo = retriever.getFriendsList()
    print json.dumps(friendsInfo)


            
        
            
