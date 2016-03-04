'use strict';

$(document).ready(init);

function init(event)
{
	
	$("button").click(buttonClicked);
	$("input").keyup(buttonClicked);
	// $("input").on('change',inputChanged);

}

function buttonClicked(event)
{
	
	var $this=$(this);

	if(event.type==="keyup" && event.keyCode!==13) return;

	$("div.well.myhidden,div.panel-footer").slideUp().fadeOut();

	var operation=$this.data("operation").toLowerCase();
	var opInput=$("#input-"+operation).val();
	operation=operation.replace("-","/");
	// console.log(operation);

	$.ajax({
		method:'GET',
		url:"http://localhost:8080/"+operation+"/"+opInput,
		success: function(data){
			var thedata=JSON.parse(data);
			// console.log("thedata: ",thedata);
			var resultSel=operation.replace("math/","");
			resultSel="#result"+resultSel.replace(/\w/,e=>e.toUpperCase());
			// console.log(resultSel);
			var $resultElt=$(resultSel);
			switch(operation)
			{
				case "birthday":
					var $newelt1 = $("<div>").text("Age: "+thedata.result.age);
					var $newelt2 = $("<div>").text("Born on: "+thedata.result.date);
					$resultElt.empty();
					$resultElt.append($newelt1, $newelt2);
					$resultElt.css("visibilty","visible");
					$resultElt.slideDown().fadeIn();
				break;

				case "gravatar":
					var $newelt1 = $("<img>").attr("src",thedata.url[0][0]).addClass("imgspacer");
					var $newelt2 = $("<img>").attr("src",thedata.url[0][1]).addClass("imgspacer");
					var $newelt3 = $("<img>").attr("src",thedata.url[0][2]).addClass("imgspacer");
					$resultElt.empty();
					$resultElt.append($newelt1, $newelt2, $newelt3);
					$resultElt.css("visibilty","visible");
					$resultElt.slideDown().fadeIn();
				break;

				case "sentence":
					var $newelt1 = $("<div>").text("Words: "+thedata.result[0].num_words);
					var $newelt2 = $("<div>").text("Letters: "+thedata.result[0].num_letters);
					var $newelt3 = $("<div>").text("Average word length: "+thedata.result[0].avg_word_length);
					$resultElt.empty();
					$resultElt.append($newelt1, $newelt2, $newelt3);
					$resultElt.css("visibilty","visible");
					$resultElt.slideDown().fadeIn();
				break;

				default:
					var $newelt = $("<div>").text("Result: "+thedata.result[0]);
					$resultElt.empty();
					$resultElt.append($newelt);
					// $resultElt.removeClass("myhidden");
					$resultElt.css("visibilty","visible");
					$resultElt.slideDown().fadeIn();
				break;
			}


		},
		error: function(err) {
			console.log("ERROR***ERROR***ERROR: ", err);
		},
	});


	
}