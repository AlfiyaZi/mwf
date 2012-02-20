/**
 * Defines methods under mwf.standard.configurableMenu that allow menu items to
 * be determined by the user.
 *
 * @package full
 * @subpackage js
 *
 * @author trott
 * @copyright Copyright (c) 2012 UC Regents
 * @license http://mwf.ucla.edu/license
 * @version 20120218
 *
 * @requires mwf
 * @requires mwf.standard.preferences
 * 
 */

mwf.full.configurableMenu=new function(){
    
    var _getPrefsLists = function(prefsKey) {
        var keys = null;
        
        if (mwf.standard.preferences.isSupported()) {
            var prefsValue = mwf.standard.preferences.get(prefsKey);
            if (prefsValue!==null)
                try {
                    keys = JSON.parse(prefsValue);    
                } catch (e) {
                    // String from user's preferences is not a valid JSON object.
                    // Revert to default.
                    keys = null;
                }
        }
        return keys;
    }
    
    var _contains = function(needle,haystack) {
        // In addition to 'needle', use '+needle' so that it gets cast to an 
        // integer if it's a string in integer form.
        // This allows objects and arrays to play nicely together as object keys 
        // will always be strings. 
        return (haystack.indexOf(needle)>=0 || haystack.indexOf(+needle)>=0); 
    }
        
    /**
     * Renders the items from object or array menuItems whose keys are specified
     * in the preferences key prefsKey into the DOM object with id targetId.
     * 
     * @param targetId string
     * @param prefsKey string
     * @param menuItems object|array
     * @param disabledMenuItems object|array
     * 
     * @return null
     */
    
    this.render = function(targetId, prefsKey, menuItems, disabledMenuItems){
        var target = document.getElementById(targetId);
        if (target === null)
            return;
        
        var result = '';
        var keys = _getPrefsLists(prefsKey);
        
        if (keys === null) {            
            for (var key in menuItems) {
                if (menuItems.hasOwnProperty(key))
                    result += menuItems[key];
            }
        } else {
            // Render items in 'on' in the correct order
            var i;
            
            var on = keys.hasOwnProperty('on') ? keys.on : [];

            for (i=0; i<on.length; i++) {
                if (menuItems.hasOwnProperty(on[i])) {
                    result += menuItems[on[i]];      
                }
            }

            
            // Render items that are neither in 'on' nor in 'off'
            var off = keys.hasOwnProperty('off') ? keys.off : [];
            
            for (i in menuItems) {
                if (menuItems.hasOwnProperty(i)) {
                    // In addition to 'i', use '+i' so that it gets cast to an 
                    // integer if it's a string in integer form.
                    // This allows objects and arrays to play nicely together as object keys will 
                    // always be strings. 
                    if (! (_contains(i,off) || _contains(i,on)))
                        result += menuItems[i];
                }
            }
            
            // If 'disabledMenuItems' was sent, then render items from 'off'
            if (disabledMenuItems) {
                for (i=0; i<off.length; i++) {
                    if (disabledMenuItems.hasOwnProperty(off[i])) {
                        result += disabledMenuItems[off[i]];
                    }
                }
            }
        }
        
        target.innerHTML = result;
    }
    
    /**
     * Enables or disables an item in the menu.
     * 
     * @param prefsKey string
     * @param itemId string|int Corresponds to array key in ini file for menu.
     * @param enable boolean If true, enable item. Otherwise, disable.
     */
    this.set = function(prefsKey, itemId, enable) {
        var prop = enable ? "on" : "off";
        var keys = _getPrefsLists(prefsKey);

        if (keys==null) {
            keys={};
        }

        if (! keys.hasOwnProperty(prop)) {
            keys[prop] = [itemId];
        } else {
            if (keys[prop].indexOf(itemId)==-1)
                keys[prop].push(itemId)
        }
        
        otherProp = prop=="on" ? "off" : "on";
        
        if (keys.hasOwnProperty(otherProp)) {
            while (keys[otherProp].indexOf(itemId)!=-1)
                keys[otherProp].splice(keys[otherProp].indexOf(itemId),1);
        }
        mwf.standard.preferences.set(prefsKey,JSON.stringify(keys));
    }
}