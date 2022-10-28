
var http = require('http');
var fs = require('fs');
var url = require('url');
var requestIp = require('request-ip');

var formidable = require('formidable');

var hostname = '210.117.128.200';
var port = '8053';

const { exec } = require('child_process');


http.createServer(function(req, res) {
   
    var _url = req.url;
    var ip = requestIp.getClientIp(req)
    function ip_long(ip){
        var ips = ip.split('.');
        var iplong = 0;
        with(Math){
            iplong= 
                ips[0]*pow(256,3)+
                ips[1]*pow(256,2)+
                ips[2]*pow(256,1)+
                ips[3]*pow(256,0);
        }
        return iplong;
    }
    var userIp = ip_long(ip)
    //if(typeof queryData.A !== "undefined"){
        //var queryData = url.parse(_url, true).query;
    var upload_line = fs.readFileSync('fileupload.html');
    var upload_bar = fs.readFileSync('fileupload_second.html');
    //var upload_html2 = fs.readFileSync('hoolly.html')
    var upload_path = `/Users/selab/vscode-workspace/Web_with_R/userFile/`;
    
    const s = `ip=${userIp} userfilename=${userIp}`
    console.log(s)

    function exeCMD(s){
        return new Promise(function(resolve,reject){
            exec(`R CMD BATCH --no-save --no-restore "--args ${s}" mk_line.R mk_line.Rout`, (err, stdout, stderr) => {
                if (err || stderr) {
                // node couldn't execute the command
                    console.log("cmd execute waiting")
                    //res.write(upload_html);
                    resolve();
                }
                else{
                    console.log("image making") 
                    resolve();
                } 
            });
        });
    }
    function exeCMD2(s){
        return new Promise(function(resolve,reject){
            exec(`R CMD BATCH --no-save --no-restore "--args ${s}" mk_bar.R mk_bar.Rout`, (err, stdout, stderr) => {
                if (err || stderr) {
                // node couldn't execute the command
                    console.log("cmd execute waiting")
                    //res.write(upload_html);
                    resolve();
                }
                else{
                    console.log("image making") 
                    resolve();
                } 
            });
        });
    }

    async function deleteImg(){
        fs.unlink('myplot.jpg',(err)=>{ 
            if(err) console.log('image delete fail')
            else{ console.log('image deleted');
            }
        })
    }

    function readURL(){
        return new Promise(function(resolve,reject){ 
            if(req.url == '/'){
                fs.readFile('fileupload_main.html', function(err, data) {
                    res.writeHead(200, {'Content-Type': 'text/html'});
                    res.write(data);
                    console.log("html upload");
                    resolve();
                    return res.end();
                });
            }
            else if(req.url == '/line'){
                fs.readFile('fileupload.html', function(err, data) {
                    res.writeHead(200, {'Content-Type': 'text/html'});
                    res.write(data);
                    console.log("line html upload");
                    resolve();
                    return res.end();
                });
            }
            else if(req.url == '/bar'){
                fs.readFile('fileupload_second.html', function(err, data) {
                    res.writeHead(200, {'Content-Type': 'text/html'});
                    res.write(data);
                    console.log("bar html upload");
                    resolve();
                    return res.end();
                });
            }
            else if (req.url == '/upload_line'||req.url=='/upload_bar') {

                fs.mkdir(`${upload_path}${userIp}`, function(err) {
                    if (err) {
                      console.log("userfile directory already exists")
                    } else {
                      console.log("New userfile directory successfully created.")
                    }
                })
                var form = new formidable.IncomingForm();
                form.parse(req, function (err, fields, files){
                    // oldpath : temporary folder to which file is saved to
                    var oldpath = files.userfile.path;
                    var file = files.userfile.name;
                    global.userColumn = fields.userColumn;
                    global.moveHTML = `${req.url}`.split('/')[1];
                    console.log(userColumn)
                    var filename = file.split('.').slice(0,-1).join('.');
                    var newpath = upload_path + `${userIp}/` + `${userIp}.csv`;
                    
                    // copy the file to a new location
                    fs.rename(oldpath, newpath, function (err) {
                        if (err) throw err;
                        // you may respond with another html page
                        
                        if(moveHTML =="upload_line"){
                            res.write(upload_line);
                        }
                        else{
                            res.write(upload_bar);
                        }
    
                        resolve();
                        return res.end();
                    });  
                });
                resolve();
            }
            else if(req.url == "/image" && typeof userColumn !== "undefined" && moveHTML=="upload_line" )
            {   
                console.log(userColumn+" haha");
                console.log(typeof userColumn)
                exeCMD(s)
                .then(function(){
                    fs.readFile(`C:/Users/selab/vscode-workspace/Web_with_R/userGraph/${userIp}/${userColumn}.png`, function(err, data) {
                        if(err){
                            console.log("No IMAGE");
                            resolve();
                            res.end();
                        }
                        else{
                            res.writeHead(200, {'Content-Type': 'image/png'});
                            res.write(data);
                            //res.write(upload_html);
                            console.log("image upload");
                            resolve();
                            res.end();
                        }
                    })     
                })   
            }else if(req.url == "/image2" && typeof userColumn !== "undefined" &&  moveHTML=="upload_bar")
            {   
                console.log(userColumn+" in image2");
                console.log(typeof userColumn)
                exeCMD2(s)
                .then(function(){
                    fs.readFile(`C:/Users/selab/vscode-workspace/Web_with_R/userGraph/${userIp}/${userColumn}.png`, function(err, data) {
                        if(err){
                            console.log("No IMAGE");
                            resolve();
                            res.end();
                        }
                        else{
                            res.writeHead(200, {'Content-Type': 'image/png'});
                            res.write(data);
                            //res.write(upload_html);
                            console.log("bar image upload");
                            resolve();
                            res.end();
                        }
                    })     
                })   
            }
            else if(req.url=="/image_line2"||req.url=="/image_bar"||req.url=="/image_density"||req.url=="/image_round"){
                fs.readFile(`./image${req.url}.png`, function(err, data) {
                    res.writeHead(200, {'Content-Type': 'image/jpeg'});
                    res.write(data);
                    return res.end();
                  });
            }
            else{
                console.log("아무 일도,,없었다!!")
                res.end();
            }
        });
    }

    async function main(){

        //await readHtml();
        
        //await readHtml();
        //await uploadfile();
       // await exeCMD(s);
        
        // await readIMG();
        await readURL();
        
        
    }
    
    main();

}).listen(port, hostname, ()=>{
console.log(`Server running at http:// ${hostname}:${port}`);
});