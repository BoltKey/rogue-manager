<head>
<meta charset="utf-8" />
<title>Rogue Manager</title>
<link rel="shortcut icon" href="/boltlogo.png">
<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
<!--<script src='https://cdn1.kongregate.com/javascripts/kongregate_api.js'></script>-->

<?php 
foreach (glob("game/*.js") as $filename)
{
    echo '<script type="text/javascript" src='.$filename.'></script>
';
} 
?>
<script> var logo; window.onload = function(){window.logo = BKLogo(main)}; </script>
</head>
<body style="margin: 0">
<canvas style="background-color:#eeeeee;" class="unselectable" id="game" draggable="false" align="center" width="960" height="640">Your browser does not support canvas. Use Chrome instead.</canvas>
</div>
</body>