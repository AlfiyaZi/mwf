mwf.desktop.preview_menu=new function(){this.optionsHidden="";this.optionsShown="";this.init=function(){var b=new RegExp(mwf.desktop.preview_util.restrict_domain,"i");if(mwf.site.domain().search(b)<0){return}mwf.desktop.preview_menu.optionsHidden='<div id="desktop-preview-menu-options-hidden" class="options"><strong><a href="'+mwf.site.frontpage()+'?unovrcls" onclick="mwf.desktop.preview_menu.exitPreview()">Exit Preview</a></strong> | <em><a href="#">Developer Options</a></em></div>';if(mwf.user_agent.is_webkit_engine()){mwf.desktop.preview_menu.optionsShown='<div id="desktop-preview-menu-options" class="options"><strong><a href="'+mwf.site.frontpage()+'?unovrcls" onclick="mwf.desktop.preview_menu.exitPreview()">Exit Preview</a></strong> | <a href="'+mwf.site.frontpage()+'?ovrcls=iphone_os">Full View</a> | <a href="'+mwf.site.frontpage()+'?ovrcls=standard">Standard View</a> | <a href="'+mwf.site.frontpage()+'?ovrcls=basic">Basic View</a> | <em><a href="#" id="desktop-preview-menu-options-hide">Hide Options</a></em></div>'}else{mwf.desktop.preview_menu.optionsShown='<div id="desktop-preview-menu-options" class="options"><strong><a href="'+mwf.site.frontpage()+'?unovrcls" onclick="mwf.desktop.preview_menu.exitPreview()">Exit Preview</a></strong> | <a href="'+mwf.site.frontpage()+'?ovrcls=standard">Standard View</a> | <a href="'+mwf.site.frontpage()+'?ovrcls=basic">Basic View</a> | <em><a href="#" id="desktop-preview-menu-options-hide">Hide Options</a></em></div>'}if(!mwf.user_agent.is_preview()){return}if($("#button-top").length>0){if($("#button-top").hasClass("button-full")){$("#button-top").attr("id","")}else{var a=$("#button-top").prev();if(a.hasClass("button-padded")||a.hasClass("menu-padded")||a.hasClass("content-padded")||a.hasClass("form-padded")){$("#button-top").attr("class","button-full button-padded").attr("id","")}else{if(a.hasClass("button-full")||a.hasClass("menu-full")||a.hasClass("content-full")&&a.hasClass("form-full")){$("#button-top").attr("class","button-full").attr("id","")}else{$("#button-top").attr("id","")}}}}$("body").prepend('<div id="desktop-preview-menu"><h1>Preview Mode</h1>'+mwf.desktop.preview_menu.optionsHidden+'<div class="clear"></div></div>');$("#desktop-preview-menu-options-hidden").click(mwf.desktop.preview_menu.showMenu)};this.showMenu=function(a,b){$("#desktop-preview-menu-options-hidden").replaceWith(mwf.desktop.preview_menu.optionsShown);$("#desktop-preview-menu-options-hide").click(mwf.desktop.preview_menu.hideMenu)};this.hideMenu=function(a,b){$("#desktop-preview-menu-options").replaceWith(mwf.desktop.preview_menu.optionsHidden);$("#desktop-preview-menu-options-hidden").click(mwf.desktop.preview_menu.showMenu)};this.exitPreview=function(){if(window.opener.location!=null){window.opener.location.href=mwf.site.frontpage()+"?unovrcls";self.close()}}};if(window.addEventListener){window.addEventListener("load",mwf.desktop.preview_menu.init,false)}else{if(window.attachEvent){window.attachEvent("onload",mwf.desktop.preview_menu.init)}};