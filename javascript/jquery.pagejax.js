
// based in part on the ajaxify gist at https://gist.github.com/854622

;(function ($, window) {

	var History = window.History,
	document = window.document;
	
	if ( !History.enabled ) {
		return false;
	}
	
	$(function () {
		var holder = '.pagejax-container',
			links  = '.pagejax',
			startEventName = 'pagejaxStart',
			completedEventName = 'pagejaxComplete',
			rootUrl = History.getRootUrl(),
			$body = $('body'),
			$window = $(window);
			
		var $content = $(holder).filter(':first');
		
		if ($content.length === 0) {
			return;
		}
		
		$.fn.ajaxify = function(){
			
			// Prepare
			var $this = $(this);
			
			// Ajaxify
			$(links).click(function(event){
				// Prepare
				var
					$this = $(this),
					url = $this.attr('href') || $this.data('href'),
					title = $this.attr('title')|| 'loading...';
				
				// Continue as normal for cmd clicks etc
				if ( event.which == 2 || event.metaKey ) { return true; }
				
				// Ajaxify this link
				History.pushState(null,title,url);
				event.preventDefault();
				return false;
			});

			// Chain
			return $this;
		};
		
		$content.ajaxify();
		
		$window.bind('statechange',function(){
			// Prepare Variables
			var
				State = History.getState(),
				url = State.url,
				relativeUrl = url.replace(rootUrl,'');
 
			// Set Loading
			$body.addClass('loading');

			$window.trigger(startEventName);
 
			// Start Fade Out
			// Animating to opacity to 0 still keeps the element's height intact
			// Which prevents that annoying pop bang issue when loading in new content
//			$content.animate({opacity:0},800);
			
			// Ajax Request the Traditional Page
			$.ajax({
				url: url,
				headers: {
					'X-Pagejax': 1
				},
				success: function(data, textStatus, jqXHR){
					// Prepare
					var
						pageData = data,
						$data = $(data),
						fullPage = data.indexOf('<html') > -1;
						
					
					// Update the content
					$content.stop(true,true);
					
					if (fullPage) {
						pageData = $('<div />').append($data).find(holder).filter(':first').html();
					} 

					$content.html(pageData).ajaxify().show(); /* you could fade in here if you'd like */
					
					
					// Update the title
					var title = jqXHR.getResponseHeader('X-PageTitle');
					if (title) {
						document.title = title;
						try {
							document.getElementsByTagName('title')[0].innerHTML = document.title.replace('<','&lt;').replace('>','&gt;').replace(' & ',' &amp; ');
						}
						catch ( Exception ) { }
					}
 
					// Complete the change
					$body.removeClass('loading');
					$window.trigger(completedEventName, {'data': data, 'status': textStatus, 'jqXHR': jqXHR});

					// Inform Google Analytics of the change
					if(typeof window._gaq !== "undefined"){
						window._gaq.push(['_trackPageview', relativeUrl]);	
					} else if(typeof window.ga !== "undefined"){	
				      	window.ga('send', 'pageview', relativeUrl);
				    }

					// Inform ReInvigorate of a state change
					if ( typeof window.reinvigorate !== 'undefined' && typeof window.reinvigorate.ajax_track !== 'undefined' ) {
						window.reinvigorate.ajax_track(url);
						// ^ we use the full url here as that is what reinvigorate supports
					}
				},
				error: function(jqXHR, textStatus, errorThrown){
					document.location.href = url;
					return false;
				}
			}); // end ajax
 
		}); // end onStateChange
	});
	
})(jQuery, window);