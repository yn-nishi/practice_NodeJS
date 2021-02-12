
const http =  require('http');
const fs = require('fs');
const ejs = require('ejs');
const url = require('url')

const index_page = fs.readFileSync('./top.ejs', 'utf8');
const other_page = fs.readFileSync('./other.ejs', 'utf8');
const style_css = fs.readFileSync('./style.css', 'utf8');

var server = http.createServer(getFromClient);
server.listen(3000);
console.log('server start!');

function getFromClient(req, res) {
  var url_parts = url.parse(req.url);
  // console.log('req.url')
  // console.log(url_parts)
  switch(url_parts.pathname) {
    case '/':
      var content = ejs.render(index_page, {
        title: "index pageぺーじ",
        content: "これはテンプレートを使ったサンプルページでs"
      });
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write(content);
      res.end();
      break;

    case '/other':
      var content = ejs.render(other_page, {
        title: "Other pageeeeee",
        content: "新しく other Page を追加しました。"
      })
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.write(content);
      res.end();
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