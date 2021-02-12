
const http =  require('http');
const fs = require('fs');
const ejs = require('ejs');
const url = require('url')

const index_page = fs.readFileSync('./top.ejs', 'utf8');
const other_page = fs.readFileSync('./other.ejs', 'utf8');
const style_css = fs.readFileSync('./style.css', 'utf8');
const qs = require('querystring');

var server = http.createServer(getFromClient);
server.listen(3000);
console.log('server start!');

function getFromClient(req, res) {
  var url_parts = url.parse(req.url, true);
  // console.log('req.url')
  // console.log(url_parts)
  switch(url_parts.pathname) {
    case '/':
      response_index(req,res);
      break;

    case '/other':
      response_other(req, res);
      break;

    case '/style.css':
      res.writeHead(200, { 'Content-Type': 'text/css' });
      res.write(style_css);
      res.end();
      break;

    default:
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('no page......');
      break;
  }
}

var data = {
  'taro': '090-3204-5810',
  'hanako': '080-1209-5218',
  'sachiko': '080-1830-5719',
  'ichiro': '070-5513-5321'
}
function response_index(req, res) {
  var msg = "これはインデックスページです app.js";
  var content = ejs.render(index_page, {
    title: "Index",
    content: msg, 
    data: data
  });
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.write(content);
  res.end()
}

function response_other(req, res) {
  var msg = "これはOtherページです。";

  if (req.method == 'POST') {
    var body = '';

    req.on('data', (data) => {
      body += data;
    });

    req.on('end', ()=>{
      var post_data = qs.parse(body);
      msg += `あなたは、「${post_data.msg}」と書きました。`;
      msg += `<br>クエリ変換前は ${body} です`;
      var content = ejs.render(other_page, {
        title: "Otherrrr",
        content:msg
      });
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.write(content);
      res.end();
    });
  } else {
    var msg = "page がありません。";
    var content = ejs.render(other_page, {
      title: "Otherrrr",
      content:msg
    });
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write(content);
    res.end();
  }
}