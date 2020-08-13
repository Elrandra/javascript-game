function updateXP(skill){
  var skillXpElement = document.getElementById(skill.name+"xp");
  skillXpElement.innerHTML = skill.message.xp + skill.xp;
}

function doProgressBar(skill, bar){
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

function switchPage(page){
  document.getElementById(currentPage).style.display = "none";
  currentPage = page;
  document.getElementById(page).style.display = "block";
}

function onLoad(){
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

function resetProgressElements(){
  for(i = 0; i < rocks.length; i++){
    document.getElementById(rocks[i].progress).style.width = "0%";
  }
}

function loadInventory(){
  if(localStorage.getItem("inventory") == null){
    inventory = {};
  } else {
    inventory = JSON.parse(localStorage.getItem("inventory"));
  }
}

function loadSkills(){
  if(JSON.parse(localStorage.getItem("mining"))!= null){
      mining = JSON.parse(localStorage.getItem("mining"));
  }
  document.getElementById("miningxp").innerHTML = mining.message.xp + " " + mining.xp;
  document.getElementById("mininglevel").innerHTML = mining.message.level + " " + mining.level;
}

function saveSkill(skill){
  localStorage.setItem(skill.name, JSON.stringify(skill));
  console.log(skill.name);
}

function reset(){
  localStorage.clear();
}

function updateLevelElement(skill){
  var skillLevelElement = document.getElementById(skill.name+"level");
  skillLevelElement.innerHTML = skill.message.level + skill.level;
}

function updateConsole(message){
  consoleMessage += message;
  document.getElementById("console").innerHTML = consoleMessage;
}

function addToInventory(obtainedItems){
  var itemKeys = Object.keys(obtainedItems);
  for(i = 0; i < itemKeys.length; i++){
    if(itemKeys[i] in inventory){
      var curAmount = Number(inventory[itemKeys[i]]);
      var newAmount = Number(obtainedItems[itemKeys[i]]);
      inventory[itemKeys[i]] += newAmount;
      console.log(items[itemKeys[i]]);
    } else {
      inventory[itemKeys[i]] = obtainedItems[itemKeys[i]];
      console.log(items[itemKeys[i]]);
    }
  }
  updateInventory(obtainedItems);
}

function onLoadInventory(){
  var invKeys = Object.keys(inventory);
  console.log(invKeys);
  for(i = 0; i < invKeys.length; i++){
    var item = items[invKeys[i]];
    console.log(item);
    document.getElementById("inventory").innerHTML += "<div class='item' id='item-"+item+"'><object type='image/svg+xml' data='" + item.icon + "' class='itemImage'></object><div class='itemAmount' id='amount-"+item.name+"'>" + inventory[invKeys[i]]+ "</div></div>";
    console.log(item);
  }
}

function updateInventory(obtainedItems){
  var invMessage = "";
  var invKeys = Object.keys(inventory);
  var obtainedKeys = Object.keys(obtainedItems);
  for(i =0; i < obtainedKeys.length; i++){
    var item = obtainedKeys[i];
    if(inventory[obtainedKeys[i]] == 1){
      document.getElementById("inventory").innerHTML += "<div class='item' id='item-"+item+"'><object type='image/svg+xml' data='" + items[item].icon + "' class='itemImage'></object><div class='itemAmount' id='amount-"+item+"'>" + inventory[invKeys[i]]+ "</div></div>";
    } else {
      var itemId = obtainedKeys[i];
      var amt = inventory[obtainedKeys[i]];
      console.log(amt);
      console.log("amount-"+itemId);
      document.getElementById("amount-"+itemId).innerHTML = amt;

    }
  }
  //document.getElementById("inventory").innerHTML = invMessage;
  saveInventory();
}

function saveInventory(){
  localStorage.setItem("inventory", JSON.stringify(inventory));
}
