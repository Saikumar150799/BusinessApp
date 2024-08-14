#!/usr/bin/python3
import sys
import subprocess
import pprint
from lxml import etree
import io
import shutil
import json
from distutils.dir_util import copy_tree
import os

appName="thehousemonk"
path = "/Users/saikumar/work/app-org-folders/BusinessApp/" + appName
jsonFileFrom=open(path +"/organization.json")
jsonFileFromTOWrite=json.load(jsonFileFrom)


#                   *************** Step I *****************

#                       copy/replace resources folder


fromDirectory = path +"/resources"
toDirectory = "./resources"
copy_tree(fromDirectory, toDirectory)
print('Resources changes => Done !!')

# ***************** copy/replace googleService.json file ****************

formGoogleServiceFile=path +"/google-services.json"
toGoogleServiceFile="./platforms/android/app/google-services.json"
shutil.copy(formGoogleServiceFile,toGoogleServiceFile)
shutil.copy(formGoogleServiceFile,'./')
print ("GoogleService.json Changes")




# ***************** copy/replace GoogleService-Info.plist file ****************

# formGoogleServiceInfoFile=path +"/GoogleService-Info.plist"
# toGoogleServiceFile="./platforms/ios/GoogleService-Info.plist"
# shutil.copy(formGoogleServiceInfoFile,toGoogleServiceFile)
# shutil.copy(formGoogleServiceInfoFile,'./')
# print ("GoogleService-Info.plist changes")



#                       copy/replace  variable.scss file 

fromVAriableFile = path +"/variables.scss"
toFile = "./src/theme/variables.scss"
shutil.copy(fromVAriableFile,toFile)
    
print('Change theme => Done !!')



# Done *************  xml file Changes  *********************

file=open('./config.xml')
tree=etree.parse(file)
root=tree.getroot()

#  Update version
version = input("Enter next Version:\n") 

root[0].text=jsonFileFromTOWrite['appName']
root.attrib['id']=jsonFileFromTOWrite['appBundleId']
root.attrib['version']=version


data=etree.tostring(root)
string=data.decode('UTF-8')

writer =io.open('./config.xml','w',encoding="Utf-8")
writer.write(string)
    
print('xml File changes Done !!')


#************ platform and org changes *********************


ORGfile=open('./src/app/conatants/organization.json','r')
ORGFilereader=json.load(ORGfile)
ORGFilereader['appName']=jsonFileFromTOWrite['appName']
ORGFilereader['connectTo']=jsonFileFromTOWrite['connectTo']
ORGFilereader['buildFor']=jsonFileFromTOWrite['buildFor']
ORGFilereader['appBundleId']=jsonFileFromTOWrite['appBundleId']
ORGFilereader['orgName']=jsonFileFromTOWrite['orgName']
ORGFilereader['currencyCode']=jsonFileFromTOWrite['currencyCode']
ORGFilereader['countryCode']=jsonFileFromTOWrite['countryCode']
ORGFilereader['displayFooter']=jsonFileFromTOWrite['displayFooter']
ORGFilereader['HomePageRouting']=jsonFileFromTOWrite['HomePageRouting']
ORGFilereader['pages']=jsonFileFromTOWrite['pages']
ORGFilereader['oneSignalAppId']=jsonFileFromTOWrite['oneSignalAppId']
ORGFilereader['CommonAuth']=jsonFileFromTOWrite['CommonAuth']
ORGFilereader['appVersion']= version
if(jsonFileFromTOWrite['organizations']):
    ORGFilereader['organizations']=jsonFileFromTOWrite['organizations']


ORGfile=open('./src/app/conatants/organization.json','w')
json.dump(ORGFilereader,ORGfile, indent=4, separators=(",",": "))
print("Platform and Org Changes Done !")
ORGfile.close()



#  Run command 

apptype= input("Which type do you wanna build \n 1.Release \n 2.Debug: \n 3.Other: \n")

if (apptype.lower()=='release'):
    print('Initiating relese build')
    os.system("rm -rf www")
    os.system("ionic cordova build android --prod --release")

elif (apptype.lower()=='debug'):
    print('Initiating prod build')
    os.system("ionic cordova build android --prod")
else:
    os.system("ionic cordova run android --list")