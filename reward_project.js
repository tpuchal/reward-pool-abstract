//INFO STORED ON POOL
let rewards = 100; //Number of USDT to split
let days = 2; // How long will the contract be active
let tokens_locked = new Map(); // Map of address => number of tokens * purchase power
let total_power_locked = 0; // number of total locked tokens * their purchase power
let testDate = new Date(Date.now() + 60*60*24*1000); //some test date to check if getRewards works properly

//SOME ERC INFO JUST TO SIMULATE
class TokenHolder {
  tokens_balance; //balance of tokens stored here
  address_power; // multiplier which indicates how much more will a certain address get
  address;
  last_payment;
  rewards;

  constructor(address) {
    this.tokens_balance = 0;
    this.address_power = 1.0;
    this.address = address;
    this.rewards = 0;
  }
}

//sends rewards to address
function getRewards(TokenHolder) {
  if(hasAtLeastOneDayPassed(TokenHolder)) {
    returnTokens(TokenHolder, getTokensLocked(TokenHolder));
    console.log("You weren't eligible for a single payout. Returning tokens");
  }
  TokenHolder.rewards = calculateReward(TokenHolder);
}

//returns tokens to a set address
function returnTokens(TokenHolder, amount) {
  TokenHolder.tokens_balance += getTokensLocked(TokenHolder);
  tokens_locked.set(TokenHolder.address, tokens_locked.get(TokenHolder.address) - (amount * TokenHolder.address_power));
}

function calculateReward(TokenHolder) {
  let rewardsDays = Math.floor(((testDate.getTime() - Date.now()) / 1000 / 60 / 60 + 0.01) / 24); // FOR TEST PURPOSES ONLY. USE last_payment - date.now INSTEAD!!!!!
  let amount_due = tokens_locked.get(address)/total_power_locked * rewards/days * rewardsDays;
}

function addToTokensLocked(TokenHolder, amount) {
  tokens_locked += amount * TokenHolder.address_power;
}

function subtractFromTokensLocked(TokenHolder, amount) {
   tokens_locked -= amount * TokenHolder.address_power;
}

function getTokensLocked(TokenHolder) {
  return tokens_locked.get(TokenHolder.address) / TokenHolder.address_power;
}

function hasAtLeastOneDayPassed(TokenHolder) {
 return  (Math.floor(((TokenHolder.last_payment.getTime() - Date.now()) / 1000 / 60 / 60) / 24) < 1);
}

function lockTokens(TokenHolder, amount) {
    getRewards(TokenHolder.address);
    if(amount <= TokenHolder.tokens_balance){
      tokens_locked.set(TokenHolder.address, amount * TokenHolder.address_power);
      TokenHolder.tokens_balance -= amount;
      addToTokensLocked(TokenHolder, amount);
      TokenHolder.last_payment = Date.now();
    } else
        console.log("you don't have enough tokens!")
}

function unlockTokens(TokenHolder, amount) {
  if(amount > getTokensLocked(TokenHolder))
    console.log("you can't unlock this many tokens!");
    else {
      getRewards(TokenHolder.address);
      returnTokens(TokenHolder, amount);
      subtractFromTokensLocked(TokenHolder, amount);
    }
}



i1 = new TokenHolder();
i2 = new TokenHolder();

i1.address = 'address1';
i2.address = 'address2';

i1.tokens_balance = 50;
i2.tokens_balance = 50;
i2.address_power = 1.05;

lockTokens(i1, 50);
lockTokens(i2, 50);

console.log(tokens_locked);

r1 = getRewards(i1);
r2 = getRewards(i2);

document.write(r1);

console.log(r1 + r2);


