

var express = require('express');
var app = express();
var { exec, execSync } = require('child_process');

var downloadDir="./downloads/";

exec('ls -al', (err, stdout, stderr) => {
    if (err) {
        // node couldn't execute the command
        return;
    }

    // the *entire* stdout and stderr (buffered)
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
});

var downloading=[];


function downloadPlaylist(url) {
    downloading[url]={
        url:url,
        status:'',
    };
    var command=`youtube-dl --yes-playlist --ignore-errors -i -f best --recode-video mp4 -o "${downloadDir}%(playlist)s/%(title)s.%(ext)s" ${url} `;
    exec(command , (err, stdout, stderr) => {
        if (err) {
            downloading[url]={
                url:url,
                status:`ERROR:${err}`,
            };
            return;
        }
        var status=stderr+stdout;
        downloading[url]={
            url:url,
            status:status
        }
        // the *entire* stdout and stderr (buffered)
        console.log(`status: ${status}`);
    });
}
function downloadSingle(url) {
    downloading[url]={
        url:url,
        status:'',
    };
    var command=`youtube-dl --add-metadata -f best --recode-video mp4 -o "${downloadDir}%(title)s.%(ext)s" ${url} `;
    exec(command , (err, stdout, stderr) => {
        if (err) {
            downloading[url]={
                url:url,
                status:`ERROR:${err}`,
            };
            return;
        }
        var status=stderr+stdout;
        downloading[url]={
            url:url,
            status:status
        }
        // the *entire* stdout and stderr (buffered)
        console.log(`status: ${status}`);
    });
}
function list() {
    var ret=execSync(`tree -hf ${downloadDir}`);
    return ret;
}
app.get('/dlpl', function (req, res) {
    console.log(req.query.url);
    var url=req.query.url;    
    downloadPlaylist(url);
    res.redirect('/');
});
app.get('/dl', function (req, res) {
    console.log(req.query.url);
    var url=req.query.url;    
    downloadSingle(url);
    res.redirect('/');
});

app.get('/', function (req, res) {
    var str="";
    var i;
    for( i in downloading ) {
        str+=`<li> ${downloading[i].url} = ${downloading[i].status} </li>` ;
    }
    var ls=list();
    res.send(`
    <html>
    <body>
        
        <ul>
        ${str}
        </ul>
        Single:
        <form action="dl">
            <input type="text" size="80" name="url" value="">
            <input type="submit">
        </form>
        PlayList:
        <form action="dlpl">
            <input type="text" size="80" name="url" value="">
            <input type="submit">
        </form>
        <pre>
        ${ls}
        </pre>
    </body>
    </html>`
    );
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});
