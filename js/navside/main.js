jQuery(document).ready(function($){
	//move nav element position according to window width
	// moveNavigation();
	// $(window).on('resize', function(){
	// 	(!window.requestAnimationFrame) ? setTimeout(moveNavigation, 300) : window.requestAnimationFrame(moveNavigation);
	// });

	// //mobile version - open/close navigation
	// $('.cd-nav-trigger').on('click', function(event){
	// 	event.preventDefault();
	// 	if($('header').hasClass('nav-is-visible')) $('.moves-out').removeClass('moves-out');
		
	// 	$('header').toggleClass('nav-is-visible');
	// 	$('.cd-main-nav').toggleClass('nav-is-visible');
	// 	$('.cd-main-content').toggleClass('nav-is-visible');
	// });

	// //mobile version - go back to main navigation
	// $('.go-back').on('click', function(event){
	// 	event.preventDefault();
	// 	$('.cd-main-nav').removeClass('moves-out');
	// });

	// //open sub-navigation
	// $('.cd-subnav-trigger').on('click', function(event){
	// 	event.preventDefault();
	// 	$('.cd-main-nav').toggleClass('moves-out');
	// });

	// $('.cd-main-nav a').click(function(e){
	// 	var elem = $(this)
	// 	$('.cd-main-nav li').removeClass("active")
	// 	elem.closest("li").addClass("active")
	// 	if(elem.attr("href").indexOf("#") >= 0){

	// 		var a = elem.attr("href").replace("#","")
	// 		// SUB MENU
	// 		$("nav.sub-menu").find("ul.selected-sub-menu").removeClass("selected-sub-menu")
	// 		$("nav.sub-menu").find("ul."+a).addClass("selected-sub-menu")

	// 		// CONTENT GROUP
	// 		$("div.content-holder .content-group.show").removeClass("show");
	// 		$("div.content-holder .content-group[data-group='"+ a +"']").addClass("show");
	// 		$("nav.sub-menu").find("ul."+a).find("li.current a").click()
			 

	// 		$(".cd-nav-trigger").click();
	// 	}
	// })

	$("div.sidebar ul.nav a").click(function(e){
		var elem = $(this)

		var ul = elem.closest("ul");
		var li = elem.closest("li");
		if(li.is(".current")){return;}
		if(li.data("content") === undefined){return;}
		$("div.sidebar ul.nav").find("li.current").removeClass("current")
		$("div.sidebar ul.nav").find("a.active").removeClass("active")
		li.addClass("current")
		elem.addClass("active")

		$("div.content .content-group.show .content-list.show").removeClass("show");
		$("div.content").find(".content-list[data-content='"+ li.data("content") +"']").addClass("show") 
		var table = $("table[data-table='" + li.data("content") + "']")
		table.attr("style",null)
		$("span.content-header span").text(li.data("header"))
		$("span.content-header subheader").text("")

		var dttable = listObjTableBinded[li.data("content")]
		if(dttable){
			var param = new Object();
			param.table = li.data("content");
        	callAjaxJson("main/getLatestData", param, bindingDatatoDataTable, ajaxError)

		}  
        if(li.data("content")=="dashboard")        
        	callAjaxJson("main/getAuditLogsJson", new Object(), bindingDatatoDataTable, ajaxError)

        // RESET PAGE 
        var currentList = $("div.content .content-group.show .content-list.show")
        currentList.find(".main-button").show();
        currentList.find(".btn-child-group").hide(); 
        currentList.find(".dataTables_wrapper").show();
        currentList.find(".content-child").hide(); 
	 	//$('.content').removeClass('isOpen');
	 
	})


	$('span.button').on('click', function() {
		$('.content').toggleClass('isOpen');
	});
 	

	$(".stepNav li a").click(function(e){
		var elem = $(this)
		if(elem.closest("li").is(".selected")){return;}
 
		if($(".stepNav li.selected").data("view") == "item-info") 
			if(!validateItemVariant(elem.closest("li").data("view"))){return;}
 
		if($(".stepNav li.selected").data("view") == "item-variants") 
			if(!validateAttribute(elem.closest("li").data("view"))){return;}

		$(".step-holder > div.show").removeClass("show");
		$(".stepNav li.selected").removeClass("selected");
		elem.closest("li").addClass("selected");
		$(".step-view[data-view="+ elem.closest("li").data("view") +"]").addClass("show")
		
		if(elem.closest("li").data("view") == "item-variants"){
			var table = listObjTableBinded["listitemvariant"];
			table.draw()
			$("table[data-table='listitemvariant']").closest("div.dataTables_wrapper").find("div.dataTables_filter").hide() 
		}
		if(elem.closest("li").data("view") == "item-review"){

			var listposupplier = new Object()

            var arrList = new Object();
            arrList.list = "";
            arrList.fields = "VariantsName|Variant Name,Price|Quantity,Item|Item No.,ItemDescription|Description,DPOCost|DPO Cost,Total|Total"
            listposupplier["listitemvariant-review"] = arrList; 

            bindingDatatoDataTable(listposupplier)

			var table = listObjTableBinded["listitemvariant-review"];
			table.draw()
			$("table[data-table='listitemvariant-review']").closest("div.dataTables_wrapper").find("div.dataTables_filter").hide() 
		}

	})



	// function moveNavigation(){
	// 	var navigation = $('.cd-main-nav-wrapper');
 //  		var screenSize = checkWindowWidth();
 //        if ( screenSize ) {
 //        	//desktop screen - insert navigation inside header element
	// 		navigation.detach();
	// 		navigation.insertBefore('.cd-nav-trigger');
	// 	} else {
	// 		//mobile screen - insert navigation after .cd-main-content element
	// 		navigation.detach();
	// 		navigation.insertAfter('.cd-main-content');
	// 	}
	// }

	// function checkWindowWidth() {
	// 	var mq = window.getComputedStyle(document.querySelector('header'), '::before').getPropertyValue('content').replace(/"/g, '').replace(/'/g, "");
	// 	return ( mq == 'mobile' ) ? false : true;
	// }

	 


});


function validateItemVariant(dataview){
	$("div.step-holder").find("p.label-error").remove()
    var isOkay = true;
   	var isOkay2 = true
	if(dataview != "item-info"){
	   $("div.step-holder > div.step-view[data-view=item-info]").find("table.form-table .inputMaterial").each(function(e){
	   		var elem = $(this)
	   		if($.trim(elem.val()).length == 0)
	   			isOkay= false;
	   })		
	   if(!isOkay)
	   		$("div.step-holder > div.step-view[data-view=item-info]").find("table.form-table tbody").before("<p class=\"label-error\">Please input all this fields.</p>")

	   if(dataview == "item-review"){
			 // VALIDATE THE ITEM VARIANT
		  	var table = listObjTableBinded["listitemvariant"]
			if(table.data().length == 0){
				isOkay2= false;
				$(".stepNav li[data-view=item-variants] a").click();
			} 
		}
		if(!isOkay2)
			$("div.step-holder > div.step-view[data-view=item-variants]").find("table.form-table").parent("div").before("<p class=\"label-error\">Please setup the variant for the item first.</p>") 
	    
	} 

	return (isOkay && isOkay2);
}

function validateAttribute(dataview){
	$("div.step-holder").find("p.label-error").remove()
	var isOkay = true
	if(dataview=="item-review"){
		// VALIDATE THE ITEM ATTRIBUTE
		$("#table-attribute").find("input").each(function(e){
			var elem = $(this)
	   		if($.trim(elem.val()).length == 0)
	   			isOkay= false;
		})
		if(!isOkay)
		   	$("div.step-holder > div.step-view[data-view=item-variants]").find("table.form-table").parent("div").before("<p class=\"label-error\">Please input all this fields.</p>")

		// VALIDATE THE ITEM VARIANT
		var table = listObjTableBinded["listitemvariant"]
		if(table.data().length == 0)
			isOkay= false;
		else{
			$("table[data-table=listitemvariant] input.nummeric").each(function(e){
			var elem = $(this)
	   		if($.trim(elem.val()).length == 0 && elem.val() == "0")
	   			isOkay= false;
		})  

			if(!isOkay)
		   		$("div.step-holder > div.step-view[data-view=item-variants]").find("#btn-itemvariantadd").after("<p class=\"label-error\">Please complete the variant details below.</p>")
		}
		
	}
	

	return isOkay;
}