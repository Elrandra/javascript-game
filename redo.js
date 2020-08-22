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
      };
      //console.log(items[itemKeys[i]]);
    }
    updateInventory(obtainedItems);
  }
function checkForLevelUp(skill) {
  if (skill.xp > xpTable[skill.level] && skill.xp < xpTable[skill.level + 1]) {
    skill.level = skill.level + 1;
    console.log("Leveled up " + skill.name);
    updateLevelElement(skill);
    updateConsole("You gained a " + skill.name + " level!<br>");
  }
}
function clearIntervals() {
  clearInterval(progressFrame);
  clearInterval(currentAction);
  clearInterval(progressBar);
  resetProgressElements();
  progressCounter = 0;
}
var currentAction = null;
var isMining = false;
var isWoodcutting = false;
var currentRock = null;
var currentTree = null;
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
  737627, 814445, 899257, 992895, 1096278, 1210421, 1336443, 1475581, 1629200, 1798808, 1986068, 2192818, 2421087, 2673114, 2951373, 3258594, 3597792, 3972294,
  4385776, 4842295, 5345332, 5902831, 6517263, 7195629, 7944614, 8771558, 9684577, 10692629, 11805606, 13034431, 99999999
];
function craft(item,skill){
  var updateItems = {};
  function doCrafting(item, skill){
  for (i = 0; i < requiredItems.length; i++){
    var newNum = -Math.abs(item.requireditems[requiredItems[i]]);
    updateItems[requiredItems[i]] = newNum;
  }
  updateItems[item.name] = 1;
  addToInventory(updateItems);
  var curxp = Number(skill.xp);
  skill.xp = curxp + item.xp;
  updateXP(skill);
  checkForLevelUp(skill);
  saveSkill(skill);
  currentAction = setTimeout(craft.bind(null, item, skill),skill.basetime/2);}

  console.log(typeof skill.level);
  console.log(typeof item.requiredlevel);
  if(skill.level >= item.requiredlevel){
    var requiredItems = Object.keys(item.requireditems);
    var craftable = false;
    for(i = 0; i < requiredItems.length; i++){
      if(requiredItems[i] in inventory && inventory[requiredItems[i]] >= item.requireditems[requiredItems[i]]) {
        craftable = true;
      } else {
        craftable = false;
        break;
      }
    }
    if(craftable == true){
      clearIntervals();
      currentAction = setTimeout(doCrafting.bind(null, item, skill), skill.basetime/2);
    } else {
      updateConsole("You do not have the required items.<br>");
      clearIntervals();
    }
  } else {
    updateConsole("You need to be level " + item.requiredlevel + " " +  skill.name + " to make that.");
  }
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
      };
      //console.log(items[itemKeys[i]]);
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
      var imageIconName = "imageIcon-"+item.name;
      var url = 'javascript:sellItem()';
      var content = {content: "Wat"}
      document.getElementById("inventory").innerHTML += "<div class='item' id='item-" + item.name + "'><object type='image/svg+xml' data='" + item.icon + "' class='itemImage' id='"+imageIconName+"' onmouseover='tippyTesting('invent', "+content+")'></object><div class='itemAmount' id='amount-" + item.name + "'>" + inventory[invKeys[i]] + "</div></div>";

    } else {
      var imageIconName = "imageIcon-"+item.name;
      document.getElementById("inventory").innerHTML += "<div class='item' id='item-" + item.name + "'><object type='image/svg+xml' data='" + item.icon + "' class='itemImage'></object><div class='itemAmount' id='amount-" + item.name + "'>" + inventory[invKeys[i]] + "</div></div>";
      document.getElementById("item-" + item.name).style.display = "none";
    }
  }
}

function tippyTesting(elem, content){
  var elem = document.getElementById(elem);
  var content = {
    content: "Wat"
  }
  console.log(content);
  tippy(elem, content);
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
        var imageIconName = "imageIcon-"+obtainedKeys[i];
        console.log(imageIconName);
        document.getElementById("inventory").innerHTML += "<div class='item' id='item-" + obtainedKeys[i] + "'><object type='image/svg+xml' data='" + items[obtainedKeys[i]].icon + "' class='itemImage' id='"+imageIconName+"'></object><div class='itemAmount' id='amount-" + obtainedKeys[i] + "'>" + inventory[obtainedKeys[i]] + "</div></div>";
        document.getElementById("item-" + obtainedKeys[i]).style.display = "block";
        var imageIcon = document.getElementById(imageIconName);
        var content = obtainedKeys[i]+"<br>Sell<br>Equip";
        tippyTesting(imageIcon, content);
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

var birdNest = {
name: "Bird's Nest",
icon: "images/bird_nest.svg"
}
items[birdNest.name] = birdNest

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
  icon: "images/iron_bar.svg"
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
  icon: "images/steel_bar.svg"
}

items["Steel Bar"] = steelBar



const adamantBar = {
  name: "Adamant Bar",
  requiredlevel: 55,
  requireditems: {
    ["Adamant Ore"]: 1,
    ["Coal Ore"]: 6
  },
  xp: 42,
  icon: "images/adamant_bar.svg"
}

items["Adamant Bar"] = adamantBar

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
    ["Bronze Bar"]: 1
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
    ["Bronze Bar"]: 2
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
    ["Bronze Bar"]: 3
  },
  xp: 30,
  icon: "images/bronze shield.svg"
}

items["Bronze Shield"] = bronzeShield

const bronze2HSword = {
  name: "Bronze 2H Sword",
  requiredlevel: 14,
  requireditems: {
    ["Bronze Bar"]: 3
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

const ironDagger = {
  name: "Iron Dagger",
  requiredlevel: 10,
  requireditems: {
    ["Iron Bar"]: 1
  },
  xp: 20,
  icon: "images/weapon_dagger_iron.svg"
}

items["Iron Dagger"] = ironDagger

const headlessBolts = {
  name: "Headless Bolts",
  requiredlevel: 10,
  requireditems: {
    ["Iron Bar"]: 1
  },
  xp: 15,
  icon: "images/headless_bolts.svg"
}

items["Headless Bolts"] = headlessBolts

const ironThrowingKnife = {
  name: "Iron Throwing Knife",
  requiredlevel: 11,
  requireditems: {
    ["Iron Bar"]: 1
  },
  xp: 40,
  icon: "images/weapon_throwingknife_iron.svg"
}

items["Iron Throwing Knife"] = ironThrowingKnife

const ironSword = {
  name: "Iron Sword",
  requiredlevel: 12,
  requireditems: {
    ["Iron Bar"]: 1
  },
  xp: 20,
  icon: "images/weapon_sword_iron.svg"
}

items["Iron Sword"] = ironSword

const ironArrowtips = {
  name: "Iron Arrowtips",
  requiredlevel: 13,
  requireditems: {
    ["Iron Bar"]: 1
  },
  xp: 20,
  icon: "images/arrowtips_iron.svg"
}

items["Iron Arrowtips"] = ironArrowtips

const ironGloves = {
  name: "Iron Gloves",
  requiredlevel: 14,
  requireditems: {
    ["Iron Bar"]: 2
  },
  xp: 40,
  icon: "images/armour_gloves_iron.svg"
}

items["Iron Gloves"] = ironGloves

const ironScimitar = {
  name: "Iron Scimitar",
  requiredlevel: 15,
  requireditems: {
    ["Iron Bar"]: 2
  },
  xp: 40,
  icon: "images/weapon_scimitar_iron.svg"
}

items["Iron Scimitar"] = ironScimitar

const ironHelmet = {
  name: "Iron Helmet",
  requiredlevel: 16,
  requireditems: {
    ["Iron Bar"]: 2
  },
  xp: 40,
  icon: "images/armour_helmet_iron.svg"
}

items["Iron Helmet"] = ironHelmet

const ironBattleaxe = {
  name: "Iron Battleaxe",
  requiredlevel: 17,
  requireditems: {
    ["Iron Bar"]: 3
  },
  xp: 60,
  icon: "images/weapon_battleaxe_iron.svg"
}

items["Iron Battleaxe"] = ironBattleaxe

const ironJavelinHeads = {
  name: "Iron Javelin Heads",
  requiredlevel: 18,
  requireditems: {
    ["Iron Bar"]: 2
  },
  xp: 40,
  icon: "images/iron_javelin_heads.svg"
}

items["Iron Javelin Heads"] = ironJavelinHeads

const ironBoots = {
  name: "Iron Boots",
  requiredlevel: 19,
  requireditems: {
    ["Iron Bar"]: 2
  },
  xp: 40,
  icon: "images/armour_boots_iron.svg"
}

items["Iron Boots"] = ironBoots

const ironShield = {
  name: "Iron Shield",
  requiredlevel: 21,
  requireditems: {
    ["Iron Bar"]: 3
  },
  xp: 60,
  icon: "images/armour_shield_iron.svg"
}

items["Iron Shield"] = ironShield

const iron2HSword = {
  name: "Iron 2H Sword",
  requiredlevel: 23,
  requireditems: {
    ["Iron Bar"]: 3
  },
  xp: 60,
  icon: "images/weapon_2h_iron.svg"
}

items["Iron 2H Sword"] = iron2HSword

const ironCrossbowHead = {
  name: "Iron Crossbow Head",
  requiredlevel: 24,
  requireditems: {
    ["Iron Bar"]: 3
  },
  xp: 60,
  icon: "images/crossbow_head_iron.svg"
}

items["Iron Crossbow Head"] = ironCrossbowHead

const ironPlatelegs = {
  name: "Iron Platelegs",
  requiredlevel: 25,
  requireditems: {
    ["Iron Bar"]: 3
  },
  xp: 60,
  icon: "images/armour_platelegs_iron.svg"
}

items["Iron Platelegs"] = ironPlatelegs

const ironPlatebody = {
  name: "Iron Platebody",
  requiredlevel: 27,
  requireditems: {
    ["Iron Bar"]: 5
  },
  xp: 100,
  icon: "images/armour_platebody_iron.svg"
}

items["Iron Platebody"] = ironPlatebody

var copperOre = {
  name: "Copper Ore",
  value: 2,
  icon: "images/copper.svg"
}

var dragoniteOre = {
  name: "Dragonite Ore",
  value: 2,
  icon: "images/dragonite_ore.svg"
}

items[dragoniteOre.name] = dragoniteOre;

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

var adamantOre = {
  name: "Adamant Ore",
  value: 2,
  icon: "images/adamant.svg"
}

var runeOre = {
  name: "Rune Ore",
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

const log = {
  name: "Log",
  requiredlevel: null,
  requireditems: {

  },
  xp: null,
  icon: "images/log.svg"
}

const steelDagger = {
  name: "Steel Dagger",
  requiredlevel: 25,
  requireditems: {
    ["Steel Bar"]: 1
  },
  xp: 30,
  icon: "images/weapon_dagger_steel.svg"
}
items[steelDagger.name] = steelDagger;
const steelThrowingKnife = {
  name: "Steel Throwing Knife",
  requiredlevel: 26,
  requireditems: {
    ["Steel Bar"]: 1
  },
  xp: 30,
  icon: "images/weapon_throwingknife_steel.svg"
}
items[steelThrowingKnife.name] = steelThrowingKnife;
const steelSword = {
  name: "Steel Sword",
  requiredlevel: 27,
  requireditems: {
    ["Steel Bar"]: 1
  },
  xp: 30,
  icon: "images/weapon_sword_steel.svg"
}
items[steelSword.name] = steelSword;
const steelArrowtips = {
  name: "Steel Arrowtips",
  requiredlevel: 28,
  requireditems: {
    ["Steel Bar"]: 1
  },
  xp: 30,
  icon: "images/arrowtips_steel.svg"
}
items[steelArrowtips.name] = steelArrowtips;
const steelGloves = {
  name: "Steel Gloves",
  requiredlevel: 29,
  requireditems: {
    ["Steel Bar"]: 2
  },
  xp: 60,
  icon: "images/armour_gloves_steel.svg"
}
items[steelGloves.name] = steelGloves;
const steelScimitar = {
  name: "Steel Scimitar",
  requiredlevel: 30,
  requireditems: {
    ["Steel Bar"]: 2
  },
  xp: 60,
  icon: "images/weapon_scimitar_steel.svg"
}
items[steelScimitar.name] = steelScimitar;
const steelHelmet = {
  name: "Steel Helmet",
  requiredlevel: 31,
  requireditems: {
    ["Steel Bar"]: 2
  },
  xp: 60,
  icon: "images/armour_helmet_steel.svg"
}
items[steelHelmet.name] = steelHelmet;
const steelBattleaxe = {
  name: "Steel Battleaxe",
  requiredlevel: 32,
  requireditems: {
    ["Steel Bar"]: 3
  },
  xp: 90,
  icon: "images/weapon_battleaxe_steel.svg"
}
items[steelBattleaxe.name] = steelBattleaxe;
const steelJavelinHeads = {
  name: "Steel Javelin Heads",
  requiredlevel: 33,
  requireditems: {
    ["Steel Bar"]: 2
  },
  xp: 60,
  icon: "images/steel_javelin_heads.svg"
}
items[steelJavelinHeads.name] = steelJavelinHeads;
const steelBoots = {
  name: "Steel Boots",
  requiredlevel: 34,
  requireditems: {
    ["Steel Bar"]: 2
  },
  xp: 60,
  icon: "images/armour_boots_steel.svg"
}
items[steelBoots.name] = steelBoots;
const steelShield = {
  name: "Steel Shield",
  requiredlevel: 36,
  requireditems: {
    ["Steel Bar"]: 3
  },
  xp: 90,
  icon: "images/armour_shield_steel.svg"
}
items[steelShield.name] = steelShield;
const steel2HSword = {
  name: "Steel 2H Sword",
  requiredlevel: 38,
  requireditems: {
    ["Steel Bar"]: 3
  },
  xp: 90,
  icon: "images/weapon_2h_steel.svg"
}
items[steel2HSword.name] = steel2HSword;
const steelCrossbowHead = {
  name: "Steel Crossbow Head",
  requiredlevel: 39,
  requireditems: {
    ["Steel Bar"]: 3
  },
  xp: 90,
  icon: "images/crossbow_head_steel.svg"
}
items[steelCrossbowHead.name] = steelCrossbowHead;
const steelPlatelegs = {
  name: "Steel Platelegs",
  requiredlevel: 40,
  requireditems: {
    ["Steel Bar"]: 3
  },
  xp: 90,
  icon: "images/armour_platelegs_steel.svg"
}
items[steelPlatelegs.name] = steelPlatelegs;
const steelPlatebody = {
  name: "Steel Platebody",
  requiredlevel: 42,
  requireditems: {
    ["Steel Bar"]: 5
  },
  xp: 150,
  icon: "images/armour_platebody_steel.svg"
}
items[steelPlatebody.name] = steelPlatebody;

const mithrilBar = {
name: "Mithril Bar",
requiredlevel: 40,
requireditems: {
["Mithril Ore"]: 1,
["Coal Ore"]: 4
},
xp: 35,
icon: "images/mithril_bar.svg"
}
items[mithrilBar.name] = mithrilBar;
const mithrilDagger = {
name: "Mithril Dagger",
requiredlevel: 40,
requireditems: {
["Mithril Bar"]: 1
},
xp: 50,
icon: "images/weapon_dagger_mithril.svg"
}
items[mithrilDagger.name] = mithrilDagger;
const mithrilThrowingKnife = {
name: "Mithril Throwing Knife",
requiredlevel: 41,
requireditems: {
["Mithril Bar"]: 1
},
xp: 50,
icon: "images/weapon_throwingknife_mithril.svg"
}
items[mithrilThrowingKnife.name] = mithrilThrowingKnife;
const mithrilSword = {
name: "Mithril Sword",
requiredlevel: 42,
requireditems: {
["Mithril Bar"]: 1
},
xp: 50,
icon: "images/weapon_sword_mithril.svg"
}
items[mithrilSword.name] = mithrilSword;
const mithrilArrowtips = {
name: "Mithril Arrowtips",
requiredlevel: 43,
requireditems: {
["Mithril Bar"]: 1
},
xp: 50,
icon: "images/arrowtips_mithril.svg"
}
items[mithrilArrowtips.name] = mithrilArrowtips;
const mithrilGloves = {
name: "Mithril Gloves",
requiredlevel: 44,
requireditems: {
["Mithril Bar"]: 2
},
xp: 100,
icon: "images/armour_gloves_mithril.svg"
}
items[mithrilGloves.name] = mithrilGloves;
const mithrilScimitar = {
name: "Mithril Scimitar",
requiredlevel: 45,
requireditems: {
["Mithril Bar"]: 2
},
xp: 100,
icon: "images/weapon_scimitar_mithril.svg"
}
items[mithrilScimitar.name] = mithrilScimitar;
const mithrilHelmet = {
name: "Mithril Helmet",
requiredlevel: 46,
requireditems: {
["Mithril Bar"]: 2
},
xp: 100,
icon: "images/armour_helmet_mithril.svg"
}
items[mithrilHelmet.name] = mithrilHelmet;
const mithrilBattleaxe = {
name: "Mithril Battleaxe",
requiredlevel: 47,
requireditems: {
["Mithril Bar"]: 3
},
xp: 150,
icon: "images/weapon_battleaxe_mithril.svg"
}
items[mithrilBattleaxe.name] = mithrilBattleaxe;
const mithrilJavelinHeads = {
name: "Mithril Javelin Heads",
requiredlevel: 48,
requireditems: {
["Mithril Bar"]: 2
},
xp: 100,
icon: "images/mithril_javelin_heads.svg"
}
items[mithrilJavelinHeads.name] = mithrilJavelinHeads;
const mithrilBoots = {
name: "Mithril Boots",
requiredlevel: 49,
requireditems: {
["Mithril Bar"]: 2
},
xp: 100,
icon: "images/armour_boots_mithril.svg"
}
items[mithrilBoots.name] = mithrilBoots;
const mithrilShield = {
name: "Mithril Shield",
requiredlevel: 51,
requireditems: {
["Mithril Bar"]: 3
},
xp: 100,
icon: "images/armour_shield_mithril.svg"
}
items[mithrilShield.name] = mithrilShield;
const mithril2HSword = {
name: "Mithril 2H Sword",
requiredlevel: 51,
requireditems: {
["Mithril Bar"]: 3
},
xp: 150,
icon: "images/weapon_2H_mithril.svg"
}
items[mithril2HSword.name] = mithril2HSword;
const mithrilCrossbowHead = {
name: "Mithril Crossbow Head",
requiredlevel: 54,
requireditems: {
["Mithril Bar"]: 3
},
xp: 150,
icon: "images/crossbow_head_mithril.svg"
}
items[mithrilCrossbowHead.name] = mithrilCrossbowHead;
const mithrilPlatelegs = {
name: "Mithril Platelegs",
requiredlevel: 55,
requireditems: {
["Mithril Bar"]: 3
},
xp: 150,
icon: "images/armour_platelegs_mithril.svg"
}
items[mithrilPlatelegs.name] = mithrilPlatelegs;
const mithrilPlatebody = {
name: "Mithril Platebody",
requiredlevel: 57,
requireditems: {
["Mithril Bar"]: 5
},
xp: 250,
icon: "images/armour_platebody_mithril.svg"
}
items[mithrilPlatebody.name] = mithrilPlatebody;

const adamantDagger = {
name: "Adamant Dagger",
requiredlevel: 55,
requireditems: {
["Adamant Bar"]: 1
},
xp: 60,
icon: "images/weapon_dagger_adamant.svg"
}
items[adamantDagger.name] = adamantDagger;
const adamantThrowingKnife = {
name: "Adamant Throwing Knife",
requiredlevel: 56,
requireditems: {
["Adamant Bar"]: 1
},
xp: 60,
icon: "images/weapon_throwingknife_adamant.svg"
}
items[adamantThrowingKnife.name] = adamantThrowingKnife;
const adamantSword = {
name: "Adamant Sword",
requiredlevel: 57,
requireditems: {
["Adamant Bar"]: 1
},
xp: 60,
icon: "images/weapon_sword_adamant.svg"
}
items[adamantSword.name] = adamantSword;
const adamantArrowtips = {
name: "Adamant Arrowtips",
requiredlevel: 58,
requireditems: {
["Adamant Bar"]: 1
},
xp: 60,
icon: "images/arrowtips_adamant.svg"
}
items[adamantArrowtips.name] = adamantArrowtips;
const adamantGloves = {
name: "Adamant Gloves",
requiredlevel: 59,
requireditems: {
["Adamant Bar"]: 2
},
xp: 120,
icon: "images/armour_gloves_adamant.svg"
}
items[adamantGloves.name] = adamantGloves;
const adamantScimitar = {
name: "Adamant Scimitar",
requiredlevel: 60,
requireditems: {
["Adamant Bar"]: 2
},
xp: 120,
icon: "images/weapon_scimitar_adamant.svg"
}
items[adamantScimitar.name] = adamantScimitar;
const adamantHelmet = {
name: "Adamant Helmet",
requiredlevel: 61,
requireditems: {
["Adamant Bar"]: 2
},
xp: 120,
icon: "images/armour_helmet_adamant.svg"
}
items[adamantHelmet.name] = adamantHelmet;
const adamantBattleaxe = {
name: "Adamant Battleaxe",
requiredlevel: 62,
requireditems: {
["Adamant Bar"]: 3
},
xp: 180,
icon: "images/weapon_battleaxe_adamant.svg"
}
items[adamantBattleaxe.name] = adamantBattleaxe;
const adamantJavelinHeads = {
name: "Adamant Javelin Heads",
requiredlevel: 63,
requireditems: {
["Adamant Bar"]: 2
},
xp: 120,
icon: "images/adamant_javelin_heads.svg"
}
items[adamantJavelinHeads.name] = adamantJavelinHeads;
const adamantBoots = {
name: "Adamant Boots",
requiredlevel: 64,
requireditems: {
["Adamant Bar"]: 2
},
xp: 120,
icon: "images/armour_boots_adamant.svg"
}
items[adamantBoots.name] = adamantBoots;
const adamantShield = {
name: "Adamant Shield",
requiredlevel: 66,
requireditems: {
["Adamant Bar"]: 3
},
xp: 180,
icon: "images/armour_shield_adamant.svg"
}
items[adamantShield.name] = adamantShield;
const adamant2HSword = {
name: "Adamant 2H Sword",
requiredlevel: 68,
requireditems: {
["Adamant Bar"]: 3
},
xp: 180,
icon: "images/weapon_2h_adamant.svg"
}
items[adamant2HSword.name] = adamant2HSword;
const adamantCrossbowHead = {
name: "Adamant Crossbow Head",
requiredlevel: 69,
requireditems: {
["Adamant Bar"]: 3
},
xp: 180,
icon: "images/crossbow_head_adamant.svg"
}
items[adamantCrossbowHead.name] = adamantCrossbowHead;
const adamantPlatelegs = {
name: "Adamant Platelegs",
requiredlevel: 70,
requireditems: {
["Adamant Bar"]: 3
},
xp: 180,
icon: "images/armour_platelegs_adamant.svg"
}
items[adamantPlatelegs.name] = adamantPlatelegs;
const adamantPlatebody = {
name: "Adamant Platebody",
requiredlevel: 72,
requireditems: {
["Adamant Bar"]: 5
},
xp: 300,
icon: "images/armour_platebody_adamant.svg"
}
items[adamantPlatebody.name] = adamantPlatebody;

const runeDagger = {
name: "Rune Dagger",
requiredlevel: 70,
requireditems: {
["Rune Bar"]: 1
},
xp: 70,
icon: "images/weapon_dagger_rune.svg"
}
items[runeDagger.name] = runeDagger;
const runeThrowingKnife = {
name: "Rune Throwing Knife",
requiredlevel: 71,
requireditems: {
["Rune Bar"]: 1
},
xp: 75,
icon: "images/weapon_throwingknife_rune.svg"
}
items[runeThrowingKnife.name] = runeThrowingKnife;
const runeSword = {
name: "Rune Sword",
requiredlevel: 72,
requireditems: {
["Rune Bar"]: 1
},
xp: 75,
icon: "images/weapon_sword_rune.svg"
}
items[runeSword.name] = runeSword;
const runeArrowTips = {
name: "Rune Arrow Tips",
requiredlevel: 73,
requireditems: {
["Rune Bar"]: 1
},
xp: 75,
icon: "images/arrowtips_rune.svg"
}
items[runeArrowTips.name] = runeArrowTips;
const runeGloves = {
name: "Rune Gloves",
requiredlevel: 74,
requireditems: {
["Rune Bar"]: 2
},
xp: 150,
icon: "images/armour_gloves_rune.svg"
}
items[runeGloves.name] = runeGloves;
const runeScimitar = {
name: "Rune Scimitar",
requiredlevel: 75,
requireditems: {
["Rune Bar"]: 2
},
xp: 150,
icon: "images/weapon_scimitar_rune.svg"
}
items[runeScimitar.name] = runeScimitar;
const runeHelmet = {
name: "Rune Helmet",
requiredlevel: 76,
requireditems: {
["Rune Bar"]: 2
},
xp: 150,
icon: "images/armour_helmet_rune.svg"
}
items[runeHelmet.name] = runeHelmet;
const runeBattleaxe = {
name: "Rune Battleaxe",
requiredlevel: 77,
requireditems: {
["Rune Bar"]: 3
},
xp: 225,
icon: "images/weapon_battleaxe_rune.svg"
}
items[runeBattleaxe.name] = runeBattleaxe;
const runeJavelinHeads = {
name: "Rune Javelin Heads",
requiredlevel: 78,
requireditems: {
["Rune Bar"]: 2
},
xp: 150,
icon: "images/rune_javelin_heads.svg"
}
items[runeJavelinHeads.name] = runeJavelinHeads;
const runeBoots = {
name: "Rune Boots",
requiredlevel: 79,
requireditems: {
["Rune Bar"]: 2
},
xp: 150,
icon: "images/armour_boots_rune.svg"
}
items[runeBoots.name] = runeBoots;
const runeShield = {
name: "Rune Shield",
requiredlevel: 81,
requireditems: {
["Rune Bar"]: 3
},
xp: 225,
icon: "images/armour_shield_rune.svg"
}
items[runeShield.name] = runeShield;
const rune2HSword = {
name: "Rune 2H Sword",
requiredlevel: 83,
requireditems: {
["Rune Bar"]: 3
},
xp: 225,
icon: "images/weapon_2h_rune.svg"
}
items[rune2HSword.name] = rune2HSword;
const runeCrossbowHead = {
name: "Rune Crossbow Head",
requiredlevel: 84,
requireditems: {
["Rune Bar"]: 3
},
xp: 225,
icon: "images/crossbow_head_rune.svg"
}
items[runeCrossbowHead.name] = runeCrossbowHead;
const runePlatelegs = {
name: "Rune Platelegs",
requiredlevel: 85,
requireditems: {
["Rune Bar"]: 3
},
xp: 225,
icon: "images/armour_platelegs_rune.svg"
}
items[runePlatelegs.name] = runePlatelegs;
const runePlatebody = {
name: "Rune Platebody",
requiredlevel: 87,
requireditems: {
["Rune Bar"]: 5
},
xp: 375,
icon: "images/armour_platebody_rune.svg"
}
items[runePlatebody.name] = runePlatebody;

const runeBar = {
name: "Rune Bar",
requiredlevel: 70,
requireditems: {
["Rune Ore"]: 1,
["Coal Ore"]: 8
},
xp: 50,
icon: "images/rune_bar.svg"
}
items[runeBar.name] = runeBar;

const dragoniteBar = {
name: "Dragonite Bar",
requiredlevel: 85,
requireditems: {
["Dragonite Ore"]: 1,
["Rune Ore"]: 2,
["Coal Ore"]: 12
},
xp: 60,
icon: "images/dragonite_bar.svg"
}
items[dragoniteBar.name] = dragoniteBar;
const dragonDagger = {
name: "Dragon Dagger",
requiredlevel: 85,
requireditems: {
["Dragonite Bar"]: 1
},
xp: 100,
icon: "images/weapon_dagger_dragon.svg"
}
items[dragonDagger.name] = dragonDagger;
const dragonThrowingKnife = {
name: "Dragon Throwing Knife",
requiredlevel: 86,
requireditems: {
["Dragonite Bar"]: 1
},
xp: 100,
icon: "images/weapon_throwingknife_dragon.svg"
}
items[dragonThrowingKnife.name] = dragonThrowingKnife;
const dragonSword = {
name: "Dragon Sword",
requiredlevel: 87,
requireditems: {
["Dragonite Bar"]: 1
},
xp: 100,
icon: "images/weapon_sword_dragon.svg"
}
items[dragonSword.name] = dragonSword;
const dragonArrowtips = {
name: "Dragon Arrowtips",
requiredlevel: 88,
requireditems: {
["Dragonite Bar"]: 1
},
xp: 100,
icon: "images/arrowtips_dragon.svg"
}
items[dragonArrowtips.name] = dragonArrowtips;
const dragonGloves = {
name: "Dragon Gloves",
requiredlevel: 89,
requireditems: {
["Dragonite Bar"]: 2
},
xp: 200,
icon: "images/armour_gloves_dragon.svg"
}
items[dragonGloves.name] = dragonGloves;
const dragonScimitar = {
name: "Dragon Scimitar",
requiredlevel: 90,
requireditems: {
["Dragonite Bar"]: 2
},
xp: 200,
icon: "images/weapon_scimitar_dragon.svg"
}
items[dragonScimitar.name] = dragonScimitar;
const dragonHelmet = {
name: "Dragon Helmet",
requiredlevel: 91,
requireditems: {
["Dragonite Bar"]: 2
},
xp: 200,
icon: "images/armour_helmet_dragon.svg"
}
items[dragonHelmet.name] = dragonHelmet;
const dragonBattleaxe = {
name: "Dragon Battleaxe",
requiredlevel: 92,
requireditems: {
["Dragonite Bar"]: 3
},
xp: 300,
icon: "images/weapon_battleaxe_dragon.svg"
}
items[dragonBattleaxe.name] = dragonBattleaxe;
const dragonJavelinHeads = {
name: "Dragon Javelin Heads",
requiredlevel: 93,
requireditems: {
["Dragonite Bar"]: 2
},
xp: 200,
icon: "images/dragon_javelin_heads.svg"
}
items[dragonJavelinHeads.name] = dragonJavelinHeads;
const dragonBoots = {
name: "Dragon Boots",
requiredlevel: 94,
requireditems: {
["Dragonite Bar"]: 2
},
xp: 200,
icon: "images/armour_boots_dragon.svg"
}
items[dragonBoots.name] = dragonBoots;
const dragonShield = {
name: "Dragon Shield",
requiredlevel: 96,
requireditems: {
["Dragonite Bar"]: 3
},
xp: 300,
icon: "images/armour_shield_dragon.svg"
}
items[dragonShield.name] = dragonShield;
const dragon2HSword = {
name: "Dragon 2H Sword",
requiredlevel: 98,
requireditems: {
["Dragonite Bar"]: 3
},
xp: 300,
icon: "images/weapon_2h_dragon.svg"
}
items[dragon2HSword.name] = dragon2HSword;
const dragonCrossbowHead = {
name: "Dragon Crossbow Head",
requiredlevel: 98,
requireditems: {
["Dragonite Bar"]: 3
},
xp: 300,
icon: "images/crossbow_head_dragon.svg"
}
items[dragonCrossbowHead.name] = dragonCrossbowHead;
const dragonPlatelegs = {
name: "Dragon Platelegs",
requiredlevel: 99,
requireditems: {
["Dragonite Bar"]: 3
},
xp: 300,
icon: "images/armour_platelegs_dragon.svg"
}
items[dragonPlatelegs.name] = dragonPlatelegs;
const dragonPlatebody = {
name: "Dragon Platebody",
requiredlevel: 99,
requireditems: {
["Dragonite Bar"]: 5
},
xp: 500,
icon: "images/armour_platebody_dragon.svg"
}
items[dragonPlatebody.name] = dragonPlatebody;

items[log.name] = log


items[copperOre.name] = copperOre;
items[tinOre.name] = tinOre;
items[ironOre.name] = ironOre;
items[coalOre.name] = coalOre;
items[mithrilOre.name] = mithrilOre;
items[adamantOre.name] = adamantOre;
items[runeOre.name] = runeOre;
items[sapphire.name] = sapphire;
items[diamond.name] = diamond;
items[emerald.name] = emerald;
items[topaz.name] = topaz;
items[ruby.name] = ruby;
items[bronzeBar.name] = bronzeBar;


function sellItem() {
  console.log("Testing!");
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
  if(JSON.parse(localStorage.getItem("woodcutting")) != null){
    woodcutting = JSON.parse(localStorage.getItem("woodcutting"));
  }

  document.getElementById("miningxp").innerHTML = mining.message.xp + " " + mining.xp;
  document.getElementById("mininglevel").innerHTML = mining.message.level + " " + mining.level;
  document.getElementById("smithingxp").innerHTML = smithing.message.xp + " " + smithing.xp;
  document.getElementById("smithinglevel").innerHTML = smithing.message.level + " " +smithing.level;
  document.getElementById("woodcuttingxp").innerHTML = woodcutting.message.xp + " " + woodcutting.xp;
  document.getElementById("woodcuttinglevel").innerHTML = woodcutting.message.level + " " + woodcutting.level;
}
function onLoad() {
  document.getElementById("mining").style.display = "block";
  loadInventory();
  loadSkills();
  onLoadInventory();
}
function onLoadInventory() {
  var invKeys = Object.keys(inventory);
  for (i = 0; i < invKeys.length; i++) {
    var item = items[invKeys[i]];
    if (inventory[invKeys[i]] != 0) {
      document.getElementById("inventory").innerHTML += "<div class='item' id='item-" + item.name + "'><object type='image/svg+xml' data='" + item.icon + "' class='itemImage'></object><div class='itemAmount' id='amount-" + item.name + "'>" + inventory[invKeys[i]] + "</div></div>";

    } else {
      document.getElementById("inventory").innerHTML += "<div class='item' id='item-" + item.name + "'><object type='image/svg+xml' data='" + item.icon + "' class='itemImage'></object><div class='itemAmount' id='amount-" + item.name + "'>" + inventory[invKeys[i]] + "</div></div>";
      document.getElementById("item-" + item.name).style.display = "none";
    }
  }
}
function resetProgressElements() {
  for (i = 0; i < rocks.length; i++) {
    document.getElementById(rocks[i].progress).style.width = "0%";
  }
}
function saveInventory() {
  localStorage.setItem("inventory", JSON.stringify(inventory));
}
function saveSkill(skill) {
  localStorage.setItem(skill.name, JSON.stringify(skill));
}
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

//Craftable Item
//Variable Name, Item Name, Required Level, Required Items, XP, Icon
//HTML for Crafting
//Skill
//Gathering Node
//Skill, Level, XP, Progress Element, Gained Item
//Item gained from node
//Icon
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
  ore: "Adamant Ore",
  level: 60,
  xp: 71,
  progress: "adamantiteProgress",
  doubleOreChance: 65
}, {
  ore: "Rune Ore",
  level: 70,
  xp: 86,
  progress: "runiteProgress",
  doubleOreChance: 75
}, {
  ore: "Dragonite Ore",
  level: 95,
  xp: 101,
  progress: "dragoniteProgress",
  doubleOreChance: 99
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
function switchPage(page) {
  document.getElementById(currentPage).style.display = "none";
  currentPage = page;
  document.getElementById(page).style.display = "block";
}
function reset() {
  localStorage.clear();
}
function updateConsole(message) {
  consoleMessage += message;
  document.getElementById("console").innerHTML = consoleMessage;
  document.getElementById("console").scrollTop = document.getElementById("console").scrollHeight;
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
function updateLevelElement(skill) {
  var skillLevelElement = document.getElementById(skill.name + "level");
  skillLevelElement.innerHTML = skill.message.level + skill.level;
}
function updateXP(skill) {
  var skillXpElement = document.getElementById(skill.name + "xp");
  skillXpElement.innerHTML = skill.message.xp + skill.xp;
}
var woodcutting = {
  xp: 0,
  level: 1,
  basetime: 1500,
  message: {
    xp: "Woodcutting XP: ",
    level: "Woodcutting Level: "
  },
  name: "woodcutting"
}

const trees = [{
  log: "Log",
  level: 1,
  xp: 7,
  progress: "normalTreeProgress"
},
{
log: "Oak Log",
level: 10,
xp: 10,
progress: "oakProgress"
},

{
log: "Willow Log",
level: 25,
xp: 25,
progress: "willowProgress"
},

{
log: "Teak Log",
level: 35,
xp: 35,
progress: "teakProgress"
},

{
log: "Maple Log",
level: 45,
xp: 45,
progress: "mapleProgress"
},

{
log: "Mahogany Log",
level: 55,
xp: 55,
progress: "mahoganyProgress"
},
{
log: "Yew Log",
level: 60,
xp: 60,
progress: "yewProgress"
},

{
log: "Magic Log",
level: 75,
xp: 75,
progress: "magicProgress"
},

{
log: "Redwood Log",
level: 90,
xp: 90,
progress: "redwoodProgress"
}]

function chopTree(tree){
  var tree = Number(tree);
  console.log(tree);
  console.log(trees[tree]);
  var obtainedItems = {};
  if(isWoodcutting && currentTree == tree){
    isWoodcutting = false;
    clearIntervals();
  } else {
    clearIntervals();
    isWoodcutting = true;
    currentTree = tree;
    if(woodcutting.level >= trees[tree].level){
      currentAction = setTimeout(doWoodcutting.bind(null, tree), woodcutting.basetime);
      //progressBar = setInterval(doProgressBar.bind(null, woodcutting, trees[tree].progress));
    } else {
      isWoodcutting = false;
      updateConsole("You need level " + trees[tree].level + " woodcutting to chop " + trees[tree].name + ".<br>");
    }
  }

  function doWoodcutting(tree){
    var obtainedLog = trees[tree].log;
    obtainedItems = {};
    obtainedItems[obtainedLog] = 1;
    woodcutting.xp += trees[tree].xp;
    currentAction = setTimeout(doWoodcutting.bind(null, tree), woodcutting.basetime);
    checkForLevelUp(woodcutting);
    saveSkill(woodcutting);
    updateXP(woodcutting);
    rollForNest();
    addToInventory(obtainedItems);
  }

  function rollForNest(){
    var roll = Math.random();
    if(roll <= .25){
      updateConsole("You got a nest!<br>");
      obtainedItems["Bird's Nest"] = 1;
    }
  }
}
