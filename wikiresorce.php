<?php
header("Access-Control-Allow-Origin: *");
header("Content-type: application/x-javascript; charset=utf-8");
$src = $_GET["src"];
if(isset($src)){
$file = file_get_contents("http://img.atwikiimg.com/www55.atwiki.jp/aiwar/pub/" . $src);
echo $file;
}