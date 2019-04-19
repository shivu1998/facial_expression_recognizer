from pymongo import MongoClient
import os
import sys
import collections
import json
from apiclient.discovery import build
import numpy
import cv2

api_key="your youtube api key"
youtube=build("youtube","v3",developerKey=api_key)
#print(json.dumps(res['items']))
connection = MongoClient("localhost",27017);
db=connection.fer
good=['Surprised','Happy','Neutral']
videos=[]
user=db.users.find_one({"email_id":sys.argv[1]})

for video in user['watched']:
        if video is not None:
            vid=video['videoId']
            reactions=video['reactions'][0]
            #reactions={value:key for key,value in reactions.items()}
            for k,v in reactions.items():
                if max(reactions.values()) == v:
                    react=k
            if react in good:
                try:
                    res=youtube.search().list(part='snippet',relatedToVideoId=vid,type='video',maxResults=10).execute()
                    videos.append(res['items'])
                except:
                    continue


print(json.dumps(videos))
sys.stdout.flush()
