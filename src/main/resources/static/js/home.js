'use strict';

function home(){

	$(".main.button.homeMenu").mousedown(function(){
		$(".menu").toggleClass("closed");
		
		if($(".menu").hasClass("closed")) {
			$(".main.button").text("Menu");
			$(".profile.button").text(" ");
			$(".ranking.button").text(" ");
			$(".code.button").text(" ");
			$(".mapd.button").text(" ");
			$(".profile.button").removeAttr("href");
			$(".ranking.button").removeAttr("href");
			$(".code.button").removeAttr("href");
			$(".mapd.button").removeAttr("href");
		} 
		else {
			$(".main.button").text("Close");
			$(".profile.button").text("Profile");
			$(".ranking.button").text("Ranking");
			$(".code.button").text("Code Design");
			$(".mapd.button").text("Map Design");
			$(".profile.button").attr("href", "profile");
			$(".ranking.button").attr("href", "ranking");
			$(".code.button").attr("href", "code-design");
			$(".mapd.button").attr("href", "map-design");
		}
	});

}