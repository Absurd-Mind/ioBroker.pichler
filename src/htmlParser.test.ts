import { expect } from "chai";
import cheerio from "cheerio";
import { HtmlParser } from "./htmlParser";

describe("HtmlParser", () => {
	let parser: HtmlParser;

	beforeEach(() => {
		parser = new HtmlParser();
	});

	it("should parse HTML correctly", () => {
		const originalHtml = `<!DOCTYPE html><html lang="en"><head><meta name="viewport" content="width=610"><meta charset="UTF-8"><meta http-equiv="refresh" content="50"><style>
.myButton { background-color:#2f2f2f; height:60px; width:60px; border-radius:50%; border:0px solid #18ab29; display:inline-block; cursor:pointer; color:#ff8000; font-size:40px; padding: 0px 0px;}
.myButtonMenu { background-color:#2f2f2f; height:66px; width:66px; border-radius:20%; border:3px solid #18ab29; display:inline-block; cursor:pointer; color:#306108; font-size:50px; padding: 0px 0px;}
.myButtonRotate { background-color:#2f2f2f; height:60px; width:60px; border-radius:50%; border:0px solid #18ab29; display:inline-block; cursor:pointer; color:#ff8000; font-size:40px; padding: 0px 0px; -webkit-animation: spin 2s linear 5; animation: spin 2s linear 5;}
.myButtonRotateInf { background-color:#2f2f2f; height:60px; width:60px; border-radius:50%; border:0px solid #18ab29; display:inline-block; cursor:pointer; color:#ff8000; font-size:40px; padding: 0px 0px; -webkit-animation: spin 2s linear infinite; animation: spin 2s linear infinite;}
@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); }}
input[type=text]:disabled{-webkit-text-fill-color:currentcolor; opacity:1;}
input[type=text]{padding-left:1px; padding-right:1px; border:1px solid red; border-radius:6px; font-size:24px; background-color:#ffff99;}
input[type=text]:focus{background-color:lightblue;}
input[type=password]{border:1px solid red; border-radius:6px; font-size:24px; background-color:#ffff99;}
input[type=password]:focus{background-color:lightblue;}
.roundedCorners{border-radius: 10px;}
.roundedBorderBl{border-radius:10px; border:2px solid #3333ff;}
.roundedBorderOr{border-radius:10px; border:2px solid #ff8000;}
.roundedTop{border-radius:10px 10px 0px 0px;}
.roundedBot{border-radius:0px 0px 10px 10px;}
.namefile{color:green; overflow-wrap:break-word;}
.inputfile{width:0.1px; height:0.1px; opacity:0; overflow:hidden; position:absolute; z-index:-1;}
.inputfile + label{height:40px; vertical-align:middle; font-size:20px; padding-left:5px; padding-right:5px; border:1px solid red; border-radius:6px; color:black; background-color:lightblue; display:table-cell; cursor:pointer;}
</style></head>
<body style="background-color:#010101;"><table class="roundedBorderBl" border="0" cellpadding="0" style="background-color:#4d4dff; font-family:Arial,sans-serif; color:#ffffff; font-size:22px;" height="60" width="600"><tr><td width=10>&nbsp;</td><td width=360>Pichler Dosiertechnik</td><td width=156>V3.12-App</td><td width=60></td></tr></table><table style="background-color:#010101" height="4px" width="600"><tr></tr></table><table class="roundedBorderOr" border="0" cellpadding="0" style="background-color:#cc6600; font-family:Arial,sans-serif; color:#ffffff; font-size:28px;" height="75" width="600"><tr><td width=10>&nbsp;</td><td width=360>Dosieranlage&nbsp;V3.29&nbsp;</td><td width=216>WPD-A4 Mini</td></tr><tr><td width=10>&nbsp;</td><td width=360 style=font-size:22px;>name</td><td width=216 style=font-size:22px;>&#128225;50%</td></tr></table><table style="background-color:#010101" height="4px" width="600"><tr></tr></table>
<table class="roundedCorners" border="0" cellpadding="0" style="background-color:#2f2f2f; font-family:Arial,sans-serif; color:#e0e0e0; font-size:22px;" height="85" width="600"><tr><form action="/commandPage"><td width="8"></td><td width="4" style=background-color:></td><td width=95><button class="myButtonMenu" type="submit" name="COMMAND" value="network" title="network">&#128225;</button></td><td width=95><button class="myButtonMenu" type="submit" name="COMMAND" value="update" title="update">&#128190;</button></td><td width=95><button class="myButtonMenu" type="submit" name="COMMAND" value="extra" title="extra">&#128736;</button></td><td width=95><button class="myButtonMenu" type="submit" name="COMMAND" value="values" title="values">&#128200;</button></td><td width=95><button class="myButtonMenu" type="submit" name="COMMAND" value="param" title="param">&#128218;</button></td></form></tr><td width="8"></td><td width="4" style=background-color:></td><td width=95>Wlan</td><td width=95>Update</td><td width=95>Extra</td><td width=95 style=color:#FF8000>Werte</td><td width=95>Param</td></tr></table>
<table style="background-color:#010101" height="4px" width="600"><tr></tr></table>
<table class="roundedTop" border="0" cellpadding="0" style="background-color:#2f2f2f; font-family:Arial,sans-serif; color:#e0e0e0; font-size:14px;" height="20" width="600"><tr><td width="8"></td><td width="4" style=background-color:#2f2f2f></td><td width=421>&nbsp;</td><td width=80 align="right"style=color:#ff4400;><b>Offline</b></td><td width=75>&nbsp;|&nbsp;Daten&nbsp;&#128077;</td></tr></table><table style="background-color:#393939" height="2px" width="600"><tr></tr></table><table border="0" cellpadding="0" style="background-color:#2f2f2f; font-family:Arial,sans-serif; color:#e0e0e0; font-size:30px;" height="44" width="600"><tr><td width="8"></td><td width="4" style=background-color:#FF0000></td><td width=120>&nbsp;&nbsp;&nbsp;PH</td><td width=30>:</td><td width=96 style=color:#00ff00><b>&nbsp;7.2</b></td><td width=64>pH</td><td width=58 style="text-align:center; font-size:12px;">-8mV<br>638</td><td width=202 style=font-size:20px>min/max&nbsp;:&nbsp;6.3 / 8.2</td></tr></table><table style="background-color:#393939" height="2px" width="600"><tr></tr></table><table border="0" cellpadding="0" style="background-color:#2f2f2f; font-family:Arial,sans-serif; color:#e0e0e0; font-size:30px;" height="44" width="600"><tr><td width="8"></td><td width="4" style=background-color:#FFFF00></td><td width=120>&nbsp;&nbsp;&nbsp;RE</td><td width=30>:</td><td width=96 style=color:#00ff00><b>&nbsp;680</b></td><td width=64>mV</td><td width=58 style="text-align:center; font-size:12px;">743mV<br>738</td><td width=202 style=font-size:20px>min/max&nbsp;:&nbsp;500 / 850</td></tr></table><table style="background-color:#393939" height="2px" width="600"><tr></tr></table><table border="0" cellpadding="0" style="background-color:#2f2f2f; font-family:Arial,sans-serif; color:#e0e0e0; font-size:30px;" height="44" width="600"><tr><td width="8"></td><td width="4" style=background-color:#FFFFFF></td><td width=120>&nbsp;&nbsp;&nbsp;DF</td><td width=30>:</td><td width=96 style=color:#00ff00><b>&nbsp;An</b></td><td width=64></td><td width=58 style="text-align:center; "></td><td width=202 style=font-size:20px></td></tr></table><table style="background-color:#393939" height="2px" width="600"><tr></tr></table><table style="background-color:#010101" height="4px" width="600"><tr></tr></table><table style="background-color:#393939" height="2px" width="600"><tr></tr></table><table border="0" cellpadding="0" style="background-color:#2f2f2f; font-family:Arial,sans-serif; color:#e0e0e0; font-size:30px;" height="44" width="600"><tr><td width="8"></td><td width="4" style=background-color:#FFFFFF></td><td width=120>&nbsp;&nbsp;&nbsp;Start</td><td width=30>:</td><td width=96 style=color:><b>&nbsp; 0</b></td><td width=64>min</td><td width=58 style="text-align:center; "></td><td width=202 style=font-size:20px>Startverzoegerung</td></tr></table><table style="background-color:#393939" height="2px" width="600"><tr></tr></table><table border="0" cellpadding="0" style="background-color:#2f2f2f; font-family:Arial,sans-serif; color:#e0e0e0; font-size:30px;" height="44" width="600"><tr><td width="8"></td><td width="4" style=background-color:#FF0000></td><td width=120>&nbsp;&nbsp;&nbsp;Fs PH</td><td width=30>:</td><td width=96 style=color:#00ff00><b>&nbsp;45</b></td><td width=64>%</td><td width=58 style="text-align:center; "></td><td width=202 style=font-size:20px>Liter : 3.00 von  3</td></tr></table><table style="background-color:#393939" height="2px" width="600"><tr></tr></table><table border="0" cellpadding="0" style="background-color:#2f2f2f; font-family:Arial,sans-serif; color:#e0e0e0; font-size:30px;" height="44" width="600"><tr><td width="8"></td><td width="4" style=background-color:#FFFF00></td><td width=120>&nbsp;&nbsp;&nbsp;Fs CL</td><td width=30>:</td><td width=96 style=color:#00ff00><b>&nbsp;50.5</b></td><td width=64>%</td><td width=58 style="text-align:center; "></td><td width=202 style=font-size:20px>Liter : 25.00 von 25</td></tr></table><table style="background-color:#393939" height="2px" width="600"><tr></tr></table><table class="roundedBot" border="0" cellpadding="0" style="background-color:#2f2f2f; font-family:Arial,sans-serif; color:#e0e0e0; font-size:12px;" height="15" width="600"><tr><td width="8"></td><td width="4" style=background-color:#2f2f2f></td><td width=580>&nbsp;</tr></table><table style="background-color:#010101" height="4px" width="600"><tr></tr></table><table class="roundedCorners" border="0" cellpadding="0" style="background-color:#2f2f2f; font-family:Arial,sans-serif; color:#e0e0e0; font-size:24px; -webkit-text-size-adjust:none;" height="70" width="600"><tr><td width=24>&nbsp;</td><td width=570 style="font-family:Arial; font-size:12px; color:#ffffff;"><details open><summary style="cursor:pointer;font-size:18px;">Legende&nbsp;(V3.12-App)</summary><table><tr><td>&nbsp;&nbsp;PH:&nbsp;pH_Wert&nbsp;|&nbsp;RE:&nbsp;ORP,Redox_Wert&nbsp;|&nbsp;CL:&nbsp;FCL,Chlor_Wert&nbsp;|&nbsp;uS:&nbsp;Leitfaehigkeit&nbsp;|&nbsp;Salz:&nbsp;Salz_Wert&nbsp;|</td></tr><tr><td>&nbsp;&nbsp;DF:&nbsp;Durchfluss_Sensor&nbsp;|&nbsp;Flow:&nbsp;Durchfluss_Wert&nbsp;|&nbsp;Start:&nbsp;Startverzoegerung&nbsp;|&nbsp;Fs:&nbsp;Fuellstand&nbsp;|</td></tr><tr><td>&nbsp;&nbsp;Daten&nbsp;&#128077;&nbsp;/&nbsp;&#128078;:&nbsp;&nbsp;Datenempfang&nbsp;von&nbsp;Dosieranlage&nbsp;(RS232)&nbsp;|&nbsp;Online/Offline:&nbsp;Internetverbindung&nbsp;|</td></tr><tr><td>&nbsp;&nbsp;Durchgestrichene&nbsp;Messwerte&nbsp;sind&nbsp;evtl.&nbsp;unplausibel,&nbsp;aufgrund&nbsp;fehlendem&nbsp;Durchfluss&nbsp;|</td></tr></table></details></td></tr></table><table style="background-color:#010101" height="4px" width="600"><tr></tr></table></body></html>`;

		const $ = cheerio.load(originalHtml);
		const result = parser.parseHtml($);

		expect(result.ph).to.equal(7.2);
		expect(result.redox).to.equal(680);
		expect(result.flow).to.equal(true);
		expect(result.levelPh).to.equal(45.0);
		expect(result.levelRedox).to.equal(50.5);
	});
});
