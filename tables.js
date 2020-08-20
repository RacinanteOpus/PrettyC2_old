
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function getBasicC2(HZE, isMesmer, challenge = "standard") {

  var zonesForBonus = 0; // zones needed for percentage increase
  var currentBonus = 0; // current percentage increases by

  var zonesForBonusIncrease = 0; // zones needed for bonus increase
  var bonusIncrease = 0; // bonus increases by how much

  var currentZone = 0; // current zone
  var currentPercent = 0; // current C2 percentage

  switch (challenge)
  {
  	case "standard":
    {
      zonesForBonus = 10;
      zonesForBonusIncrease = 100;
      bonusIncrease = isMesmer?3:1;
      currentBonus = isMesmer?3:1;
      break;
    }
  	case "Trimp":
    {
      zonesForBonus = 10;
      zonesForBonusIncrease = 40;
      bonusIncrease = 3;
      currentBonus = 3;
      break;
    }
  	case "Trapper":
    {
      zonesForBonus = 10;
      zonesForBonusIncrease = 50;
      bonusIncrease = 2;
      currentBonus = 1;
      break;
    }
  	case "Coordinate":
    {
      zonesForBonus = 3;
      zonesForBonusIncrease = 30;
      bonusIncrease = 1;
      currentBonus = 1;
      break;
    }
  	case "Obliterated":
    {
      zonesForBonus = 1;
      zonesForBonusIncrease = 10;
      bonusIncrease = 1;
      currentBonus = 1;
      break;
    }
  	case "Eradicated":
    {
      zonesForBonus = 1;
      zonesForBonusIncrease = 2;
      bonusIncrease = 2;
      currentBonus = 10;
      break;
    }
    case "Trappapalooza":
    {
      zonesForBonus = 10;
      zonesForBonusIncrease = 50;
      bonusIncrease = 2;
      currentBonus = 3;
      break;
    }
    default:
    {
      zonesForBonus = 10;
      zonesForBonusIncrease = 100;
      bonusIncrease = isMesmer?3:1;
      currentBonus = isMesmer?3:1;
      break;
    }
  }

  for (i = 0; i < Math.floor(HZE/zonesForBonus); i++)
  {
    currentZone += zonesForBonus;

  	var zonesAffected = currentZone - 701;
    var weirdBonus = 0;
    if (zonesAffected > 0 && zonesAffected < zonesForBonus)
    {
    	weirdBonus = 	Math.floor((currentBonus * (zonesForBonus-zonesAffected) +
      							currentBonus * 5 * zonesAffected) / zonesForBonus);
    }


    currentPercent += weirdBonus > 0 ? weirdBonus : currentBonus * (currentZone > 701 ? 5 : 1);
    if (currentZone%zonesForBonusIncrease == 0) currentBonus += bonusIncrease;
  }

	return currentPercent;
}


function getC2HZE(radiumHZE = 0){
	var zone = 701;
	zone += (radiumHZE > 100) ? 100 + (Math.floor(radiumHZE / 50) * 10) : Math.floor(radiumHZE / 10) * 10;
	return zone;
}

function doClick() {
    var foo = document.getElementById("foo");
    if (foo.value == "") return;

    var result = document.getElementById("result");
    var table = document.getElementById("c2table");
    var body = table.getElementsByTagName("tbody")[0];
    body.innerHTML = "";
	
    var c2 = 0;
    var c3 = 0;

    var easyC2 = ["Discipline", "Metal", "Size", "Balance", "Meditate"];
    var specialC2s = ["Trimp"];
    var challengesU2 = ["Unlucky", "Downsize", "Transmute", "Unbalance", "Duel"];

    var game = JSON.parse(LZString.decompressFromBase64(foo.value));
    foo.value = "";

    var hasMesmer = game.talents.mesmer.purchased;
    var HZReached = game.global.highestLevelCleared+1;
    var radHZReached = game.global.highestRadonLevelCleared;
    var prisonClear = game.global.prisonClear;
    var totalC2 = game.global.totalSquaredReward;

    if(HZReached >= 70) specialC2s.push("Trapper");
    if(prisonClear == 1) easyC2.push("Electricity");
    if(HZReached >= 120) specialC2s.push("Coordinate");
    if(HZReached >= 130) easyC2.push("Slow");
    if(HZReached >= 145) easyC2.push("Nom");
    if(HZReached >= 150) easyC2.push("Mapology");
    if(HZReached >= 165) easyC2.push("Toxicity");
    if(HZReached >= 180) { easyC2.push("Watch"); easyC2.push("Lead"); }
    if(HZReached >= 425) specialC2s.push("Obliterated");
    if(totalC2 >= 4500) specialC2s.push("Eradicated");
	
    if(radHZReached >= 59) challengesU2.push("Trappapalooza");
    if(radHZReached >= 69) challengesU2.push("Wither");
    if(radHZReached >= 84) challengesU2.push("Quest");
    if(radHZReached >= 105) challengesU2.push("Storm");
    if(radHZReached >= 115) challengesU2.push("Berserk");

    for (var i = 0; i < easyC2.length; i++) {
     var key = easyC2[i];
     var isAlt = i%2;

     var row = body.insertRow(-1);

     var cellChallenge = row.insertCell(0);
     var cellHZE = row.insertCell(1);
     var cellC2Percent = row.insertCell(2);

     if (game['c2'][key] !== undefined)
     {
        var c2HZE = Math.min(game['c2'][key], getC2HZE(radHZReached));
        cellChallenge.innerHTML = easyC2[i];
        cellChallenge.setAttribute("sorttable_customkey", "1 "+easyC2[i]);
        cellHZE.innerHTML = c2HZE;
        cellHZE.style.textAlign = "right";
	c2 += getBasicC2(c2HZE, hasMesmer);
        cellC2Percent.innerHTML = numberWithCommas(getBasicC2(c2HZE, hasMesmer)) + "%";
     	cellC2Percent.style.textAlign = "right";
     }

    }
    for (var j = 0; j < specialC2s.length; j++) {
     var key2 = specialC2s[j];
     var isAlt2 = (i+j)%2;

     var row2 = body.insertRow(-1);
     var cellChallenge2 = row2.insertCell(0);
     var cellHZE2 = row2.insertCell(1);
     var cellC2Percent2 = row2.insertCell(2);

     if (game['c2'][key2] !== undefined)
     {
     var c2HZE = Math.min(game['c2'][key2], getC2HZE(radHZReached));
     cellChallenge2.innerHTML = specialC2s[j];
     cellChallenge2.setAttribute("sorttable_customkey", "2 "+specialC2s[j]);
     cellHZE2.innerHTML = c2HZE;
     cellHZE2.style.textAlign = "right";
     var c2HZE = Math.min(game['c2'][key2], getC2HZE());
     c2 += getBasicC2(game['c2'][key2], hasMesmer,key2);
     cellC2Percent2.innerHTML = numberWithCommas(getBasicC2(game['c2'][key2], hasMesmer,key2)) + "%";
     cellC2Percent2.style.textAlign = "right";
     }
    }

    for (var k = 0; k < challengesU2.length; k++) {
     var key3 = challengesU2[k];
     var isAlt3 = (i+j+k)%2;

     var row3 = body.insertRow(-1);

     var cellChallenge3 = row3.insertCell(0);
     var cellHZE3 = row3.insertCell(1);
     var cellC2Percent3 = row3.insertCell(2);

     if (game['c2'][key3] !== undefined)
     {
        var c2HZE = Math.min(game['c2'][key3], radHZReached);
        cellChallenge3.innerHTML = key3;
     	cellChallenge3.setAttribute("sorttable_customkey", "3 "+key3);
        cellHZE3.innerHTML = c2HZE;
     	cellHZE3.style.textAlign = "right";
        var c2HZE = Math.min(game['c2'][key2], getC2HZE());
        c3 += getBasicC2(game['c2'][key3], hasMesmer,key3);
	cellC2Percent3.innerHTML = numberWithCommas(getBasicC2(game['c2'][key3], hasMesmer, key3)) + "%";     	
	cellC2Percent3.style.textAlign = "right";
     }
    }
    var footer = table.createTFoot();
    var rowTotal = footer.insertRow(0);
    var cellTotal = rowTotal.insertCell(0);
    var cellBlank = rowTotal.insertCell(1);
    var cellC2PercentT = rowTotal.insertCell(2);

    cellTotal.innerHTML = "Total C<sup>2</sup>";
    cellC2PercentT.innerHTML = numberWithCommas(c2) + "%";
    cellC2PercentT.style.textAlign = "right";
    
    
    rowTotal = footer.insertRow(0);
    cellTotal = rowTotal.insertCell(0);
    cellBlank = rowTotal.insertCell(1);
    cellC2PercentT = rowTotal.insertCell(2);

    cellTotal.innerHTML = "Total C<sup>3</sup>";
    cellC2PercentT.innerHTML = numberWithCommas(c3) + "%";
    cellC2PercentT.style.textAlign = "right";
	
    rowTotal = footer.insertRow(0);
    cellTotal = rowTotal.insertCell(0);
    cellBlank = rowTotal.insertCell(1);
    cellC2PercentT = rowTotal.insertCell(2);

    cellTotal.innerHTML = "Total:";
    cellC2PercentT.innerHTML = numberWithCommas(totalC2) + "%";
    cellC2PercentT.style.textAlign = "right";
};
