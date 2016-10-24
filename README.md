# Shopify Android App Generator
This project was created for the VanHackathon that occurred from october 21st to 23rd, 2016. The challenge suggested by Shopify was to make commerce better for everyone.

## About
With this project a Shopify store owner will be able to generate an android application to list products from up to four collections. The user has to follow a few simple steps to get his apk:

1. Go to the admin area of the store and generate a private app
2. Copy the api key, api password and store hostname
3. Go to this [website](http://shopify-apk-generator.s3-website-us-east-1.amazonaws.com)
4. Enter the information on the wizard
5. Select what collections you want to show on the application
6. Add an icon for each collection. The list of available icons can be found [here](http://ionicons.com/)
7. Upload an icon and a splash screen
8. When the wizard is done wait a few minutes while the apk is generated and refresh the page. The link to your application will appear there

## Technology
There is three main components on this project, they are described below. Here is a picture of how everything works:
![Image of Yaktocat](https://s3.amazonaws.com/shopify-apk-generator/img/architecture.png)

The user access the website which is hosted on a bucket on AWS S3. While the user walks through the wizard a few requisitions is made to the webservice on an EC2 machine, the webservice stores information on redis, which is a in memory database for caching information. When the user finishes the wizard the webservice sends a message to AWS SQS, separeted from the webservice there is another application on the EC2 machine pooling the SQS messages, this application is responsible for creating an ionic project, add an android platform and use gulp tasks to create routes and change layout for the application, lastly but not least the apk is generated and send it to S3 so the user can download his app.

## Reproducing the code
For the challenge i used a m4.xlarge instance with 16GB of memory and ubuntu installed. Is nice to have a good machine at hand so our apks will be ready fast. I used AWS spot instances, although they are not reserved the are 90% cheaper than on demand machines and you can always start a new one if your current machine goes down, at least for this demo purpose. You will also need to increase EBS volume size to at least 20GB since android sdk occupies a lot of space. Then you will have to follow the steps below: 

1 - Install Java
```
sudo apt-get update
sudo apt-get install default-jre
sudo apt-get install default-jdk
```
2 - Install Android SDK
```
wget http://dl.google.com/android/android-sdk_r24.2-linux.tgz
tar -xvf android-sdk_r24.2-linux.tgz
cd android-sdk-linux/tools
./android update sdk --no-ui
sudo apt-get install lib32stdc++6 lib32z1
```
3 - Install Node.js
```
curl -sL https://deb.nodesource.com/setup_4.x | sudo -E bash -
sudo apt-get install -y nodejs
```
4 - Install npm packages
```
sudo npm install -g cordova@6.0.0
sudo npm install -g ionic
sudo npm install -g pm2
sudo npm install -g gulp
```
5 - Pre-Redis installation
```
sudo apt-get install make
sudo apt-get install gcc
cd ~
```
6 - Install Redis
```
wget http://download.redis.io/releases/redis-3.2.4.tar.gz
tar xzf redis-3.2.4.tar.gz
cd redis-3.2.4/deps
make hiredis jemalloc linenoise lua geohash-int
cd ..
make
```
7 - Use redis service installer to generate a redis config file and an /etc/init.d script. This scripts should be run as root
```
cd utils
sudo su
./install_server.sh
```
8 - When asked this is the path you should write and your redis server will be up and running on localhost
```
/home/ubuntu/redis-3.2.4/src/redis-server
```
9 - To finish lets export some environment variables
```
vim ~/.bash_profile
export PATH=${PATH}:$HOME/android-sdk-linux/platform-tools:$HOME/android-sdk-linux/tools:$HOME/android-sdk-linux/build-tools/23.0.1
export ANDROID_HOME=$HOME/android-sdk-linux
export SHOPIFY_REDIS_HOST=localhost
export SHOPIFY_WEBSERVICE_URL=htpp://MACHINE_IP/webservice
source ~/.bash_profile
```
10 - Create an SQS QUEUE
