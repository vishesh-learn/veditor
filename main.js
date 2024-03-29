$ = (e) => document.querySelector(e);
$All = (e) => document.querySelectorAll(e);
$aEL = (e, eve, f) => e.addEventListener(eve, f);
$cE = (e) => document.createElement(e);

var code = "", m = 0, lS;

window.onload = () => {
	if (localStorage.code) {
		code = localStorage.code;
	}

	$("textarea").value = code;

	run();
	formatCode();

	loadSavedFontSize();

	$aEL($(".hb"), "click", input);
	$aEL($(".ob"), "click", output);

	$aEL($(".cpy"), "click", cpy);
	$aEL($(".delb"), "click", clr);
	$aEL($(".live"), "click", nlive);
	$aEL($(".save"), "click", save);
	$aEL($(".nw"), "click", () => window.open('code.html'));
	$aEL($(".fs"), "click", fontSizeInput);
	$aEL($(".run"), "click", run);

	$aEL($("textarea"), "input", typing);
	$aEL($("textarea"), "change", typing);

	$aEL(window, "resize", formatCode);
}

function cpy() {
	document.querySelector('textarea').select();
	document.querySelector('textarea').setSelectionRange(0, 99999); /* For mobile devices */

	let result = document.execCommand("copy");

	console.log('cpy -> result', result);

	document.querySelector('textarea').blur();
}

function clr() {
	$("textarea").value = "";
	$(".finput").innerHTML = '<pre class="line"></pre>';
	localStorage.code = "";
	lineNo();
}

function nlive() {
	if ($(".live.active")) {
		$(".live").classList.remove("active");
	}
	else {
		$(".live").classList.add("active");

		typing();
	}
}

function run() {
	$(".output").srcdoc = code;
}

function typing() {
	var live_status = $(".live.active");

	code = $("textarea").value;

	formatCode();

	if (live_status) {
		run();
	}

	localStorage.code = code;
}

function lineNo() {
	const pa = $(".lnColumn");
	var lines = $All(".line");

	pa.innerHTML = "";

	for (let i of lines) {
		var lnN = $cE("div");
		lnN.classList = "lnCounts";
		lnN.style.height = i.scrollHeight + "px";

		pa.appendChild(lnN);
	}

	// console.log("lines[0].scrollHeight: "+lines[0].scrollHeight);
}

function h() {
	var h = $("textarea").scrollHeight;

	$("textarea").style.height = h + "px";
	$(".finput").style.height = h + "px";
	$(".lnColumn").style.height = h + "px";
	$(".input").style.height = h + "px";
}

function lH() {
	const tA = $("textarea");
	const lNC = $(".lnColumn");

	var lH = getComputedStyle($(".line")).lineHeight;

	// console.log("lH: "+ lH)

	lNC.style.lineHeight = lH;

	jsStyler(".line, .lnCounts", "min-height", lH);
}

function formatCode() {
	var fcode;
	const finput = $(".finput");
	const tA = $("textarea");
	var code = tA.value;

	fcode = code.split("\n");

	finput.innerHTML = "";

	for (let i of fcode) {
		var line = $cE("div");
		line.classList = "line";
		line.innerText = i;
		finput.appendChild(line);
	}

	lineNo();
	lH();
	h();
}

function save() {
	var filename = prompt("Save file as:");

	if (filename) {
		var blob = new Blob([code], { type: "text/plain;charset=utf-8" });
		saveAs(blob, filename);
	}
}

function fontSizeInput() {
	var currentFontSize = window.getComputedStyle($(".input")).fontSize;

	var fontSize = prompt('Enter a css font-size value.\ne.g.: 12px, 2em, 100%, etc.', currentFontSize);

	if (!fontSize) {
		return false;
	}

	let isFontSizeValid = validateFontSize(fontSize);

	if (isFontSizeValid) {
		loadFontSize(fontSize);
	} else {
		alert("invalid");
	}
}

function loadSavedFontSize() {
	if (localStorage.fontSize) {
		var fontSize = localStorage.fontSize;

		let isFontSizeValid = validateFontSize(fontSize);

		if (isFontSizeValid) {
			loadFontSize(fontSize);
		}
	}
}

function loadFontSize(fontSize) {
	$(".input").style.fontSize = fontSize;

	lineNo();
	lH();
	h();

	localStorage.fontSize = fontSize;
}

function validateFontSize(fontSize) {
	let v = false;

	if (!fontSize) {
		return false;
	}

	var fk = ["medium", "xx-small", "x-small", "small", "large", "x-large", "xx-large", "smaller", "larger", "length", "initial", "inherit"];

	var fu = ["cm", "mm", "in", "px", "pt", "pc", "%", "em", "ex", "ch", "rem", "vw", "vh", "vmin", "vmax"];

	for (e of fu) {
		if (fontSize && fontSize.endsWith(e)) {
			for (i = 0; i <= 9; i++) {
				if (fontSize.startsWith(i)) {
					v = true;
					break;
				}
			}
			break;
		}
	}

	if (fk.includes(fontSize)) v = true;

	return v;
}

function input() {
	$(".ic").classList.remove("off");
	$(".toolbar").classList.remove("off");
	$(".output").classList.add("off");

	$(".hb").classList.add("visited");
	$(".ob").classList.remove("visited");
}

function output() {
	$(".ic").classList.add("off");
	$(".toolbar").classList.add("off");
	$(".output").classList.remove("off");

	$(".hb").classList.remove("visited");
	$(".ob").classList.add("visited");
}

function jsStyler(e, property, value) {
	const jsStyleE = $(".jsStyle");

	jsStyleE.innerHTML = "";

	jsStyleE.innerHTML = e + "{" + property + ": " + value + "}\n\n";
}