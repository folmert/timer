// FitAtMidlife.com Free Workout Timer
// Copyright 2006-20017 FitAtMidlife.com.  All rights reserved.
//
var CountSeconds = -1;
var IntervalSeconds = -1;
var IntervalIndex = -1;
var FlashSeconds = -1;
var TotalWorkTime = 0;
var TotalRestTime = 0;
var Pause = true;
var NotStarted = true;
var RoundCount = 0;
var gRepeated = false;
var lasttime;

// Const stuff.
var gTIMEOUT = 10;
var gCOOKIEPREFIX = "OSv4-";
var gCOOKIEOPTIONS = "OptionSetsV4";
var gCOOKIECURRENTNAME = "CurV4";
var gCOOKIELIFE = 1440;
// expiration in days
// Debug mode gives add'l sound options, like announcing the first 12 rounds ... "begin round 1". These audio files are too slow loading for general use
// It also provides easy access to some diagnostic & utility functions (like creating deep link query strings)
// To invoke debug mode, pass in ?debug or ?debug=true on the URL...
var gDEBUG = false;
var query = location.search.substring(1);
if (query.indexOf("debug") > -1)
 gDEBUG = true;

var TimeDisplay = null;
var RoundDisplay = null;
var TextDisplay = null;
var StoppedAtRoundLimit = false;

setInterval("UpdateCurrentTime()", 500);

function DdlOption(argText, argValue)
 {
    this.Text = argText;
    this.Value = argValue;
}

var aLengths = new Array();
aLengths[0] = new DdlOption("0 sec", "0");
aLengths[1] = new DdlOption("1 sec", "1000");
aLengths[2] = new DdlOption("2 sec", "2000");
aLengths[3] = new DdlOption("3 sec", "3000");
aLengths[4] = new DdlOption("4 sec", "4000");
aLengths[5] = new DdlOption("5 sec", "5000");
aLengths[6] = new DdlOption("6 sec", "6000");
aLengths[7] = new DdlOption("7 sec", "7000");
aLengths[8] = new DdlOption("8 sec", "8000");
aLengths[9] = new DdlOption("9 sec", "9000");
aLengths[10] = new DdlOption("10 sec", "10000");
aLengths[11] = new DdlOption("11 sec", "11000");
aLengths[12] = new DdlOption("12 sec", "12000");
aLengths[13] = new DdlOption("13 sec", "13000");
aLengths[14] = new DdlOption("14 sec", "14000");
aLengths[15] = new DdlOption("15 sec", "15000");
aLengths[16] = new DdlOption("16 sec", "16000");
aLengths[17] = new DdlOption("17 sec", "17000");
aLengths[18] = new DdlOption("18 sec", "18000");
aLengths[19] = new DdlOption("19 sec", "19000");
aLengths[20] = new DdlOption("20 sec", "20000");
aLengths[21] = new DdlOption("21 sec", "21000");
aLengths[22] = new DdlOption("22 sec", "22000");
aLengths[23] = new DdlOption("23 sec", "23000");
aLengths[24] = new DdlOption("24 sec", "24000");
aLengths[25] = new DdlOption("25 sec", "25000");
aLengths[26] = new DdlOption("26 sec", "26000");
aLengths[27] = new DdlOption("27 sec", "27000");
aLengths[28] = new DdlOption("28 sec", "28000");
aLengths[29] = new DdlOption("29 sec", "29000");
aLengths[30] = new DdlOption("30 sec", "30000");
aLengths[31] = new DdlOption("35 sec", "35000");
aLengths[32] = new DdlOption("36 sec", "36000");
aLengths[33] = new DdlOption("37 sec", "37000");
aLengths[34] = new DdlOption("38 sec", "38000");
aLengths[35] = new DdlOption("39 sec", "39000");
aLengths[36] = new DdlOption("40 sec", "40000");
aLengths[37] = new DdlOption("41 sec", "41000");
aLengths[38] = new DdlOption("42 sec", "42000");
aLengths[39] = new DdlOption("43 sec", "43000");
aLengths[40] = new DdlOption("44 sec", "44000");
aLengths[41] = new DdlOption("45 sec", "45000");
aLengths[42] = new DdlOption("46 sec", "46000");
aLengths[43] = new DdlOption("47 sec", "47000");
aLengths[44] = new DdlOption("48 sec", "48000");
aLengths[45] = new DdlOption("49 sec", "49000");
aLengths[46] = new DdlOption("50 sec", "50000");
aLengths[47] = new DdlOption("51 sec", "51000");
aLengths[48] = new DdlOption("52 sec", "52000");
aLengths[49] = new DdlOption("53 sec", "53000");
aLengths[50] = new DdlOption("54 sec", "54000");
aLengths[51] = new DdlOption("55 sec", "55000");
aLengths[52] = new DdlOption("56 sec", "56000");
aLengths[53] = new DdlOption("57 sec", "57000");
aLengths[54] = new DdlOption("58 sec", "58000");
aLengths[55] = new DdlOption("59 sec", "59000");
aLengths[56] = new DdlOption("1 min", "60000");
aLengths[57] = new DdlOption("1 min 5 sec", "65000");
aLengths[58] = new DdlOption("1 min 10 sec", "70000");
aLengths[59] = new DdlOption("1 min 15 sec", "75000");
aLengths[60] = new DdlOption("1 min 20 sec", "80000");
aLengths[61] = new DdlOption("1 min 25 sec", "85000");
aLengths[62] = new DdlOption("90 sec", "90000");
aLengths[63] = new DdlOption("1 min 35 sec", "95000");
aLengths[64] = new DdlOption("1 min 40 sec", "100000");
aLengths[65] = new DdlOption("1 min 45 sec", "105000");
aLengths[66] = new DdlOption("1 min 50 sec", "110000");
aLengths[67] = new DdlOption("1 min 55 sec", "115000");
aLengths[68] = new DdlOption("2 min", "120000");
aLengths[69] = new DdlOption("2 min 5 sec", "125000");
aLengths[70] = new DdlOption("2 min 10 sec", "130000");
aLengths[71] = new DdlOption("2 min 15 sec", "135000");
aLengths[72] = new DdlOption("2 min 20 sec", "140000");
aLengths[73] = new DdlOption("2 min 25 sec", "145000");
aLengths[74] = new DdlOption("2 min 30 sec", "150000");
aLengths[75] = new DdlOption("2 min 35 sec", "155000");
aLengths[76] = new DdlOption("2 min 40 sec", "160000");
aLengths[77] = new DdlOption("2 min 45 sec", "165000");
aLengths[78] = new DdlOption("2 min 50 sec", "170000");
aLengths[79] = new DdlOption("2 min 55 sec", "175000");
aLengths[80] = new DdlOption("3 min 30 sec", "210000");
aLengths[81] = new DdlOption("4 min", "240000");
aLengths[82] = new DdlOption("5 min", "300000");
aLengths[83] = new DdlOption("6 min 10 sec", "370000");
aLengths[84] = new DdlOption("7 min", "420000");
aLengths[85] = new DdlOption("8 min", "480000");
aLengths[86] = new DdlOption("9 min", "540000");
aLengths[87] = new DdlOption("10 min", "600000");
aLengths[88] = new DdlOption("11 min", "660000");
aLengths[89] = new DdlOption("12 min", "720000");
aLengths[90] = new DdlOption("13 min", "780000");
aLengths[91] = new DdlOption("14 min", "840000");
aLengths[92] = new DdlOption("15 min", "900000");
aLengths[93] = new DdlOption("16 min", "960000");
aLengths[94] = new DdlOption("17 min", "1020000");
aLengths[95] = new DdlOption("18 min", "1080000");
aLengths[96] = new DdlOption("19 min", "1140000");
aLengths[97] = new DdlOption("20 min", "1200000");
aLengths[98] = new DdlOption("21 min", "1260000");
aLengths[99] = new DdlOption("22 min", "1320000");
aLengths[100] = new DdlOption("23 min", "1380000");
aLengths[101] = new DdlOption("24 min", "1440000");
aLengths[102] = new DdlOption("25 min", "1500000");
aLengths[103] = new DdlOption("26 min", "1560000");
aLengths[104] = new DdlOption("27 min", "1620000");
aLengths[105] = new DdlOption("28 min", "1680000");
aLengths[106] = new DdlOption("29 min", "1740000");
aLengths[107] = new DdlOption("30 min", "1800000");
aLengths[108] = new DdlOption("31 min", "1860000");
aLengths[109] = new DdlOption("32 min", "1920000");
aLengths[110] = new DdlOption("33 min", "1980000");
aLengths[111] = new DdlOption("34 min", "2040000");
aLengths[112] = new DdlOption("35 min", "2100000");
aLengths[113] = new DdlOption("36 min", "2160000");
aLengths[114] = new DdlOption("37 min", "2220000");
aLengths[115] = new DdlOption("38 min", "2280000");
aLengths[116] = new DdlOption("39 min", "2340000");
aLengths[117] = new DdlOption("40 min", "2400000");
aLengths[118] = new DdlOption("41 min", "2460000");
aLengths[119] = new DdlOption("42 min", "2520000");
aLengths[120] = new DdlOption("43 min", "2580000");
aLengths[121] = new DdlOption("44 min", "2640000");
aLengths[122] = new DdlOption("45 min", "2700000");
aLengths[123] = new DdlOption("1 hour", "3600000");
aLengths[124] = new DdlOption("90 min", "5400000");
aLengths[125] = new DdlOption("2 hours", "7200000");
aLengths[126] = new DdlOption("4 hours", "14400000");
aLengths[127] = new DdlOption("8 hours", "28800000");
aLengths[128] = new DdlOption("999 hours", "3596400000");
aLengths[129] = new DdlOption("Random: 1-30 sec", "1000-30000");
aLengths[130] = new DdlOption("Random: 10-30 sec", "10000-30000");
aLengths[131] = new DdlOption("Random: 1-45 sec", "1000-45000");
aLengths[132] = new DdlOption("Random: 10-45 sec", "10000-45000");
aLengths[133] = new DdlOption("Random: 20-45 sec", "20000-45000");
aLengths[134] = new DdlOption("Random: 1-60 sec", "1000-60000");
aLengths[135] = new DdlOption("Random: 30-60 sec", "30000-60000");
aLengths[136] = new DdlOption("Random: 45-60 sec", "45000-60000");
aLengths[137] = new DdlOption("Random: 1-90 sec", "1000-90000");
aLengths[138] = new DdlOption("Random: 30-90 sec", "30000-90000");


var aSizes = new Array();
aSizes[0] = new DdlOption("1em", "1em");
aSizes[1] = new DdlOption("2em", "2em");
aSizes[2] = new DdlOption("3em", "3em");
aSizes[3] = new DdlOption("4em", "4em");
aSizes[4] = new DdlOption("5em", "5em");
aSizes[5] = new DdlOption("6em", "6em");
aSizes[6] = new DdlOption("7em", "7em");
aSizes[7] = new DdlOption("8em", "8em");
aSizes[8] = new DdlOption("9em", "9em");
aSizes[9] = new DdlOption("10em", "10em");
aSizes[10] = new DdlOption("11em", "11em");
aSizes[11] = new DdlOption("12em", "12em");
aSizes[12] = new DdlOption("13em", "13em");
aSizes[13] = new DdlOption("14em", "14em");
aSizes[14] = new DdlOption("15em", "15em");
aSizes[15] = new DdlOption("16em", "16em");
aSizes[16] = new DdlOption("17em", "17em");
aSizes[17] = new DdlOption("18em", "18em");
aSizes[18] = new DdlOption("19em", "19em");
aSizes[19] = new DdlOption("20em", "20em");
aSizes[20] = new DdlOption("25em", "25em");
aSizes[21] = new DdlOption("30em", "30em");
aSizes[22] = new DdlOption("35em", "35em");
aSizes[23] = new DdlOption("40em", "40em");
aSizes[24] = new DdlOption("45em", "45em");
aSizes[25] = new DdlOption("50em", "50em");
aSizes[26] = new DdlOption("55em", "55em");
aSizes[27] = new DdlOption("60em", "60em");

var aColors = new Array();
aColors[0] = new DdlOption("Green", "green");
aColors[1] = new DdlOption("Yellow", "yellow");
aColors[2] = new DdlOption("Red", "red");
aColors[3] = new DdlOption("Blue", "blue");
aColors[4] = new DdlOption("Silver", "silver");
aColors[5] = new DdlOption("Brown", "brown");
aColors[6] = new DdlOption("Orange", "orange");
aColors[7] = new DdlOption("White", "white");
aColors[8] = new DdlOption("Black", "black");

var aSounds = new Array();
aSounds[0] = new DdlOption("Bell", "bell1.mp3");
aSounds[1] = new DdlOption("Buzzer", "buzzer_x.mp3");
aSounds[2] = new DdlOption("Buzzer x 3", "buzzer3_x.mp3");
aSounds[3] = new DdlOption("Short 1", "short1.mp3");
aSounds[4] = new DdlOption("Short 2", "short2.mp3");
aSounds[5] = new DdlOption("Gong", "gong.mp3");

if (gDEBUG)
 {
    aSounds[6] = new DdlOption("Round 1", "round1.html");
    aSounds[7] = new DdlOption("Round 2", "round2.html");
    aSounds[8] = new DdlOption("Round 3", "round3.html");
    aSounds[9] = new DdlOption("Round 4", "round4.html");
    aSounds[10] = new DdlOption("Round 5", "round5.html");
    aSounds[11] = new DdlOption("Round 6", "round6.html");
    aSounds[12] = new DdlOption("Round 7", "round7.html");
    aSounds[13] = new DdlOption("Round 8", "round8.html");
    aSounds[14] = new DdlOption("Round 9", "round9.html");
    aSounds[15] = new DdlOption("Round 10", "round10.html");
    aSounds[16] = new DdlOption("Round 11", "round11.html");
    aSounds[17] = new DdlOption("Round 12", "round12.html");
    aSounds[18] = new DdlOption("Fight Complete", "fightcomplete.html");
}

var aYesNos = new Array();
aYesNos[0] = new DdlOption("Yes", "yes");
aYesNos[1] = new DdlOption("No", "no");

var aRounds = new Array();
aRounds[0] = new DdlOption("Don't stop", "-1");
aRounds[1] = new DdlOption("1 round", "1");
aRounds[2] = new DdlOption("2 rounds", "2");
aRounds[3] = new DdlOption("3 rounds", "3");
aRounds[4] = new DdlOption("4 rounds", "4");
aRounds[5] = new DdlOption("5 rounds", "5");
aRounds[6] = new DdlOption("6 rounds", "6");
aRounds[7] = new DdlOption("7 rounds", "7");
aRounds[8] = new DdlOption("8 rounds", "8");
aRounds[9] = new DdlOption("9 rounds", "9");
aRounds[10] = new DdlOption("10 rounds", "10");
aRounds[11] = new DdlOption("11 rounds", "11");
aRounds[12] = new DdlOption("12 rounds", "12");
aRounds[13] = new DdlOption("13 rounds", "13");
aRounds[14] = new DdlOption("14 rounds", "14");
aRounds[15] = new DdlOption("15 rounds", "15");
aRounds[16] = new DdlOption("16 rounds", "16");
aRounds[17] = new DdlOption("17 rounds", "17");
aRounds[18] = new DdlOption("18 rounds", "18");
aRounds[19] = new DdlOption("19 rounds", "19");
aRounds[20] = new DdlOption("20 rounds", "20");
aRounds[21] = new DdlOption("21 rounds", "21");
aRounds[22] = new DdlOption("22 rounds", "22");
aRounds[23] = new DdlOption("23 rounds", "23");
aRounds[24] = new DdlOption("24 rounds", "24");
aRounds[25] = new DdlOption("25 rounds", "25");
aRounds[26] = new DdlOption("26 rounds", "26");
aRounds[27] = new DdlOption("27 rounds", "27");
aRounds[28] = new DdlOption("28 rounds", "28");
aRounds[29] = new DdlOption("29 rounds", "29");
aRounds[30] = new DdlOption("30 rounds", "30");

function FieldMap(argShortId, argElementId)
 {
    this.ShortId = argShortId;
    this.ElementId = argElementId;
}

var aFieldMap = new Array();
aFieldMap[0] = new FieldMap("dRL", "ddlRoundLength");
aFieldMap[1] = new FieldMap("dWA", "ddlWarnAt");
aFieldMap[2] = new FieldMap("dIH", "ddlIntervalHigh");
aFieldMap[3] = new FieldMap("dIL", "ddlIntervalLow");
aFieldMap[4] = new FieldMap("dSI", "ddlStartInterval");
aFieldMap[5] = new FieldMap("dReL", "ddlRestLength");
aFieldMap[6] = new FieldMap("dBS", "ddlBeginSound");
aFieldMap[7] = new FieldMap("dLIS", "ddlLowIntervalSound");
aFieldMap[8] = new FieldMap("dHIS", "ddlHighIntervalSound");
aFieldMap[9] = new FieldMap("dTiFS", "ddlTimeFontSize");
aFieldMap[10] = new FieldMap("dRFS", "ddlRoundFontSize");
aFieldMap[11] = new FieldMap("dTFS", "ddlTextFontSize");
aFieldMap[12] = new FieldMap("dRC", "ddlRoundColor");
aFieldMap[13] = new FieldMap("dBC", "ddlBackgroundColor");
aFieldMap[14] = new FieldMap("dHC", "ddlHighColor");
aFieldMap[15] = new FieldMap("dST", "ddlShowTenths");
aFieldMap[16] = new FieldMap("dCD", "ddlCountDirection");
aFieldMap[17] = new FieldMap("dD", "ddlDelay");
aFieldMap[18] = new FieldMap("tON", "txtOptionsName");
aFieldMap[19] = new FieldMap("OSS", "OptionSetSelect");
aFieldMap[20] = new FieldMap("dRWA", "ddlRestWarnAt");
aFieldMap[21] = new FieldMap("dSA", "ddlStopAt");
aFieldMap[22] = new FieldMap("dFS", "ddlFinalSound");
aFieldMap[23] = new FieldMap("dWS", "ddlWarnSound");
// NOTE: These element ids are no longer used, but is included so the legacy cookie upgrade will map the old value to the new value properly
// Seeing as how it's no longer used, it should come at the END so the lookup by shortId returns the CORRECT element ID (ddlIntervalHigh)
aFieldMap[24] = new FieldMap("dIH", "ddlIntervalLength");
aFieldMap[25] = new FieldMap("dIS", "ddlIntervalSound");

function Interval(argLength, argDescription, argColor, argBeginSound, argEndSound, argCount, argWarnAt, argWarnSound, argTickAfterWarn, argWarnColor, argRepeat, argIntervalLengthHigh, argIntervalLengthLow, argLowIntervalSound, argHighIntervalSound, argIntensity, argIntervalHighColor, argStartInterval)
 {
    this.Length = argLength;
    this.Description = argDescription;
    this.Color = argColor;
    this.BeginSound = argBeginSound;
    this.EndSound = argEndSound;
    this.Count = argCount;
    this.WarnAt = argWarnAt;
    this.WarnSound = argWarnSound;
    this.TickAfterWarn = argTickAfterWarn;
    this.WarnColor = argWarnColor;
    this.Repeat = argRepeat;
    this.IntervalLengthHigh = argIntervalLengthHigh;
    this.IntervalLengthLow = argIntervalLengthLow;
    this.LowIntervalSound = argLowIntervalSound;
  	this.HighIntervalSound = argHighIntervalSound;
    this.StartInterval = argStartInterval;
    this.Intensity = argIntensity;
    this.IntervalHighColor = argIntervalHighColor;
}

var Intervals = new Array(3);

function Init()
 {
    TextDisplay = document.getElementById("TextDisplay");
    RoundDisplay = document.getElementById("RoundDisplay");
    TimeDisplay = document.getElementById("TimeDisplay");

    InitDdl();

    CheckForDefaultCookies();

    UncookifyAll(gCOOKIECURRENTNAME);

    initOptionSets();

    if (gDEBUG)
    document.getElementById("divDEBUG").style.display = "block";

    UpdateIntervals();

}

function InitDdl()
 {
    LoadDdlOptionsByName("ddlSize", aSizes, "");
    LoadDdlOptionsByName("ddlLength", aLengths, "");
    LoadDdlOptionsByName("ddlColor", aColors, "");
    LoadDdlOptionsByName("ddlBeginSound", aSounds, "");
    LoadDdlOptionsByName("ddlEndSound", aSounds, "");
    LoadDdlOptionsByName("ddlCount", aYesNos, "");
    LoadDdlOptionsByName("ddlWarnAt", aLengths, "");
    LoadDdlOptionsByName("ddlWarnSound", aSounds, "click_x.mp3");
    LoadDdlOptionsByName("ddlWarnColor", aColors, "");
    LoadDdlOptionsByName("ddlRestWarnAt", aLengths, "");
    LoadDdlOptionsByName("ddlRounds", aRounds, "");

    LoadDdlOptionsByName("ddlAnnounceMode", aYesNos, "No")

    LoadDdlOptionsById("ddlRoundColor", aColors, "Same as time color");
    LoadDdlOptionsById("ddlHighColor", aColors, "Same as time color");
    LoadDdlOptionsById("ddlBackgroundColor", aColors, "White");

    // Default values
    set("ddlRoundLength", "210000");
    set("ddlWarnAt", "5000");
    set("ddlRestWarnAt", "0");
    set("ddlRestLength", "0")
    set("ddlIntervalHigh", "0")
    set("ddlIntervalLow", "0");
    set("ddlStartInterval", "");
    set("ddlDelay", "0");
    set("ddlBeginSound", "");
    set("ddlWarnSound", "click_x.mp3");
    set("ddlLowIntervalSound", "");
   	set("ddlHighIntervalSound", "");
    set("ddlTextFontSize", "4em");
    set("ddlRoundFontSize", "8em");
    set("ddlTimeFontSize", "12em");
    set("ddlStopAt", "-1");
    set("ddlFinalSound", "");
}


// Called when option sets are changed
// Set everything to defaults (blanks)
// This is needed because legacy cookies may not have values for some of these fields.
function ClearAll()
 {
    // Default values
    set("ddlRoundLength", "");
    set("ddlWarnAt", "5000");
    set("ddlRestWarnAt", "");
    set("ddlRestLength", "")
    set("ddlIntervalHigh", "0")
    set("ddlIntervalLow", "0");
    set("ddlStartInterval", "");
    set("ddlDelay", "0");
    set("ddlBeginSound", "bell1.mp3");
    set("ddlWarnSound", "click_x.mp3");
    set("ddlLowIntervalSound", "");
	set("ddlHighIntervalSound", "");
  	set("ddlTextFontSize", "4em");
    set("ddlRoundFontSize", "8em");
    set("ddlTimeFontSize", "12em");
    set("ddlStopAt", "-1");
    set("ddlFinalSound", "");
    set("ddlHighColor", "Same as time color");
    set("ddlRoundColor", "Same as time color");
    set("ddlBackgroundColor", "White");
    set("ddlCountDirection", "Down");
    set("ddlShowTenths", "Hundreds");
}

// Load a DDL with options stored in some array (of Option objects)
// This selects elements based on Name
function LoadDdlOptionsByName(DdlName, OptionArray, sDefault)
 {
    var elems = document.getElementsByName(DdlName);
    for (var i = 0; i < elems.length; i++)
    {
        elems[i].options[0] = new Option("", "");
        for (var j = 0; j < OptionArray.length; j++)
        {
            elems[i].options[j + 1] = new Option(OptionArray[j].Text, OptionArray[j].Value);
            if (sDefault != "" && OptionArray[j].Value == sDefault)
            elems[i].selectedIndex = j + 1;
        }
    }
}

// Load a DDL with options stored in some array (of Option objects)
// This selects elements based on id
// Includes a default value NOT sourced from the array.
function LoadDdlOptionsById(DdlId, OptionArray, sDefault)
 {
    var elem = document.getElementById(DdlId);
    elem.options[0] = new Option(sDefault, sDefault);
    for (var j = 0; j < OptionArray.length; j++)
    elem.options[j + 1] = new Option(OptionArray[j].Text, OptionArray[j].Value);
}

function UpdateIntervals(silent)
 {
    if (!Pause && !silent) {
        if (!confirm("Are you sure you want to reset?"))
        return;
        Pause = true;
        gRepeated = false;
    }

    var IntervalCount = 0;
    Intervals = new Array();

    // Add a delay up front?
    if (retrieveZeroForBlank("ddlDelay") != "0")
    {
        Intervals[IntervalCount++] = new Interval(parseInt(retrieveZeroForBlank("ddlDelay")), "Starting...", "red", null, null, false, null, null, null, null, false, null, null, null, null, null, null);
    }

    // Are we repeating and decrementing?
    if (retrieveZeroForBlank("ddlDecrement") != "0") {

        var Length = parseInt(retrieveZeroForBlank("ddlRoundLength"));
        var Decrement = parseInt(retrieveZeroForBlank("ddlDecrement"));
        var Repeat = parseInt(retrieveZeroForBlank("ddlRepeatDecrement"));
        var DecrementCount = 0;

        Intervals = new Array();
        while (Length > 0) {
            Intervals[IntervalCount] = new Interval(Length, "WORK", "green", retrieve("ddlBeginSound"), null, true, (retrieve("ddlWarnAt") == "0" ? null: parseInt(retrieve("ddlWarnAt"))), (retrieve("ddlWarnAt") == "0" ? null: retrieve("ddlWarnSound")), true, "yellow", true, parseInt(retrieve("ddlIntervalHigh")), parseInt(retrieve("ddlIntervalLow")), retrieve("ddlLowIntervalSound"),retrieve("ddlHighIntervalSound"), (retrieve("ddlStartInterval") == "High" ? "HIGH INTENSITY": "LOW INTENSITY"), retrieve("ddlHighColor"), retrieve("ddlStartInterval"));
            Intervals[++IntervalCount] = new Interval(parseInt(retrieveZeroForBlank("ddlRestLength")), "REST", "red", retrieve("ddlBeginSound"), null, false, (retrieve("ddlRestWarnAt") == "0" ? null: parseInt(retrieve("ddlRestWarnAt"))), (retrieve("ddlRestWarnAt") == "0" ? null: retrieve("ddlWarnSound")), true, "red", true, null, null, null, null, null);
            DecrementCount++;
            if (DecrementCount == Repeat) {
                Length -= Decrement;
                DecrementCount = 0;
            }
        }
    }
    else {
        Intervals[IntervalCount++] = new Interval(parseInt(retrieveZeroForBlank("ddlRoundLength")), "WORK", "green", retrieve("ddlBeginSound"), null, true, (retrieve("ddlWarnAt") == "0" ? null: parseInt(retrieve("ddlWarnAt"))), (retrieve("ddlWarnAt") == "0" ? null: retrieve("ddlWarnSound")), true, "yellow", true, parseInt(retrieve("ddlIntervalHigh")), parseInt(retrieve("ddlIntervalLow")), retrieve("ddlLowIntervalSound"), retrieve("ddlHighIntervalSound"), (retrieve("ddlStartInterval") == "High" ? "HIGH INTENSITY": "LOW INTENSITY"), retrieve("ddlHighColor"), retrieve("ddlStartInterval"));
        Intervals[IntervalCount++] = new Interval(parseInt(retrieveZeroForBlank("ddlRestLength")), "REST", "red", retrieve("ddlBeginSound"), null, false, (retrieve("ddlRestWarnAt") == "0" ? null: parseInt(retrieve("ddlRestWarnAt"))), (retrieve("ddlRestWarnAt") == "0" ? null: retrieve("ddlWarnSound")), true, "red", true, null, null, null, null, null);
    }

    // make sure proper start settings are displayed.
    CountSeconds = Intervals[0].Length;
    IntervalSeconds = (Intervals[0].StartInterval == "High" ? Intervals[0].IntervalLengthHigh: Intervals[0].IntervalLengthLow);
    if (Intervals[0].IntervalLengthHigh > 0)
    Intervals[0].Intensity = Intervals[0].Description = (Intervals[0].StartInterval == "High" ? "HIGH INTENSITY": "LOW INTENSITY");
    UpdateDisplay(Intervals[0], Intervals[0].Color);

    IntervalIndex = -1;
    CountSeconds = -1;
    // This is important.  Don't mess with it.
    if (Pause && !silent)
    document.getElementById("btnStart").value = "Start";
}

// Replace blank selection with 0
function retrieveZeroForBlank(field)
 {
    var val = retrieve(field);

    // Handle randomized time length options
    // The Random time options are like 1000-10000 where 1000 is the min value , 10000 the max.
    if (val.indexOf("-") > -1)
    {
        // Parse out the min and max values
        // randomly pick a value between the min and max.
        var s = new String(val);
        var dashindex = s.indexOf("-");
        var min = s.substring(0, dashindex);
        var max = s.substring(dashindex + 1);
        var val = Math.floor((parseInt(max) - parseInt(min)) * Math.random()) + parseInt(min);
        return val;
    }
    else
    // Replace blank with zero
    return (retrieve(field) == "" ? "0": retrieve(field));
}

// This is the function invoked when Start button is clicked.
function Toggle(button)
 {
    Pause = !Pause;
    if (Pause)
    {
        // Now stopped
        button.value = "Start (Paused)";
    }
    else
    {

        // Did we last stop at a round stop? Is so, must reset round count first.
        if (StoppedAtRoundLimit)
        {
            RoundCount = 0;
            StoppedAtRoundLimit = false;
        }

        NotStarted = false;
        lasttime = new Date();
        // Starting...
        button.value = "Pause";
        Countdown();
    }
}

function Reset(button)
 {
    if (confirm("Are you sure you want to reset?"))
    {
        Pause = true;
        CountSeconds = Intervals[0].Length;
        IntervalSeconds = (Intervals[0].StartInterval == "High" ? Intervals[0].IntervalLengthHigh: Intervals[0].IntervalLengthLow);

        IntervalIndex = -1;
        CountSeconds = -1;
        IntervalSeconds = -1;
        gRepeated = false;
        document.getElementById("btnStart").value = "Start";
        NotStarted = true;
        UpdatePausedDisplay();

    }
}

function ResetRound(button)
 {
    if (!Pause)
    {
        if (Intervals[IntervalIndex].Count)
        RoundCount = 1;
        else
        RoundCount = 0;
    }
    else
    RoundCount = 0;

    UpdatePausedDisplay();

}

function Countdown()
 {

    var now = new Date();

    var SoundPlayed = false;

    if (Pause)
    return;

    var CurrentInterval = Intervals[IntervalIndex];

    if (CountSeconds < 0)
    {
        FlashSeconds = -1;

        if (retrieveZeroForBlank("ddlStopAt") > 0 && RoundCount == parseInt(retrieveZeroForBlank("ddlStopAt")))
        {
            CountSeconds = 0;
            UpdateDisplay(CurrentInterval, CurrentInterval.Color);

            Pause = true;
            CountSeconds = Intervals[0].Length;
            IntervalSeconds = (Intervals[0].StartInterval == "High" ? Intervals[0].IntervalLengthHigh: Intervals[0].IntervalLengthLow);

            IntervalIndex = -1;
            CountSeconds = -1;
            IntervalSeconds = -1;
            gRepeated = false;
            document.getElementById("btnStart").value = "Start";
            NotStarted = true;

            StoppedAtRoundLimit = true;

            // Play final sound, if any was specified
            if (retrieve("ddlFinalSound") != "")
            PlaySound(retrieve("ddlFinalSound"));

            return;
        }

        if (IntervalIndex == Intervals.length - 1)
        {
            // Sequence finished...
            if (CurrentInterval.EndSound != null)
            {
                PlaySound(CurrentInterval.EndSound);
                SoundPlayed = true;
            }

            IntervalIndex = -1;

            setTimeout(Countdown, gTIMEOUT);
            gRepeated = true;
            // Some sort of flag so we know we've cycled through all intervals at least once.
            // Silently (no prompt) reset the interval settings.
            // Need to do this mainly because the Randomized options (length) need to be reseeded.	
            UpdateIntervals(true);

            return;
            // We're done.
        }

        CurrentInterval = Intervals[++IntervalIndex];

        // If we're cycling through after the first go, skip intervals flagged to NOT repeat.
        // TODO: If you're Intervals aren't setup right this can cause an infinite loop
        while (gRepeated && CurrentInterval && !CurrentInterval.Repeat)
        CurrentInterval = Intervals[++IntervalIndex];

        if (!CurrentInterval)
        {
            IntervalIndex = -1;
            UpdateIntervals(true);
            setTimeout(Countdown, gTIMEOUT);
            return;
        }

        CountSeconds = CurrentInterval.Length;

        if (CurrentInterval.IntervalLengthHigh > 0)
        {
            CurrentInterval.Description = CurrentInterval.Intensity;
            IntervalSeconds = (Intervals[IntervalIndex].StartInterval == "High" ? Intervals[IntervalIndex].IntervalLengthHigh: Intervals[IntervalIndex].IntervalLengthLow);
        }
        else
        IntervalSeconds = -1;

        if (CurrentInterval.BeginSound != null)
        {
            PlaySound(CurrentInterval.BeginSound);
            SoundPlayed = true;
            if (CurrentInterval.Count == true)
            RoundCount++;
        }

        // Debug mode can announce rounds.
        if (gDEBUG && retrieve("ddlAnnounceMode") == "yes" && CurrentInterval.Count == true)
        PlaySound("round" + RoundCount + ".mp3");

    }

    var Color = CurrentInterval.Color;

    // How many milliseconds have elapsed since last time?
    // Using this calculation is the key to accuracy...
    var now = new Date();
    var mills = now - lasttime;
    lasttime = now;

    // Warning time?
    if (CurrentInterval.WarnAt != null && CountSeconds <= CurrentInterval.WarnAt && CurrentInterval.TickAfterWarn)
    {

        if (CurrentInterval.WarnAt > CountSeconds && FlashSeconds == -1)
        {
            PlaySound(CurrentInterval.WarnSound);
            SoundPlayed = true;
            FlashSeconds = 1000;
        }

        FlashSeconds -= mills;

        if (FlashSeconds < 0 && !SoundPlayed)
        {
            PlaySound("click_x.mp3");
            FlashSeconds = 1000;
        }

        if (FlashSeconds > 875)
        Color = "white";
        // make it flash!
        else
        Color = CurrentInterval.WarnColor;
    }

    // Interval change?
    IntervalSeconds -= mills;
    if (CurrentInterval.IntervalLengthHigh > 0 && IntervalSeconds <= 0) {
        // All the other sounds take precendence over internal change...
        if (!SoundPlayed)
		{
			if ( CurrentInterval.StartInterval == "High" )
				PlaySound(CurrentInterval.LowIntervalSound);
			else
				PlaySound(CurrentInterval.HighIntervalSound);
		}
			
        //Flip-flop intensity and the start interval
        CurrentInterval.StartInterval = (CurrentInterval.StartInterval == "High" ? "Low": "High");
        // Reset count			
        IntervalSeconds = (CurrentInterval.StartInterval == "High" ? CurrentInterval.IntervalLengthHigh: CurrentInterval.IntervalLengthLow);

        CurrentInterval.Intensity = (CurrentInterval.StartInterval == "High" ? "HIGH INTENSITY": "LOW INTENSITY");

        CurrentInterval.Description = CurrentInterval.Intensity;
        // Use intensity as the description.
    }

    UpdateDisplay(CurrentInterval, Color);
    setTimeout(Countdown, gTIMEOUT);

    CountSeconds -= mills;

    if (CurrentInterval.Count)
    TotalWorkTime += mills;
    else
    TotalRestTime += mills;

}

function UpdatePausedDisplay()
 {
    // Update the display to the initial interval, but only if we are paused!
    if (!Pause)
    return;

    if (IntervalIndex == -1)
    UpdateDisplay(Intervals[0], Intervals[0].Color);
    // Not running ... i.e. stopped
    else
    UpdateDisplay(Intervals[IntervalIndex], Intervals[IntervalIndex].Color);
    // Paused
}

function FormatTime(argMilliseconds)
 {
    TempCountSeconds = argMilliseconds / 1000;

    Minutes = parseInt(TempCountSeconds / 60);
    Seconds = TempCountSeconds - (parseInt(Minutes) * 60);

    Seconds = Math.round(Seconds * 1000) / 1000
    //This is needed to stop javascript math weirdness...
    var SecondsDisplay = (Seconds.toFixed(0) < 10 ? "0" + Seconds.toFixed(0) : Seconds.toFixed(0));

    return Minutes + ":" + SecondsDisplay;
}

function UpdateCurrentTime()
 {
    var tnow = new Date();
    var thours = tnow.getHours();
    var tminutes = tnow.getMinutes();
    var tseconds = tnow.getSeconds()
    var timeValue = "" + ((thours > 12) ? thours - 12: thours)
    if (timeValue == "0") timeValue = 12;
    timeValue += ((tminutes < 10) ? ":0": ":") + tminutes
    timeValue += ((tseconds < 10) ? ":0": ":") + tseconds
    timeValue += (thours >= 12) ? " P.M.": " A.M."
    setInnerHTML(document.getElementById("divCurrentTime"), timeValue)
}

function UpdateDisplay(argCurrentInterval, argColor)
 {
    var Minutes;
    var Seconds;

    var TempCountSeconds = (NotStarted || Pause ? Intervals[(IntervalIndex > -1 ? IntervalIndex: 0)].Length: CountSeconds);
    var OriginalSeconds = TempCountSeconds;

    if (retrieve("ddlCountDirection") == "Up")
    {
        TempCountSeconds = parseInt(argCurrentInterval.Length) - parseInt((CountSeconds == -1 ? argCurrentInterval.Length: CountSeconds));
    }
    TempCountSeconds = TempCountSeconds / 1000;

    Minutes = parseInt(TempCountSeconds / 60);
    Seconds = TempCountSeconds - (parseInt(Minutes) * 60);

    Seconds = Math.round(Seconds * 1000) / 1000
    //This is needed to stop javascript math weirdness...
    var SecondsDisplay = "";

    switch (retrieve("ddlShowTenths"))
    {
    case "Tenths":
        SecondsDisplay = (Seconds.toFixed(1) < 10 ? "0" + Seconds.toFixed(1) : Seconds.toFixed(1));
        break;
    case "Hundreds":
        SecondsDisplay = (Seconds.toFixed(2) < 10 ? "0" + Seconds.toFixed(2) : Seconds.toFixed(2));
        break;
    case "Thousands":
        SecondsDisplay = (Seconds.toFixed(3) < 10 ? "0" + Seconds.toFixed(3) : Seconds.toFixed(3));
        break;
    default:
        SecondsDisplay = (Seconds.toFixed(0) < 10 ? "0" + Seconds.toFixed(0) : Seconds.toFixed(0));
        break;
    }

    setInnerHTML(TimeDisplay, Minutes + ":" + SecondsDisplay);

	// Show countdown in title area.
    if (!Pause)
    	top.document.title = Minutes + ":" + SecondsDisplay;
    else
    	top.document.title = "Free Workout Timer (PC, MAC, SMARTPHONE, or TABLET)";

    setInnerHTML(RoundDisplay, RoundCount);
    setInnerHTML(TextDisplay, "&nbsp;" + argCurrentInterval.Description + "&nbsp;");

    setInnerHTML(document.getElementById("divTotalWorkTime"), FormatTime(TotalWorkTime))
    setInnerHTML(document.getElementById("divTotalRestTime"), FormatTime(TotalRestTime))
    setInnerHTML(document.getElementById("divTotalElapsedTime"), FormatTime(TotalWorkTime + TotalRestTime))

    TimeDisplay.style.color = argColor;
    TimeDisplay.style.fontSize = retrieve("ddlTimeFontSize");
    TimeDisplay.style.backgroundColor = retrieve("ddlBackgroundColor");

    RoundDisplay.style.color = (retrieve("ddlRoundColor") == "Same as time color" ? argColor: retrieve("ddlRoundColor"));
    RoundDisplay.style.fontSize = retrieve("ddlRoundFontSize");
    RoundDisplay.style.backgroundColor = retrieve("ddlBackgroundColor");

    TextDisplay.style.color = argColor;
    TextDisplay.style.fontSize = retrieve("ddlTextFontSize");
    TextDisplay.style.backgroundColor = retrieve("ddlBackgroundColor");

    if (argCurrentInterval.IntervalLengthHigh > 0 && argCurrentInterval.StartInterval == "High")
    {
        // I.e. problem???
        try
        {
            document.getElementById("TextDisplay").style.color = retrieve("ddlHighColor");
        }
        catch(err)
        {
            // do nothing
        }
    }

    return;
}


function GetShortId(ElementId)
 {
    for (var i = 0; i < aFieldMap.length; i++)
    if (aFieldMap[i].ElementId == ElementId)
    return aFieldMap[i].ShortId;

    return null;
}

function GetElementId(ShortId)
 {
    for (var i = 0; i < aFieldMap.length; i++)
    if (aFieldMap[i].ShortId == ShortId)
    return aFieldMap[i].ElementId;

    return null;
}

function Cookify(element, id)
 {
    if (id == null)
    id = element.id;

    var cookieid = GetShortId(id);

    if (cookieid == null)
    alert("Couldn't find FieldMap object for " + id);

    var value = "";
    if (element.options != null)
    value = element.options[element.selectedIndex].value;
    else
    value = element.value;

    // Must escape = and & in our own way... before we do the regular escaping	
    var valueAsString = new String(value);
    valueAsString = cookieid + '~' + valueAsString + '*';

    var s;
    if (readCookie(gCOOKIECURRENTNAME) != null)
    {
        //s = new String( unescape(readCookie(gCOOKIECURRENTNAME)))
        s = new String(readCookie(gCOOKIECURRENTNAME))
    }
    else
    {
        s = new String("");
    }

    // Parse out old field value, if present.  This will handle multiple!
    // Add new field value to the end.
    var fldIndex = s.indexOf(cookieid + '~');
    while (fldIndex > -1)
    {
        var ampIndex = s.indexOf('*', fldIndex);
        if (ampIndex > -1)
        s = s.substring(0, fldIndex - 1) + s.substring(ampIndex);
        fldIndex = s.indexOf(cookieid + '~');
    }

    s = s + valueAsString;

    eraseCookie(gCOOKIECURRENTNAME);
    createCookie(gCOOKIECURRENTNAME, s, 2);
}

function CookieUpgrade(value)
 {
    s = new String(value);
    for (var i = 0; i < aFieldMap.length; i++)
    {
        //Simply change the old (element id , like ddlRoundLength) to the new one (short id, like dRL)
        s = s.replace("%26" + aFieldMap[i].ElementId + "%3D", "*" + aFieldMap[i].ShortId + "~");
    }

    return s;
}

function CheckForDefaultCookies()
 {
    var LegacyCookiePrefix = "OSv25a-";
    var LegacyCookieOptions = "OptionSetsv25a";
    var LegacyCookieCurrentName = "Currentv25a";

    /* Older cookies are NOT compatible with this version :(
	// Upgrade v2 cookies to v4*/

    if (readCookie(LegacyCookieOptions) != null)
    {
        window.status = "Legacy cookies detected, upgrading now.";

        // First Upgrade the Option Sets.  No change in how the value is stored , just store it under the new name
        var legacyoptionsets = new String(readCookie(LegacyCookieOptions));
        eraseCookie(gCOOKIEOPTIONS);
        createCookie(gCOOKIEOPTIONS, legacyoptionsets + "Interval - 30 Sec,", gCOOKIELIFE); // NOTE: Adding new option set!
        eraseCookie(LegacyCookieOptions);
        window.status = "Step 1: Option Sets Upgraded.";

        if (readCookie(LegacyCookieCurrentName) != null)
        {
            var legacycurrent = new String(readCookie(LegacyCookieCurrentName));
            eraseCookie(gCOOKIECURRENTNAME);
            createCookie(gCOOKIECURRENTNAME, CookieUpgrade(legacycurrent), gCOOKIELIFE);
            eraseCookie(LegacyCookieCurrentName);
            window.status = "Step 2: Current Upgraded.";
        }

        // NOW fix all saved option sets.
        var all = legacyoptionsets.split(',');
        for (var i = 0; i < all.length; i++)
        {
            if (all[i] != "")
            {
                var current = readCookie(LegacyCookiePrefix + all[i]);
                eraseCookie(gCOOKIEPREFIX + all[i]);
                // Create new cookie, with new prefix, and the fix string appended on the end.
                createCookie(gCOOKIEPREFIX + all[i], CookieUpgrade(current), gCOOKIELIFE);
                eraseCookie(LegacyCookiePrefix + all[i]);
                window.status = "Step 3: Upgrade individual options.";
            }
        }

		// Have to add this new option set if upgrading from v25
		eraseCookie(gCOOKIEPREFIX + "Interval - 30 Sec");
		createCookie(gCOOKIEPREFIX + "Interval - 30 Sec","*dRL~300000*dWA~*dWS~*dIH~30000*dIL~30000*dSI~Low*dReL~60000*dBS~bell1.mp3*dHIS~short1.mp3*dLIS~short2.mp3*dTiFS~12em*dRFS~8em*dTFS~4em*dRC~Same as time color*dBC~white*dHC~Same as time color*dST~Hundreds*dCD~Down*dD~*tON~Interval - 30 Sec*OSS~Tabata*dRWA~*dSA~-1*dFS~*", gCOOKIELIFE);

        window.status = "Cookies upgraded to new version.";
    }


    // Set a few default option sets, if none exist.
    if (readCookie(gCOOKIEOPTIONS) == null)
    {
        eraseCookie(gCOOKIEOPTIONS);
        // Important: This cookie value must START and END with a comma fosr parsing!
        createCookie(gCOOKIEOPTIONS, ",Boxing 2 minute,Boxing 3 minute,MMA,Tabata,Stopwatch,Interval - 30 Sec,", gCOOKIELIFE);

        eraseCookie(gCOOKIEPREFIX + "Boxing 2 minute");
        createCookie(gCOOKIEPREFIX + "Boxing 2 minute", "*dRL~120000*dWA~10000*dWS~buzzer_x.mp3*dIH~*dIL~*dSI~*dReL~60000*dBS~bell1.mp3*dHIS~*dLIS~*dTiFS~12em*dRFS~8em*dTFS~4em*dRC~Same as time color*dBC~white*dHC~Same as time color*dST~Hundreds*dCD~Down*dD~*tON~Boxing 2 minute*OSS~Boxing 2 minute*dRWA~*dSA~-1*dFS~*", gCOOKIELIFE);

        eraseCookie(gCOOKIEPREFIX + "Boxing 3 minute");
        createCookie(gCOOKIEPREFIX + "Boxing 3 minute", "*dRL~180000*dWA~10000*dWS~buzzer_x.mp3*dIH~*dIL~*dSI~*dReL~60000*dBS~bell1.mp3*dHIS~*dLIS~*dTiFS~12em*dRFS~8em*dTFS~4em*dRC~Same as time color*dBC~white*dHC~Same as time color*dST~Hundreds*dCD~Down*dD~*tON~Boxing 3 minute*dRWA~*dSA~-1*dFS~*", gCOOKIELIFE);

        eraseCookie(gCOOKIEPREFIX + "MMA");
        createCookie(gCOOKIEPREFIX + "MMA", "*dRL~300000*dWA~10000*dWS~buzzer_x.mp3*dIH~*dIL~*dSI~*dReL~60000*dBS~bell1.mp3*dHIS~*dLIS~*dTiFS~12em*dRFS~8em*dTFS~4em*dRC~Same as time color*dBC~white*dHC~Same as time color*dST~Hundreds*dCD~Down*dD~*tON~MMA*dRWA~*dSA~-1*dFS~*", gCOOKIELIFE);

        eraseCookie(gCOOKIEPREFIX + "Tabata");
        createCookie(gCOOKIEPREFIX + "Tabata", "*dRL~20000*dWA~*dWS~*dIH~*dIL~*dSI~*dReL~10000*dBS~bell1.mp3*dHIS~*dLIS~*dTiFS~12em*dRFS~8em*dTFS~4em*dRC~Same as time color*dBC~white*dHC~Same as time color*dST~Hundreds*dCD~Down*dD~*tON~Tabata*dRWA~*dSA~-1*dFS~*", gCOOKIELIFE);

        eraseCookie(gCOOKIEPREFIX + "Stopwatch");
        createCookie(gCOOKIEPREFIX + "Stopwatch", "*dRL~28800000*dWA~*dWS~*dIH~*dIL~*dSI~*dReL~*dBS~bell1.mp3*dHIS~*dLIS~*dTiFS~12em*dRFS~8em*dTFS~4em*dRC~white*dBC~white*dHC~Same as time color*dST~Hundreds*dCD~Up*dD~*tON~Stopwatch*dRWA~*dSA~-1*dFS~*", gCOOKIELIFE);

		eraseCookie(gCOOKIEPREFIX + "Interval - 30 Sec");
		createCookie(gCOOKIEPREFIX + "Interval - 30 Sec","*dRL~300000*dWA~*dWS~*dIH~30000*dIL~30000*dSI~Low*dReL~60000*dBS~bell1.mp3*dHIS~short1.mp3*dLIS~short2.mp3*dTiFS~12em*dRFS~8em*dTFS~4em*dRC~Same as time color*dBC~white*dHC~Same as time color*dST~Hundreds*dCD~Down*dD~*tON~Interval - 30 Sec*OSS~Tabata*dRWA~*dSA~-1*dFS~*", gCOOKIELIFE);

        window.status = "Default cookies created.";

    }

}

function CookifyAll()
 {
    Cookify(document.getElementById("ddlRoundLength"));
    Cookify(document.getElementById("ddlWarnAt"));
    Cookify(document.getElementById("ddlWarnSound"));
    Cookify(document.getElementById("ddlIntervalHigh"));
    Cookify(document.getElementById("ddlIntervalLow"));
    Cookify(document.getElementById("ddlStartInterval"));
    Cookify(document.getElementById("ddlRestLength"));
    Cookify(document.getElementById("ddlBeginSound"));
    Cookify(document.getElementById("ddlHighIntervalSound"));
	Cookify(document.getElementById("ddlLowIntervalSound"));
    Cookify(document.getElementById("ddlTimeFontSize"));
    Cookify(document.getElementById("ddlRoundFontSize"));
    Cookify(document.getElementById("ddlTextFontSize"));
    Cookify(document.getElementById("ddlRoundColor"));
    Cookify(document.getElementById("ddlBackgroundColor"));
    Cookify(document.getElementById("ddlHighColor"));
    Cookify(document.getElementById("ddlShowTenths"));
    Cookify(document.getElementById("ddlCountDirection"));
    Cookify(document.getElementById("ddlDelay"));
    Cookify(document.getElementById("txtOptionsName"));
    Cookify(document.getElementById("OptionSetSelect"));
    Cookify(document.getElementById("ddlRestWarnAt"));
    Cookify(document.getElementById("ddlStopAt"));
    Cookify(document.getElementById("ddlFinalSound"));
}

function UncookifyAll(name)
 {
    if (readCookie(name) == null)
    return;

    var s = new String(readCookie(name));
    var allf = s.split("*")
    for (var i = 0; i < allf.length; i++)
    {
        if (allf[i].indexOf("~") > -1)
        {
            var field = allf[i].substring(0, allf[i].indexOf("~"));
            var value = allf[i].substr(allf[i].indexOf("~") + 1);
            field = GetElementId(field);
            if (field == null)
            continue;
            // Skip any bad cookified data
            var elem = document.getElementById(field);

            if (elem == null)
            // If couldnt find the element, skip it!
            continue;

            if (elem.options != null)
            {
                for (var j = 0; j < elem.options.length; j++)
                {
                    if (elem.options[j].value == value)
                    {
                        elem.selectedIndex = j;
                        break;
                    }
                }
            }
            else
            elem.value = value;
        }
    }
}

function SaveOptions()
 {
    document.getElementById("txtOptionsName").style.backgroundColor = "white";

    var name = document.getElementById("txtOptionsName").value;
    if (name == "")
    {
        alert("You must specify a name first!");
        document.getElementById("txtOptionsName").focus();
        document.getElementById("txtOptionsName").style.backgroundColor = "yellow";
        return;
    }

    var optionsets = readCookie(gCOOKIEOPTIONS);
    if (optionsets == null)
    optionsets = "," + name + ",";
    else
    {
        var ops = new String(optionsets);
        if (ops.indexOf("," + name + ",") == -1)
        {
            optionsets = optionsets + name + ",";
        }
    }

    eraseCookie(gCOOKIEOPTIONS);
    createCookie(gCOOKIEOPTIONS, optionsets, gCOOKIELIFE);

    var current = readCookie(gCOOKIECURRENTNAME);

    eraseCookie(gCOOKIEPREFIX + name);
    createCookie(gCOOKIEPREFIX + name, current, gCOOKIELIFE);

    initOptionSets();

    // Must do this because of bug where selected choice name not showing in the DDL?
    // Setting the selected index of the DDL.
    var ddl = document.getElementById("OptionSetSelect");
    for (var i = 0; i < ddl.options.length; i++)
    {
        if (ddl.options[i].value == name)
        {
            ddl.selectedIndex = i;
            break;
        }
    }

}

function GetDeepLink()
 {
    var current = readCookie(gCOOKIECURRENTNAME);
    prompt("Current Cookie Settings", current);
}

function initOptionSets()
 {
    var selecto = document.getElementById("OptionSetSelect");
    selecto.style.display = "block";

    // Clear out options.
    selecto.options.length = 0;

    var count = 0;
    var optionsets = readCookie(gCOOKIEOPTIONS);
    if (optionsets != null)
    {
        var all = optionsets.split(',').sort();
        for (var i = 0; i < all.length; i++)
        {
            if (all[i] != "")
            {
                count++;
                selecto.options[selecto.options.length] = new Option(all[i], all[i]);
            }
        }
    }

    if (count == 0)
    {
        selecto.options[selecto.options.length] = new Option("None (use Save below to add)", "");
        selecto.selectedIndex = 0;
    }
    else
    {
        // Must have option for "blank" if there are saved options!
        selecto.options[selecto.options.length] = new Option("", "");
        selecto.selectedIndex = selecto.options.length - 1;
    }

}

function changeOptions(ddl)
 {
    Button = document.getElementById("btnStart");
    if (!Pause)
    {
        Toggle(Button);
        NotStarted = true;
    }

    // What they selected.
    var name = ddl.options[ddl.selectedIndex].value;

    ClearAll();

    var cookiename = gCOOKIEPREFIX + ddl.options[ddl.selectedIndex].value;
    UncookifyAll(cookiename);

    var deloption = document.getElementById("aDeleteOption");
    deloption.style.display = "inline";

    UpdateIntervals();

    UpdateDisplay(Intervals[0], Intervals[0].Color);

    // When you change options, this is an easy way to remember the "current" settings
    // ... no need to call Cookify for each individual UI element.
    var newlyselected = readCookie(cookiename);
    eraseCookie(gCOOKIECURRENTNAME);
    createCookie(gCOOKIECURRENTNAME, newlyselected, gCOOKIELIFE);

    SaveBox = document.getElementById("txtOptionsName");
    SaveBox.value = name;

    // Must do this because of bug where selected choice name not showing in the DDL?
    // Setting the selected index of the DDL.
    for (var i = 0; i < ddl.options.length; i++)
    {
        if (ddl.options[i].value == name)
        {
            ddl.selectedIndex = i;
            break;
        }
    }
}

function deleteOption()
 {
    var ddl = document.getElementById("OptionSetSelect");
    var name = ddl.options[ddl.selectedIndex].value;

    if (name == "")
    return;

    if (!confirm("Are you sure you want to delete " + name + "?"))
    return;

    var optionsets = readCookie(gCOOKIEOPTIONS);
    if (optionsets == null)
    return;

    var newoptionsets = ",";

    var all = optionsets.split(',');

    for (var i = 0; i < all.length; i++)
    {
        if (all[i] != name)
        {
            newoptionsets = newoptionsets + all[i] + ",";
        }
    }

    var elem = document.getElementById("txtOptionsName");
    elem.value = "";
    eraseCookie(gCOOKIEOPTIONS);
    createCookie(gCOOKIEOPTIONS, newoptionsets, gCOOKIELIFE);
    eraseCookie(gCOOKIEPREFIX + name);
    initOptionSets();
}


function ToggleShowOptions()
 {
    document.getElementById("OptionsTable").style.display = (document.getElementById("OptionsTable").style.display == "none" ? "block": "none");
    setInnerHTML(document.getElementById("OptionsToggleAnchor"), (document.getElementById("OptionsTable").style.display == "block" ? "<h3>Options (Hide)</h3>": "<h3>Options (Show)</h3>"));
}

//
// Utility Functions
//
// Get selected value of a DDL
function retrieve(ddlName)
 {
    var ddl = document.getElementById(ddlName);
    return ddl.options[ddl.selectedIndex].value;
}

// Set selected value of a DDL
function set(ddlName, value)
 {
    var ddl = document.getElementById(ddlName);
    for (var j = 0; j < ddl.options.length; j++)
    {
        if (value == ddl.options[j].value)
        {
            ddl.selectedIndex = j;
            break;
        }
    }
}

// Cookie functions
function createCookie(name, value, days)
 {
    if (days)
    {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        var expires = "expires=" + date.toGMTString();
    }
    else var expires = "";
    // Safari very pick about order that these are in!
    document.cookie = name + "=" + escape(value) + "; path=/; " + expires;
}

function readCookie(name)
 {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++)
    {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return unescape(c.substring(nameEQ.length, c.length));
    }
    return null;
}

function eraseCookie(name)
 {
    createCookie(name, "", -1);
}

function setInnerHTML(obj, value)
 {
    obj.innerHTML = "<span>" + value + "</span>";
}

function setInnerText(obj, value)
 {
    if (obj.innerText) {
        // IE;
        obj.innerText = value;
    }
    else {
        if (obj.textContent)
        {
            obj.textContent = value;
        }
        else
        obj.text = value;
    }
}

function PlaySound(soundsrc)
 {
	
	if (soundsrc == null)
		return;
		
	if ( soundsrc == "")
		return;
	
    var sound = document.getElementById("Sound");
    sound.src = soundsrc;
    sound.play();
    /*
   
        // Firefox and others..
        var thissound = document.getElementById(soundsrc);
        try
        {
            thissound.play();
        }
        catch(e)
        {
            thissound.play();
        }
        */
   }
