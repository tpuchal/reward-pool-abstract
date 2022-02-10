//INFO STORED ON POOL
let rewards = 100; //Number of USDT to split
let curr_rewards = rewards; //Current state of rewards_pool
let days = 2; // How long will the contract be active
let tokens_locked = new Map(); // Map of address => number of tokens * address power
let total_power_locked = 0; // number of total locked tokens * their address power
let testDate = new Date(Date.now() + 60*60*24*1000); //some test date to check if getRewards works properly

//SOME ERC INFO JUST TO SIMULATE
class TokenHolder {
  tokens_balance; //balance of tokens stored here
  address_power; // multiplier which indicates how much more rewards will a certain address get
  address;
  last_payment;
  rewards;

  constructor(address) {
    this.tokens_balance = 0;
    this.address_power = 1.0;
    this.address = address;
    this.rewards = 0;
  }

  //priviledged addresses will only work if they don't send tokens to anyone else
  transferTo(TokenHolder, amount) {
    if(amount > this.tokens_balance)
      console.log("You dont have enough tokens to send");
      else {
        this.address_power = 1.0;
        this.tokens_balance -= amount;
        TokenHolder.tokens_balance += amount;
      }
  }
}

//sends rewards to address
function getRewards(TokenHolder) {
  if(hasLessThanOneDayPassed(TokenHolder)) {
    returnTokens(TokenHolder, getTokensLocked(TokenHolder));
    console.log("You weren't eligible for a single payout. Returning tokens");
  }
  let calc_rewards = calculateReward(TokenHolder);
  TokenHolder.rewards += calc_rewards;
  curr_rewards -= calc_rewards;
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

function hasLessThanOneDayPassed(TokenHolder) {
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