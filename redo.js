var currentAction = null;
var isMining = false;
var currentRock = null;
var progressCounter = 0;
var progressBar = null;
var progressFrame = null;
var currentPage = "mining";
var consoleMessage = "";

var inventory = {

}

const xpTable = [0, 83, 174, 276, 388, 512, 650, 801, 969, 1154, 1358, 1584, 1833, 2107, 2411, 2745, 3115, 3523, 3973, 4470, 5018, 5624, 6291, 7028, 7842, 8740,
  9730, 10824, 12031, 13363, 14833, 16456, 18247, 20224, 22406, 24815, 27473, 30408, 33648, 37224, 41171, 45529, 50339, 55649, 61512, 67983, 75127, 83104, 91721,
  101333, 111945, 123660, 136594, 150872, 155636, 184040, 203254, 224466, 247886, 273742, 302288, 333804, 368599, 407015, 449428, 496254, 547953, 605032, 668051,
  737627, 814445, 899257, 992895, 1096278, 1210421, 1336443, 1475581, 16292000, 1798808, 1986068, 2192818, 2421087, 2673114, 2951373, 325594, 3597792, 3972294,
  4385776, 4842295, 5345332, 5902831, 6517263, 7195629, 7944614, 8771558, 9684577, 10692629, 11805606, 13034431, 99999999
];
function updateXP(skill) {
  var skillXpElement = document.getElementById(skill.name + "xp");
  skillXpElement.innerHTML = skill.message.xp + skill.xp;
}

function doProgressBar(skill, bar) {
  if (progressCounter == 0) {
    progressCounter = 1;
    var width = 1;
    var bar = document.getElementById(bar);

    function frame() {
      if (width >= 100) {
        clearInterval(progressFrame);
        progressCounter = 0;
      } else {
        width++;
        bar.style.width = width + "%";
      }
    }
    progressFrame = setInterval(frame, skill.basetime / 100);
  }
}

function switchPage(page) {
  document.getElementById(currentPage).style.display = "none";
  currentPage = page;
  document.getElementById(page).style.display = "block";
}

function onLoad() {
  document.getElementById("mining").style.display = "block";
  loadInventory();
  loadSkills();
  onLoadInventory();
}

function clearIntervals() {
  clearInterval(progressFrame);
  clearInterval(currentAction);
  clearInterval(progressBar);
  resetProgressElements();
  progressCounter = 0;
}

function resetProgressElements() {
  for (i = 0; i < rocks.length; i++) {
    document.getElementById(rocks[i].progress).style.width = "0%";
  }
}

function loadInventory() {
  if (localStorage.getItem("inventory") == null) {
    inventory = {};
  } else {
    inventory = JSON.parse(localStorage.getItem("inventory"));
  }
}

function loadSkills() {
  if (JSON.parse(localStorage.getItem("mining")) != null) {
    mining = JSON.parse(localStorage.getItem("mining"));
  }
  if(JSON.parse(localStorage.getItem("smithing")) != null) {
    smithing = JSON.parse(localStorage.getItem("smithing"));
  }

  document.getElementById("miningxp").innerHTML = mining.message.xp + " " + mining.xp;
  document.getElementById("mininglevel").innerHTML = mining.message.level + " " + mining.level;
  document.getElementById("smithingxp").innerHTML = smithing.message.xp + " " + smithing.xp;
  document.getElementById("smithinglevel").innerHTML = smithing.message.level + " " +smithing.level;
}

function saveSkill(skill) {
  localStorage.setItem(skill.name, JSON.stringify(skill));
}

function reset() {
  localStorage.clear();
}

function updateLevelElement(skill) {
  var skillLevelElement = document.getElementById(skill.name + "level");
  skillLevelElement.innerHTML = skill.message.level + skill.level;
}

function updateConsole(message) {
  consoleMessage += message;
  document.getElementById("console").innerHTML = consoleMessage;
  document.getElementById("console").scrollTop = document.getElementById("console").scrollHeight;
}

function addToInventory(obtainedItems) {
  var itemKeys = Object.keys(obtainedItems);
  for (i = 0; i < itemKeys.length; i++) {
    if (itemKeys[i] in inventory) {
      var curAmount = Number(inventory[itemKeys[i]]);
      var newAmount = Number(obtainedItems[itemKeys[i]]);
      inventory[itemKeys[i]] += newAmount;
      //console.log(items[itemKeys[i]]);
    } else {
      inventory[itemKeys[i]] = obtainedItems[itemKeys[i]];
      //console.log(items[itemKeys[i]]);
    }
  }
  updateInventory(obtainedItems);
}

function onLoadInventory() {
  var invKeys = Object.keys(inventory);
  for (i = 0; i < invKeys.length; i++) {
    var item = items[invKeys[i]];
    console.log(invKeys[i]);
    console.log(item);
    if (inventory[invKeys[i]] != 0) {
      console.log(item);
      document.getElementById("inventory").innerHTML += "<div class='item' id='item-" + item.name + "'><object type='image/svg+xml' data='" + item.icon + "' class='itemImage'></object><div class='itemAmount' id='amount-" + item.name + "'>" + inventory[invKeys[i]] + "</div></div>";
    } else {
      document.getElementById("inventory").innerHTML += "<div class='item' id='item-" + item.name + "'><object type='image/svg+xml' data='" + item.icon + "' class='itemImage'></object><div class='itemAmount' id='amount-" + item.name + "'>" + inventory[invKeys[i]] + "</div></div>";
      document.getElementById("item-" + item.name).style.display = "none";
    }
  }
}

function updateInventory(obtainedItems) {
  var invKeys = Object.keys(inventory);
  var obtainedKeys = Object.keys(obtainedItems);
  console.log(obtainedKeys);
  for (i = 0; i < obtainedKeys.length; i++) {
    if (obtainedKeys[i] in inventory) {
      if (inventory[obtainedKeys[i]] == 0) {
        //console.log(document.getElementById("item-"+obtainedKeys[i]));
        document.getElementById("item-" + obtainedKeys[i]).style.display = "none";
      } else if (document.getElementById("amount-" + obtainedKeys[i]) != null) {
        document.getElementById("amount-" + obtainedKeys[i]).innerHTML = inventory[obtainedKeys[i]];
        document.getElementById("item-" + obtainedKeys[i]).style.display = "block";
      } else {
        document.getElementById("inventory").innerHTML += "<div class='item' id='item-" + obtainedKeys[i] + "'><object type='image/svg+xml' data='" + items[obtainedKeys[i]].icon + "' class='itemImage'></object><div class='itemAmount' id='amount-" + obtainedKeys[i] + "'>" + inventory[obtainedKeys[i]] + "</div></div>";
        document.getElementById("item-" + obtainedKeys[i]).style.display = "block";
      }
    }
  }
  //document.getElementById("inventory").innerHTML = invMessage;
  saveInventory();
}

function saveInventory() {
  localStorage.setItem("inventory", JSON.stringify(inventory));
}

function checkForLevelUp(skill) {
  if (skill.xp > xpTable[skill.level] && skill.xp < xpTable[skill.level + 1]) {
    skill.level = skill.level + 1;
    console.log("Leveled up " + skill.name);
    updateLevelElement(skill);
    updateConsole("You gained a " + skill.name + " level!<br>");
  }
}
var items = []

var bronzeBar = {
  name: "Bronze Bar",
  requiredlevel: 1,
  requireditems: {
    ["Copper Ore"]: 1,
    ["Tin Ore"]: 1
  },
  xp: 2,
  icon: "images/bronze bar.svg"
}

 const ironBar = {
  name: "Iron Bar",
  requiredlevel: 15,
  requireditems: {
    ["Iron Ore"]: 1
  },
  xp: 14,
  icon: "images/iron bar.svg"
}

items["Iron Bar"] = ironBar


const steelBar = {
 name: "Steel Bar",
 requiredlevel: 25,
 requireditems: {
   ["Iron Ore"]: 1,
   ["Coal Ore"]: 1
 },
 xp: 15,
 icon: "images/steel bar.svg"
}

items["Steel Bar"] = steelBar

 const mithrilBar = {
  name: "Mithril Bar",
  requiredlevel: 33,
  requireditems: {
    ["Mithril Ore"]: 1,
    ["Coal Ore"]: 4
  },
  xp: 35,
  icon: "images/mithril bar.svg"
}

items["Mithril Bar"] = mithrilBar

 const adamantiteBar = {
  name: "Adamantite Bar",
  requiredlevel: 55,
  requireditems: {
    ["Adamantite Ore"]: 1,
    ["Coal Ore"]: 6
  },
  xp: 42,
  icon: "images/adamantite bar.svg"
}

items["Adamantite Bar"] = adamantiteBar

 const runiteBar = {
  name: "Runite Bar",
  requiredlevel: 70,
  requireditems: {
    ["Runite Ore"]: 1,
    ["Coal Ore"]: 8
  },
  xp: 50,
  icon: "images/runite bar.svg"
}

items["Runite Bar"] = runiteBar

 const bronzeDagger = {
  name: "Bronze Dagger",
  requiredlevel: 1,
  requireditems: {
    ["Bronze Bar"]: 1
  },
  xp: 10,
  icon: "images/bronze dagger.svg"
}

items["Bronze Dagger"] = bronzeDagger

 const bronzeThrowingKnife = {
  name: "Bronze Throwing Knife",
  requiredlevel: 2,
  requireditems: {
    ["Bronze Bar"]: 1
  },
  xp: 10,
  icon: "images/bronze throwing knife.svg"
}

items["Bronze Throwing Knife"] = bronzeThrowingKnife

 const bronzeSword = {
  name: "Bronze Sword",
  requiredlevel: 4,
  requireditems: {
    ["Bronze Bar"]:1
  },
  xp: 10,
  icon: "images/bronze sword.svg"
}

items["Bronze Sword"] = bronzeSword

 const bronzeArrowtips = {
  name: "Bronze Arrow Tips",
  requiredlevel: 4,
  requireditems: {
    ["Bronze Bar"]: 1
  },
  xp: 10,
  icon: "images/bronze arrow tips.svg"
}

items["Bronze Arrow Tips"] = bronzeArrowtips

  const bronzeGloves = {
   name: "Bronze Gloves",
   requiredlevel: 5,
   requireditems: {
     ["Bronze Bar"]: 2
   },
   xp: 20,
   icon: "images/bronze gloves.svg"
 }

 items["Bronze Gloves"] = bronzeGloves

 const bronzeScimitar = {
  name: "Bronze Scimitar",
requiredlevel: 6,
  requireditems: {
     ["Bronze Bar"]: 2
  },
  xp: 20,
  icon: "images/bronze scimitar.svg"
}

items["Bronze Scimitar"] = bronzeScimitar

 const bronzeHelmet = {
  name: "Bronze Helmet",
  requiredlevel: 7,
  requireditems: {
    ["Bronze Bar"]:2
  },
  xp: 20,
  icon: "images/bronze helmet.svg"
}

items["Bronze Helmet"] = bronzeHelmet

 const bronzeBattleaxe = {
  name: "Bronze Battleaxe",
  requiredlevel: 8,
  requireditems: {
    ["Bronze Bar"]: 3
  },
  xp: 30,
  icon: "images/bronze battleaxe.svg"
}

items["Bronze Battleaxe"] = bronzeBattleaxe

 const bronzeJavelinHeads = {
  name: "Bronze Javelin Heads",
  requiredlevel: 9,
  requireditems: {
    ["Bronze Bar"]: 2
  },
  xp: 20,
  icon: "images/bronze javelin heads.svg"
}

items["Bronze Javelin Heads"] = bronzeJavelinHeads

 const bronzeBoots = {
  name: "Bronze Boots",
  requiredlevel: 10,
  requireditems: {
    ["Bronze Bar"]: 2
  },
  xp: 20,
  icon: "images/bronze boots.svg"
}

items["Bronze Boots"] = bronzeBoots

 const bronzeShield = {
  name: "Bronze Shield",
  requiredlevel: 12,
  requireditems: {
    ["Bronze Bar"]:3
  },
  xp: 30,
  icon: "images/bronze shield.svg"
}

items["Bronze Shield"] = bronzeShield

 const bronze2HSword = {
  name: "Bronze 2H Sword",
  requiredlevel: 14,
  requireditems: {
    ["Bronze Bar"]:3
  },
  xp: 30,
  icon: "images/bronze 2h sword.svg"
}

items["Bronze 2H Sword"] = bronze2HSword

 const bronzeCrossbowHead = {
  name: "Bronze Crossbow Head",
  requiredlevel: 15,
  requireditems: {
    ["Bronze Bar"]: 3
  },
  xp: 30,
  icon: "images/bronze crossbow head.svg"
}

items["Bronze Crossbow Head"] = bronzeCrossbowHead

 const bronzePlatelegs = {
  name: "Bronze Platelegs",
  requiredlevel: 16,
  requireditems: {
    ["Bronze Bar"]: 3
  },
  xp: 30,
  icon: "images/bronze platelegs.svg"
}

items["Bronze Platelegs"] = bronzePlatelegs

const bronzePlatebody = {
 name: "Bronze Platebody",
 requiredlevel: 18,
 requireditems: {
   ["Bronze Bar"]: 5
 },
 xp: 50,
 icon: "images/bronze platebody.svg"
}

 items["Bronze Platebody"] = bronzePlatebody

var copperOre = {
  name: "Copper Ore",
  value: 2,
  icon: "images/copper.svg"
}

var tinOre = {
  name: "Tin Ore",
  value: 2,
  icon: "images/tin.svg"
}

var ironOre = {
  name: "Iron Ore",
  value: 2,
  icon: "images/iron.svg"
}

var coalOre = {
  name: "Coal Ore",
  value: 2,
  icon: "images/coal.svg"
}

var mithrilOre = {
  name: "Mithril Ore",
  value: 2,
  icon: "images/mithril.svg"
}

var adamantiteOre = {
  name: "Adamantite Ore",
  value: 2,
  icon: "images/adamantite.svg"
}

var runiteOre = {
  name: "Runite Ore",
  value: 2,
  icon: "images/runite.svg"
}

var sapphire = {
  name: "Sapphire",
  value: 100,
  icon: "images/sapphire.svg"
}

var diamond = {
  name: "Diamond",
  icon: "images/diamond.svg"
}

var ruby = {
  name: "Ruby",
  icon: "images/ruby.svg"
}

var emerald = {
  name: "Emerald",
  icon: "images/emerald.svg"
}

var topaz = {
  name: "Topaz",
  icon: "images/topaz.svg"
}

items[copperOre.name] = copperOre;
items[tinOre.name] = tinOre;
items[ironOre.name] = ironOre;
items[coalOre.name] = coalOre;
items[mithrilOre.name] = mithrilOre;
items[adamantiteOre] = adamantiteOre;
items[runiteOre.name] = runiteOre;
items[sapphire.name] = sapphire;
items[diamond.name] = diamond;
items[emerald.name] = emerald;
items[topaz.name] = topaz;
items[ruby.name] = ruby;
items[bronzeBar.name] = bronzeBar;
var mining = {
  xp: 0,
  level: 1,
  basetime: 1500,
  message: {
    xp: "Mining XP: ",
    level: "Mining Level: "
  },
  name: "mining"
}

var smithing = {
  xp: 0,
  level: 1,
  basetime: 1500,
  message: {
    xp: "Smithing XP: ",
    level: "Smithing Level: "
  },
  name: "smithing"
}

const rocks = [{
  ore: "Copper Ore",
  level: 1,
  xp: 7,
  progress: "copperProgress",
  doubleOreChance: 5
}, {
  ore: "Tin Ore",
  level: 1,
  xp: 7,
  progress: "tinProgress",
  doubleOreChance: 5
}, {
  ore: "Iron Ore",
  level: 15,
  xp: 14,
  progress: "ironProgress",
  doubleOreChance: 20
}, {
  ore: "Coal Ore",
  level: 30,
  xp: 18,
  progress: "coalProgress",
  doubleOreChance: 35
}, {
  ore: "Mithril Ore",
  level: 50,
  xp: 65,
  progress: "mithrilProgress",
  doubleOreChance: 55
}, {
  ore: "Adamantite Ore",
  level: 60,
  xp: 71,
  progress: "adamantiteProgress",
  doubleOreChance: 65
}, {
  ore: "Runite Ore",
  level: 70,
  xp: 86,
  progress: "runiteProgress",
  doubleOreChance: 75
}]

function mineRock(rock) {
  console.log(rock);
  var rock = Number(rock);
  var obtainedItems = {};
  var doubleOre = false;
  console.log(isMining);
  if (isMining && currentRock == rock) {
    isMining = false;
    clearIntervals();
  } else {
    clearIntervals();
    isMining = true;
    currentRock = rock;
    if (mining.level >= rocks[rock].level) {
      //mine dat rock boi
      currentAction = setTimeout(doMining.bind(null, rock), mining.basetime);
      progressBar = setInterval(doProgressBar.bind(null, mining, rocks[rock].progress));
    } else {
      //YOU CAN'T MINE THAT YOU NOOB
      isMining = false;
      updateConsole("You need level " + rocks[rock].level + " mining to mine " + rocks[rock].ore + ".<br>")
    }
  }

  function doMining(rock) {
    var obtainedOre = rocks[rock].ore;
    obtainedItems = {};
    if(doubleOre){
        obtainedItems[obtainedOre] = 2;
        updateConsole("You got double ores!<br>");
    } else {
      obtainedItems[obtainedOre] = 1;
    }
    mining.xp += rocks[rock].xp;
    currentAction = setTimeout(doMining.bind(null, rock), mining.basetime);
    doubleOreChance();
    checkForLevelUp(mining);
    saveSkill(mining);
    updateXP(mining);
    rollForGem();
    addToInventory(obtainedItems);
  }

  function doubleOreChance(){
    if(mining.level >= rocks[rock].doubleOreChance){
      var roll = Math.random();
      if(roll <= .1){
        doubleOre = true;
      } else {
        doubleOre = false;
      }
    }
  }

  function rollForGem() {
    var obtainedGem;
    var roll = Math.random();
    if (roll <= .25) {
      roll = Math.random();
      if (roll <= .10) {
        obtainedGem = "Diamond";
        updateConsole("You found a Diamond!<br>");
        obtainedItems[obtainedGem] = 1;
      } else if (roll <= .25) {
        obtainedGem = "Ruby";
        updateConsole("You found a Ruby!<br>");
        obtainedItems[obtainedGem] = 1;
      } else if (roll <= .50) {
        obtainedGem = "Emerald";
        updateConsole("You found an Emerald!<br>");
        obtainedItems[obtainedGem] = 1;
      } else if (roll <= .75) {
        obtainedGem = "Topaz";
        updateConsole("You found a Topaz!<br>");
        obtainedItems[obtainedGem] = 1;
      } else if (roll <= 1) {
        obtainedGem = "Sapphire";
        updateConsole("You found a Sapphire!<br>");
        obtainedItems[obtainedGem] = 1;
      }
    }
  }
}

function smelt(item) {
  function doSmelting(item){
    var updateItems = {};
    for (i = 0; i < requiredItems.length; i++) {
      var newNum = -Math.abs(item.requireditems[requiredItems[i]]);
      updateItems[requiredItems[i]] = newNum;
    }
    updateItems[item.name] = 1;
    addToInventory(updateItems);
    var curxp = Number(smithing.xp);
    smithing.xp = curxp + item.xp;
    updateXP(smithing);
    checkForLevelUp(smithing);
    saveSkill(smithing);
    currentAction = setTimeout(smelt.bind(null, item), smithing.basetime);
  }

  if (smithing.level >= item.requiredlevel) {
    var requiredItems = Object.keys(item.requireditems);
    var smeltable = false;
    for (i = 0; i < requiredItems.length; i++) {
      if (requiredItems[i] in inventory && inventory[requiredItems[i]] >= item.requireditems[requiredItems[i]]) {
        smeltable = true;
      } else {
        smeltable = false;
        break;
      }
    }
    if (smeltable == true) {
      //Remove required items & add new item
      clearIntervals();
      currentAction = setTimeout(doSmelting.bind(null, item), smithing.basetime);
    } else {
      //Error. Can't smith that!
      updateConsole("You do not have the required items.<br>");
      clearIntervals();
    }
  } else {
    updateConsole("You need to be level " + item.requiredlevel + " to smelt that!<br>");
  }
}
