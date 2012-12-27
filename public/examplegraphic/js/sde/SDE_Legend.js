/**
 * @author RuppertM
 * 
 * Version: 1.1
 */

function SDE_Legend ()
{		
	this.createLegend = function(targetcontainer,align,top,input){
		var textboxwidth;
		var slideInfoOut;
		var slideInfoIn;
		var slideTextOut;
		var slideTextIn;
		var text = "";
		var parentPositionStatus = $(targetcontainer).css('position');		
		
		if(parentPositionStatus == 'static'){
			$(targetcontainer).addClass('legendpositionedparent');
		}		
		
		
		for (var i=0; i < input.length; i++) {
		    text += input[i] +'<br/>';
		};
		
		$('<div id="legend"></div>').addClass('legend'+align).css('top',top+'px').appendTo(targetcontainer);
		$('<div id="legendinfo" class="legendtop"></div>').addClass('legend'+align).appendTo('#legend');
		$('<div id="legendinfobox"></div>').addClass('legendboxshadow'+align).appendTo('#legendinfo');
		$('<div id="legendtext" class="legendbottom"></div>').addClass('legend'+align).appendTo('#legend');
		$('<div id="legendtextbox"></div>').addClass('legendtextbox'+align+' legendboxshadow'+align).appendTo('#legendtext');
		$('<p></p>').addClass('legendtextboxp'+align).html(text).appendTo('#legendtextbox');
		$('<div id="legendarrow"></div>').addClass('legendarrow'+align).appendTo('#legendtextbox');
		
		textboxwidth = $('#legendtext').width();
		textboxheight = $('#legendtext').height();
		$('#legendtext').height(textboxheight + 4)
				
		if(align == 'right')
		{
			slideInfoOut = {'left':'50px'};
			slideInfoIn = {'left':'0px'};
			slideTextIn = {'right':'0px'};
			slideTextOut = {'right':(-1)*textboxwidth};
		}
		else
		{
			slideInfoOut = {'right':'50px'};
			slideInfoIn = {'right':'0px'};
			slideTextIn = {'left':'0px'};
			slideTextOut = {'left':(-1)*textboxwidth};
		}
		
		$('#legendinfobox').on('click',function(e) {			
			$(this).stop().animate(slideInfoOut).removeClass('legendtop').addClass('legendbottom');
			$('#legendinfo').removeClass('legendtop').addClass('legendbottom');
			$('#legendtext').removeClass('bottom').addClass('legendtop').show();
			$('#legendtextbox').stop().animate(slideTextIn);
		});
		$('#legendtextbox').on('click',function(e) {			
			$('#legendtext').removeClass('legendtop').addClass('legendbottom');
			$('#legendinfo').removeClass('legendbottom').addClass('legendtop');
			$(this).stop().animate(slideTextOut);		
			$('#legendinfobox').stop().animate(slideInfoIn,function(){$('#legendtext').hide()});
		
		});
	}
};
