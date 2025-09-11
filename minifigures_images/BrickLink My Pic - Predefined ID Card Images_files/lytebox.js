//***********************************************************************************************************************************/
//        LyteBox v3.22
//
//         Author: Markus F. Hay
//  Website: http://www.dolem.com/lytebox
//           Date: October 2, 2007
//        License: Creative Commons Attribution 3.0 License (http://creativecommons.org/licenses/by/3.0/)
// Browsers: Tested successfully on WinXP with the following browsers (using no DOCTYPE and Strict/Transitional/Loose DOCTYPES):
//                                * Firefox: 2.0.0.7, 1.5.0.12
//                                * Internet Explorer: 7.0, 6.0 SP2, 5.5 SP2
//                                * Opera: 9.23
//
// Releases: For up-to-date and complete release information, visit http://www.dolem.com/forum/showthread.php?tid=62
//                                * v3.22 (10/02/07)
//                                * v3.21 (09/30/07)
//                                * v3.20 (07/12/07)
//                                * v3.10 (05/28/07)
//                                * v3.00 (05/15/07)
//                                * v2.02 (11/13/06)
//
//   Credit: LyteBox was originally derived from the Lightbox class (v2.02) that was written by Lokesh Dhakar. For more
//                         information please visit http://huddletogether.com/projects/lightbox2/
//***********************************************************************************************************************************/
//
// Modifications by Dan Jezek:
//
// 5/18/09 - Get image location and gallery images via ajax
// 5/18/09 - Display thumbnails in gallery mode instead of prev/next links.
// 5/18/09 - Remove tooltip from thumb before load, put back after load to prevent tooltip showing on large image
// 5/18/09 - End on click of large image and loading div
// 5/19/09 - Fix bug with shaking in FireFox if previous image was same size
// 5/19/09 - Alternate code for onload to load lytebox before images on page are loaded
// 5/21/09 - Removed lyteshow and lyteframe, preloading of next/prev images
// 5/21/09 - If image has less than 250 width, set containers to 250 to prevent caption overflow if image is too small
// 5/29/09 - On error, display image not available.
//
//***********************************************************************************************************************************/
//
// Code inserts html at bottom of page that looks like:
//
// <DIV ID="overlay"></DIV>
// <DIV ID="lbMain">
//     <DIV ID="lbOuterContainer">
//         <DIV ID="lbImageContainer">
//             <IMG ID="lbImage">
//         </DIV>
//         <DIV ID="lbloading">
//         </DIV>
//     </DIV>
//     <DIV ID="lbDetailsContainer">
//         <DIV ID="lbDetailsData">
//             <DIV ID="lbDetails">
//                 <SPAN ID="lbCaption"></SPAN>
//             </DIV>
//             <DIV ID="lbBottomNav">
//                 <A HREF="#" ID="lbClose"></A>
//             </DIV>
//         </DIV>
//    </DIV>
//    <DIV ID="lbNavDisplay"></DIV>
// </DIV>
//
//***********************************************************************************************************************************/

Array.prototype.removeDuplicates = function () { for (var i = 1; i < this.length; i++) { if (this[i][0] == this[i-1][0]) { this.splice(i,1); } } }
Array.prototype.empty = function () { for (var i = 0; i <= this.length; i++) { this.shift(); } }
String.prototype.trim = function () { return this.replace(/^\s+|\s+$/g, ''); }

var ajText
var tmpThis
var tmpThisID
var tmpThisAlt

function ajReturn(theText) {
   ajText = theText
   document.getElementById('img' + tmpThisID).setAttribute('alt',tmpThisAlt)
   document.getElementById('img' + tmpThisID).setAttribute('title',tmpThisAlt)
   myLytebox.start(tmpThis);
}

function LyteBox() {
        /*** Start Global Configuration ***/
        this.hideFlash = true;                // controls whether or not Flash objects should be hidden
        this.outerBorder = true;                // controls whether to show the outer grey (or theme) border
        this.resizeSpeed = 10;                // controls the speed of the image resizing (1=slowest and 10=fastest)
        this.maxOpacity = 80;                // higher opacity = darker overlay, lower opacity = lighter overlay
        this.autoResize = false;                // controls whether or not images should be resized if larger than the browser window dimensions
        this.doAnimations = false;                // controls whether or not "animate" Lytebox, i.e. resize transition between images, fade in/out effects, etc.
        this.borderSize = 12;                // if you adjust the padding in the CSS, you will need to update this variable -- otherwise, leave this alone...
        /*** End Global Configuration ***/

        if(this.resizeSpeed > 10) { this.resizeSpeed = 10; }
        if(this.resizeSpeed < 1) { resizeSpeed = 1; }
        this.resizeDuration = (11 - this.resizeSpeed) * 0.15;
        this.resizeWTimerArray = new Array();
        this.resizeWTimerCount = 0;
        this.resizeHTimerArray = new Array();
        this.resizeHTimerCount = 0;
        this.showContentTimerArray = new Array();
        this.showContentTimerCount = 0;
        this.overlayTimerArray = new Array();
        this.overlayTimerCount = 0;
        this.imageTimerArray = new Array();
        this.imageTimerCount = 0;
        this.timerIDArray = new Array();
        this.timerIDCount = 0;
        this.imageArray = new Array();
        this.thumbArray = new Array();
        this.activeImage = null;

        this.lytebox = "myLytebox";
        this.doc = document;

        this.prevImgW = 0
        this.prevImgH = 0
        /*@cc_on
                /*@if (@_jscript)
                        this.ie = (document.all && !window.opera) ? true : false;
                /*@else @*/
                        this.ie = false;
                /*@end
        @*/
        this.ie7 = (this.ie && window.XMLHttpRequest);
        this.initialize();
}
LyteBox.prototype.initialize = function() {
        this.updateLyteboxItems();
        var objBody = this.doc.getElementsByTagName("body").item(0);
        if (this.doc.getElementById('lbOverlay')) {
                objBody.removeChild(this.doc.getElementById("lbOverlay"));
                objBody.removeChild(this.doc.getElementById("lbMain"));
        }
        var objOverlay = this.doc.createElement("div");
                objOverlay.setAttribute('id','lbOverlay');
                if ((this.ie && !this.ie7) || (this.ie7 && this.doc.compatMode == 'BackCompat')) {
                        objOverlay.style.position = 'absolute';
                }
                objOverlay.style.display = 'none';
                objBody.appendChild(objOverlay);
        var objLytebox = this.doc.createElement("div");
                objLytebox.setAttribute('id','lbMain');
                objLytebox.style.display = 'none';
                objBody.appendChild(objLytebox);
        var objOuterContainer = this.doc.createElement("div");
                objOuterContainer.setAttribute('id','lbOuterContainer');
                objLytebox.appendChild(objOuterContainer);
        var objImageContainer = this.doc.createElement("div");
                objImageContainer.setAttribute('id','lbImageContainer');
                objOuterContainer.appendChild(objImageContainer);
        var objLyteboxImage = this.doc.createElement("img");
                objLyteboxImage.setAttribute('id','lbImage');
                objImageContainer.appendChild(objLyteboxImage);
        var objLoading = this.doc.createElement("div");
                objLoading.setAttribute('id','lbLoading');
                objOuterContainer.appendChild(objLoading);
        var objDetailsContainer = this.doc.createElement("div");
                objDetailsContainer.setAttribute('id','lbDetailsContainer');
                objLytebox.appendChild(objDetailsContainer);
        var objDetailsData =this.doc.createElement("div");
                objDetailsData.setAttribute('id','lbDetailsData');
                objDetailsContainer.appendChild(objDetailsData);
        var objDetails = this.doc.createElement("div");
                objDetails.setAttribute('id','lbDetails');
                objDetailsData.appendChild(objDetails);
        var objCaption = this.doc.createElement("span");
                objCaption.setAttribute('id','lbCaption');
                objDetails.appendChild(objCaption);
        var objBottomNav = this.doc.createElement("div");
                objBottomNav.setAttribute('id','lbBottomNav');
                objDetailsData.appendChild(objBottomNav);
        var objClose = this.doc.createElement("a");
                objClose.setAttribute('id','lbClose');
                objClose.setAttribute('href','#');
                objBottomNav.appendChild(objClose);
        var objNavDisplay = this.doc.createElement("span");
                objNavDisplay.setAttribute('id','lbNavDisplay');
                objNavDisplay.style.display = 'none';
                objLytebox.appendChild(objNavDisplay);
};
LyteBox.prototype.updateLyteboxItems = function() {
        var anchors = document.getElementsByTagName('a');
        var tmpCnt = 0
        for (var i = 0; i < anchors.length; i++) {
                var anchor = anchors[i];
                var relAttribute = String(anchor.getAttribute('rel'));
                if (anchor.getAttribute('href')) {
                        if (relAttribute.toLowerCase().match('lytebox') || relAttribute.toLowerCase().match('blmyimg')) {
                                anchor.onclick = function () { myLytebox.start(this); return false; }
                        } else if (relAttribute.toLowerCase().match('blcatimg')) {
                                anchor.onclick = function () {
                                     tmpThis = this

                                     tmpThisID = this.getAttribute('id')
                                     tmpThisID = tmpThisID.replace('imgLink','')
                                     tmpThisAlt = document.getElementById('img' + tmpThisID).getAttribute('alt')
                                     document.getElementById('img' + tmpThisID).setAttribute('alt','')
                                     document.getElementById('img' + tmpThisID).setAttribute('title','')

                                     var tmpLink = this.getAttribute('href')
                                     var tmpResult = tmpLink.replace('catalogItemPic','getImgHref')

                                     ajaxGet(tmpResult,ajReturn,'N',null)
                                     return false;
                                }
                        }
                }
        }
};
LyteBox.prototype.start = function(imageLink) {
        if (this.ie && !this.ie7) {        this.toggleSelects('hide');        }
        if (this.hideFlash) { this.toggleFlash('hide'); }
        var pageSize        = this.getPageSize();
        var objOverlay        = this.doc.getElementById('lbOverlay');
        var objBody                = this.doc.getElementsByTagName("body").item(0);
        objOverlay.style.height = pageSize[1] + "px";
        objOverlay.style.display = '';
        this.appear('lbOverlay', (this.doAnimations ? 0 : this.maxOpacity));
        var anchors = document.getElementsByTagName('a');

        this.imageArray = [];
        this.thumbArray = [];
        this.imageNum = 0;
        if ((imageLink.getAttribute('rel') == 'blcatimg')) {
                eval(ajText)
        } else {
                if ((imageLink.getAttribute('rel') == 'blmyimg')) {
                        this.imageArray.push(new Array(imageLink.getAttribute('target'), ''));
                } else {
                        if ((imageLink.getAttribute('rel') == 'lytebox')) {
                                this.imageArray.push(new Array(imageLink.getAttribute('href'), imageLink.getAttribute('title')));
                        } else {
                                if (imageLink.getAttribute('rel').indexOf('lytebox') != -1) {
                                        for (var i = 0; i < anchors.length; i++) {
                                                var anchor = anchors[i];
                                                if (anchor.getAttribute('href') && (anchor.getAttribute('rel') == imageLink.getAttribute('rel'))) {
                                                        this.imageArray.push(new Array(anchor.getAttribute('href'), anchor.getAttribute('title')));
                                                }
                                        }
                                        this.imageArray.removeDuplicates();
                                        while(this.imageArray[this.imageNum][0] != imageLink.getAttribute('href')) { this.imageNum++; }
                                }
                        }
                }
        }

        var object = this.doc.getElementById('lbMain');
                object.style.top = (this.getPageScroll() + (pageSize[3] / 15)) + "px";
                object.style.display = '';
        if (!this.outerBorder) {
                this.doc.getElementById('lbOuterContainer').style.border = 'none';
                this.doc.getElementById('lbDetailsContainer').style.border = 'none';
        } else {
                this.doc.getElementById('lbOuterContainer').style.borderBottom = '';
        }
        this.doc.getElementById('lbOverlay').onclick = function() { myLytebox.end(); return false; }
        this.doc.getElementById('lbMain').onclick = function(e) {
                var e = e;
                if (!e) {
                        if (window.parent.frames[window.name] && (parent.document.getElementsByTagName('frameset').length <= 0)) {
                                e = window.parent.window.event;
                        } else {
                                e = window.event;
                        }
                }
                var id = (e.target ? e.target.id : e.srcElement.id);
                if (id == 'lbMain') { myLytebox.end(); return false; }
        }
        this.doc.getElementById('lbOuterContainer').onclick = function() { myLytebox.end(); return false; }
        this.doc.getElementById('lbImage').onclick = function() { myLytebox.end(); return false; }
        this.doc.getElementById('lbClose').onclick = function() { myLytebox.end(); return false; }
        this.changeContent(this.imageNum);
};
LyteBox.prototype.changeContent = function(imageNum) {
        this.activeImage = imageNum;
        if (!this.outerBorder) {
                this.doc.getElementById('lbOuterContainer').style.border = 'none';
                this.doc.getElementById('lbDetailsContainer').style.border = 'none';
        } else {
                this.doc.getElementById('lbOuterContainer').style.borderBottom = '';
        }
        this.doc.getElementById('lbLoading').style.display = '';
        this.doc.getElementById('lbImage').style.display = 'none';
        this.doc.getElementById('lbDetailsContainer').style.display = 'none';

        object = this.doc.getElementById('lbNavDisplay');
        object.innerHTML = ''
        for (i = 0; i < myLytebox.thumbArray.length; i++) {
                //object.innerHTML += '<A HREF="#" onClick="myLytebox.changeContent(' + i + '); return false;"><IMG BORDER="1" SRC="' + myLytebox.thumbArray[i] + '" WIDTH="80" HEIGHT="60"></A>&nbsp;'
				object.innerHTML += '<A HREF="#" onClick="myLytebox.changeContent(' + i + '); return false;"><IMG BORDER="1" SRC="' + myLytebox.thumbArray[i] + '" style="max-width: 80px; max-height: 80px;"></A>&nbsp;'
        }

        imgPreloader = new Image();
        imgPreloader.onerror = function() {
                imgPreloader.src = "//static.bricklink.com/clone/img/no_image.png"
                lbImage.src = "//static.bricklink.com/clone/img/no_image.png"
                imgPreloader.onerror = function() {};
        }
        imgPreloader.onload = function() {
                var imageWidth = imgPreloader.width;
                var imageHeight = imgPreloader.height;
                if (myLytebox.autoResize) {
                        var pagesize = myLytebox.getPageSize();
                        var x = pagesize[2] - 150;
                        var y = pagesize[3] - 150;
                        if (imageWidth > x) {
                              imageHeight = Math.round(imageHeight * (x / imageWidth));
                              imageWidth = x;
                              if (imageHeight > y) {
                                      imageWidth = Math.round(imageWidth * (y / imageHeight));
                                      imageHeight = y;
                              }
                        } else if (imageHeight > y) {
                              imageWidth = Math.round(imageWidth * (y / imageHeight));
                              imageHeight = y;
                              if (imageWidth > x) {
                                      imageHeight = Math.round(imageHeight * (x / imageWidth));
                                      imageWidth = x;
                              }
                        }
                }
                var lbImage = myLytebox.doc.getElementById('lbImage')
                lbImage.src = myLytebox.imageArray[myLytebox.activeImage][0]
                lbImage.width = imageWidth;
                lbImage.height = imageHeight;
                myLytebox.resizeContainer(imageWidth, imageHeight);
                imgPreloader.onload = function() {};
        }
        imgPreloader.src = this.imageArray[this.activeImage][0];
};
LyteBox.prototype.resizeContainer = function(imgWidth, imgHeight) {
        this.wCur = this.doc.getElementById('lbOuterContainer').offsetWidth;
        this.hCur = this.doc.getElementById('lbOuterContainer').offsetHeight;
        this.xScale = ((imgWidth  + (this.borderSize * 2)) / this.wCur) * 100;
        this.yScale = ((imgHeight  + (this.borderSize * 2)) / this.hCur) * 100;

        //var wDiff = (this.wCur - this.borderSize * 2) - imgWidth;
        //var hDiff = (this.hCur - this.borderSize * 2) - imgHeight;

        var wDiff = myLytebox.prevImgW - imgWidth;
        var hDiff = myLytebox.prevImgH - imgHeight;

        myLytebox.prevImgW = imgWidth;
        myLytebox.prevImgH = imgHeight;

        if (imgWidth + (this.borderSize*2) < 250) {
                this.wFix = 250
                this.wFixed = 'Y'
        } else {
                this.wFix = imgWidth + (this.borderSize*2)
                this.wFixed = 'N'
        }

        if (!(hDiff == 0)) {
                this.hDone = false;
                this.resizeH('lbOuterContainer', this.hCur, imgHeight + this.borderSize*2, this.getPixelRate(this.hCur, imgHeight));
        } else {
                this.hDone = true;
        }
        if (!(wDiff == 0)) {
                this.wDone = false;
                this.resizeW('lbOuterContainer', this.wCur, this.wFix, this.getPixelRate(this.wCur, imgWidth));
        } else {
                this.wDone = true;
        }
        if ((hDiff == 0) && (wDiff == 0)) {
                if (this.ie){ this.pause(250); } else { this.pause(100); }
        }
        if (this.wFixed == 'Y') {
          this.doc.getElementById('lbDetailsContainer').style.width = this.wFix + "px";
        } else {
          this.doc.getElementById('lbDetailsContainer').style.width = (this.wFix + (this.ie && this.doc.compatMode == "BackCompat" && this.outerBorder ? 2 : 0)) + "px";
        }
        this.showContent();
};
LyteBox.prototype.showContent = function() {
        if (this.wDone && this.hDone) {
                for (var i = 0; i < this.showContentTimerCount; i++) { window.clearTimeout(this.showContentTimerArray[i]); }
                if (this.outerBorder) {
                        this.doc.getElementById('lbOuterContainer').style.borderBottom = 'none';
                }
                this.doc.getElementById('lbLoading').style.display = 'none';
                this.doc.getElementById('lbImage').style.display = '';
                this.appear('lbImage', (this.doAnimations ? 0 : 100));
                //this.preloadNeighborImages();
                if (this.imageArray.length > 1) {
                        this.doc.getElementById('lbNavDisplay').style.display = '';
                } else {
                       this.doc.getElementById('lbNavDisplay').style.display = 'none';
                }
                this.doc.getElementById('lbClose').style.display = '';
                this.doc.getElementById('lbDetails').style.display = '';
                this.doc.getElementById('lbImageContainer').style.display = '';
        } else {
                this.showContentTimerArray[this.showContentTimerCount++] = setTimeout("myLytebox.showContent()", 200);
        }
};
LyteBox.prototype.updateDetails = function() {
        var object = this.doc.getElementById('lbCaption');
        var sTitle = this.imageArray[this.activeImage][1]
        object.style.display = '';
        object.innerHTML = (sTitle == null ? '' : sTitle);
        this.enableKeyboardNav();
        this.doc.getElementById('lbDetailsContainer').style.display = '';
        if (this.imageArray.length > 1) {
                this.doc.getElementById('lbNavDisplay').style.display = '';
        } else {
                this.doc.getElementById('lbNavDisplay').style.display = 'none';
        }
        this.appear('lbDetailsContainer', (this.doAnimations ? 0 : 100));
};
LyteBox.prototype.enableKeyboardNav = function() { document.onkeydown = this.keyboardAction; };
LyteBox.prototype.disableKeyboardNav = function() { document.onkeydown = ''; };
LyteBox.prototype.keyboardAction = function(e) {
        var keycode = key = escape = null;
        keycode        = (e == null) ? event.keyCode : e.which;
        key                = String.fromCharCode(keycode).toLowerCase();
        escape  = (e == null) ? 27 : e.DOM_VK_ESCAPE;
        if ((key == 'x') || (key == 'c') || (keycode == escape)) {
                myLytebox.end();
        } else if ((key == 'p') || (keycode == 37)) {
                if(myLytebox.activeImage != 0) {
                        myLytebox.disableKeyboardNav();
                        myLytebox.changeContent(myLytebox.activeImage - 1);
                }
        } else if ((key == 'n') || (keycode == 39)) {
                if(myLytebox.activeImage != (myLytebox.imageArray.length - 1)) {
                        myLytebox.disableKeyboardNav();
                        myLytebox.changeContent(myLytebox.activeImage + 1);
                }
        }
};
LyteBox.prototype.preloadNeighborImages = function() {
        if ((this.imageArray.length - 1) > this.activeImage) {
                preloadNextImage = new Image();
                preloadNextImage.src = this.imageArray[this.activeImage + 1][0];
        }
        if(this.activeImage > 0) {
                preloadPrevImage = new Image();
                preloadPrevImage.src = this.imageArray[this.activeImage - 1][0];
        }
};
LyteBox.prototype.end = function(caller) {
        this.disableKeyboardNav();
        this.doc.getElementById('lbMain').style.display = 'none';
        this.fade('lbOverlay', (this.doAnimations ? this.maxOpacity : 0));
        this.toggleSelects('visible');
        if (this.hideFlash) { this.toggleFlash('visible'); }
};
LyteBox.prototype.getPixelRate = function(cur, img) {
        var diff = (img > cur) ? img - cur : cur - img;
        if (diff >= 0 && diff <= 100) { return 10; }
        if (diff > 100 && diff <= 200) { return 15; }
        if (diff > 200 && diff <= 300) { return 20; }
        if (diff > 300 && diff <= 400) { return 25; }
        if (diff > 400 && diff <= 500) { return 30; }
        if (diff > 500 && diff <= 600) { return 35; }
        if (diff > 600 && diff <= 700) { return 40; }
        if (diff > 700) { return 45; }
};
LyteBox.prototype.appear = function(id, opacity) {
        var object = this.doc.getElementById(id).style;
        object.opacity = (opacity / 100);
        object.MozOpacity = (opacity / 100);
        object.KhtmlOpacity = (opacity / 100);
        object.filter = "alpha(opacity=" + (opacity + 10) + ")";
        if (opacity == 100 && (id == 'lbImage')) {
                try { object.removeAttribute("filter"); } catch(e) {}        /* Fix added for IE Alpha Opacity Filter bug. */
                this.updateDetails();
        } else if (opacity >= this.maxOpacity && id == 'lbOverlay') {
                for (var i = 0; i < this.overlayTimerCount; i++) { window.clearTimeout(this.overlayTimerArray[i]); }
                return;
        } else if (opacity >= 100 && id == 'lbDetailsContainer') {
                try { object.removeAttribute("filter"); } catch(e) {}        /* Fix added for IE Alpha Opacity Filter bug. */
                for (var i = 0; i < this.imageTimerCount; i++) { window.clearTimeout(this.imageTimerArray[i]); }
                this.doc.getElementById('lbOverlay').style.height = this.getPageSize()[1] + "px";
        } else {
                if (id == 'lbOverlay') {
                        this.overlayTimerArray[this.overlayTimerCount++] = setTimeout("myLytebox.appear('" + id + "', " + (opacity+20) + ")", 1);
                } else {
                        this.imageTimerArray[this.imageTimerCount++] = setTimeout("myLytebox.appear('" + id + "', " + (opacity+10) + ")", 1);
                }
        }
};
LyteBox.prototype.fade = function(id, opacity) {
        var object = this.doc.getElementById(id).style;
        object.opacity = (opacity / 100);
        object.MozOpacity = (opacity / 100);
        object.KhtmlOpacity = (opacity / 100);
        object.filter = "alpha(opacity=" + opacity + ")";
        if (opacity <= 0) {
                try {
                        object.display = 'none';
                } catch(err) { }
        } else if (id == 'lbOverlay') {
                this.overlayTimerArray[this.overlayTimerCount++] = setTimeout("myLytebox.fade('" + id + "', " + (opacity-20) + ")", 1);
        } else {
                this.timerIDArray[this.timerIDCount++] = setTimeout("myLytebox.fade('" + id + "', " + (opacity-10) + ")", 1);
        }
};
LyteBox.prototype.resizeW = function(id, curW, maxW, pixelrate, speed) {
        if (!this.hDone) {
                this.resizeWTimerArray[this.resizeWTimerCount++] = setTimeout("myLytebox.resizeW('" + id + "', " + curW + ", " + maxW + ", " + pixelrate + ")", 100);
                return;
        }
        var object = this.doc.getElementById(id);
        var timer = speed ? speed : (this.resizeDuration/2);
        var newW = (this.doAnimations ? curW : maxW);
        object.style.width = (newW) + "px";
        if (newW < maxW) {
                newW += (newW + pixelrate >= maxW) ? (maxW - newW) : pixelrate;
        } else if (newW > maxW) {
                newW -= (newW - pixelrate <= maxW) ? (newW - maxW) : pixelrate;
        }
        this.resizeWTimerArray[this.resizeWTimerCount++] = setTimeout("myLytebox.resizeW('" + id + "', " + newW + ", " + maxW + ", " + pixelrate + ", " + (timer+0.02) + ")", timer+0.02);
        if (parseInt(object.style.width) == maxW) {
                this.wDone = true;
                for (var i = 0; i < this.resizeWTimerCount; i++) { window.clearTimeout(this.resizeWTimerArray[i]); }
        }
};
LyteBox.prototype.resizeH = function(id, curH, maxH, pixelrate, speed) {
        var timer = speed ? speed : (this.resizeDuration/2);
        var object = this.doc.getElementById(id);
        var newH = (this.doAnimations ? curH : maxH);
        object.style.height = (newH) + "px";
        if (newH < maxH) {
                newH += (newH + pixelrate >= maxH) ? (maxH - newH) : pixelrate;
        } else if (newH > maxH) {
                newH -= (newH - pixelrate <= maxH) ? (newH - maxH) : pixelrate;
        }
        this.resizeHTimerArray[this.resizeHTimerCount++] = setTimeout("myLytebox.resizeH('" + id + "', " + newH + ", " + maxH + ", " + pixelrate + ", " + (timer+.02) + ")", timer+.02);
        if (parseInt(object.style.height) == maxH) {
                this.hDone = true;
                for (var i = 0; i < this.resizeHTimerCount; i++) { window.clearTimeout(this.resizeHTimerArray[i]); }
        }
};
LyteBox.prototype.getPageScroll = function() {
        if (self.pageYOffset) {
                return self.pageYOffset;
        } else if (this.doc.documentElement && this.doc.documentElement.scrollTop){
                return this.doc.documentElement.scrollTop;
        } else if (document.body) {
                return this.doc.body.scrollTop;
        }
};
LyteBox.prototype.getPageSize = function() {
        var xScroll, yScroll, windowWidth, windowHeight;
        if (window.innerHeight && window.scrollMaxY) {
                xScroll = this.doc.scrollWidth;
                yScroll = self.innerHeight + self.scrollMaxY;
        } else if (this.doc.body.scrollHeight > this.doc.body.offsetHeight){
                xScroll = this.doc.body.scrollWidth;
                yScroll = this.doc.body.scrollHeight;
        } else {
                xScroll = this.doc.getElementsByTagName("html").item(0).offsetWidth;
                yScroll = this.doc.getElementsByTagName("html").item(0).offsetHeight;
                xScroll = (xScroll < this.doc.body.offsetWidth) ? this.doc.body.offsetWidth : xScroll;
                yScroll = (yScroll < this.doc.body.offsetHeight) ? this.doc.body.offsetHeight : yScroll;
        }
        if (self.innerHeight) {
                windowWidth = self.innerWidth;
                windowHeight = self.innerHeight;
        } else if (document.documentElement && document.documentElement.clientHeight) {
                windowWidth = this.doc.documentElement.clientWidth;
                windowHeight = this.doc.documentElement.clientHeight;
        } else if (document.body) {
                windowWidth = this.doc.getElementsByTagName("html").item(0).clientWidth;
                windowHeight = this.doc.getElementsByTagName("html").item(0).clientHeight;
                windowWidth = (windowWidth == 0) ? this.doc.body.clientWidth : windowWidth;
                windowHeight = (windowHeight == 0) ? this.doc.body.clientHeight : windowHeight;
        }
        var pageHeight = (yScroll < windowHeight) ? windowHeight : yScroll;
        var pageWidth = (xScroll < windowWidth) ? windowWidth : xScroll;
        return new Array(pageWidth, pageHeight, windowWidth, windowHeight);
};
LyteBox.prototype.toggleFlash = function(state) {
        var objects = this.doc.getElementsByTagName("object");
        for (var i = 0; i < objects.length; i++) {
                objects[i].style.visibility = (state == "hide") ? 'hidden' : 'visible';
        }
        var embeds = this.doc.getElementsByTagName("embed");
        for (var i = 0; i < embeds.length; i++) {
                embeds[i].style.visibility = (state == "hide") ? 'hidden' : 'visible';
        }
};
LyteBox.prototype.toggleSelects = function(state) {
        var selects = this.doc.getElementsByTagName("select");
        for (var i = 0; i < selects.length; i++ ) {
                selects[i].style.visibility = (state == "hide") ? 'hidden' : 'visible';
        }
};
LyteBox.prototype.pause = function(numberMillis) {
        var now = new Date();
        var exitTime = now.getTime() + numberMillis;
        while (true) {
                now = new Date();
                if (now.getTime() > exitTime) { return; }
        }
};

//
//
// OnLoad Replacement
//
//

function initLB() {
   if (arguments.callee.done) return;
   arguments.callee.done = true;
   if (_timer) {
      clearInterval(_timer);
      _timer = null;
   }
   initLytebox();
};

/* Mozilla */
if (document.addEventListener) {
   document.addEventListener("DOMContentLoaded", initLB, false);
}


/* Safari */
if (/WebKit/i.test(navigator.userAgent)) {
   var _timer = setInterval(function() {
      if (/loaded|complete/.test(document.readyState)) {
         initLB(); // call the onload handler
      }
   }, 10);
}

/* for other browsers */
window.onload = initLB;

//if (window.addEventListener) {
//        window.addEventListener("load",initLytebox,false);
//} else if (window.attachEvent) {
//        window.attachEvent("onload",initLytebox);
//} else {
//        window.onload = function() {initLytebox();}
//}

function initLytebox() { myLytebox = new LyteBox(); }