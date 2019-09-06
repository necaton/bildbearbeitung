//303030, 454545, 5c5c5c

var canvas = document.getElementById('imageCanvas');
var ctx = canvas.getContext('2d');
var img = new Image();
var canvas_download = document.getElementById('downloadCanvas');
var ctx_download = canvas_download.getContext('2d');
var offset_x = 0, offset_y = 0, isMoving = 0, mousepos_x = 0, mousepos_y = 0, positionChanged = 0;
var scale = 1;

//event listeners
document.getElementById('imageLoader').addEventListener('change', loadImage, false);
document.getElementById('vorschau').addEventListener('change', vorschau, false);
document.getElementById("scale").addEventListener("input", changedRange, false);
document.getElementById('size_x').addEventListener('input', redrawImage, false);
document.getElementById('size_y').addEventListener('input', redrawImage, false);
canvas.addEventListener("mousewheel", mouseScroll);
canvas.addEventListener("mousemove", moveGetCoords);
canvas.addEventListener("mousedown", moveStart);
canvas.addEventListener("mouseup", moveStop);
canvas.addEventListener("mouseout", moveStop);
setInterval(moveCheck, 100);
setInterval(inRectCheck, 100);
setInterval(setCanvasSize, 100);

//size of canvas
setCanvasSize();

function redrawImage() {
	if (img.src == "") {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.font = "16px Comic Sans MS";
		ctx.textAlign = "center";
		ctx.fillText("Image", canvas.width/2, canvas.height/2);
		return 0;
	}
	
	if (document.getElementById('size_x').value > 1000) {
		document.getElementById('size_x').value = 1000;
	}
	if (document.getElementById('size_y').value > 1000) {
		document.getElementById('size_y').value = 1000;
	}
	
	changedRange();
	changeValues();
	
	var x = document.getElementById('size_x').value;
	var y = document.getElementById('size_y').value;
	
	//canvas
	ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, offset_x, offset_y, img.width * scale, img.height * scale);
	
	//canvas_download
	canvas_download.width = x;
	canvas_download.height = y;
	ctx_download.drawImage(canvas, canvas.width/2-x/2, canvas.height/2-y/2, x, y, 0, 0, x, y);
	
	//rect
	ctx.lineWidth = "2";
	ctx.strokeStyle = "rgba(0, 0, 0, 1)";
	ctx.beginPath();
	ctx.rect(parseInt(canvas.width/2-x/2), parseInt(canvas.height/2-y/2), Number(x), Number(y));
	ctx.stroke();
}

function loadImage(e) {
    var reader = new FileReader();
    reader.onload = function(event){
        img.onload = function(){
            ctx.drawImage(img,0,0);
			redrawImage();
        }
        img.src = event.target.result;
    }
    reader.readAsDataURL(e.target.files[0]);
}

function downloadImage(e) {
	var image = canvas_download.toDataURL("image/jpg");
	e.href = image;
}

function moveGetCoords(e) {
	e.preventDefault();
    e.stopPropagation();
	
	if (isMoving != 1) return;
	
	var rect = canvas.getBoundingClientRect();
	var x = document.getElementById('size_x').value;
	var y = document.getElementById('size_y').value;
	
	//difference of old and current position add to offset
	var temp_x = Math.round(e.clientX - rect.left) - mousepos_x;
	var temp_y = Math.round(e.clientY - rect.top) - mousepos_y;
	
	if (temp_x != 0 && mousepos_x != 0) {
		//wenn nach links und rechts noch frei ist
		if (offset_x+temp_x < canvas.width/2-x/2 && (offset_x+temp_x) + img.width * scale > canvas.width/2+x/2) {
			offset_x += temp_x;
			positionChanged = 1;
		}
	}
	if (temp_y != 0 && mousepos_y != 0) {
		//wenn nach oben und unten noch frei ist
		if (offset_y+temp_y < canvas.height/2-y/2 && (offset_y+temp_y) + img.height * scale > canvas.height/2+y/2) {
			offset_y += temp_y;
			positionChanged = 1;
		}
	}
	if (temp_x == 0 && temp_y == 0) positionChanged = 0;
	
	//set mousepos to current mousepos
	mousepos_x = Math.round(e.clientX - rect.left);
	mousepos_y = Math.round(e.clientY - rect.top);
}

function moveStart(e) {
	e.preventDefault();
    e.stopPropagation();
	isMoving = 1;
}

function moveStop() {
	isMoving = 0;
	mousepos_x = 0;
	mousepos_y = 0;
}

function moveCheck() {
	if (isMoving != 1) return;
	if (positionChanged != 1) return;
	positionChanged = 0;
	
	redrawImage();
}

function changedRange() {
	scale = document.getElementById("scale").value / 100;
	var x = document.getElementById('size_x').value;
	var y = document.getElementById('size_y').value;
	
	if ((x / img.width) > scale) {
		scale = x / img.width;
	}
	if ((y / img.height) > scale) {
		scale = y / img.height;
	}
	document.getElementById("scale").min = ((x / img.width) >= (y / img.height) ? (x / img.width) : (y / img.height)) * 100;
	document.getElementById("scale").value = (scale * 100);
	
	inRectCheck();
}

function inRectCheck() {
	var x = document.getElementById('size_x').value;
	var y = document.getElementById('size_y').value;
	
	if (!(offset_x < canvas.width/2-x/2 && (offset_x) + img.width * scale > canvas.width/2+x/2)) {
		offset_x = canvas.width/2-x/2;
	}
	if (!(offset_y < canvas.height/2-y/2 && (offset_y) + img.height * scale > canvas.height/2+y/2)) {
		offset_y = canvas.height/2-y/2;
	}
}

function setCanvasSize() {
	if (canvas.width != window.innerWidth - 20 || canvas.height != window.innerHeight - canvas.getBoundingClientRect().top - 10) {
		canvas.width = window.innerWidth - 20;
		canvas.height = window.innerHeight - canvas.getBoundingClientRect().top - 10;
	}
	
	if (canvas.getBoundingClientRect().left != canvas_download.getBoundingClientRect().left || canvas.getBoundingClientRect().top != canvas_download.getBoundingClientRect().top) {
		canvas_download.style.left = canvas.getBoundingClientRect().left + "px";
		canvas_download.style.top = canvas.getBoundingClientRect().top + "px";
	}
	
	redrawImage();
}

function mouseScroll(e) {
	if (e.deltaY < 0) {
		//up
		if (Number(document.getElementById("scale").value) + 2 > document.getElementById("scale").max) {
			document.getElementById("scale").value = document.getElementById("scale").max;
		} else {
			document.getElementById("scale").value = Number(document.getElementById("scale").value) + 2;
		}
	} else {
		//down
		if (Number(document.getElementById("scale").value) - 2 < document.getElementById("scale").min) {
			document.getElementById("scale").value = document.getElementById("scale").min;
		} else {
			document.getElementById("scale").value = Number(document.getElementById("scale").value) - 2;
		}
	}
	changedRange();
	redrawImage();
}

function resetPicture(e) {
	e.href = "";
}

function changeValues() {
	document.getElementById("menu3").getElementsByClassName("subitem1")[0].getElementsByTagName("p")[1].innerHTML = img.width + "x" + img.height;
	document.getElementById("menu3").getElementsByClassName("subitem2")[0].getElementsByTagName("p")[1].innerHTML = Math.round(scale * 100) / 100;
	document.getElementById("menu3").getElementsByClassName("subitem3")[0].getElementsByTagName("p")[1].innerHTML = Math.round(img.width * scale) + "x" + Math.round(img.height * scale);
}

function vorschau() {
	if (document.getElementById("vorschau").checked == true) {
		document.getElementById("downloadCanvas").style.display = "block";
	} else {
		document.getElementById("downloadCanvas").style.display = "none";
	}
}