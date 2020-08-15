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
