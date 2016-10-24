"use strict";

//Load required modules
var AWS = require("aws-sdk");
var fs = require("fs");
var Promise = require("promise");
var exec = require("child_process").exec;
var redis = require("./redis.js");

var appQueueUrl = process.env.SHOPIFY_SQS_URL;
var bucketName = process.env.SHOPIFY_S3_BUCKET;

var sqs = new AWS.SQS({region: "us-east-1"});
var s3 = new AWS.S3({region : 'us-east-1', endpoint : 'https://s3.amazonaws.com'});
//Initialize variables
var waitFunction, createApp, receiveQueue, createConstantsFile, deleteMessageFromQueue, checkIfProjectAlreadyExists, buildApp, sendApkToS3, saveApkRedis, getIcon, sendIconToPath, getSplash, sendSplashToPath, generateResources, copyFiles, gulpApp, gulpControllers, gulpTabs = null;

waitFunction = function() {
    setTimeout(function() {
        receiveQueue();
    }, 1000);
};

checkIfProjectAlreadyExists = function(body){
    var promise = new Promise(function(resolve,reject){
        exec("cd /home/ubuntu/projects/" + body.apiKey + "/" + body.appName,function(err){
            if(err) resolve();
            else reject();
        });
    });
    
    return promise;
};

createApp = function(data, body) {
    checkIfProjectAlreadyExists(body)
    .then(function() {
        console.log("Creating app");
        var command = "cd /home/ubuntu/projects && mkdir " + body.apiKey + " && cd " + body.apiKey + " && ionic start " + body.appName + " blank && cd " + body.appName + " && mkdir resources && ionic platform add android && cd www && mkdir templates";
        console.log(command);
        exec(command, function(error) {
            if (error !== null) {
                waitFunction();
            } else {
                console.log("The app " + body.appName + " was created");
                createConstantsFile(data, body);
            }
        });
    })
    .catch(function() {
        console.log("The app " + body.appName + " is already created");
        createConstantsFile(data, body);
    });
};

createConstantsFile = function(data, body) {
    console.log("Creating constants");
	var str = "angular.module('shopifyVars',[])\n.constant('baseUrl','" + process.env.SHOPIFY_WEBSERVICE_URL + "').constant('apiKey','" + body.apiKey + "').value('collections'," + JSON.stringify(body.selectedCollections) + ");";
	fs.writeFileSync("/home/ubuntu/projects/" + body.apiKey + "/" + body.appName + "/www/js/vars.js", str, "utf8");
	getIcon(data,body);
};

getIcon = function(data,body){
    console.log("Getting Icon");
    var str = body.iconUrl;
    var index = str.lastIndexOf("/");
    var key = str.substr(index+1);

    var params = {
        Bucket : bucketName,
        Key : key
    };

    s3.getObject(params,function(err,res){
        if(err) waitFunction();
        else sendIconToPath(data,body,res.Body)
    })
};

sendIconToPath = function(data,body,buffer){
    console.log("Setting icon");
    var path = "/home/ubuntu/projects/" + body.apiKey + "/" + body.appName + "/resources/icon.png";
    fs.writeFileSync(path,buffer,'utf8');
    getSplash(data,body);
};

getSplash = function(data,body){
    console.log("Getting Splash");
    var str = body.splashUrl;
    var index = str.lastIndexOf("/");
    var key = str.substr(index+1);

    var params = {
        Bucket : bucketName,
        Key : key
    };

    s3.getObject(params,function(err,res){
        if(err) waitFunction();
        else sendSplashToPath(data,body,res.Body)
    })
};

sendSplashToPath = function(data,body,buffer){
    console.log("Setting Splash");
    var path = "/home/ubuntu/projects/" + body.apiKey + "/" + body.appName + "/resources/splash.png";
    fs.writeFileSync(path,buffer,'utf8');
    generateResources(data,body);
};

generateResources = function(data,body){
    console.log("Generating Resources");
    var command = "cd /home/ubuntu/projects/" + body.apiKey + "/" + body.appName + "/ && ionic resources";
    exec(command,function(err,s,s2){
        console.log(err);
        console.log(s);
        console.log(s2);
        if(err) waitFunction();
        else copyFiles(data,body);
    });
};

copyFiles = function(data,body){
    console.log("Copying files");
    var rootFolder = "cd /home/ubuntu/projects/" + body.apiKey + "/" + body.appName + "/www && ";
    var index = "cp /home/ubuntu/sqsHandler/www/index.html index.html && cd css && ";
    var style = "cp /home/ubuntu/sqsHandler/www/css/style.css style.css && cd .. && cd templates && ";
    var templates = "cp /home/ubuntu/sqsHandler/www/templates/tab-collection.html tab-collection.html";
    exec(rootFolder + index + style + templates,function(err){
        if(err) waitFunction();
        else gulpApp(data,body);
    });
};

gulpApp = function(data,body){
    console.log("Gulp App");
    var path = "/home/ubuntu/projects/" + body.apiKey + "/" + body.appName + "/www/js";
    var command = "cd /home/ubuntu/sqsHandler && gulp app.js --size=" + body.selectedCollections.length + " --path=\"" + path + "\"";
    exec(command,function(err){
        if(err) waitFunction();
        else gulpControllers(data,body);
    })
};

gulpControllers = function(data,body){
    console.log("Gulp Controllers");
    var titles = "--title1=\"" + body.selectedCollections[0].title + "\" ";
    if(body.selectedCollections.length > 1) titles = titles + "--title2=\"" + body.selectedCollections[1].title + "\" ";
    if(body.selectedCollections.length > 2) titles = titles + "--title3=\"" + body.selectedCollections[2].title + "\" ";
    if(body.selectedCollections.length > 3) titles = titles + "--title4=\"" + body.selectedCollections[3].title + "\" ";
    console.log(titles);
    var path = "/home/ubuntu/projects/" + body.apiKey + "/" + body.appName + "/www/js";
    var command = "cd /home/ubuntu/sqsHandler && gulp controllers.js --size=" + body.selectedCollections.length + " --path=\"" + path + "\" " + titles;
    console.log(command);
    exec(command,function(err){
        if(err) waitFunction();
        else gulpTabs(data,body);
    })
};

gulpTabs = function(data,body){
    console.log("Gulp Tabs");
    var titles = "--title1=\"" + body.selectedCollections[0].title + "\" --icon1=\"" + body.selectedCollections[0].icon + "\" ";
    if(body.selectedCollections.length > 1) titles = titles + "--title2=\"" + body.selectedCollections[1].title + "\" --icon2=\"" + body.selectedCollections[1].icon + "\" ";
    if(body.selectedCollections.length > 2) titles = titles + "--title3=\"" + body.selectedCollections[2].title + "\" --icon3=\"" + body.selectedCollections[2].icon + "\" "
    if(body.selectedCollections.length > 3) titles = titles + "--title4=\"" + body.selectedCollections[3].title + "\" --icon4=\"" + body.selectedCollections[3].icon + "\" "
    console.log(titles);
    var path = "/home/ubuntu/projects/" + body.apiKey + "/" + body.appName + "/www/templates";
    var command = "cd /home/ubuntu/sqsHandler && gulp tabs --size=" + body.selectedCollections.length + " --path=\"" + path + "\" " + titles;
    console.log(command);
    exec(command,function(err){
        if(err) waitFunction();
        else buildApp(data,body);
    })
};

buildApp = function(data,body){
    console.log("building app");
    var command = "cd /home/ubuntu/projects/" + body.apiKey + "/" + body.appName + "/ && ionic build android --debug";
    exec(command,function(error){
        if(error !== null){
            waitFunction();
        }else{
            sendApkToS3(data,body);
        }
    });
};

sendApkToS3 = function(data,body){
    var path = "/home/ubuntu/projects/" + body.apiKey + "/" + body.appName + "/platforms/android/build/outputs/apk/android-debug.apk";
    var buffer = fs.readFileSync(path);
    console.log(path);

    var key = body.apiKey + "/android-debug.apk";

    var params = {
        Body : buffer,
        ACL : 'public-read',
        Bucket : bucketName,
        Key : key,
        ContentType : 'application/vnd.android.package-archive'
    };

    s3.putObject(params, function(err) {
        console.log("Mandando para a s3");
        console.log(err);
        if (err) waitFunction();
        else saveApkRedis(data,body,"https://shopify-app-generator.s3.amazonaws.com/" + key);
    });
};

saveApkRedis = function(data,body,url){
    console.log("Salvando no Redis");
    redis.client.set("app:" + body.apiKey + ":apk",url,function(){
        deleteMessageFromQueue(data, 0);
    });
};

deleteMessageFromQueue = function(data, trys) {
	console.log(data);
    var params = {
        QueueUrl: appQueueUrl,
        ReceiptHandle: data.Messages[0].ReceiptHandle
    };

    sqs.deleteMessage(params, function(err) {
        if (err) {
            trys++;
            if (trys < 5) {
                setTimeout(function() {
                    deleteMessageFromQueue(data, trys);
                }, 500);
            } else {
                waitFunction();
            }
        } else {
            waitFunction();
        }
    });
};

receiveQueue = function() {
	var params = {
        QueueUrl: appQueueUrl,
        VisibilityTimeout: 30,
        MaxNumberOfMessages: 1,
    };

    sqs.receiveMessage(params, function(err, data) {
        if (err) {
            waitFunction();
        } else {
            if (typeof data.Messages === "undefined") {
                waitFunction();
            } else {
                console.log(data.Messages[0]);
                var body = JSON.parse(data.Messages[0].Body);
                switch (body.action) {
                    case "createApp":
                        createApp(data, body);
                        break;
                    default:
                        deleteMessageFromQueue(data, 0);
                        break;
                }
            }
        }
    });
};

waitFunction();
