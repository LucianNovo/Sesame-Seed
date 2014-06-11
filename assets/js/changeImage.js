$(document).keypress(function(e) { 
    if (e.which == 27) {
    	changeImg();
    }
});
$("#info").click(function() {
    changeImg();
});
$("#info").on('click', function () {
    changeImg();                                                     
});
$("#info").hover(function(){
	changeImg();
	console.log("hover event happened");                                                  
});

function changeImg(imageNumber){
	switch(imageNumber) {
	    case 1:
	        $("#info").attr("src","../assets/imgs/mockups-09.png");
	        $("#info").attr("display","block");
	        break;
	    case 2:
	        $("#info").attr("src","../assets/imgs/mockups-10.png");
	        $("#info").attr("display","block");
	        break;
	    case 3:
	        $("#info").attr("src","../assets/imgs/mockups-11.png");
	        $("#info").attr("display","block");
	        break;
	    default:
	        $("#info").attr("src","");
	}
}