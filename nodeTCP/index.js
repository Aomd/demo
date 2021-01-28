//@ts-check

// 1 引入模块
const net = require('net');
let clients = {};
// 2 创建服务器
const server = net.createServer();
// 3 绑定链接事件
server.on('connection', (person) => {
  // 记录链接的进程
  person['id'] = Object.keys(clients).length;
  clients[Object.keys(clients).length] = person

  console.log('id  ', 'address  ', 'port  ', 'family')
  console.log(person['id'], person.remoteAddress, person.remotePort, person.remoteFamily);

  person.setEncoding('hex');
  // 客户socket进程绑定事件
  person.on('data', (chunk) => {
    var uint8Array = [];
    for (var i = 0; i <= chunk.length; i++) {
      if (i % 2 == 0) {
        var item = chunk.slice(i - 2, i)
        if (item) {
          uint8Array.push(+('0x' + item))
        }
      }
    }
    console.log('--- data start -------------------------------------------------------')
    console.log('收到结果');
    console.log('hex:', chunk);
    console.log('dec:', uint8Array);
    console.log('--- data end ---------------------------------------------------------\n')
    sendAll(new Uint8Array(uint8Array))
  })




  person.on('close', (...arg) => {
    delete clients[person['id']]
    console.log('--- close start -------------------------------------------------------')
    console.log('关闭id:' + person['id'])
    console.log('当前剩余:' + Object.keys(clients).length + '个客户端')
    console.log('--- close end ---------------------------------------------------------\n')
  })
  person.on('error', (p1) => {
    delete clients[person['id']]
    console.log('--- error start -------------------------------------------------------')
    console.log('错误id:' + person['id'])
    console.log('当前剩余:' + Object.keys(clients).length + '个客户端')
    console.log('--- error end ---------------------------------------------------------\n')
  })
})
server.listen(8899);

function sendAll(uint8) {
  // 数据写入全部客户进程中
  for (var id in clients) {
    clients[id].write(uint8)
  }
}
