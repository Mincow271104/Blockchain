const readline = require("readline"); 
const rl = readline.createInterface({ input: process.stdin, output: process.stdout, });
const { log, time } = require("console");
const { blob } = require("stream/consumers");
const { parse } = require("path");
const crypto = require("crypto");
const SHA256 = message => crypto.createHash("sha256").update(message).digest("hex");

class Block {
  constructor(prevhash, data, timeStamp = new Date().toISOString()) {
    this.prevhash = prevhash;
    this.timeStamp = timeStamp;
    this.data = data;
    this.hash = this.gethash();
    this.mineVar=0;
  }

  gethash() {
    return SHA256(this.prevhash + this.timeStamp + JSON.stringify(this.data)+this.mineVar).toString();
  }

  mine(difficulty){
    const bd = Date.now();
    while(!this.hash.startsWith('0'.repeat(difficulty))){
      this.mineVar++;
      this.hash=this.gethash();
    }
    this.minetime = (Date.now() - bd)/1000;
  }
}

class Blockchain {
  constructor(difficulty) {
    const genesisblock = new Block('0000', { isGenesis: true });
    this.difficulty = difficulty;
    this.chain = [genesisblock];
  }

  getlastblock() {
    return this.chain[this.chain.length - 1];
  }

  addblock(data,y) {
    const lastblock = this.getlastblock();
    const newblock = new Block(lastblock.hash, data);
    console.log(`Đang đào Block thứ ${this.chain.length} ...`);
    newblock.mine(y);
    this.chain.push(newblock);
    console.log('Đào thành công');
  }

  InBlockChain() {
      this.chain.forEach((block, index) => {
          console.log(`Block ${index}:`);
          console.log(`Hash của block trước đó: ${block.prevhash}`);
          console.log(`Hash Block hiện tại: ${block.hash}`);
          console.log(`Thời gian: ${block.timeStamp}`);
          console.log(`Nội Dung:`);
          console.log(`From: ${block.data.from}
To: ${block.data.to}
Amount: ${block.data.amount}`);
          console.log(`Thời gian Đào: ${block.minetime}s`)
          console.log(`Giá trị Đào: ${block.mineVar}`);
        });
      }
  
  isValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentblock = this.chain[i];
      const prevblock = this.chain[i - 1];
      if (currentblock.hash !== currentblock.gethash()) {
        return false;
      }
      if (currentblock.prevhash !== prevblock.hash) {
        return false;
      }
    }
    return true;
  }
  HackBlock(x){
    if(x>=this.chain.length||x<0){
      console.log('Số bạn nhập không hợp lệ!');
      mainmenu(this);
      return;
    }
    rl.question('Hãy nhập người gửi mới: ',(from)=>{
      rl.question('Hãy nhập người nhận mới: ',(to)=>{
        rl.question('Hãy nhập số tiền: ',(amount)=>{
          this.chain[x].data = {from,to,amount:parseInt(amount)};
          this.chain[x].hash = this.chain[x].gethash();
          console.log("Đã cập nhật dữ liệu thành công!"); 
          mainmenu(this);
        })
      })
    })
  }
}
function addblockchain(blockchain){
  rl.question("Hãy Nhập N: ",(n)=>{
    rl.question("Hãy nhập Chuẩn để Đào: ",(y)=>{
    let dem =0;
    function addblocks(){
      if(dem<n){
        console.log(`Block: ${dem+1}`);
        rl.question("Hãy nhập người gửi: ", (from) => {
          rl.question("Hãy nhập người nhận: ", (to) => {
            rl.question("Hãy nhập số tiền: ", (amount) => {
              blockchain.addblock({ from, to, amount: parseInt(amount) },parseInt(y));
              console.log("Đã thêm block thành công!");
              dem++;
              addblocks();
              });
            });
          });
        }else mainmenu(blockchain);
      }
      addblocks();
    })
  })
}
function hienthimenu(){
  console.log("1.Thêm n Block");
  console.log("2.Kiểm tra Valid");
  console.log("3.In BlockChain")
  console.log("4.Hack Block");
  console.log("5.Thoát");
}
function caidatmenu(choice,blockchain){
  switch(choice){
    case '1':
      addblockchain(blockchain);
      break;
    case '2':
      console.log("***Valid: "+blockchain.isValid()+"***");
      mainmenu(blockchain);
      break;
    case '3':
      blockchain.InBlockChain();
      mainmenu(blockchain);
      break;
    case '4':
      rl.question('Hãy nhập Block muốn Hack: ',(x)=>{
        blockchain.HackBlock(parseInt(x));
      });
      break;
    case '5':
      rl.close();
      break;
    default:
      console.log("Số bạn nhập không hợp lệ, vui lòng nhập lại");
  }
}
function mainmenu(blockchain){
  console.log("----Menu Chức Năng----");
  hienthimenu();
  rl.question("Hãy chọn 1 chức năng: ",(choice) =>{
      caidatmenu(choice,blockchain);
  });
}
const minhChain = new Blockchain();
mainmenu(minhChain);

