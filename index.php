<!DOCTYPE html>
<html>
<head>
<title>Bildbearbeitung</title>
<link href="style.css" rel="stylesheet">
</head>
<body>
<canvas id="downloadCanvas" width="100" height="100"></canvas>
<div id="wrapper">
<div id="menubar">

<div class="menu" id="menu1">
<h2>Datei</h2>
<div class="subitem_wrapper">
<div class="subitem1">
<!--Hochladen-->
<label for="imageLoader" id="file_upload" class="button_design">Hochladen</label>
<input type="file" id="imageLoader" name="imageLoader"></input>
</div>
<div class="subitem2">
<!--Speichern-->
<a id="download" download="image.jpg" href="" onclick="downloadImage(this);" class="button_design">Speichern</a>
</div>
<div class="subitem3">
<!--Entfernen-->
<a id="delete" onclick="resetPicture(this);" class="button_design">Entfernen</a>
</div>
</div>
</div>

<div class="menu" id="menu2">
<h2>Bearbeiten</h2>
<div class="subitem_wrapper">
<div class="subitem1">
<!--Endformat-->
<div id="coords1">
<p>x: </p><br>
<p>y: </p>
</div>
<div id="coords2">
<input type="text" id="size_x" value="100"></input><br>
<input type="text" id="size_y" value="100"></input>
</div>
</div>
<div class="subitem2">
<!--Maßstab-->
<p>Größe</p><br>
<input type="range" id="scale" min="1" max="200" value="100"></input>
</div>
<div class="subitem3">
<!--Vorschau-->
<p>Vorschau</p><br>
<label id="vorschaulabel">
<input type="checkbox" id="vorschau">
<span class="checkmark"></span>
</label>
</div>
</div>
</div>

<div class="menu" id="menu3">
<h2>Werte</h2>
<div class="subitem_wrapper">
<div class="subitem1">
<!--Bildgröße-->
<p>Bildgröße</p><br>
<p>0x0</p>
</div>
<div class="subitem2">
<!--Maßstab-->
<p>Maßstab</p><br>
<p>0.5</p>
</div>
<div class="subitem3">
<!--Aktuelle Größe-->
<p>Aktuelle Größe</p><br>
<p>0x0</p>
</div>
</div>
</div>

</div>
<div id="canvaswrapper">
<canvas id="imageCanvas" width="100" height="100"></canvas>
</div>
</div>
<!--load js-->
<script src="main.js"></script>
</body>
</html>