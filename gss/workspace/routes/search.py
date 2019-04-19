import sys
import collections
import json
from apiclient.discovery import build
import numpy

api_key="your youtube api key"
youtube=build("youtube","v3",developerKey=api_key)
res=youtube.search().list( part='snippet',q=sys.argv[1],type='video',maxResults=50).execute()
print(json.dumps(res['items']))
sys.stdout.flush()