$(function () {
	//關閉任何的lightbox
	$("#mask,.lg-bot .btn-cancel").on("click", function () {
		$("#mask,.lg-box").fadeOut(300);
	});

	//打開lightbox
	$("#btnOpenMesg").on("click", function () {
		$("#lgMesg,#mask").fadeIn(300);
	});
	$("#btnOpenBig").on("click", function () {
		$("#lgBig,#mask").fadeIn(300);
	});
	$("#btnOpenfull").on("click", function () {
		$("#lgfull,#mask").fadeIn(300);
	});

	//側邊欄選單
	$('#closeNav').on('click', function () {
		$('#closeNav').animate({ right: '12px' }, 300);
		$('.side-nav').animate({ width: '0' }, 300);
		$('.btn-side-open').animate({ left: '0' }, 400);
	});

	$('#openNav').on('click', function () {
		$('#closeNav').animate({ right: '12px' }, 300);
		$('.side-nav').animate({ width: '180px' }, 300);
		$('.btn-side-open').animate({ left: '-26px' }, 400);
	});

	//打開次項目
	$(".nav-sub-item").on('click', function () {
		$(this).parent().find('.sub-nav').slideToggle(300);
		if ($(this).parent().find('.nav-sub-item').hasClass('act')) {
			$(this).parent().find('.nav-sub-item').removeClass('act');
			console.log(false);
		} else {
			$(this).parent().find('.nav-sub-item').addClass('act');
			console.log(true);
		}
	});

	//展開收合
	$(".unfold-item").on("click", function () {
		if ($(this).parent().find(".unfold-cont").is(":hidden") == true) {
			$(this).addClass("fold-open");
			$(this).find("i").removeClass("fa-plus").addClass("fa-minus");
			$(this).parent().find(".unfold-cont").slideDown(300);
		} else {
			$(this).removeClass("fold-open");
			$(this).find("i").removeClass("fa-minus").addClass("fa-plus");
			$(this).parent().find(".unfold-cont").slideUp(300);
		}
	});
	//全選
	$(".js-checkAll").on('change', function() {
		if ($(this).is(':checked')) {
			// console.log('true');
			$(this).parent().parent().parent().parent().parent().find("input[type='checkbox']").prop("checked",true);
		} else {
			// console.log('false');
			$(this).parent().parent().parent().parent().parent().find("input[type='checkbox']").prop("checked",false);
		}
	});


	//上傳檔案
	$('#uploadFile').change(function () {
		var filename = $(this).val();
		var lastIndex = filename.lastIndexOf("\\");
		if (lastIndex >= 0) {
			filename = filename.substring(lastIndex + 1);
		}
		$('#fileNameBox').text(filename);
	});

	//增加標籤
	$('#btnTagAdd').on('click', function () {
		$('#tagCreat').show();
	});
	$('#btnTagAdd2').on('click', function () {
		$('#tagCreat2').show();
	});


});
$(window).on('load', function () {
	//側邊欄nav height
	sideNav();

	//remove notic
	$("#closeNotic").on("click",function(){
		$(".err-notic-box").hide();
	});

	// 20230528 新增繪圖
	//船舶記事本功能
	$('#btnDraw').on('click',function(){
		// console.log('222')
		const drawStatus = document.querySelector('#mapDraw');
		if(drawStatus.checked === true){
			$('#drawPanel').show();
		}else{           
			$('#drawPanel').hide();
		}
	})

	$('#openNewDraw').on('click',function(){
		$('#historyListBox').show();
		$('#fileListBox').hide();
		$('#drawColorPanel').show();
		$('#drawSymboPanel').show();

	})
	$('#openOldDraw').on('click',function(){
		$('#fileListBox').show();
		$('#historyListBox').hide();
		$('#drawColorPanel').show();
		$('#drawSymboPanel').show();
	})
	$('#closeHistoryListBox').on('click',function(){
		$('#historyListBox').hide();
		$('#drawColorPanel').hide();
		$('#drawSymboPanel').hide();
		$('#downladFormat').hide();
		$('#saveFile').hide();
	})
	$('#closeFileListBox').on('click',function(){
		$('#fileListBox').hide();
		$('#drawColorPanel').hide();
		$('#drawSymboPanel').hide();
		$('#downladFormat').hide();
		$('#saveFile').hide();
	})

	// 選擇顏色
	$('.symbo-color').on( "click", function() {
		$('.symbo-color').removeClass('on')
		$(this).toggleClass("on");
	});
	// 選擇符號
	$('.symbo-item').on( "click", function() {
		$('.symbo-item').removeClass('on')
		$(this).toggleClass("on");
	});

	// 下載
	$('.h-btn-download').on( "click", function() {
		$('#downladFormat').show();
	});
	
	//關閉下載
	$('.history-cancel').on( "click", function() {
		$('#downladFormat').hide();
		$('#saveFile').hide();
	});
	//開啟儲存
	$('.h-btn-save').on( "click", function() {
		$('#saveFile').show();
	});
	

})
$(window).resize(function () {
	sideNav();
});

//上傳圖片的按鈕
function upload_click(obj) {
	var fileEvent = $(obj).parent().find('input[type=file]');
	fileEvent.click();
}

//側邊欄nav height
function sideNav() {
	var _navH = $('.side-nav').height();
	var _logo = $('.side-logo').outerHeight();
	var _tit = $('.backend-tit').outerHeight();
	var _info = $('.user-info').outerHeight();
	var _sideFoot = $('.side-footer').outerHeight();
	//console.log( _navH,_logo,_tit,_info,_sideFoot);
	$('.nav-box').height(_navH - (_logo + _tit + _info + _sideFoot + 50));
}
