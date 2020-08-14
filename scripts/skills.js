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
