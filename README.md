> ## **IMPORTANT**

> This module is no longer actively maintained, however, if you're interested in adopting it, please let us know!

# Pagejax module for SilverStripe

Adds partial page loading using ajax. 

## Installation

Follow the standard SilverStripe module [installation procedure](http://doc.silverstripe.com/framework/en/topics/modules#installation)

## Requirements

You must have jquery included in your page 

## Usage

Cuurently we need to modify Page_Controller and add the following method
```php
	public function getViewer($action) {
        $viewer = parent::getViewer($action);
		$this->extend('updateViewer', $action, $viewer);
        return $viewer;
    }
```

Modify your main Page.ss template and change
```html
	$Layout
```
to 
```html
	<div class="pagejax-container">$Layout</div>
```

Then, any link you want to loaded internally needs to have the pagejax 
class applied, ie
```html
	<a href="some/internal/page" class="pagejax">Internal page</a>
```

To customise the way the page transitions in and out, you can bind to the 
window.pagejaxStart and window.pagejaxComplete events, eg
```javascript
	$(window).bind('pagejaxStart', function () { });
```
To change the page title on each refresh, specify an `ajaxTitle()` method on
your Page_Controller class; otherwise, the page title will not be chanaged.

The module does take into account CSS and JS added using Requirements:: by
parsing out relevant headers 

