<style>
  @font-face {
		font-family: 'Hauss'; 
		src: url(ALSHAUSS-BOOK.TTF); 
	}
	 
	@font-face {
		font-family: 'ALSHAUSS-MEDIUM.TTF'; 
		src: url(bold.ttf); 
	}

*{
	font-family: Hauss;
}
	
mark {
  background-color: #C5DDE6;
  color: black;
}
	
mark:hover {
  background-color: #3EBCE6;
	text-decoration: underline;
  color: black;
}	
  
  </style>

<script>

var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];


function updateTime(){
    var currentTime = new Date();
var status = "✅ Available for messaging only, calls will be declined 📵 ";

d = currentTime.getUTCDay();
    h = currentTime.getUTCHours();



 if (h >= 0 && h <= 7)
{
	status = "Sleeping... 💤";
}

if (h>=8 && h<=16)
{
	status = "Busy. ⚠️ Do not disturb. ⛔";
}

if (d == 0 && h < 9)
{
	status = "Sleeping... 💤";
}
else
{
if (d == 0 && h >= 9) status = "On a weekend. Enjoying real life 📳";
}
document.getElementById('status_span').innerHTML = status;
    
}
setInterval(updateTime, 1000);


</script>




<!---
xhackerino/rakin.tech is a ✨ special ✨ repository because its `README.md` (this file) appears on your GitHub profile.
You can click the Preview link to take a look at your changes.
--->
<body>
<big>👋</big> Hello, that's homepage of <b><a href="https://drive.google.com/uc?export=view&id=1px94pcoPQYk14iCOFNGf50si9nZQ3Aak" target="_blank">Ilia Rakin</a></b><br>
Right now I’m...<br>
<div id="status_span">Checking the schedule...</div><br>

<big>📫</big> How to reach me ... <br>
E-mail: <a href="mailto:rakin1999@icloud.com">rakin1999@icloud.com</a><br>
Gmail: <a href="mailto:xhackerino@gmail.com">xhackerino@gmail.com</a><br>
<!--Corporate: <a href="mailto:ilia.rakin@student.lab.fi">ilia.rakin@student.lab.fi</a><br>-->
TG: <a href="https://xhackerino.t.me">TELEGRAM [main]</a><br>
<!--Discord: <a href="https://discordapp.com/users/xhackerino">Discord</a><br><br>-->

<big>📩</big> For <u>working issues</u> contact me at : <br>
<a href="https://xhackerino.t.me">@xhackerino</a><br><br>
<!--<a href="https://dyrnos.t.me">@dyrnos</a><br><br>-->

<big>🤝</big> Also check ...<br>

📷 Instagram: <a href="https://instagram.com/yurnerox">@yurnerox</a><br>
💬 X (Twitter): <a href="https://twitter.com/humblekomi"><small>@humblekomi</small></a><br>
<br><br>
<big>💰</big> Wallets :<br>
Revtag: <mark><small>@iliafyjoa</small></mark><br>
USDT (BEP20): <mark><small>0xa43205f0bdd955ad5df455cd86f3fb11052a875b</small></mark><br>
USDT (TRC20): <mark><small>TLpRFRNje7SHWExwu87TDtsG3ukostcFMp</small></mark><br>
BTC: <mark><small>1Phbjhyuy5M5jurhLegNyawe1CMMJPyzcC</small></mark><br>
ETH: <mark><small>0xa43205f0bdd955ad5df455cd86f3fb11052a875b</small></mark><br>
TON: <mark><small>UQD7F5y8wdGEus0X6MfgLDZ7uBkUyhtXTe9RHg28mcX_8n0e</small></mark><br>
<hr>
<div align="center"><small>⚡️ rakin.tech   </small>
<small><a href="https://apple.com">.onion [TOR]</a><br>	
<small> 2023 </small>
<body>

