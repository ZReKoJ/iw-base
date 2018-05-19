'use strict';

function profile(socket) {
	
    let buttons = $('#responsive');
    let links = buttons.find('a');
 
    links.click(function(e) {
    	
        $(this).siblings('a.active').removeClass("active");
        $(this).addClass("active");
        
        let index = $(this).index();
        
        $("div.user-menu>div.user-menu-content").removeClass("active");
        $("div.user-menu>div.user-menu-content").eq(index).addClass("active");
        
    });

    $("[rel='tooltip']").tooltip();    
 
    $('.view').hover(
    		
        function(){
            $(this).find('.caption').slideDown(250); //.fadeIn(250)
        },
        
        function(){
            $(this).find('.caption').slideUp(250); //.fadeOut(205)
        }
        
        
    ); 
    
	$("#escrito").submit(function (e) {
		let message = $("#send").val();
		if (message != null && message != ""){
			socket.send(message);
			$("#send").val("");
		}
		e.preventDefault(); // avoid actual submit
	});
	
	$("#sendButton").click(function (e) {
		let message = $("#send").val();
		if (message != null && message != ""){
			socket.send(message);
			$("#send").val("");
		}
		e.preventDefault(); // avoid actual submit
	});
	
	socket.onmessage = function(e) {
		let log = $("#chat");
		log.val(log.val() + '\n' + e.data);
	}
}

$(function () {
    $('.button-checkbox').each(function () {

        // Settings
        var $widget = $(this),
            $button = $widget.find('button'),
            $checkbox = $widget.find('input:checkbox'),
            color = $button.data('color'),
            settings = {
                on: {
                    icon: 'glyphicon glyphicon-check'
                },
                off: {
                    icon: 'glyphicon glyphicon-unchecked'
                }
            };

        // Event Handlers
        $button.on('click', function () {
            $checkbox.prop('checked', !$checkbox.is(':checked'));
            $checkbox.triggerHandler('change');
            updateDisplay();
        });
        $checkbox.on('change', function () {
            updateDisplay();
        });

        // Actions
        function updateDisplay() {
            var isChecked = $checkbox.is(':checked');

            // Set the button's state
            $button.data('state', (isChecked) ? "on" : "off");

            // Set the button's icon
            $button.find('.state-icon')
                .removeClass()
                .addClass('state-icon ' + settings[$button.data('state')].icon);

            // Update the button's color
            if (isChecked) {
                $button
                    .removeClass('btn-default')
                    .addClass('btn-' + color + ' active');
            }
            else {
                $button
                    .removeClass('btn-' + color + ' active')
                    .addClass('btn-default');
            }
        }

        // Initialization
        function init() {

            updateDisplay();

            // Inject the icon if applicable
            if ($button.find('.state-icon').length == 0) {
                $button.prepend('<i class="state-icon ' + settings[$button.data('state')].icon + '"></i> ');
            }
        }
        init();
    });
});

function deleteCodes(){
	var selected = [];
	
	$('input[name="codes"]:checked').each(function() {
		selected.push($(this).attr('value'));
		  
		});
	console.log(selected);
	$.post( "/deleteCodes", {"codes": selected, "_csrf": csrf_data.token }, 
			function (data) { window.location.replace(data); }
		  );
}

function deleteMaps(){
	var selected = [];
	
	$('input[name="maps"]:checked').each(function() {
		selected.push($(this).attr('value'));
		  
		});
	console.log(selected);
	$.post( "/deleteMaps", {"maps": selected, "_csrf": csrf_data.token }, 
			function (data) { window.location.replace(data); }
		  );
}
