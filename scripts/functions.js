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
