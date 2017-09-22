$(function(){
$.getScript("http://www55.atwiki.jp/aiwar/pub/"+$("div#CoreResource span.wikiUnits").text(),function(){
$.getScript("http://www55.atwiki.jp/aiwar/pub/"+$("div#CoreResource span.wikiTips").text(),function(){
$.getScript("http://www55.atwiki.jp/aiwar/pub/"+$("div#CoreResource span.DBConnector").text(),function(){run()})
})
})
})