/**
 * Responsible for writing classification, user agent and screen cookies back
 * to the server and refreshing the page to propagate this if done as such.
 *
 * @package core
 * @subpackage js
 *
 * @author ebollens
 * @copyright Copyright (c) 2010-12 UC Regents
 * @license http://mwf.ucla.edu/license
 * @version 20120414
 *
 * @requires mwf
 * @requires mwf.site
 * @requires mwf.capability
 * @requires mwf.classification
 * @requires mwf.userAgent
 * @requires mwf.screen
 * 
 * @requires /root/assets/js/core/vars.php
 * @requires /root/assets/js/core/capability.js
 * @requires /root/assets/js/core/classification.js
 * @requires /root/assets/js/core/userAgent.js
 * @requires /root/assets/js/core/screen.js
 */

mwf.server = new function(){
    
    this.cookieNameLocal = mwf.site.cookie.prefix+'server';
    this.mustRedirect = false;
    this.mustReload = false;
    
    /**
     * Local variables to minimize payload size in compression.
     */
    
    var site = mwf.site,
        classification = mwf.classification,
        userAgent = mwf.userAgent,
        screen = mwf.screen;
    
    this.init = function(){
        
        /**
         * Initialization requires cookies to store data - else simply exit.
         */
        
        if(!mwf.capability.cookie())
            return;
        
        /**
         * Exit in the event that no_server_init is set as a query string
         * parameter. This ensures that an infinite loop will not occur with
         * passhthru.php, as it adds this parameter to the query string on
         * reload of the originator.
         */
        var query = window.location.href.split('?')[1];
        if(typeof query != 'undefined'){
            var vars = query.split('&');
            for(var i = 0; i < vars.length; i++){
                if(vars[i].split('=')[0] == 'no_server_init')
                    return;
            }
        }
        
        var classificationCookie = classification.generateCookieContent();
        
        /**
         * Set classification cookie if it doesn't already exist on server.
         * Set it if classification has changed (e.g., user turns on or off
         *    something in their settings).
         */
        
        if(!site.cookie.exists(classification.cookieName) || site.cookie.classification != classificationCookie)
            this.setCookie(classification.cookieName, classificationCookie);
        
        /**
         * Set user agent cookie if it doesn't already exist on server.
         */
        
        if(!site.cookie.exists(userAgent.cookieName))
            this.setCookie(userAgent.cookieName, userAgent.generateCookieContent());
        
        /**
         * Set screen cookie if it doesn't already exist on server.
         */
        
        if(!site.cookie.exists(screen.cookieName))
            this.setCookie(screen.cookieName, screen.generateCookieContent());

        /**
         * If the service provider doesn't have cookies, either (1) reload
         * the page if framework is of same-origin or device browser supports 
         * third-party cookies, or (2) redirect to the SP redirector. If the
         * service provider already has cookies, then this isn't necessary.
         */
        
        if(this.mustReload && !mwf.override.isRedirecting){
            var loc = window.location.href;
            if(loc.indexOf('?') == -1) loc += "?";
            if(loc.indexOf('?') < loc.length-1) loc += "&";
            loc += "no_server_init";
            window.location = loc;
        }else if(this.mustRedirect && !mwf.override.isRedirecting){
            window.location = site.asset.root+'/passthru.php?return='+encodeURIComponent(window.location)+'&mode='+mwf.browser.getMode();
        }
        
    }
    
    this.setCookie = function(cookieName, cookieContent) {
    
        /**
         * Function to generate a cookie on the service provider, specifying a
         * domain if this is a cross
         */
        
        var isSameOrigin = mwf.site.local.isSameOrigin();
            
        /**
         * If not cross-domain or this is the first load and third party is
         * supported, then attempt to write the cookie to the SP directly.
         */
        
        if(isSameOrigin){
            
            /**
             * Write the cookie with the proper suffix for service provider.
             */
            
            document.cookie = cookieName + '=' + encodeURIComponent(cookieContent)+';path=/';
            
            /**
             * Must reload the page to propagate the cookie to SP.
             */
            
            this.mustReload = true;
            
        /**
         * If third-party cookies aren't supported and this is cross domain,
         * then redirect through the SP and then back to CP.
         */  
        
        } else {
            
            this.mustRedirect = true;
            
        }
        
    }
    
}

mwf.server.init();
