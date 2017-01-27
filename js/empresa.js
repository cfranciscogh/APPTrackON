// JavaScript Document
$(document).ready(function(e) {
	
	$("#listEmpresas li a").eq(0).attr("href","panel.html?idChofer="+$.QueryString["idChofer"]+"&empresa=SODIMA");
	$("#listEmpresas li a").eq(1).attr("href","panel.html?idChofer="+$.QueryString["idChofer"]+"&empresa=MAESTR");
	$("#listEmpresas li a").eq(2).attr("href","panel.html?idChofer="+$.QueryString["idChofer"]+"&empresa=SOLTRA");
});

   