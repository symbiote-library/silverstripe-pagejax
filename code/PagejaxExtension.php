<?php

/**
 * @author <marcus@silverstripe.com.au>
 * @license BSD License http://www.silverstripe.org/bsd-license
 */
class PagejaxExtension extends Extension
{
    
    public function onAfterInit()
    {
        // it is assumed that jquery has been included by something else... 
        Requirements::javascript(PAGEJAX_DIR . '/javascript/jquery.history.1.8.js');
        Requirements::javascript(PAGEJAX_DIR . '/javascript/jquery.pagejax.js');
        
        if ($this->owner->hasMethod('ajaxTitle') && $this->owner->getRequest()->getHeader('X-Pagejax')) {
            $this->owner->getResponse()->addHeader('X-PageTitle', $this->owner->ajaxTitle());
        }
    }

    public function updateViewer($action, $viewer)
    {
        $chosen = $viewer->templates();
        
        if ($this->owner->getRequest()->getHeader('X-Pagejax') && isset($chosen['main'])) {
            $ajax = str_replace('.ss', '_Ajax.ss', $chosen['main']);
            if (!file_exists($ajax)) {
                $ajax = PAGEJAX_PATH . '/templates/AjaxPage.ss';
            }
            $viewer->setTemplateFile('main', $ajax);
        }
    }
}
