(function () {
	$(function(){

		// moveType (0:left / 1:right) 
		var moveType = 0; 
		// 이동시간간격 3초 
		var moveSpeed = 3000; 
		// 움직이는 작업중 다시 명령 받지 않음 
		var moveWork = false; 
		// 일시정지 flag 
		var movePause = false; 
		function imgMove(){ 
			if(moveWork==false){ 
			   // 0d\일경우 left방향 
			  if(moveType==0){ 
				 // 맨처음 이미지의 폭 
				 var aWidth = $(".RollDiv > div > a:first").width(); 
				 // 롤링마지막에 맨처음의 a태그 추가 
				 $(".RollDiv > div").append("<a href=\""+$(".RollDiv > div > a:first").attr("href")+"\" target=\""+$(".RollDiv > div > a:first").attr("target")+"\" title=\""+$(".RollDiv > div > a:first").attr("title")+"\" >" + $(".RollDiv > div > a:first").html()+ "</a>"); 
				 // 맨처음이미지를 왼쪽으로 이동시킨다. 
				 $(".RollDiv > div > a:first").animate({marginLeft:-aWidth},{duration:moveSpeed,step:function(){ 
				 // 이동중 만약 일시정지 flag가 true라면 
				 if(movePause==true){ 
					// 이동을 멈춘다 
					$(this).stop(); 
				 } 
				 },complete:function(){ 
				 // 이동을 마친후 첫번째 a태그를 지워버린다 
				 $(this).remove(); 
				 // 이미지 움직이는것을 다시 실행 
				 imgMove(); 
			  }}); 
			  }else{ 
			  // 마지막 a태그의 폭 
			   var aWidth = $(".RollDiv > div > a:last").width(); 
			   // a태그 앞에 마지막의 a태그를 생성한다 단 스타일은 마지막 a태그의 폭만큼 빼준다 
			   $("<a href=\"" + $(".RollDiv > div > a:last").attr("href")+ "\" style=\"margin-left:-" + aWidth + "px\">" + $(".RollDiv > div > a:last").html()+ "</a>").insertBefore(".RollDiv > div > a:first") 
			   // 맨처음 a태그의 margin-left를 다시 0으로 맞춰준다. 
			  $(".RollDiv > div > a:first").animate({marginLeft:0},{duration:moveSpeed,step:function(){ 
			   // 이동중 만약 일시정지 flag가 true라면 
			   if(movePause==true){ 
				  // 이동을 멈춘다 
				  $(this).stop(); 
			   } 
			   },complete:function(){ 
			   // 이동을 마친후 마지막 a태그를 지워버린다 
			   $(".RollDiv > div > a:last").remove(); 
			   // 이미지 움직이는것을 다시 실행 
			   imgMove(); 
			}}); 
		 } 
		 } 
		 } 
		 function goMove(){ 
			// 일시정지가 풀려있을 경우를 대비하여 일시정지를 풀러준다 
			movePause=false; 
			// 0d\일경우 left방향 
			if(moveType==0){ 
			   imgMove(); 
			   }else{ 
			   $(".RollDiv > div > a:first").animate({marginLeft:0},{duration:moveSpeed,step:function(){ 
			   // 이동중 만약 일시정지 flag가 true라면 
			   if(movePause==true){ 
				  // 이동을 멈춘다 
				  $(this).stop(); 
			  } 
			   },complete:function(){ 
			  // 이동을 마친후 마지막 a태그를 지워버린다 
			  //$(".RollDiv > div > a:last").remove(); 
			  // 이미지 움직이는것을 다시 실행 
			  imgMove(); 
		   }}); 
		}
		   
		}
		imgMove(); 

		// 추가된 부분
		$('.ban_left').on("click", function (e) {
			e.preventDefault();
			moveType = 0;
		});

		$('.ban_right').on("click", function (e) {
			e.preventDefault();
			moveType = 1;
		});
		$('.ban_play').on("click", function (e) {
			e.preventDefault();
			goMove();
		});

		$('.ban_pause').on("click", function (e) {
			e.preventDefault();
			movePause=true;
		});
	});
})();

