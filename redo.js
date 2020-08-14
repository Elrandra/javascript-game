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
  document.getElementById("miningxp").innerHTML = mining.message.xp + " " + mining.xp;
  document.getElementById("mininglevel").innerHTML = mining.message.level + " " + mining.level;
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
    console.log(item);
    if (inventory[invKeys[i]] != 0) {
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

var ironBar = {
  name: "Iron Bar",
  requiredlevel: 10,
  requiredItems: {
    ["Iron Ore"]: 1
  },
  xp: 10,
  icon: "images/iron bar.svg"
}

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
items[ironBar.name] = ironBar;
var mining = {
  xp: 0,
  level: 1,
  basetime: 1000,
  message: {
    xp: "Mining XP: ",
    level: "Mining Level: "
  },
  name: "mining"
}

var smithing = {
  xp: 0,
  level: 1,
  basetime: 1000,
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
  progress: "copperProgress"
}, {
  ore: "Tin Ore",
  level: 1,
  xp: 7,
  progress: "tinProgress"
}, {
  ore: "Iron Ore",
  level: 15,
  xp: 14,
  progress: "ironProgress"
}, {
  ore: "Coal Ore",
  level: 30,
  xp: 18,
  progress: "coalProgress"
}, {
  ore: "Mithril Ore",
  level: 50,
  xp: 65,
  progress: "mithrilProgress"
}, {
  ore: "Adamantite Ore",
  level: 60,
  xp: 71,
  progress: "adamantiteProgress"
}, {
  ore: "Runite Ore",
  level: 70,
  xp: 86,
  progress: "runiteProgress"
}]

function mineRock(rock) {
  console.log(rock);
  var rock = Number(rock);
  var obtainedItems = {};
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
      currentAction = setTimeout(doMining.bind(null, rock), 1000);
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
    obtainedItems[obtainedOre] = 1;
    mining.xp += rocks[rock].xp;
    currentAction = setTimeout(doMining.bind(null, rock), 1000);
    checkForLevelUp(mining);
    saveSkill(mining);
    updateXP(mining);
    rollForGem();
    addToInventory(obtainedItems);
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
      var updateItems = {};
      for (i = 0; i < requiredItems.length; i++) {
        var newNum = -Math.abs(item.requireditems[requiredItems[i]]);
        updateItems[requiredItems[i]] = newNum;
      }
      updateItems[item.name] = 1;
      addToInventory(updateItems);

    } else {
      //Error. Can't smith that!
      updateConsole("You do not have the required items.<br>");
    }
  } else {
    updateConsole("You need to be level " + item.requiredlevel + " to smelt that!<br>");
  }
}
