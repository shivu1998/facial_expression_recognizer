from imutils.video import VideoStream
import numpy as np
from tqdm import tqdm
import imutils
import time
import cv2
import os
from datetime import datetime
import sys
import json
import collections
import json
from apiclient.discovery import build
from pymongo import MongoClient
import gridfs
from bson.objectid import ObjectId
import keras
from keras.preprocessing import image
from keras.applications.vgg16 import preprocess_input
from keras.models import model_from_json
from imutils.video import WebcamVideoStream
from imutils.video import FPS
import win32com.client as wincl
import threading
speak=wincl.Dispatch("SAPI.SpVoice")

api_key="AIzaSyCVHp-sceFLnk_-XuuvEhZX9VytMb2blVc"
youtube=build("youtube","v3",developerKey=api_key)
#res=youtube.videos().list(part='snippet,contentDetails,statistics',chart='mostPopular',regionCode='IN',videoCategoryId='',maxResults=15).execute() 
connection = MongoClient("localhost",27017);
db=connection.fer
fs= gridfs.GridFS(db)
di="C:\\Users\\shivu\\Anaconda2\\Desktop\\capture\\"
os.chdir("C:\\Users\\shivu\\Anaconda2\\Desktop\\capture\\")
adam=keras.optimizers.Adam(lr=0.0001, beta_1=0.9, beta_2=0.999, epsilon=None, decay=0.0, amsgrad=False)
json_file = open('C:\\Users\\shivu\\Anaconda2\\Desktop\\models\\first\\aug_model.json', 'r')
loaded_model_json = json_file.read()
json_file.close()
loaded_model_json = model_from_json(loaded_model_json)
loaded_model_json.load_weights("C:\\Users\\shivu\\Anaconda2\\Desktop\\models\\first\\aug_model.h5")
loaded_model_json.compile(loss='categorical_crossentropy',optimizer=adam,metrics=['accuracy'])
result={"Afraid":0,"Angry":0,"Disgusted":0,"Happy":0,"Neutral":0,"Sad":0,"Surprised":0}
emotions=["Afraid","Angry","Disgusted","Happy","Neutral","Sad","Surprised"]

slice_data=[]


#clearing the folder before capturing video frames.
for file in os.listdir(di):
    if os.path.isfile(di+file):
        os.unlink(di+file)


prototxt='F:\\nodeapp\\gss\\workspace\\deploy.prototxt.txt'
model="F:\\nodeapp\\gss\\workspace\\res10_300x300_ssd_iter_140000.caffemodel"
net = cv2.dnn.readNetFromCaffe(prototxt,model)

# initialize the video stream and allow the cammera sensor to warmup
#print("[INFO] starting video stream...")
time.sleep(1)
vs = WebcamVideoStream(src=0).start()
fps=FPS().start()
speak.Speak("Starting Video capturing")
count=0

def predictFile(file):
    if os.path.isfile(file):
        try:
            img=image.load_img(file,color_mode="grayscale",target_size=(64,64))
            img_tensor = image.img_to_array(img)
            img_tensor=img_tensor/255
            img_tensor = img_tensor.reshape((1,)+img_tensor.shape)
            res=loaded_model_json.predict(img_tensor)
            index=np.argmax(res)
            return emotions[index]
        except:
            pass




# loop over the frames from the video stream
while True:
    
   # grab the frame from the threaded video stream and resize it
    # to have a maximum width of 400 pixels
    frame = vs.read()
    frame = imutils.resize(frame, width=400)
 
    # grab the frame dimensions and convert it to a blob
    (h, w) = frame.shape[:2]
    blob = cv2.dnn.blobFromImage(cv2.resize(frame, (300, 300)), 1.0,
        (300, 300), (104.0, 177.0, 123.0))
 
    # pass the blob through the network and obtain the detections and
    # predictions
    net.setInput(blob)
    detections = net.forward()

    # loop over the detections
    for i in range(0, detections.shape[2]):
        # extract the confidence (i.e., probability) associated with the
        # prediction
        confidence = detections[0, 0, i, 2]

        # filter out weak detections by ensuring the `confidence` is
        # greater than the minimum confidence
        if confidence < 0.9:
            continue

        # compute the (x, y)-coordinates of the bounding box for the
        # object
        box = detections[0, 0, i, 3:7] * np.array([w, h, w, h])
        (startX, startY, endX, endY) = box.astype("int")
 
        # draw the bounding box of the face along with the associated
        # probability
        text = "{:.2f}%".format(confidence * 100)
        y = startY - 10 if startY - 10 > 10 else startY + 10
        file=frame[startY:endY,startX:endX]
        cv2.rectangle(frame, (startX, startY), (endX, endY),
            (255, 255, 255))
          
        file_name=di+str(datetime.now().microsecond)+str(count)+".jpg"
        cv2.imwrite(file_name,file)
        img_res=predictFile(file_name)
        if img_res is not None:
            result[img_res]+=1
        cv2.putText(frame,img_res, (startX, y),
            cv2.FONT_HERSHEY_SIMPLEX, 0.45, (0,0, 255))
        
        
        datafile = open(file_name,"rb")
        d=datafile.read()
        stored = fs.put(d, filename=file_name)
        count+=1
        # print(file_name)
        # cv2.imwrite(file_name,file)

    fps.update()    
    # show the output frame
    cv2.imshow("Frame", frame)
    key = cv2.waitKey(3) & 0xFF
 
    # if the `q` key was pressed, break from the loop
    if key == ord("q"):
                WebcamVideoStream(src=0).stop()
                break
fps.stop()        
cv2.destroyAllWindows()
vs.stop()

# def Speak(res):
#     if res=="Happy":
#         speak.Speak("Happy")
##def predict(path):
##    if os.path.isfile(path):
##        img=image.load_img(path, target_size=(224, 224))
##        x = image.img_to_array(img)
##        np.expand_dims(x, axis=0)
##        x = preprocess_input(x)
##        x = np.reshape(x, (1, 224, 224, 3))
##        prediction = loaded_model_json.predict(x)
##        order = np.argsort(prediction)[0,:]
##        tag_dict = {0: 'Angry', 1: 'Sadness', 2: 'Surprise', 3: 'Happiness', 4: 'Disgust', 5: 'Fear', 6: 'Neutral'}
##        #print tag_dict
##        return tag_dict[order[-1]]



files=fs.list()

db.videos.update({'_id':ObjectId(sys.argv[1])},{'$push':{"imageFiles":files}})
video=db.videos.find_one({'_id':ObjectId(sys.argv[1])})
db.users.update({"email_id":sys.argv[2]},{'$push':{"watched":video}})

def store():
    #print("inside storing")
    #appending all the files to slice_data for predicting.
    data=db.users.aggregate([{"$unwind":"$watched"},{"$match":{"watched._id":ObjectId(sys.argv[1])}},{"$project":{"watched.imageFiles":1,"watched._id":1,"_id":0}}])
    for i in data:
        for d in i['watched']['imageFiles'][0]:
            slice_data.append(d)
    #print("slice_data=",slice_data)

store()


db.videos.update({'_id':ObjectId(sys.argv[1])},{'$push':{'reactions':result}})
video=db.videos.find_one({'_id':ObjectId(sys.argv[1])})
db.users.update({"email_id":sys.argv[2],"watched":{"$elemMatch":{"_id":ObjectId(sys.argv[1])}}},{"$set":{"watched.$":video}})
db.fs.files.remove({})
db.fs.chunks.remove({})
connection.close()
sys.stdout.flush()
speak.Speak("Image processing finished")