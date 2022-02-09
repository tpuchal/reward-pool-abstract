//INFO STORED ON POOL
let rewards = 100; //Number of USDT to split
let days = 2; // How long will the contract be active
let tokens_locked = new Map(); // Map of address => number of tokens * purchase power
let total_locked = 0; // number of total locked tokens * their purchase power
let testDate = new Date(Date.now() + 60*60*24*1000); //some test date to check if getRewards works properly

//SOME ERC INFO
class TokenHolder {
tokens_balance; //balance of tokens stored here
purchase_power; // multiplier which indicates how much more will a certain address get
address;
last_payment;

constructor(address) {
  this.tokens_balance = 0;
  this.purchase_power = 1.0;
  this.address = address;
}
}

function lockTokens(TokenHolder, amount) {
  if(amount <= TokenHolder.tokens_balance){
     tokens_locked.set(TokenHolder.address, amount * TokenHolder.purchase_power);
     TokenHolder.tokens_balance -= amount;
     total_locked += amount * TokenHolder.purchase_power;
     TokenHolder.last_payment = Date.now();
}}


//TODO checks
function unlockTokens(TokenHolder, amount) {
  TokenHolder.tokens_balance += amount;
  let temp = tokens_locked.get(TokenHolder.address);
  temp -= amount * TokenHolder.purchase_power;
  tokens_locked.set(TokenHolder.address, temp);
  total_locked -= amount * purchase_power;
}

function getRewards(address) {
  let rewardsDays = Math.floor(((testDate.getTime() - Date.now()) / 1000 / 60 / 60 + 0.01)/24);
  console.log(rewardsDays);

  let amount_due = tokens_locked.get(address)/total_locked * rewards/days * rewardsDays;

  console.log(address + "received " + amount_due);

  return amount_due;
}

i1 = new TokenHolder();
i2 = new TokenHolder();

i1.address = 'address1';
i2.address = 'address2';

i1.tokens_balance = 50;
i2.tokens_balance = 50;
i2.purchase_power = 1.05;

lockTokens(i1, 50);
lockTokens(i2, 50);

console.log(tokens_locked);

r1 = getRewards(i1.address);
r2 = getRewards(i2.address);

document.write(r1);

console.log(r1 + r2);


