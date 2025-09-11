// Mobile Check Util : from https://github.com/kaimallea/isMobile
(function () {var a={};var g=/iPhone/i,p=/iPod/i,i=/iPad/i,f=/\bAndroid(?:.+)Mobile\b/i,h=/Android/i,d=/(?:SD4930UR|\bSilk(?:.+)Mobile\b)/i,e=/Silk/i,c=/Windows Phone/i,j=/\bWindows(?:.+)ARM\b/i,k=/BlackBerry/i,l=/BB10/i,m=/Opera Mini/i,n=/\b(CriOS|Chrome)(?:.+)Mobile/i,o=/Mobile(?:.+)Firefox\b/i;function b($,a){return $.test(a)}function q($){var a=($=$||("undefined"!=typeof navigator?navigator.userAgent:"")).split("[FBAN");void 0!==a[1]&&($=a[0]),void 0!==(a=$.split("Twitter"))[1]&&($=a[0]);var r={apple:{phone:b(g,$)&&!b(c,$),ipod:b(p,$),tablet:!b(g,$)&&b(i,$)&&!b(c,$),device:(b(g,$)||b(p,$)||b(i,$))&&!b(c,$)},amazon:{phone:b(d,$),tablet:!b(d,$)&&b(e,$),device:b(d,$)||b(e,$)},android:{phone:!b(c,$)&&b(d,$)||!b(c,$)&&b(f,$),tablet:!b(c,$)&&!b(d,$)&&!b(f,$)&&(b(e,$)||b(h,$)),device:!b(c,$)&&(b(d,$)||b(e,$)||b(f,$)||b(h,$))||b(/\bokhttp\b/i,$)},windows:{phone:b(c,$),tablet:b(j,$),device:b(c,$)||b(j,$)},other:{blackberry:b(k,$),blackberry10:b(l,$),opera:b(m,$),firefox:b(o,$),chrome:b(n,$),device:b(k,$)||b(l,$)||b(m,$)||b(o,$)||b(n,$)},any:!1,phone:!1,tablet:!1};return r.any=r.apple.device||r.android.device||r.windows.device||r.other.device,r.phone=r.apple.phone||r.android.phone||r.windows.phone,r.tablet=r.apple.tablet||r.android.tablet||r.windows.tablet,r}a=q();if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=a}else if(typeof define==="function"&&define.amd){define(function(){return a})}else{this["isMobile"]=a}})();

(
	function ()
	{
		"use strict";

		var UUID	=
		{
		};

		var Base64=
		{
			_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="
		,	encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t}
		,	decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9\+\/\=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t}
		,	_utf8_encode:function(e){e=e.replace(/\r\n/g,"\n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t}
		,	_utf8_decode:function(e){var t="";var n=0;var r=0, c1=0, c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}
		};

		var	blUtil	=
			{
				_mapCountry:		null
			,	_mapColor:			null
			,	refreshReserved:	false
			,	NAME_COOKIESETTING:	"blckCookieSetting"			
			,	isSafeToRefer: 		
					function ( v ) { try { if (v != null) return true; } catch (err) {};  return false; }

			,	getBLHost:  		
					function ( type )
					{
						var		host	= "www.bricklink.com";

						switch ( type )
						{
							case 'www':		host = "www.bricklink.com"; 	try { host = blo_host.www_host; } catch (err) {};	break;

							case 'alpha':	host = "www.bricklink.com";		try { host = blo_host.alpha_host; } catch (err) {}; break;
							case 'img':		host = "img.bricklink.com";		try { host = blo_host.img_host; } catch (err) {}; break;
							case 'static':	host = "static.bricklink.com";	try { host = blo_host.static_host; } catch (err) {}; break;
							case 'store':	host = "store.bricklink.com";	try { host = blo_host.store_host; } catch (err) {}; break;
							case 'api':		host = "api.bricklink.com";	    try { host = blo_host.api_host; } catch (err) {}; break;
							case 'cmsapi':	host = "cms-api.bricklink.com";	    try { host = blo_host.cmsapi_host; } catch (err) {}; break;
							case "studioforum": host = "forum.bricklink.com"; try { host = blo_host.studioforum_host; } catch (err) {}; break;
							case "v2portal": host = "www.v2.bricklink.com"; try { host = blo_host.v2portal_host; } catch (err) {}; break;
						}
						return host;
					}
			,	formatInteger:	
					function ( num ) { return parseInt( num ).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); }

			,	getVarsFromHashString: 
					function ( strHash )
					{
						var	vars	= {}, hash;
						var	hashes 	= strHash.slice(strHash.indexOf('#') + 1).split('&');
						for ( var i = 0; i < hashes.length; i++ )
						{
							hash = hashes[i].split('=');
							vars[hash[0]] = this.decodeURL( hash[1] );
						}
						return vars;
					}

			,	getVarsFromUrlString:
					function ( url )
					{
						var	vars	= {}, hash;
						var	strURL	= String( url );
						var	hashIdx	= strURL.indexOf('#');
						var	hashes 	= strURL.slice(strURL.indexOf('?') + 1, hashIdx == -1 ? strURL.length : hashIdx).split('&');
						for ( var i = 0; i < hashes.length; i++ )
						{
							hash = hashes[i].split('=');
							vars[hash[0]] = this.decodeURL( hash[1] );
						}
						return vars;
					}
			,	getUrlValues: 
					function(){
						var	vars	= {};
						var	strURL	= String( window.location.href );
						var	hashIdx	= strURL.indexOf('#');
						var	hashes 	= strURL.slice(strURL.indexOf('?') + 1, hashIdx == -1 ? strURL.length : hashIdx).split('&');
						for ( var i = 0; i < hashes.length; i++ )
						{
							hash = hashes[i].split('=');
							vars[hash[0]] = this.decodeURL( hash[1] );
						}
						return vars;
					}
			,	getUrlVars: 
					function() { return this.getVarsFromUrlString( window.location.href ); }
			,	removeParamFromUrl:
					function( param, url )
					{
						if( window.URLSearchParams )
						{
							var urlNew = new URL(url);
							urlNew.searchParams.delete(param);
							return urlNew;
						}
						else{
							var mainURL = url.split('?')[0];
							var search = url.split('?')[1];
							var params = {};
							search && search.split('&').forEach(function(pair) {
								var split = pair.split('=');
								params[split[0]] = split[1];
							});
							delete params[param];
							if (Object.keys(params).length == 0) {
								return mainURL;
								}
								return mainURL + '?' + Object.keys(params)
								.forEach(function(param) { param + '=' + params[param]})
								.join('&');
						}
					}

			,	getHashVars: 
					function() { return this.getVarsFromHashString( window.location.href ); }

			,	getUrlVar:
					function ( name ) { return this.getUrlVars()[name]; }

			,	getHashVar: 
					function ( name ) { return this.getHashVars()[name]; }

			,	loadCSS: 
					function ( url )
					{
						var cssElem = document.createElement( "link" );

						cssElem.setAttribute( "rel", "stylesheet" );
						cssElem.setAttribute( "type", "text/css" );
						cssElem.setAttribute( "href", url );
						if ( typeof cssElem != "undefined" )
							document.getElementsByTagName( "head" )[0].appendChild( cssElem );
					}
			,	encodeURL:
					function( str ) { return encodeURIComponent(str+''); }
			,	decodeURL:
					function( str ) { return decodeURIComponent((str+'').replace(/\+/g, '%20')); }		
			
			,	unescapeUnicode: 
					function( txt )	{ return String( txt ).replace( /\\u([\d\w]{4})/gi, function (match, grp) { return String.fromCharCode(parseInt(grp, 16)); } ); }

			,	encodeHtml: 
					function( txt )	{ return String( txt ).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;'); }

			,	decodeHtml: 
					function( txt ) { return String( this.unescapeUnicode( txt ) ).replace(/&quot;/g, '"').replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/&amp;/g, '&').replace( /&#([\d\w]+);/gi, function (match, grp) { return String.fromCharCode( parseInt( grp, 10 ) ) } ); }
	
			,	escapeJS: 
					function ( txt ) { return ( txt + '').replace(/[\\']/g, '&apos;').replace(/[\\"]/g, '&quot;'); }
	
			,	unescapeJS: 
					function ( txt ) { return ( txt + '').replace( /&apos;/g, "'" ).replace(/&quot;/g, '"'); }

			,	isTouchSupported:
					function () { try { if ( 'ontouchstart' in document.documentElement ) return true; } catch ( e ) {}; return false; }

			,	registerToBL:
					function ( name, obj ) 
					{ 
						if ( typeof window.bl === undefined || window.bl == null ) 
							{ window.bl = {} }; 
						window.bl[ name ] = obj; 
					}
			,	gotoTop:
					function ()
					{
						$( window ).scrollTo( 0 );
					}
			,	reloadPage:
					function ()
					{
						var	randomVal	= "_refreshrnd=" + Math.floor((Math.random() * 100000) + 1);
						var	url			= window.location.href;

						if ( url.indexOf( "_refreshrnd=" ) > 0 )
						{
							url		= url.replace( "_refreshrnd=", "_refreshrnd=1" );
						}
						else
						{
							var	idxQ	= url.indexOf( "?" )
							var idxH	= url.indexOf( "#" )

							if ( idxQ > 0 && ( idxH <= 0 || idxQ < idxH ) )
								url		= url.replace( "?", "?" + randomVal + "&" );
							else if ( idxH > 0 && ( idxQ <= 0 || idxQ > idxH ) )
								url		= url.replace( "#", "?" + randomVal + "#" );
							else
								url		= url + "?" + randomVal;
						}

						window.location.href		= url;
					}
			,	checkPlaceholders:
					function ( bForceUpdate )
					{
						if ( _var_ie != 9 )
							return;

						$("input:not([type='file'])").each(
							function()
							{
										if( ( bForceUpdate == true || $(this).attr( "data-placeholder-init" ) != "Y" ) && $(this).val() == "" && $(this).attr("placeholder") != "" )
										{
											$(this).attr( "data-placeholder-init", "Y" );
											$(this).val( $(this).attr("placeholder") );
											$(this).focus( function() { $(this).css( "color", "" ); if ( $(this).val() == $(this).attr("placeholder") ) $(this).val(""); } );
											$(this).blur( function() { if ( $(this).val()=="" ) $(this).val( $(this).attr("placeholder") ).css( "color", "#999999" ); } );
											if ( !$(this).is( ":focus" ) ) $(this).css( "color", "#999999" );
										}
								}
							);
						}
				,	refreshSession:
						function ( once, reservedCall )
						{
						$.ajax( { url: '//' + blUtil.getBLHost( "www" ) + '/ajax/renovate/SessionInfoGet.ajax', dataType: 'jsonp', cache: false, xhrFields: { withCredentials: true  } } ); 
						$.ajax( { url: '//' + blUtil.getBLHost( "www" ) + '/refresh.asp', dataType: 'html', cache: false, xhrFields: { withCredentials: true  } } ); 
						
						if ( reservedCall != null && reservedCall == true ) 
						{ 
							this.refreshReserved = false; 
							blUtil.reserveRefresh(); 
						}
						}

				,	reserveRefresh:
						function ()
						{
							if ( this.refreshReserved == false )
							{
								this.refreshReserved	= true;
								setTimeout( function () { blUtil.refreshSession( false, true ); }, 1800000 );	// 30 minutes later
							}
						}

				,	isElementInViewport:
						function ( elem, isPartial )
						{
						var rect 			= elem.getBoundingClientRect();
						var	intersectT		= Math.max( 0, rect.top );
						var intersectB		= Math.min( $( window ).height(), rect.bottom );
						var	intersectL		= Math.min( 0, rect.left );
						var intersectR		= Math.max( $( window ).width(), rect.right );

						if ( isPartial )
							return ( intersectT <= intersectB ) && ( intersectL <= intersectR );
						else
							return ( intersectT == rect.top && intersectB == rect.bottom && intersectL == rect.left && intersectR == rect.right );
						}
				,	getRand2Byte:
					function()
					{
						return (((1 + Math.random())*0x10000)|0).toString(16).substring(1); 
					}
			,	createMID:
					function()
					{
						var	t		= (new Date()).getTime();
						var	tStr	= ( ( ( t < 0 ) ? -t : t ).toString( 16 ) + "0000000000000000" ).substring( 0, 16 );
						var	mid		= tStr + '-' + this.getRand2Byte() + this.getRand2Byte() + this.getRand2Byte() + this.getRand2Byte();

						return mid.toLowerCase();
					}
			,	getCurrentPageTrackID:
					function ()
					{
						if ( typeof _bl_track_pageid == "undefined" )
						{
							var	url		= window.location.href;
							var	sIdx	= 0;
							
							if ( ( sIdx = url.indexOf( "//" ) ) > 0 )	url	= url.substring( sIdx );
							if ( ( sIdx = url.indexOf( "/" ) ) > 0 )	url	= url.substring( sIdx - 1 );
							if ( ( sIdx = url.indexOf( "?" ) ) > 0 )	url	= url.substring( 0, sIdx );

							return url;
						}
						return _bl_track_pageid;
					}
			,	encodeURLSafeB64:
					function ( str )
					{
						return blUtil.encodeB64( str ).replace( /\+/g, "-" ).replace( /\//g, "_" ).replace( /\=/g, "," );
					}
			,	decodeURLSafeB64:
					function ( str )
					{
						return blUtil.decodeB64( str.replace( /\-/g, "+" ).replace( /\_/g, "/" ).replace( /\,/g, "=" ) );
					}
			,	encodeB64:
					function( str )   
					{  
							if (window.btoa) // Internet Explorer 10 and above  
									return window.btoa( str );  
							else  
									return Base64.encode( str );  
					}  
						
			,	decodeB64:
						function ( str )   
					{  
							if (window.atob){ // Internet Explorer 10 and above  
									return window.atob( str.replace(/\s/g, '') );  
							}
							else  
									return Base64.decode( str );  
					}
			,	getColorInst:
					function ( idColor )
					{
						try
						{
							var _idColor	= Number( idColor );

							if ( this._mapColor == null )
							{
								if ( _varColorList )
								{
									this._mapColor	= [];
									for ( var i = 0; i < _varColorList.length; ++i )
										this._mapColor[ _varColorList[ i ].idColor ]	= _varColorList[ i ];
								}
								else
								{
									return null;
								}
							}

							return this._mapColor[ _idColor ];
						}
						catch ( e )
						{
							return null;
						}
					}

			,	getColorName:
					function ( idColor )
					{
						var colorInst = this.getColorInst( idColor );

						if ( colorInst != null )
							return colorInst.strColorName;

						return "Unknown";
					}

			,	getCountryName:
					function ( idCountry )
					{
						var	countryInst	= null;

						if ( this._mapCountry == null )
						{
							if ( _varCountryList )
							{
								this._mapCountry	= [];
								for ( var i = 0; i < _varCountryList.length; ++i )
									this._mapCountry[ _varCountryList[ i ].idCountry ]	= _varCountryList[ i ];
							}
							else
							{
								return "Error"
							}
						}

						countryInst	= this._mapCountry[ idCountry ];

						if ( countryInst == null)
							return "Unknown"

						return countryInst.strCountryName;
					}

			,	sanitizeHtml: 
					function( htmlString ) {
						try 			{ return $( document.createElement( "div" ) ).html( htmlString ).html(); } 
						catch( err ) 	{ return "<h3 style='color: red; font-weight: bold;'>Error in HTML</h3>"; }
					}
			,	shuffleArray:
					function( arr ) {
						var j, x, i;
						for ( i = arr.length - 1; i > 0; i-- ) {
							j = Math.floor(Math.random() * (i + 1));
							x = arr[i];
							arr[i] = arr[j];
							arr[j] = x;
						}
						return arr;
					}
			,	isCookieEnabled:
				function ( category )
				{
					var	cookieSetting	= blUtil.getCookie( blUtil.NAME_COOKIESETTING );

					cookieSetting	= cookieSetting || "";
					category		= category.toUpperCase();

					if ( cookieSetting.indexOf( category ) >= 0 )
						return true;

					return false;
				}
			,	getCookie:			
					function ( cname )
					{
						var name 	= cname + "=";
						var ca 		= document.cookie.split(';');
						
						for ( var i=0; i<ca.length; ++i )
						{
							var c = ca[i];
							while ( c.charAt(0)==' ' )
								c = c.substring(1);
							if ( c.indexOf(name) == 0 )
								return c.substring( name.length,c.length );
						}
						return "";
					}
			,	setCookie:
					function ( name, value, exdays, domain, path )
					{
						if ( blUtil.isCookieEnabled( "BLF" ) )
							blUtil._setCookie( name, value, exdays, domain, path );
					}
			,	_setCookie:	
					function ( name, value, exdays, domain, path )
					{
						var		cookieStr;

						cookieStr	= name + "=" + value;

						if ( domain != null )	cookieStr	+= ";domain=" + domain;
						else					cookieStr	+= ";domain=bricklink.com";

						if ( path != null )		cookieStr	+= ";path=" + path;
						else					cookieStr	+= ";path=/";

						if ( exdays != null )
						{
							var d = new Date();
							d.setTime(d.getTime() + (exdays*24*60*60*1000));
							cookieStr = cookieStr + ";expires=" + d.toUTCString();
						}

						document.cookie	= cookieStr;
					}
			,	getSessionStorage:
					function( name )
					{
						if ( sessionStorage )
							return sessionStorage.getItem( name );
						return null;
					}					
			,	setSessionStorage:
					function ( name, value )
					{
						if ( blUtil.isCookieEnabled( "BLF" ) )
							blUtil._setSessionStorage( name, value );
					}
			,	_setSessionStorage:
					function( name, value )
					{
						if ( sessionStorage )
							sessionStorage.setItem( name, value );
					}
			,	getLocalStorage:
					function( name )
					{
						if ( localStorage )
							return localStorage.getItem( name );
						return null;
					}
			,	removeLocalStorage:
					function( name )
					{
						if ( localStorage )
							localStorage.removeItem( name );
					}	
			,	setLocalStorage:
					function( name, value )
					{
						if ( blUtil.isCookieEnabled( "BLF" ) )
							blUtil._setLocalStorage( name, value );
					}
			,	_setLocalStorage:
					function( name, value )
					{
						if ( localStorage )
							localStorage.setItem( name, value );
					}
			,	showCookiesBanner:
					function () 
					{
						return !this.isCookieEnabled( "CHK" );
					}
			,	acceptAllCookies:
					function () 
					{
						var cookieVal = "CHKTGATFPBLF";
						this._setCookie( blUtil.NAME_COOKIESETTING, cookieVal, 3560 );
						bl.tracker.track( 801, cookieVal );


						$( '.cookie-notice' ).addClass( 'hidden' );
					}
			,	enableSelectedCookies:
					function (cookieVal)
					{
						this._setCookie( this.NAME_COOKIESETTING, cookieVal, 3560 );
						bl.tracker.track( 801, cookieVal );
					}
			,	floatNotification: 
				function()
				{
					if(this.getUrlVar("floatNotification")) {
						var content = this.getUrlVar("floatNotification");
						var type 		= this.getUrlVar("floatNotificationType");

						var url = window.location.href;
								url = this.removeParamFromUrl('floatNotification', url);
								url = this.removeParamFromUrl('floatNotificationType', url);

						window.history.pushState('', '', url)

						NotificationBar(content, type);
					}


					function NotificationBar(content, type) {
						var header 				= document.querySelector('#blGlobalNavContainer');
						var headerHeight 	= header ? header.offsetHeight : 0;

						var notificationBarContainer = document.createElement('div');
								notificationBarContainer.classList.add('bl-3');
								notificationBarContainer.classList.add('notification-bar__container');
								notificationBarContainer.style.top = headerHeight + 'px';

						var notificationBarInternal = document.createElement('div');
								notificationBarInternal.classList.add('notification-bar__internal');
								notificationBarInternal.innerHTML = content + '<i class="far fa-times notification-bar__close js-notification-close"></i>'; 

						var notificationBar = document.createElement('div');
								notificationBar.classList.add('notification-bar');
								notificationBar.classList.add('notification-bar--' + type);
								notificationBar.appendChild(notificationBarInternal);


						if(document.querySelector('.notification-bar__container')) {
							document.querySelector('.notification-bar__container').appendChild(notificationBar);
						}else{
							document.body.appendChild(notificationBarContainer);
							notificationBarContainer.appendChild(notificationBar);
						}

						setTimeout(function(){
							notificationBar.classList.add('fade-out');
							notificationBar.addEventListener('transitionend', function() {notificationBar.remove()});
						}, 5000);

						notificationBar.querySelector('.js-notification-close').addEventListener('click', function() {notificationBar.remove()});
					}
				}
			,	formatDate:
					function ( date, options = null )
					{
						if (!options) {
							options = {
								year: 'numeric', month: 'short', day: 'numeric',
								hour: 'numeric', minute: 'numeric', second: 'numeric',
								hour12: false,
								timeZone: 'America/New_York'
							};
						}

						return new Intl.DateTimeFormat('en', options).format(date);
					}
			};

		var	blURL	=
			{
				getCatalogItemPageURL:
					function ( idItem )
					{
						return "//" + blUtil.getBLHost( "www" ) + "/v2/catalog/catalogitem.page?id=" + idItem;
					}
			,	getCatalogItemPageURLWithColor:
					function ( idItem, idColor )
					{
						return "//" + blUtil.getBLHost( "www" ) + "/v2/catalog/catalogitem.page?id=" + idItem + "&idColor=" + idColor;
					}
			,	getCatalogItemPageURLByItemNo:
					function ( typeItem, strItemNo, nItemSeq )
					{
						return "//" + blUtil.getBLHost( "www" ) + "/v2/catalog/catalogitem.page?" + typeItem + "=" + strItemNo + ( ( typeItem == 'S' || typeItem == 'I' || typeItem == 'O' ) ? ( "-" + nItemSeq ) : "" );
					}

			,	getCatalogItemsForSalePageURL:
					function ( idItem, colorID )
					{
						return "//" + blUtil.getBLHost( "www" ) + '/v2/catalog/catalogitem.page?id=' + idItem + '&idColor=' + colorID + '#T=S';
					}
			,	getNewsPageURL:
					function ( idMsg )
					{
						return "//" + blUtil.getBLHost( "www" ) + "/v2/community/newsview.page?msgid=" + idMsg;
					}
			,	getStoreURL:
					function ( skSellerUsername )
					{
						return "//" + blUtil.getBLHost( "store" ) + "/" + skSellerUsername;	
					}
			,	getNewStoreURL:
					function ( skSellerUsername )
					{
						return "//" + blUtil.getBLHost( "store" ) + "/" + skSellerUsername;							
					}
			,	getStoreURLByID:
					function ( idUserSeller )
					{
						return "//" + blUtil.getBLHost( "www" ) + "/store/home.page?sid=" + idUserSeller;
					}
			,	getStoreInvURL:
					function ( skSellerUsername, idInv )
					{
						return "//" + blUtil.getBLHost( "store" ) + "/" + skSellerUsername + "?itemID=" + idInv;
					}
			,	getStoreInvURLByID:
					function ( idUserSeller, idInv )
					{
						return "//" + blUtil.getBLHost( "www" ) + "/store/home.page?sid=" + idUserSeller + "&itemID=" + idInv;		
					}
			,	getStoreWLURL:
					function( skSellerUsername, wlIDs )
					{
						var storeOptions = {
							bOnWantedList: 1
						};

						if (wlIDs != null && wlIDs.length > 0) storeOptions['wantedMoreArrayID'] = wlIDs.join(',');

						return "//" + blUtil.getBLHost( "store" ) + "/" + skSellerUsername + "#/shop?o=" + JSON.stringify(storeOptions);
					}
			,	getStoreCartURL:
					function ( skSellerUsername )
					{
						return "//" + blUtil.getBLHost( "store" ) + "/" + skSellerUsername + "#/cart";	
					}
			,	getStoreCheckoutURL:
					function ( skSellerUsername )
					{
						return "//" + blUtil.getBLHost( "store" ) + "/" + skSellerUsername + "#/checkout";	
					}
			,	getStoreCartURLByID:
					function ( idUserSeller )
					{
						return "//" + blUtil.getBLHost( "www" ) + "/store/home.page?sid=" + idUserSeller + "#/cart";	
					}
			,	getCountryFlagSmallURL:
					function ( idCountry )
					{
						return "//" + blUtil.getBLHost( "img" ) + "/Images/FlagsS/" + idCountry + ".gif";
					}

			,	getCountryFlagMediumURL:
					function ( idCountry )
					{
						return "//" + blUtil.getBLHost( "img" ) + "/Images/FlagsM/" + idCountry + ".gif";
					}
			,	getStoreFeedbackURL:
					function( skSellerUsername )
					{
						return "//" + blUtil.getBLHost( "www" ) + "/store/home.page?p=" + skSellerUsername + "#/feedback";	
					}
			,	getLoginURL:
					function( loginTo )
					{
						return "https://" + blUtil.getBLHost( "www" ) + "/v2/login.page?logInTo=" + encodeURIComponent( loginTo );
					}
			,	getDefaultStoreLogoURL:
					function()
					{
						return "//" + blUtil.getBLHost( "static" ) + "/clone/img/store-default-image.png";
					}
			,	getFeedbackIconUrl:
					function ( score )
					{
						var		idx		= '000'

						if ( score < 10 )				idx	= '000';
						else if ( score < 50 )			idx	= '001';
						else if ( score < 100 )			idx	= '002';
						else if ( score < 500 )			idx	= '003';
						else if ( score < 1000 )		idx	= '004';
						else if ( score < 2500 )		idx	= '005';
						else if ( score < 5000 )		idx	= '006';
						else if ( score < 10000 )		idx	= '007';
						else if ( score < 25000 )		idx	= '008';
						else if ( score < 50000 )		idx	= '009';
						else 							idx	= '010';

					return "//static.bricklink.com/clone/img/feedback_" + idx + ".png";
				}
			,	getCrowdProjectDesignViewUrl:
					function ( idModel, strModelName )
					{
						var url =  "//" + blUtil.getBLHost( "www" ) + "/v3/crowdfunding/designer-sets-for-adult-fans-of-lego/" + idModel + "/";
						if ( strModelName )
							url	+= strModelName;
		
						return url.replace( / /g, "-" );
					}	
			,	getOrderDetailUrl:
					function ( idOrder )
					{
						var url =  "//" + blUtil.getBLHost( "www" ) + "/orderDetail.asp?ID=" + idOrder;
						return url;
					}
			};

		var	blc_Login =
			{
				login_id: 			null	// Username or Email ID
			,	password: 			null	// login password
			,	gotoMyProfile: 		false	// goto My Profile After Login
			,	stayLoggedIn:		false	// stay logged-in for this browser
			,	impersonate:		false	// impersonate
			,	ret_code: 			null
			,	ret_msg: 			null
			,	error_url:			null

			,	getErrorCode: 		
					function ()	{ return this.ret_code; } 
			,	getErrorMsg: 		
					function ()	{ return this.ret_msg; } 
			,	validateInput: 		
					function ()
					{
						this.login_id		= this.login_id == null ? null : this.login_id.trim();
						this.password		= this.password == null ? null : this.password.trim();

						if ( ( this.login_id == null || this.login_id.length == 0 ) 
							|| ( this.password == null || this.password.length == 0 ) )
						{
							this.ret_code	= -3;
							this.ret_msg	= "Invalid Input";
							return false;
						}

						if ( this.login_id.indexOf( '@' ) < 0 && this.login_id.length > 15 )
						{
							this.ret_code	= -3;
							this.ret_msg	= "User ID is too long! (Max 15 characters)";
							return false;
						}

						this.ret_code	= 0;
						this.ret_msg	= "OK";
						return true;
					}
			,	login:  			
					async function( callbackFunc )
					{
						if ( _var_ie == 9 )
							return this.loginBySubmit();

						if ( !this.validateInput() )
						{
							return false;
						}

						const awsToken = await AwsWafIntegration.getToken();

						if(awsToken) {
							const payload2 = new URLSearchParams();
										payload2.append('userid', this.login_id);
										payload2.append('password', this.password);
										payload2.append('override', false);
										payload2.append('keepme_loggedin', this.stayLoggedIn);
										payload2.append('impersonate', this.impersonate);
										payload2.append('mid', blc_Tracker.getMID());
										payload2.append('pageid', blUtil.getCurrentPageTrackID());
										payload2.append('login_to', window.location.href.indexOf("logInTo") > 0 ? window.location.href.substring(window.location.href.indexOf("logInTo") + 8) : '');

							const login_response = await AwsWafIntegration.fetch('/ajax/renovate/loginandout.ajax', {
									method: 'POST'
								,	credentials: 'same-origin'
								, body: payload2
								,	headers: {
										'Content-Type': 'application/x-www-form-urlencoded'
								  	}
							});

							const awsRules = [
									{returnCode: 448, message: "Error logging in. Please try again in 10 minutes."}
								, {returnCode: 449, message: "Error logging in. Please try again in 30 minutes."}
								, {returnCode: 444, message: "Error logging in. Please update your password or log in from a different device."}
								, {returnCode: 442, message: "Error logging in. Please log in from a different device."}
								, {returnCode: 443, message: "Error logging in. Please update your password or log in from a different device."}
								, {returnCode: 440, message: "Error logging in. Please try again in 30 minutes or log in from a different device."}
								, {returnCode: 446, message: "Error logging in. Please enable cookies or log in from a different device."}
								, {returnCode: 445, message: "Error logging in. We don't support logins using custom scripts or forms."}
								, {returnCode: 450, message: "Error logging in. Please try again in 30 minutes."}
								, {returnCode: 451, message: "Error logging in. Please try again in 30 minutes."}
							];

							if(awsRules.findIndex((rule) => rule.returnCode == login_response.status) != -1){
								const response = awsRules[awsRules.findIndex((rule) => rule.returnCode == login_response.status)];
								bl.tracker.track(login_response.status, this.login_id);

								blc_Login.ret_code	= response.returnCode;
								blc_Login.ret_msg		= response.message;

								if(callbackFunc != null) {
									callbackFunc(response.returnCode, urlAfterLogin, window.location.href.indexOf("logInTo") > 0 ? decodeURIComponent(window.location.href.substring(window.location.href.indexOf("logInTo") + 8)) : '');
								}
							}else{
								const data = await login_response.json();

								if(data) {
									blc_Login.ret_code	= data.returnCode;
									blc_Login.ret_msg		= data.returnMessage;
									var urlAfterLogin 	= null;
									
									if (typeof data.user != 'undefined') {
										urlAfterLogin = data.user.url_after_login;
									}

									if(typeof data.stay_login_token !== 'undefined' && data.stay_login_token != null && data.stay_login_token.length > 0 && localStorage ) {
										localStorage.setItem('bl_login_token', data.stay_login_token);
									}

									if(callbackFunc != null) {
										callbackFunc(blc_Login.ret_code, urlAfterLogin, window.location.href.indexOf("logInTo") > 0 ? decodeURIComponent(window.location.href.substring(window.location.href.indexOf("logInTo") + 8)) : '');
									}
								}else{
									blc_Login.loginBySubmit();
								}

								return true;
							}
						}else{
							blc_Login.ret_code	= "ERR_NO_TOKEN";
							blc_Login.ret_msg		= 'Error logging in. Please try again in 30 minutes.';
							
							if(callbackFunc != null) {

								callbackFunc(blc_Login.ret_code, urlAfterLogin, window.location.href.indexOf("logInTo") > 0 ? decodeURIComponent(window.location.href.substring(window.location.href.indexOf("logInTo") + 8)) : '');
							}
						}
					}
				
			,	loginBySubmit:
					function ()
					{
						if ( !this.validateInput() )
						{
							return false;
						}

						var	$form	= $( "<form>", { "action": "https://" + blUtil.getBLHost( "www" ) + "/ajax/renovate/loginandout.ajax", "method": "POST" } );

						$form.append( $( "<input>", { "type": "hidden", "name": "userid", "value": this.login_id } ) );
						$form.append( $( "<input>", { "type": "hidden", "name": "password", "value": this.password } ) );
						$form.append( $( "<input>", { "type": "hidden", "name": "impersonate", "value": this.impersonate } ) );
						if ( blc_Login.gotoMyProfile )
							$form.append( $( "<input>", { "type": "hidden", "name": "redirect", "value": "/my.asp" } ) );
						else
							$form.append( $( "<input>", { "type": "hidden", "name": "redirect", "value": window.location.href } ) );
						$form.append( $( "<input>", { "type": "hidden", "name": "keepme_loggedin", "value": blc_Login.stayLoggedIn } ) );
						$form.append( $( "<input>", { "type": "hidden", "name": "mid", "value": blc_Tracker.getMID() } ) );
						$form.append( $( "<input>", { "type": "hidden", "name": "pageid", "value": blUtil.getCurrentPageTrackID() } ) );
						$form.append( $( "<input>", { "type": "hidden", "name": "error_url", "value": this.error_url } ) );
			
						$( 'body' ).append( $form );
						$form.submit();
					}
			,	gotoLoginPage:
					function ( actionTrigger )
					{
						var	curUrl			= window.location.href;

						if ( actionTrigger )
						{
							curUrl += ( curUrl.indexOf( "#" ) > 0 ? "&" : "#" ) + "at=" + blUtil.encodeURLSafeB64( JSON.stringify( actionTrigger ) );
						}

						window.location.href	= "/v2/login.page?logInTo=" + encodeURIComponent( curUrl );
					}

			,	logout: 			
					function ( callbackFunc )
					{
						if ( _var_ie == 9 )
						{					
							return this.logoutBySubmit();
						}
						else
						{
							$.ajax
							(
								{
									url: 		'https://' + blUtil.getBLHost( 'www' ) + '/ajax/renovate/loginandout.ajax?do_logout=true'
								,	type: 		'GET'
								,	cache: 		false
								,	xhrFields: 	{ withCredentials: true }
								}
							)
							.always
							(
								function ( data )
								{
									if ( callbackFunc != null )
										callbackFunc();
								}
							)
						}
					}
			,	logoutAndReload:
					function ()
					{
						blc_Login.logout( function () { blUtil.reloadPage();} );
					}
			,	logoutBySubmit:
					function ()
					{
						var	$form	= $( "<form>", { "action": "https://" + blUtil.getBLHost( "www" ) + "/ajax/renovate/loginandout.ajax", "method": "GET" } );

						$form.append( $( "<input>", { "type": "hidden", "name": "redirect", "value": window.location.href } ) );
						$form.append( $( "<input>", { "type": "hidden", "name": "do_logout", "value": true } ) );

						$( 'body' ).append( $form );
						$form.submit();
					}
			,	handleStayLoggedInChange:
					function ( $loginElement )
					{
						var	chkStayLoggedIn	= $loginElement.find( "#frmStayLoggedIn" ).prop( "checked" );

						if ( chkStayLoggedIn )
						{
							$loginElement.find( "#txtStayLoggedinDesc" ).removeClass( "hidden" );
						}
						else
						{
							$loginElement.find( "#txtStayLoggedinDesc" ).addClass( "hidden" );
						}
					}
			,	attachLoginToElement:  	
					function ( $element )
					{
						if ( $element.data( "bl_login" ) !== 1 )
						{
							var doLogin = async function ( event )
							{
								blc_Login.login_id		= $element.find( "#frmUsername" ).val();
								blc_Login.password		= $element.find( "#frmPassword" ).val();
								blc_Login.gotoMyProfile	= $element.find( "#frmGotoMyProfile" ).length > 0 ? $element.find( "#frmGotoMyProfile" ).prop( "checked" ) : false;
								blc_Login.stayLoggedIn	= $element.find( "#frmStayLoggedIn" ).length > 0 ? $element.find( "#frmStayLoggedIn" ).prop( "checked" ) : false;
								blc_Login.impersonate	= $element.find( "#frmImpersonate" ).length > 0 ? $element.find( "#frmImpersonate" ).val() : false;

								$element.find( '.error' ).addClass( 'hidden' );

								var	bRet = await blc_Login.login
								( 
									function ( retCode, urlAfterLogin, loginTo ) 
									{
										if ( retCode == 0 )
										{
											if(urlAfterLogin != null && urlAfterLogin != 0){

												switch(urlAfterLogin){
													case 1:
														window.location.href	= "/my.asp";
														break;
													case 2:
														window.location.href	= "/myMsg.asp";
														break;
													case 3:
														window.location.href	= "/orderPlaced.asp";
														break;
													case 4:
														window.location.href	= "/orderReceived.asp";
														break;
													case 5:
														window.location.href	= "/catalogOptions.asp";
														break;
													case 100:
														window.location.href	= decodeURIComponent(loginTo);
														break;	
												}	
											}
											else
												blUtil.reloadPage();
										}else if( retCode == -25 ) {
											$element.find('#js-show-update-pwd').removeClass('hidden');
										}else if( retCode == -26 ) {
											$element.find('#js-show-recovery').removeClass('hidden');
										}else
										{
											$element.find( '.error' ).text( blc_Login.getErrorMsg() ).removeClass( 'hidden' );
										}
									}
								);

								if ( bRet == false )
								{
									$element.find( '.error' ).text( blc_Login.getErrorMsg() ).removeClass( 'hidden' );
								}


								return false;
							};

							$element.data( "bl_login", 1 );
							$element.find( '.error' ).addClass( 'hidden' );
							$element.find( '#frmLogin' ).submit( doLogin );
							$element.find( "#frmStayLoggedIn" ).change( function () { blc_Login.handleStayLoggedInChange( $element ); } );
							blc_Login.handleStayLoggedInChange( $element );

							if ( _var_ie == 9 )
							{
								//$element.find( "#frmUsername" ).keydown( function (e) { if ( e.keyCode == 13 ) { e.preventDefault(); e.stopPropagation(); } } );
								$element.find( "#frmPassword" ).keydown( 
									function ( e ) 
									{ 
										if ( e.keyCode == 13 ) 
										{
											e.preventDefault(); 
											e.stopPropagation(); 
											$element.find( '#frmLogin' ).submit();
										}
									}
								);
							}
							
							$element.find( "#blbtnLogin" ).click( 
								function( e ) 
								{ 
									e.preventDefault(); 
									e.stopPropagation(); 

									$element.find( '#frmLogin' ).on('submit', function(e) {e.preventDefault()});

									$element.find( '#frmLogin' ).submit();
								} 
							);
						}
					}
			,	attachLogoutToElement: 
					function ( $element )
					{
						if ( $element.data( "bl_logout" ) !== 1 )
						{
							$element.data( "bl_logout", 1 );
							$element.find( "#blbtnLogout" ).click(
								function ( e )
								{
									e.preventDefault();
									e.stopPropagation;
									blc_Login.logout( function () { blUtil.reloadPage();} );
								}
							);
						}
					}
			,	checkStayLogin:
					function ()
					{
					}
					
			,	loginFromModal:
					async function(user, pwd, stayLoggedIn, actionTrigger, callback)
					{
						blc_Login.login_id		= user;
						blc_Login.password		= pwd;
						blc_Login.stayLoggedIn	= stayLoggedIn;
						
						var	bRet = await blc_Login.login
							( 
								function ( retCode, urlAfterLogin, loginTo ) 
								{
									if ( retCode == 0 )
									{
										if(urlAfterLogin != null && urlAfterLogin != 0){

											switch(urlAfterLogin){
												case 1:
													window.location.href	= "/my.asp";
													break;
												case 2:
													window.location.href	= "/myMsg.asp";
													break;
												case 3:
													window.location.href	= "/orderPlaced.asp";
													break;
												case 4:
													window.location.href	= "/orderReceived.asp";
													break;
												case 5:
													window.location.href	= "/catalogOptions.asp";
													break;
												case 100:
													window.location.href	= decodeURIComponent(loginTo);
													break;	
											}	
										}
										else{
											if ( actionTrigger )
											{
												var	curUrl			= window.location.href;
												curUrl += ( curUrl.indexOf( "#" ) > 0 ? "&" : "#" ) + "at=" + blUtil.encodeURLSafeB64( JSON.stringify( actionTrigger ) );
												window.location.href	= curUrl;
											}
											window.location.reload();
										}
										
									}
									else
									{
										callback(blc_Login.getErrorMsg(), blc_Login.getErrorCode())
									}
								}
							);

							if ( bRet == false )
							{
								callback(blc_Login.getErrorMsg(), blc_Login.getErrorCode())
							}
					}
			,	showRegisterModal:
					function()
					{
						bl.login.showSignupModal('register');
					}
			,	showLoginModal:
					function(action)
					{
						bl.login.showSignupModal('login', action);
					}
			,	showConfirmEmailModal:
					function(email)
					{
						bl.login.showSignupEmailModal(email);
					}
			};

		var	blc_DropDown	=
			{
				is_initialized: 	false
			,	_internalSerial: 	0
			,	_prevX:				0
			,	_prevY:				0
			,	init: 				
					function()
					{
						if ( this.is_initialized == false )
						{
							this.is_initialized	= true;
							
							// Do not change the order below!!!
							$('body')
								.on( 
									'click', '.bl-3 .dropdown-menu'
								,	function(e) 
									{ 
										e.stopPropagation(); 
									} 
								)
								.on( 
									'click', '.bl-3 .dropdown-list'
								,	function(e) 
									{ 
										e.stopPropagation(); 
										$(this).closest( ".dropdown" ).removeClass( "open" ).trigger( 'dropdown-status-change' ); 
									} 
								)
								.on( 
									'click', '.bl-3 .dropdown'
								, 	function(e) 
									{
											var $thisElm = $( this );

											e.stopPropagation();

											if ( $thisElm.hasClass('open') ) 	{ blc_DropDown.closeDropdown( $thisElm ); } 
											else								{ blc_DropDown.openDropdown( $thisElm ); }
									} 
								)
								.on( 
									'touchstart', '.bl-3 .dropdown.dropdown-byhover .dropdown-menu'
								,	function ( e )
									{
										e.stopPropagation();
									}
								)
								.on( 
									'touchend', '.bl-3 .dropdown.dropdown-byhover .dropdown-menu'
								,	function ( e )
									{
										e.stopPropagation();
									}
								)
								.on( 
									'touchstart', '.bl-3 .dropdown.dropdown-byhover'
								,	function ( e )
									{
											var $thisElm = $( this );

											e.stopPropagation();
										e.preventDefault();

											if ( $thisElm.hasClass('open') ) 	{ blc_DropDown.closeDropdown( $thisElm ); } 
											else								{ blc_DropDown.openDropdown( $thisElm ); }
									} 
								)
								.on( 
									'touchend', '.bl-3 .dropdown.dropdown-byhover'
								,	function ( e )
									{
											e.stopPropagation();
										e.preventDefault();
									} 
								)
								.on( 
									'mouseenter', '.bl-3 .dropdown.dropdown-byhover'
								,	function ( e )
									{
											var $thisElm = $( this );

											e.stopPropagation();
											blc_DropDown.processHoverMove( $thisElm );
									} 
								)
								.on( 
									'mouseleave', '.bl-3 .dropdown.dropdown-byhover'
								,	function (e) 
									{
											var $thisElm = $( this );

											e.stopPropagation();
											blc_DropDown.processHoverOut( $thisElm );
										} 
								)
								.on( 
									'mousemove', '.bl-3 .dropdown.dropdown-byhover'
								,	function (e)
									{
										var $thisElm = $( this );

										if ( this._prevX != e.clientX || this._prevY != e.clientY )
											blc_DropDown.processHoverMove( $thisElm );
										
										this._prevX	= e.clientX;
										this._prevY	= e.clientY;
									} 
								)
								.click( 
									function (e) 
									{ 
										blc_DropDown.closeAllDropdown(); 
									} 
								);
					
							$('.bl-3 .dropdown' ).on( 'dropdown-status-change', function() {
									var	prevStatus	= $( this ).data( "dropdown_is_open" );
									var	newStatus	= $( this ).hasClass( "open" );

									if ( prevStatus == null )
										prevStatus	= newStatus;

									if ( newStatus != prevStatus )
									{
										if ( newStatus == true )	$( this ).trigger( "dropdown-open" );
										else						$( this ).trigger( "dropdown-close" );
									}
									
									$( this ).data( "dropdown_is_open", newStatus );
								}
							);

							$('.bl-3 .dropdown-menu .dropdown-list')
								.on('mouseenter', 'li:not(.dropdown-inactive)', function() { $(this).parents( '.bl-3 .dropdown-menu' ).find( ".dropdown-list > li" ).removeClass( 'hover' ); $(this).addClass('hover'); } )
								.on('mouseleave', 'li', function() { $(this).removeClass('hover'); } );
							$('.bl-3 .dropdown-menu .dropdown-list .dropdown-activator')
								.on('mouseenter', function( e ) { $(this).closest( '.dropdown-menu' ).find( '.dropdown-activator' ).removeClass( 'active hover' ); $(this).addClass('active hover'); $(this).find( '.dropdown-list' ).children().removeClass( 'hover' ).first().addClass( 'hover' ) } )
								.on('click', function( e ) { e.stopPropagation(); } );
							$('.bl-3 .dropdown-menu .dropdown-list .dropdown-activator-dummy')
								.on('mouseenter', function( e ) { e.stopPropagation(); } )
								.on('mouseleave', function( e ) { e.stopPropagation(); } );
							$( 'body' ).on( 'mousemove', blc_DropDown.processDelayed );
						}
					}
			,	processHoverMove:
					function ( $dropdown )
					{
						$dropdown.addClass( 'hover' );

						if ( !$dropdown.hasClass( "open" ) && !$dropdown.hasClass( "delayed" ) )
						{
							var	dropdownGroup 	= $dropdown.attr( "dropdowngroup" );
							var	delayTime		= 200;
							var	serial			= ++this._internalSerial;

							if ( dropdownGroup && $( ".dropdown.dropdown-byhover.open" ).filter( "[dropdowngroup='" + dropdownGroup + "']" ).length > 0 )
							{
								delayTime	= 20;
							}

							$dropdown.attr( 'data-dropdown-serial', serial );

							this.openDropdownDelayed( $dropdown, serial, delayTime );
						}
						}
			,	processHoverOut:
					function ( $dropdown )
					{
						$dropdown.removeClass( 'hover' );

						this.closeDropdownDelayed( $dropdown );
					}

			,	processDelayed:
					function ( e )
					{
						if ( !$( e.target ).hasClass( "dropdown-byhover delayed" ) && $( e.target ).parents( '.dropdown-byhover.delayed' ).length == 0 )
						{
							$( '.dropdown-byhover.delayed' ).removeClass( 'delayed'); 
							$( 'body' ).off( 'mousemove', blc_DropDown.processDelayed );
						}
					}

			,	openDropdown:
					function ( $dropdown )
					{
							this.closeAllDropdown();
							$dropdown.find('.hover').removeClass('hover');
							$dropdown.addClass('open hover').trigger( 'dropdown-status-change' );
							/*
							$dropdown.find('.dropdown-menu .dropdown-list')
								.removeClass( 'hover' ).children().first().addClass( 'hover' );
							*/
							$dropdown.find('.dropdown-menu .dropdown-list').find( '.dropdown-activator' )
								.removeClass( 'active' )
								.first().addClass('active hover');
							$dropdown.find( ".bl-autofocus" ).focus();
						}
			,	closeDropdown:
					function ( $dropdown )
					{
						$dropdown.removeClass('open').trigger( 'dropdown-status-change' ); 
					}
			,	closeAllDropdown:
					function ()
					{
						blc_DropDown.closeDropdown( $('.bl-3 .dropdown') );
					}
			,	openDropdownDelayed:
					function ( $dropdown, serial, delayTime )
					{
						setTimeout( 
							function ()
							{
								if ( $dropdown.hasClass( 'hover' ) && $dropdown.attr( "data-dropdown-serial" ) == String( serial ) )
									blc_DropDown.openDropdown( $dropdown );
							}
						,	delayTime
						);
					}
			,	closeDropdownDelayed:
					function ( $dropdown )
					{
						setTimeout( 
							function ()
							{
								if ( !$dropdown.hasClass( 'hover' ) )
									blc_DropDown.closeDropdown( $dropdown );
							}
						,	500
						);
					}
			};

		var	blc_Select	=
			{
				is_initialized: 	false
			,	init:
					function ()
					{
						if ( this.is_initialized == false )
						{
							this.is_initialized	= true;

							$('body').on('click', '.bl-3 .blc-select .dropdown-list a', function(e) {
								if($(this).attr('id') != 'js-advanced-search') {
									e.preventDefault();
									var	selectedVal	= $( this ).attr( "data-search-type" );
									var	selectedTxt	= $( this ).text();
									var	$rootElem	= $( this ).closest( '.blc-select' );
									if (selectedTxt === "My Store Inventory") selectedTxt = "My Store Inv.";
									$rootElem.find( "#idSelectedVal" ).text( selectedTxt );
									$rootElem.attr( "data-val", selectedVal );
									$rootElem.trigger( "change" );
								}

							} );
						}
					}
			,	setSelection:
					function( $elem, val )
					{
						var	textVal	= $elem.find( ".dropdown-list li a[data-search-type='" + val + "']" ).text();

						if ( textVal )
						{
							if (textVal === "My Store Inventory") textVal = "My Store Inv.";
							$elem.find( "#idSelectedVal" ).text( textVal );
							$elem.attr( "data-val", val );
						}
					}
			};

		var blc_SiteWideAlert =
			{
				is_initialized:		false
			,	$elem:				null
			,	timer:				null
			,	isFirst:			true
			,	firstInterval:		3000
			,	nextInterval:		10000
			,	init:
					function ()
					{
						if ( this.is_initialized == false )
						{
							this.is_initialized	= true;

							this.$elem	= $( '.site-wide-alert-container' );

							this.$elem.find( '.site-wide-alert' ).each( 
								function ()
								{
									var		alert_id	= $( this ).attr( "data-alert-id" );
									
									if ( blUtil.getCookie( "disablealert_" + alert_id ) == "true" )	
										$( this ).remove();
									else														
										$( this ).show();
								}
							);
				
							this.$elem.find('.site-wide-alert .close').click(
								function () 
								{
									var		containerElem	= $( this ).closest( ".site-wide-alert" );
									var		alert_id		= containerElem.attr( "data-alert-id" );

									blc_SiteWideAlert.$elem.find( ".site-wide-alert[data-alert-id='" + alert_id + "']" ).remove();
									
									blUtil.setCookie(  "disablealert_" + alert_id, "true" );

									if ( blc_SiteWideAlert.$elem.children().length == 0 )
										blc_SiteWideAlert.$elem.remove();
								}
							);

							this.initAutoScroll();		
						}
					}
			,	initAutoScroll:
					function ()
					{
						var	len = this.$elem.children().length;

						if ( len > 1 )
						{	// need to scroll
							this.$elem.attr( "data-pos", 0 );

							for ( var i = 0; i < len; ++i )
								this.$elem.append( this.$elem.children().eq( i ).clone() );		// Duplicate for smooth scroll

							this.isFirst	= true;
							this.timer		= setInterval( function () { blc_SiteWideAlert.scrollToNext(); }, this.firstInterval ) ;
							this.$elem.show();
						}
						else if ( len == 1 )
						{	// No scroll
							this.$elem.show();
						}
						else
						{	// No show
							this.$elem.remove();
						}
					}
			,	scrollToNext:
					function ()
					{
						var	curPos	= parseInt( this.$elem.attr( "data-pos" ) )
						var	totSize	= ( this.$elem.children().length ) / 2;
						var	nextPos	= curPos + 1;

						if ( nextPos >= totSize )
							nextPos	= 0

						if ( totSize == 0)
						{
							clearInterval( this.timer );
							this.$elem.remove();
						}
						else if ( totSize == 1 )
						{
							clearInterval( this.timer );
							this.$elem.scrollTop( 0 ); 
						}
						else if ( nextPos == 0 )
						{
							if ( this.isFirst )
							{
								this.isFirst	= false;
								clearInterval( this.timer );
								this.timer		= setInterval( function () { blc_SiteWideAlert.scrollToNext(); }, this.nextInterval ) ;
							}

							this.$elem.attr( "data-pos", 0 );
							this.$elem.scrollTo( this.$elem.children().eq( totSize ), { duration: 'slow', onAfter: function () { this.$elem.scrollTop( 0 );	}.bind( this ) } );
						}
						else
						{
							this.$elem.attr( "data-pos", nextPos );
							this.$elem.scrollTo( this.$elem.children().eq( nextPos ), { duration: 'slow' } );
						}
					}
			}

		var blc_MainNav	=
			{
				is_initialized: 	false
			,	$elem:				null
			,	fav:				null
			,	init:
					function ()
					{
						if ( this.is_initialized == false )
						{
							this.is_initialized	= true;

							this.$elem	= $( ".bl-3 .nav-navbar" );

							if ( blUtil.isTouchSupported() && isMobile.any )
							{	// touch supported mobile environmennt
								this.$elem.find( '.dropdown-byhover' ).removeClass( 'dropdown-byhover' );
							}
							else
							{
								this.$elem.find( ".nav-link" ).click( 
									function ( e ) 
									{
										var		href	= $( this ).attr( "data-href" );

										if ( href )
										{
											e.preventDefault();
											e.stopPropagation();
											window.location.href	= href;
										}
									}
								);
							}

							this.$elem.find( "#nav-login" ).click( 
									function ( e ) 
									{
										bl.login.showSignupModal('login');
									}
								);
	
							this.buildFavoriteStores();
						}
					}
			,	setFavorites:
					function ( data )
					{
						if ( data )
							this.fav	= data;
					}
			,	buildFavoriteStores:
					function ()
					{
						if ( this.fav && this.fav.list && this.fav.list.length > 0 )
						{
							var	$containerElem		= this.$elem.find( "#idNavFavStores" );
							var	$listElem			= $containerElem.children().first();

							$containerElem.children().remove();

							for ( var i = 0; i < this.fav.list.length; ++i )
							{
								var	store	= this.fav.list[ i ];
								var	$inst	= $listElem.clone();

								$inst.find( "A" ).attr( "href", blURL.getStoreURL( store.seller_username ) ).text( store.storename );
								$containerElem.append( $inst );
							}
						}
					}
			,	buildFavoriteStoresInStore:
					function ( $listElem, data, bHasCurrent )
					{
						var	$tmpl		= $listElem.children().first().clone();
						var $actionInst	= $listElem.children().last().clone();

						$listElem.children().remove();

						for ( var i = 0; i < data.list.length; ++i )
						{
							var		store 	= data.list[ i ];
							var		$inst	= $tmpl.clone();

							$inst.find( "A" ).attr( "href", blURL.getStoreURL( store.seller_username ) ).text( store.storename );
							$listElem.append( $inst );
						}

						if ( bHasCurrent )
							$actionInst.find( "A" ).text( "Edit favorite settings" ).attr( "href", "#" );
						else
							$actionInst.find( "A" ).text( "Bookmark this store" ).attr( "href", "#" );

						if ( $listElem.children().length > 0 )
							$actionInst.css( "border-top", "1px solid #cccccc" );
						
						$listElem.append( $actionInst );
					}
			,	setStoreLogo:
					function ( logoUrl )
					{
						var $logoElem 	= this.$elem.find( "#idNavMyStoreLogo" );
						var logoUrl 	= ( logoUrl && logoUrl.length > 0 ) ? logoUrl : bl.url.getDefaultStoreLogoURL();

						$logoElem.attr( "src", logoUrl );
					}
			,	refreshDashboardNotification:
					function ()
					{
						$.ajax
						( 
							{ 
								url: '/ajax/renovate/DashboardNotificationGet.ajax'
							, 	cache: false 
							} 
						)
						.done
						( 
							function( data ) 
							{
								if ( data.returnCode == 0 )
								{
									if ( data.info.nMsgsToRead == 0 )	
										$( ".nav-global .mymsgcnt1" ).text( "" ).parent().removeClass( "dot-show" );
									else
										$( ".nav-global .mymsgcnt1" ).text( data.info.nMsgsToRead ).parent().addClass( "dot-show" );

									$( ".nav-global .mymsgcnt2" ).text( data.info.nMsgsToRead );
								}
							}
						);
					}
			}

		var	blc_SubNav	=
			{
				is_initialized: 	false
			,	$elem:				null
			,	$subCategoryElem:	null
			,	init:
					function ()
					{
						if ( this.is_initialized == false )
						{
							this.is_initialized	= true;

							this.$elem				= $( ".navigation .nav-sub" );
							this.$subCategoryElem	= this.$elem.find( ".nav-sub-links" );
							
							if ( this.$subCategoryElem.length > 0 )
							{
								this.$subCategoryElem.removeClass( 'nav-sub-selected' ).first().addClass( 'nav-sub-selected' );
								this.$subCategoryElem.find( ".nav-sub-category" ).click( 
									function ( e ) 
									{
										e.stopPropagation();
										e.preventDefault();

										var		newMenu	= $( this ).attr( "data-href" );
										blc_SubNav.changeMenu( newMenu, true );
									}
								)
							}
							this.changeMenu( this.getMenu(), false );
						}
					}
			,	getMenu:
					function ()
					{
						return this.$subCategoryElem.filter( ".nav-sub-selected" ).first().attr( "target" );
					}
			,	gotoMenu:
					function ( menu )
					{
						switch ( menu )
						{
							case "Catalog":			window.location.href = "/catalog.asp?utm_content=subnav";		break;
							case "Stores":			window.location.href = "/browse.asp?utm_content=subnav";		break;
							case "Forum":			window.location.href = "/messageList.asp?utm_content=subnav";	break;
							case "Members":			window.location.href = "/members.asp?utm_content=subnav";		break;
							case "Links":			window.location.href = "/links.asp?utm_content=subnav";			break;
							case "HelpCenter":		window.location.href = "/helpMain.asp?utm_content=subnav";		break;
							case "ProblemCenter":	window.location.href = "/retract.asp?utm_content=subnav";		break;
						}						
					}
			,	changeMenu:
					function ( newMenu, doAnimation )
					{
						if ( this.getMenu() == newMenu )
						{
							doAnimation = false;
						}

						if ( this.$subCategoryElem.length > 0 )
						{
							var		$shrinkElem	= this.$subCategoryElem.filter( ".nav-sub-selected" ).removeClass( "nav-sub-selected" ).first().find( ".nav-sub-menu-list");
							var		$expandElem	= this.$subCategoryElem.filter( "[target="+newMenu+"]" ).first().addClass( "nav-sub-selected" ).find( ".nav-sub-menu-list");

							if ( doAnimation )
							{
								$shrinkElem.animate( 
									{ width: 0 }
								, 	{
										duration: 	200
									,	progress:	function () { blc_SubNav.adjustPosition(); }
									,	always:
											function ()
											{
												$expandElem.animate(
													{ width: $expandElem.attr( document.documentElement.className.indexOf( "bl-alt-font" ) > 0 ? "data-altwidth" : "data-width" ) }
												,	{ 
														duration: 200 
													,	progress:	function () { blc_SubNav.adjustPosition(); }
													}
												);
											}
									}
								);
							}
							else
							{
								$shrinkElem.css( "width", 0 );
								$expandElem.css( "width", $expandElem.attr( document.documentElement.className.indexOf( "bl-alt-font" ) > 0 ? "data-altwidth" : "data-width" ) );
								blc_SubNav.adjustPosition();
							}
						}
					}
			,	setCurrentMenuItem:
					function( menu )
					{
						var	menuStructure	= menu.split( '.' );

						if ( menuStructure.length == 2 )
						{
							var	menuGroup		= menuStructure[ 0 ];
							var	menuItem		= menuStructure[ 1 ];

							this.$subCategoryElem.find( "li>a" ).removeClass( "active" );
							this.$subCategoryElem.filter( "[target=" + menuGroup + "]" ).addClass( "active" );
							this.$subCategoryElem.find( ".nav-sub-menu-list[target=" + menuGroup + "]" ).find( "li[data-menu=" + menuItem + "] > a" ).addClass( "active" );

							this.changeMenu( menuGroup, false );
						}
					}
			,	adjustPosition:
					function ()
					{
						var		leftOffset	= 0;

						this.$subCategoryElem.each( 
							function()
							{
								var $menuList 	= $( this ).find( ".nav-sub-menu-list" );
								var	thisLength	= $menuList.position().left + $menuList.width();

								$( this ).css( "left", leftOffset );
								$( this ).width( thisLength );

								leftOffset	+= thisLength + 5;
							}
						);
					}
			};

		var	blc_Search	=
			{
				is_initialized: 	false
			,	$elem:				null
			,	$subCategoryElem:	null
			,	_original_value:	null
			,	_remember_last:		false
			,	_cookie_name:		'blLastSearchType'
			,	init:
					function ()
					{
						if ( this.is_initialized == false )
						{
							this.is_initialized	= true;
							this.$elem	= $( ".nav-global DIV.nav-search" );
							//this.$elem.find( "input[name='nav-search']").keydown( function( e ) {  var code = e.keyCode || e.which; if ( code == 13 ) { e.stopPropagation(); e.preventDefault(); this.doSearch(); }  }.bind( this ) );
							this.$elem.find( ".bl-btn-search").click( function( e ) { this.doSearch(); }.bind( this ) );
							this.$elem.find( ".dropdown" ).on( "change", function ( e ) { this.onChange( true ); }.bind( this ) );
							this.$elem.find( ".bl-btn-search--advanced" ).click( function ( e ) { this.goAdvancedSearch(); }.bind( this ) );
							this.initAutocomplete();

							if ( this._remember_last == true )
							{
								var savedContext	= blUtil.getCookie( this._cookie_name );

								if ( savedContext != null && savedContext.length > 0 )
								{
									blc_Select.setSelection( this.$elem.find( ".blc-select" ), savedContext );
									this.onChange( false );
								}
							}	
							
						}
					}
			,	doSearch:
					function ()
					{
						var	searchType	= this.$elem.find( ".blc-select" ).attr( "data-val" );
						var	query		= this.$elem.find( "input[name='nav-search']").val();

						var	$formElem	= $( "<form action='/searchRedirect.asp' method='POST'>" );
						var	$searchType	= $( "<input type='hidden' name='searchType'>" );
						var	$query	= $( "<input type='hidden' name='q'>" );
						
						$searchType.val( searchType );
						$query.val( query );

						$formElem.append( $searchType );
						$formElem.append( $query );
						$( 'body' ).append( $formElem );
						$formElem.submit();
					}
			,	setSearchContext:
					function ( searchType, query )
					{
						blc_Select.setSelection( this.$elem.find( ".blc-select" ), searchType );
						this.$elem.find( "input[name='nav-search']").val( blUtil.decodeHtml( query ) );
						this.onChange( false );
					}
			,	setSearchQuery:
					function ( query )
					{
						this.$elem.find( "input[name='nav-search']").val( blUtil.decodeHtml( query ) );
					}
			,	onChange:
					function ( setFocus )
					{
						var	type = this.getSearchType();
						switch ( type )
						{
						case "c": 
						case "p": 
						case "i":
						case "w":
						case "m":
							this.$elem.find( ".bl-btn-search--advanced" ).show();
							this.$elem.find(".js-main-search-input").addClass('has-advanced-search');
							break;
						default:
							this.$elem.find( ".bl-btn-search--advanced" ).hide();
							this.$elem.find(".js-main-search-input").removeClass('has-advanced-search');
							break;
						}
						
						if ( setFocus )
						{
							this.$elem.find( "input[name='nav-search']" ).focus();
							if ( this._remember_last == true )
								blUtil.setCookie( this._cookie_name, type );
						}
						
					}
			,	getSearchType:
					function ()
					{
						return this.$elem.find( ".blc-select" ).attr( "data-val" );
					}
			,	goAdvancedSearch:
					function ()
					{
						var	searchType	= this.$elem.find( ".blc-select" ).attr( "data-val" );

						switch ( searchType )
						{
						case "c": 	window.location.href	= "/catalogSearch.asp";		break;
						case "i":	window.location.href	= "/searchAdvanced.asp";	break;
						case "p":	window.location.href	= "/searchAdvanced.asp";	break;
						case "w":	window.location.href	= "/v2/wanted/search.page";	break;
						case "m":	window.location.href	= "/messageSearch.asp";		break;
							break;
						}
					}
			,	initAutocomplete:
					function ()
					{
						_bl_search_autocomplete.attachToElem( 
							this.$elem.find( "input[name='nav-search']" )
						,	function ( q )
							{
								this.$elem.find( "input[name='nav-search']").val( q );
								this.doSearch();
							}.bind( this )
						);
						return;

						/*
						var chgType = 0;

						this.$elem.find( "input[name='nav-search']" ).autocomplete
						(
							{
								delay:		200
							,	minLength:	2
							,	position:	{ at: "left bottom" }
							,	source:
									function ( request, response )
									{
										if ( blc_Search.getSearchType() == 'p' )
										{
											var params = {};
												
											params["suggest_str"] 		= request.term;
											blc_Search._original_value	= request.term;
												
											$.getJSON
											( 
												'//' + blUtil.getBLHost( 'www' ) + '/ajax/clone/search/autocomplete.ajax?callback=?'
											, 	params
											, 	function( data )
												{
													var allcompletes = [];
													
													if ( data.termincat != null && data.termincat.length > 0 )
													{
														var termincat = $.map(
																			data.termincat, 
																			function(m) 
																			{
																				if (chgType == 0) chgType = m.type;
																				return {	suggest: 	unescape(m.option),
																							id: 		m.id,
																							catName: 	m.catName,
																							type: 		m.type
																						};
																			}
																		);
														allcompletes.push.apply(allcompletes, termincat); 
													}	
													
													if ( data.categories != null && data.categories.length > 0 )
													{
														var categories = $.map(
																			data.categories,
																			function(m) 
																			{
																				if (chgType == 0) chgType = m.type;
																				return 	{	name: 	unescape(m.name),
																							id: 	m.id,
																							type: 	m.type
																						};
																			}
																		);
														allcompletes.push.apply(allcompletes, categories);
													}	
													
													if ( data.keywords != null && data.keywords.length > 0 )
													{
														var keywords = $.map(data.keywords, function(m) {
															if (chgType == 0) chgType = m.type;
															return {
																suggest: unescape(m.option),
																type: m.type
															};
														});
														allcompletes.push.apply(allcompletes, keywords);
													}

													if (data.products != null && data.products.length > 0)
													{
														var products = $.map(data.products, function(m) {
															if (chgType == 0) chgType = m.type;
															return {
																name: unescape(m.name),
																id: m.id,
																itemNo: m.itemNo,
																type: m.type,
																imgString: m.imgString,
																seq: m.seq,
																color: m.color,
																colorname: m.colorName
															};
														});
														allcompletes.push.apply(allcompletes, products);
													}										
													
													response(allcompletes);
												}
											);
										}
									}
							,	focus: 		
									function( event, ui ) 
									{
										// prevent autocomplete from updating the textbox
										event.preventDefault();
									}
							,	select: 	
									function(event, ui) 
									{
										// prevent autocomplete from updating the textbox
										event.preventDefault();
										// navigate to the selected item's url
										//window.open(ui.item.url);
										if ( ui.item.type == 1 ) 
										{
											blc_Search.setSearchQuery( ui.item.suggest );
											blc_Search.doSearch();
										}
										else if ( ui.item.type == 2 )
										{
											var itemURL = blURL.getCatalogItemPageURL( ui.item.id );
											if ( ui.item.color != null )
												itemURL += "&idColor=" + ui.item.color;

											window.open( itemURL , "_self" );
										}
										else if ( ui.item.type == 3 )
										{
											blc_Search.setSearchQuery( "[cat:"+ui.item.id+"]" );
										}
										else if (ui.item.type == 4)
										{
											blc_Search.setSearchQuery( ui.item.suggest + " [cat:"+ui.item.id+"]" );
										}
									}
							}
						).data( "ui-autocomplete" )._renderItem = function( ul, item )
						{
							var $a = $("<a></a>");
							
							switch( item.type ) 
							{			
								case 1:
									$("<span class='m-keyword'></span>").text(item.suggest).appendTo($a);
									break;
								case 2:
									var item_img = $("<img />", { width: 50, src:"//" + blUtil.getBLHost( "www" ) + "/" + item.imgString });
									//$("<span class='m-item-image-div><div/>").append(item_img).appendTo($a);
									//var div_itemtext = $("<div class='m-item-text-div><div/>").appendTo($a);
									//$("<span class='m-item-name'></span>").text(item.name).appendTo(div_itemtext);
									//$("<span class='m-item-itemno'></span>").text("no: "+item.itemNo).appendTo(div_itemtext);
									
									$("<span class='m-item-image'></span>").append(item_img).appendTo($a);
									var span_itemtext = $("<span class='m-item-text-span' />").appendTo($a);
									var item_name_str = ( item.colorname != null ) ? "(" + item.colorname + ") ":"";
									item_name_str += item.name;
									$("<span class='m-item-name'></span>").text(item_name_str).appendTo(span_itemtext);
									var itemNoStr = "Item No: "+item.itemNo;
									if (item.seq > 0) itemNoStr += "-" + item.seq;
									$("<span class='m-item-itemno'></span>").text(itemNoStr).appendTo(span_itemtext);
									break;
								case 3:
									$("<span class='m-category'></span>").text(item.name).appendTo($a);
									break;
								case 4:
									$("<span class='m-keyword'></span>").text(item.suggest).appendTo($a);
									$("<span class='m-category'></span>").text("in "+item.catName).appendTo($a);
									break;
							}
							$a.append( "<div style='clear: both;'></div>" );
							var list_elem = $("<li class='m-item-li'></li>");
							if (item.type != chgType){
								list_elem.addClass("li-border")
								chgType = item.type;
							}
							return list_elem.append($a).append( "<div style='clear: both;'></div>" ).appendTo(ul);
						}
						*/
					}

			};

		var	blc_GlobalCart =
			{
				is_initialized: 	false
			,	$elem:				null
			,	$storeitemTmpl:		null
			,	$storelistElem:	null
			,	emptyContent:		'<div id="empty-cart" class="dropdown-cart__empty l-margin-top--sm">' +
									'	<div class="l-flex l-split l-pad--sm">' +
									'		<strong  id="cart-summary" class="h4 tight">' +
									'			0 stores, 0 lots' +
									'		</strong>' +
									'	</div>' +
									'	<div class="dropdown-cart__empty-message">Discover rare vintage sets, find lost parts, or search for a specific item!</div>' +
									'	<a href="/browse.asp" ><button class="bl-btn primaryGreen dropdown-cart__empty-cta">Browse items for sale</button></a>' +
									'</div>'
			,	attachToElement:
					function ( $element )
					{
						this.$elem			= $element;

						this.$cartSection		= $element.find( '.dropdown-cart');
						this.$storelistElem	= $element.find( "#store-cart-group" );
						this.$storeitemTmpl	= this.$storelistElem.children().first();

						this.$storelistElem.children().remove();
						this.$storelistElem.children().remove();
						this.$elem.data( "is_data_ok", false );

						this.$elem.on( 'dropdown-open', function ( e ) { this.openGlobalCart() }.bind( this ) );
					}
			,	openGlobalCart:
					function ()
					{
						if ( this.$elem.data( "is_data_ok" ) != true )
						{
							this.$storelistElem.children().remove();
							this.retrieveCartInfo();
						}
					}
			,	retrieveCartInfo:
					function ( bOpenCart )
					{
						$.ajax
						(
							{
								url:		'//' + blUtil.getBLHost( 'www' ) + '/ajax/renovate/getglobalcart.ajax'
							,	type:		'GET'
							,	cache:		false
							,	xhrFields:	{ withCredentials: true }
							}
						)
						.done
						(
							function ( data )
							{
								if ( data.returnCode == 0 )
								{
									this.$elem.find( "#cart-summary" ).text( 
										( data.total_store_cnt > 1 ? data.total_store_cnt + " stores" : data.total_store_cnt + " store" ) 
									+ 	", "
									+	( data.total_lot_cnt > 1 ? data.total_lot_cnt + " lots" : data.total_lot_cnt + " lot" )
									);

									this.$storelistElem.children().remove();

									for ( var i = 0; i < data.list.length; ++i )
									{
										var	store		= data.list[ i ];
										var domestic	= bl.session.detected_country === store.countryid
										var	$storeInst	= this.$storeitemTmpl.clone();
										
										$storeInst.find( "#idStoreCountryFlag" ).attr( "src", blURL.getCountryFlagSmallURL( store.countryid ) );
										$storeInst.find( "#idStoreName" ).text( store.store_name );
										$storeInst.find( "#idStoreFeedback" ).text( "(" + store.feedback_score + ")" );
										$storeInst.find( "#idStoreLink" ).attr( "href", blURL.getStoreURL( store.username) );
										$storeInst.find( "#idButtonCart" ).attr( "onClick", "window.location.href='/v2/globalcart.page?sid="+store.sellerid+"'" );
										$storeInst.find( "#idPrice" ).text( store.strTotPrice );
										if(!domestic){
											$storeInst.find( "#idPriceTotal" ).text( '~' + store.strTotPrice );
										}else{
											$storeInst.find( "#idPriceTotal" ).text( store.strTotPrice );
										}
										$storeInst.find( "#idShipping" ).text( "TBD" );
										$storeInst.find( "#idUpdated" ).text( store.dtUpdated );
										$storeInst.find( "#idLotCnt" ).text( "" + store.lotcnt + ( store.lotcnt > 1 ? " Lots" : " Lot" ) );
										$storeInst.find( '.bl-media.l-cursor-pointer' ).attr( "data-store", store.username ).click( function () { window.location.href = blURL.getStoreCartURL( $( this ).attr( "data-store" ) ) } );
										if ( store.instantCheckout ){
											$storeInst.find( '.icon-instant-checkout' ).show();
											this.getCheckoutInfo(store, $storeInst)
										}


										this.$storelistElem.append( $storeInst );
									}

									this.setGlobalCartCnt( data.total_store_cnt );

									if(data.list.length == 0) {
										var children = Array.from(this.$cartSection.children());
										children.forEach(function(child){child.style.display = 'none'});
										this.$cartSection.append(this.emptyContent);
									}
								}
								else
								{
									

									this.$elem.find( ".dropdown-meta" ).text( "Cart Loading Failed!" );
									this.$storelistElem.children().remove();
									this.setGlobalCartCnt( 0 );
									this.$cartSection.children().remove();
									this.$cartSection.append(this.emptyContent);
								}

								this.$elem.data( "is_data_ok", ( data.returnCode == 0 ) );
							}
							.bind( this )
						)
						.fail
						(
							function ()
							{
								this.$elem.find( ".dropdown-meta" ).text( "Cart Loading Failed!" );
								this.$elem.data( "is_data_ok", false );
								this.setGlobalCartCnt( 0 );
								this.$cartSection.children().remove();
								this.$cartSection.append(this.emptyContent);
							}
							.bind( this )
						)
					}
			,	getCheckoutInfo:
					function(store, storeInst){
						storeInst.find( "#idShipping" ).text( "Loading..." );
						storeInst.find( "#idPriceTotal" ).text( "Loading..." );
						var domestic = bl.session.detected_country === store.countryid
						var data={
							action: 'conditions',
							sid: store.sellerid,
							key: store.key,
							checkPaypal: 0
						}
						$.ajax(
							{
								url:		'//' + blUtil.getBLHost( 'www' ) + '/ajax/clone/store/preparecheckout.ajax'
							,	type:		'GET'
							,	data:		data
							,	cache:		false
							,	xhrFields:	{ withCredentials: true }
							}
						)
						.done(function(result){
							if(result.conditions.error.code === 0 && result.conditions.hasShippingCost){
								if(!domestic){
									storeInst.find( "#idShipping" ).text( '~' + result.conditions.estShippingAndHandling );
									storeInst.find( "#idPriceTotal" ).text( '~' + result.conditions.orderTotalPrice );
								}else{
									storeInst.find( "#idShipping" ).text( result.conditions.estShippingAndHandling );
									storeInst.find( "#idPriceTotal" ).text( result.conditions.orderTotalPrice );
								}
								
							}
							else{
								storeInst.find( "#idShipping" ).text( "TBD" );
								if(!domestic){
									var price = result.conditions.orderTotalPrice ? result.conditions.orderTotalPrice : store.strTotPrice;
									storeInst.find( "#idPriceTotal" ).text( '~' + price );
								}else{
									storeInst.find( "#idPriceTotal" ).text( price );
								}
							}
						})
						.fail(function(){
							storeInst.find( "#idShipping" ).text( "TBD" );
							if(!domestic){
								storeInst.find( "#idPriceTotal" ).text( '~' + store.strTotPrice );
							}else{
								storeInst.find( "#idPriceTotal" ).text( store.strTotPrice );
							}
						})

					}
			,	resetGlobalCart:
					function ()
					{
						this.$elem.data( "is_data_ok", false );
						this.$elem.find( ".dropdown-meta" ).text( "Empty" );
						this.$cartSection.find( '#empty-cart').remove();
						var children = Array.from(this.$cartSection.children());
						children.forEach(function(child){child.style.display = 'block'});
					}
			,	refreshGlobalCart:
					function ()
					{
						this.resetGlobalCart();
						this.retrieveCartInfo();
					}
			,	setGlobalCartCnt:
					function ( cnt )
					{
						// console.log(this.$elem.find( "#js-notification-cart" ));
						if(cnt == 0) {
							this.$elem.querySelector("#js-notification-cart").innerText = cnt;
							this.$elem.querySelector("#js-notification-cart").style.display = 'none';
						}else{
							this.$elem.querySelector("#js-notification-cart").innerText = cnt;
							this.$elem.querySelector("#js-notification-cart").style.display = 'flex';
						}
					}
			,	refreshGlobalCartCnt:
					function()
					{
						$.ajax
						(
							{
								url:		'//' + blUtil.getBLHost( 'www' ) + '/ajax/renovate/getglobalcart.ajax'
							,	data:		{countOnly: true}
							,	type:		'GET'
							,	cache:		false
							,	xhrFields:	{ withCredentials: true }
							}
						)
						.done
						(
							function ( data )
							{
								if ( data.returnCode == 0 )
								{
									this.setGlobalCartCnt( data.total_store_cnt );
								}
							}.bind( this )
						);
					}
			}


		var blc_TopArrow =
			{
				is_initialized:			false
			,	$elem:					null
			,	init:
					function ()
					{
						if ( this.is_initialized == false )
						{
							this.is_initialized	= true;
							this.$elem = $( "<div class='bl-3'><a class='anchor-to-top'><svg viewBox='0 0 266 205' style='fill: currentColor; fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:1.41421;''><path d='M126.068,31.764c-4.919,-0.36 -7.959,-1.079 -9,-1.764c-4.208,-2.769 10.899,-30 16,-30c5.101,0 20.036,27.46 16,30c-1.278,0.805 -4.239,1.467 -9,1.789l0,31.263l5,0.044l0,-1.096l4,0l0,1.167c1.356,0.033 2.689,0.071 4,0.114l0,-1.281l4,0l0,1.431c1.357,0.058 2.69,0.122 4,0.192l0,-1.623l4,0l0,1.863c0.66,0.044 1.314,0.089 1.962,0.137l2.038,0l0,-2l4,0l0,2l5,0c0.859,0.001 1.591,0.542 1.874,1.301c32.698,4.335 48.212,15.536 69.126,39.699c4.965,5.736 16.604,24.804 17,28c-0.634,6.261 -5.983,11.812 -14,5c-9.089,2.718 -18.299,5.335 -27.569,7.901l-55.862,15.198c-9.27,2.566 -18.48,5.183 -27.569,7.901c-0.349,0.058 -0.682,0.118 -1,0.178l0,28.822c0,3.863 -3.136,7 -7,7c-3.863,0 -7,-3.137 -7,-7l0,-28c-24.168,-7.004 -82.337,-21.13 -113,-28c-5.043,4.469 -13.934,5.073 -13,-7c18.584,-41.458 45.438,-60.991 86,-68.341l0,-0.659c0,-1.103 0.894,-1.998 2,-2l5,0l0,-2l4,0l0,2l4,0l0,-2l4,0l0,2l1.865,0c0.708,-0.057 1.42,-0.112 2.135,-0.164l0,-1.836l4,0l0,1.574c1.321,-0.078 2.655,-0.147 4,-0.208l0,-1.366l4,0l0,1.208c1.649,-0.055 3.316,-0.099 5,-0.132l0,-31.312ZM180.068,83l0,1c0,1.103 -0.894,1.998 -2,2l-5,0l0,2l-4,0l0,-2l-4,0l0,2l-4,0l0,-2l-4,0l0,2l-4,0l0,-2l-4,0l0,2l-4,0l0,-2l-5,0l0,25.64c6.793,2.345 14.841,6.572 12,8.36l0,33.347c0.631,-0.115 1.296,-0.231 2,-0.347c23.219,-4.546 92.596,-23.611 91,-27c-18.038,-36.883 -65,-43 -65,-43l0,0ZM86.068,83.566c-0.668,0.14 -1.334,0.285 -2,0.434c-27.673,6.19 -47.665,17.861 -64,45c-3.094,3.321 55.869,16.29 93,24c0.338,0.061 0.671,0.121 1,0.181l0,-33.181c-2.967,-1.953 5.16,-6.124 12,-8.414l0,-25.586l-5,0l0,2l-4,0l0,-2l-4,0l0,2l-4,0l0,-2l-4,0l0,2l-4,0l0,-2l-4,0l0,2l-4,0l0,-2l-5,0c-1.104,0 -2,-0.896 -2,-2l0,-0.434Z' /></svg><br>To Top</a></div>" );
							this.$elem.find( "A" ).click( function ( e ) {  $( 'html, body' ).animate({ scrollTop: '0px' }, 200); });
							$( "body" ).append( this.$elem );
						}
					}
			,	show:
					function ()
					{
						this.$elem.show();
					}

			,	hide:
					function ()
					{
						this.$elem.hide();
					}
				
			}
		var blc_MyCollection =
			{
					getTotalCollectionCnt:
					function()
					{
						$.ajax
						( 
							{
								url:	'_ajax/mycollection/getItemQty.ajax'
							,	type:	'POST'
							,	cache:	false
							,	xhrFields: 	{ withCredentials: true }
							}
						)
						.done
						(
							function ( data )
							{
								// console.log(data);
							}
						)
					}

				,	addCatalogItem: 
					function(partCnt, extPartCnt, minifigCnt)
					{
						var {idItem, type, invStatus, itemno, strItemName, idColorDefault } = _var_item;
						var listKnownColor = [];
						var colorSelected = ( (idColorDefault > 0) && (_var_color_selected == -1) )?idColorDefault:_var_color_selected;

						$(".pciSelectColorColorItem").each(
								function( ) {
									if ($(this).attr("data-tab") == "Known") 
									{
										var colorDetail = { colorId: $(this).attr("data-color"), name: $(this).attr("data-name"), rgb: $(this).attr("data-rgb")};
										listKnownColor[listKnownColor.length] = colorDetail;
									}
								}
							)

						if ( !bl.session.is_loggedin )
						{
							var	actionTrigger	=
								{
									type:			"addToMyCollection"
								};

							//show login modal
							bl.login.showSignupModal('login', actionTrigger);
							return;
						}
						if ( typeof bl.collection._showMyCollectionAddItem === undefined || bl.collection._showMyCollectionAddItem == null )
						{
							$.getScript( "//" + blUtil.getBLHost("static") + "/renovate/js/build/myCollection.build.js", function () { bl.collection._showMyCollectionAddItem( type, idItem, colorSelected, listKnownColor, invStatus, itemno, strItemName, partCnt, extPartCnt, minifigCnt ); } );
						}
						else
						{
							bl.collection._showMyCollectionAddItem(type, idItem, colorSelected, listKnownColor, invStatus, itemno, strItemName, partCnt, extPartCnt, minifigCnt);
						}
					}
			};

		var blc_Wanted =
			{
				serial_cnt:			0

			,	addItemToWantedModal:
					function ( idItem, idColor, nQty, callback, srcLocation, srcMethod, srcFromType, srcFromID )
					{
						bl.tracker.track( 500, idItem, idColor );

						if ( !bl.session.is_loggedin )
						{
							var	actionTrigger	=
								{
									type:			"addToWantedList"
								,	idItem:			idItem
								,	idColor:		idColor
								,	nQty:			nQty
								,	xPos:			window.pageXOffset
								,	yPos:			window.pageYOffset
								,	srcLocation:	srcLocation
								,	srcMethod:		srcMethod
								,	srcFromType:	srcFromType
								,	srcFromID:		srcFromID
								};

							//show login modal
							bl.login.showSignupModal('login',actionTrigger);
							return;
						}

						if ( idColor < 0 )
							idColor = 0;

						if ( typeof bl.wanted._showWantedAddModal2 === undefined || bl.wanted._showWantedAddModal2 == null )
						{
							$.getScript( "//" + blUtil.getBLHost("static") + "/renovate/js/build/wantedAddModalUtility2.build.js", function () { bl.wanted._showWantedAddModal2( parseInt( idItem ), parseInt( idColor ), nQty == null ? null : parseInt( nQty ), callback, srcLocation, srcMethod, srcFromType, srcFromID ); } );
						}
						else
						{
							bl.wanted._showWantedAddModal2( parseInt( idItem ), parseInt( idColor ), nQty == null ? null : parseInt( nQty ), callback, srcLocation, srcMethod, srcFromType, srcFromID );
						}
					}
			
			,	checkItems:
					function ( $elems, callback )
					{
						if ( !bl.session.is_loggedin || $elems.length == 0)
							return;

						var	list	= [];

						$elems.each
						( 
							function ()
							{
								var	$thisElem	= $( this );
								var	idItem		= $thisElem.attr( 'data-itemid' );
								var	idColor		= $thisElem.attr( 'data-colorid' );
								var cCond		= $thisElem.attr( 'data-cond' );
								var	idSerial	= ++blc_Wanted.serial_cnt;

								if ( cCond == null || cCond == '' ) cCond = 'X';

								$thisElem.attr( 'data-wantedcheck', idSerial );

								var	obj			= { idItem: idItem, idColor: idColor, cCond: cCond, idSerial: idSerial };

								list.push( obj );
							}
						);

						$.ajax
						( 
							{
								url:	'/ajax/renovate/wanted/checkWantedItems.ajax'
							,	data:	{ list: JSON.stringify( list ) }
							,	type:	'POST'
							,	cache:	false
							,	xhrFields: 	{ withCredentials: true }
							}
						)
						.done
						(
							function ( data )
							{
								if ( data.returnCode == 0 )
								{
									for ( var i = 0; i < data.list.length; ++i )
									{
										var	checkItem = data.list[ i ];

										$elems.each( 
											function () 
											{ 
												var	checkSerial = $(this).attr( "data-wantedcheck" );
												var	idItem 		= $( this ).attr( "data-itemid" );
												var	idColor		= $( this ).attr( "data-colorid" );

												if ( checkSerial == checkItem.idSerial )
												{
													$(this).attr( "data-wanted-check-result", checkItem.bHasWanted );
													$(this).attr( "data-wanted-qty", checkItem.nWantedQty );
													if ( callback ) 
														callback( $(this) );
													else
														blc_Wanted.callbackGeneral( idItem, idColor );
												}
											} 
										);
									}
								}
							}
						)
					}

			,	enableAdd:
					function ( $elems, callback, srcLocation )
					{
						$elems.off( 'click' ).click( 
							function ( e )
							{
								e.preventDefault();
								e.stopPropagation();

								var	idItem 	= $( this ).attr( "data-itemid" );
								var	idColor	= $( this ).attr( "data-colorid" );
								var	nQty	= $( this ).attr( "data-wantedqty" );

								bl.wanted.addItemToWantedModal( 
									idItem
								, 	idColor
								,	nQty
								, 	function () 
									{ 
										if ( callback ) 
											callback( $(this) ); 
										else
											blc_Wanted.checkItems( $( ".bl-wanted-addable[data-itemid='" + idItem + "'][data-colorid='" + idColor + "']" ) );
									}.bind( this )
								,	srcLocation
								);
							}
						)
					}

			,	callbackGeneral:
					function( idItem, idColor )
					{

						$( ".bl-wanted-addable[data-itemid='" + idItem + "'][data-colorid='" + idColor + "']" ).each( 
							function () 
							{
								var $thisElem 	= $( this );
								var	wantedQty	= $thisElem.attr( "data-wanted-qty");
								var	checkVal	= $thisElem.attr( "data-wanted-check-result" );

								if ( wantedQty )
								{
									$thisElem.find( ".like-count" ).text( wantedQty );
								}
								
								if ( checkVal )
								{
									if ( checkVal == "true" )
										$thisElem.find( "I" ).removeClass( "far fa-heart" ).addClass( "fas fa-heart" );
									else
										$thisElem.find( "I" ).removeClass( "fas fa-heart" ).addClass( "far fa-heart" );
								}
							}
						);
					}
			};

		var blc_CatalogItem =
			{
				serial_cnt:					100
			,	checkItems:
					function ( $elems, callback )
					{
						if ( $elems.length == 0 )
							return;

						var	list	= [];

						$elems.each
						( 
							function ()
							{
								var	$thisElem	= $( this );
								var	idItem		= $thisElem.attr( 'data-itemid' );
								var	idColor		= $thisElem.attr( 'data-colorid' );
								var	idSerial	= ++blc_CatalogItem.serial_cnt;

								$thisElem.attr( 'data-catalogitemcheck', idSerial );

								var	obj			= { idItem: idItem, idColor: idColor, idSerial: idSerial };

								list.push( obj );
							}
						);

						$.ajax
						( 
							{
								url:	'/ajax/renovate/catalog/getItemBasicInfoBatch.ajax'
							,	data:	{ list: JSON.stringify( list ), bWithPrice: true, bWithWanted: true }
							,	type:	'POST'
							,	cache:	false
							,	xhrFields: 	{ withCredentials: true }
							}
						)
						.done
						(
							function ( data )
							{
								if ( data.returnCode == 0 )
								{
									for ( var i = 0; i < data.list.length; ++i )
									{
										var	checkItem = data.list[ i ];

										$elems.each( 
											function () 
											{ 
												var	checkSerial = $(this).attr( "data-catalogitemcheck" );

												if ( checkSerial == checkItem.idSerial )
												{
													if ( callback ) 
														callback( $(this), checkItem ); 
												}
											} 
										);
									}
								}
							}
						);
					}
			,	getItemTypeName:
					function ( type, isPlural )
					{
						switch ( type )
						{
						case "P":	case "p":	return 	( !isPlural ? "Part" : "Parts" );
						case "S":	case "s":	return 	( !isPlural ? "Set" : "Sets" );
						case "M":	case "m":	return 	( !isPlural ? "Minifigure" : "Minifigures" );
						case "G":	case "g":	return 	( !isPlural ? "Gear" : "Gear" );
						case "I":	case "u":	return 	( !isPlural ? "Instruction" : "Instructions" );
						case "O":	case "o":	return 	( !isPlural ? "Original Box" : "Original Boxes" );
						case "C":	case "c":	return 	( !isPlural ? "Catalog" : "Catalogs" );
						case "B":	case "b":	return 	( !isPlural ? "Book" : "Books" );
						case "U":	case "u":	return 	( !isPlural ? "Custom Item" : "Custom Items" );
						default:	return "";
						}
					}
			};

		var blc_Category =
			{
				serial_cnt:					100
			,	checkCategories:
					function ( $elems, callback )
					{
						if ( $elems.length == 0 )
							return;
						
						var	list	= [];

						$elems.each
						( 
							function ()
							{
								var	$thisElem		= $( this );
								var	strCatString	= $thisElem.attr( 'data-catstring' );
								var	idSerial		= ++blc_Category.serial_cnt;

								$thisElem.attr( 'data-categoryitemcheck', idSerial );

								var	obj			= { idSerial: idSerial, strCatString: strCatString, bWithItemList: false };

								list.push( obj );
							}
						);

						$.ajax
						( 
							{
								url:	'/ajax/renovate/catalog/getCategoryInfo.ajax'
							,	data:	{ list: JSON.stringify( list ) }
							,	type:	'POST'
							,	cache:	false
							,	xhrFields: 	{ withCredentials: true }
							}
						)
						.done
						(
							function ( data )
							{
								if ( data.returnCode == 0 )
								{
									for ( var i = 0; i < data.list.length; ++i )
									{
										var	checkItem = data.list[ i ];

										$elems.each( 
											function () 
											{ 
												var	checkSerial = $(this).attr( "data-categoryitemcheck" );

												if ( checkSerial == checkItem.idSerial )
												{
													if ( callback ) 
														callback( $(this), checkItem ); 
												}
											} 
										);
									}
								}
							}
						);
					}
			};


		var blc_Tab =
		{
			is_initialized:		false
		,	init:
				function ()
				{
					if ( this.is_initialized == false )
					{
						this.is_initialized	= true;
						
						$('body').on( 'click', '.bl-3 .js-tab-trigger',
							function ( e )
							{
								var	$this	= $( this );
								var	target	= $this.attr( 'data-tab' );
								var group	= $this.attr( "data-tab-group" )

								$( '.bl-3 .js-tab-trigger[data-tab-group="' + group + '"]' ).removeClass( 'active' ).addClass( "inactive" );
								$( '.bl-3 .js-tab-target[data-tab-group="' + group + '"]' ).removeClass( 'active-tab' ).addClass( "inactive-tab" );
								
								$this.removeClass( 'inactive' ).addClass( 'active' );
								$( '.bl-3 .js-tab-target[data-tab-group="' + group + '"][data-tab="' + target + '"]' ).removeClass( 'inactive-tab' ).addClass( "active-tab" );
							}
						);
					}
				}
		};

		var	blc_Tracker =
		{
			init:
				function ()
				{
					var	val = blUtil.getCookie( "blckSessionStarted" );

					if ( val != "1" )
					{
						this.track( 1, navigator.userAgent );
						blUtil._setCookie( "blckSessionStarted", 1 );
					}
				}
		,	track:
				function ( typeActivity, arg1, arg2, arg3, arg4 )
				{
					var	useBL30	= true;

					if ( useBL30 )
					{
						var activities	= { typeActivity: typeActivity, strPageID: blUtil.getCurrentPageTrackID(), arg1: arg1, arg2: arg2, arg3: arg3, arg4: arg4 };

						$.ajax(
							{
								url:		"/_ajax/track_activity.ajax"
							,	method:		"GET"
							,	data:		{
												mid:		this.getMID()
											,	activities:	JSON.stringify( activities )
											}
							,	cache: 		false
							,	xhrFields:	{ withCredentials: true  }
							}
						);
					}
					else
					{
						$.ajax(
							{
								url:		"/ajax/renovate/track_activity.ajax"
							,	method:		"GET"
							,	data:		{
												type:		typeActivity
											,	mid:		this.getMID()
											,	pageid:		blUtil.getCurrentPageTrackID()
											,	arg1:		arg1
											,	arg2:		arg2
											,	arg3:		arg3
											,	arg4:		arg4
											}
							,	cache: 		false
							,	dataType:	"jsonp"
							,	xhrFields: { withCredentials: true  }
							}
						);
					}
				}

		,	getMID:
				function ()
				{
					var	ckMID	= blUtil.getCookie( "blckMID" );

					if ( ckMID == null || ckMID == "" )
					{
						ckMID	= blUtil.createMID();
						blUtil._setCookie( "blckMID", ckMID, 5000, ".bricklink.com" );
					}

					return ckMID;
				}
		,	registerTrackableLink:
				function ( $elems )
				{
					$elems.each( 
						function ()
						{
							var	$this	= $( this );

							if ( $this.prop("tagName") == "A" )
							{
								var		target		= $this.attr( "data-track-target");
								var		url			= $this.attr( "HREF" );

								$this.click( 
									function ()
									{
										blc_Tracker.track( 12, target, url );
									}
								)
							}
						}
					 )
				}
		};

		var	blc_ActionTrigger =
			{
				init:
					function ()
					{
						var	at		= blUtil.getHashVar( "at" );

						if ( at )
						{
							var	trigger	= JSON.parse( blUtil.decodeURLSafeB64( at ) );
							var	hIdx	= window.location.href.indexOf( "#" );
							var	hashUrl	= '';

							if ( hIdx > 0 )
								hashUrl = window.location.href.slice( hIdx + 1 );

							hashUrl	= hashUrl.replace( /\&?at\=[^\=]+/g, "" );

							window.location.hash	= hashUrl;

							switch ( trigger.type )
							{
							case "addToMyCollection":
								blc_MyCollection.addCatalogItem();
								break;
							case "addToWantedList":
								window.scrollTo( trigger.xPos, trigger.yPos );
								blc_Wanted.addItemToWantedModal( 
									trigger.idItem
								, 	trigger.idColor
								,	trigger.nQty
								,	function ()
									{
										blc_Wanted.checkItems( $( ".bl-wanted-addable[data-itemid='" + trigger.idItem + "'][data-colorid='" + trigger.idColor + "']" ) );
									}
								,	trigger.srcLocation
								,	trigger.srcMethod
								,	trigger.srcFromType
								,	trigger.srcFromID
								);
								break;
							case 'showSignupMailModal':
								if(!window.location.href.indexOf('confirm.page') >= 0){
									window.scrollTo( trigger.xPos, trigger.yPos );
									blc_Login.showConfirmEmailModal(trigger.email);
								}
								break;
							}
						}
					}
			}

		var blc_LoadingIcon = 
			{
				targetId: "",
				init:
					function( targetId, msg )
					{
						blc_LoadingIcon.targetId = targetId;
						var blcLoader = $(
							'<div class="brick-preloader brick-preloader--multicolor"> \
								<div class="brick-preloader__cube"></div> \
								<div class="brick-preloader__cube"></div> \
								<div class="brick-preloader__cube"></div> \
								<div class="brick-preloader__cube"></div> \
							</div><div class="clearfix"></div> \
							<div class="l-margin-bottom text center">' + msg + '</div>' );

						$("#" + targetId).append(blcLoader);

					},
				show:
					function()
					{
						if (blc_LoadingIcon.targetId != "")
							$("#" + blc_LoadingIcon.targetId).show();
					},
				hide:
					function()
					{
						if (blc_LoadingIcon.targetId != "")
							$("#" + blc_LoadingIcon.targetId).hide();
					}
			}

		var blc_Constants	=
		{
			mapColors:			{}
		,	arrColors:			null
			
		,	mapCategories:		{}
		,	arrCategories:		null

		,	mapCoBrands:		{}
		,	arrCoBrands:		null

		,	mapLanguages:		{}
		,	mapLanguagesByCode:	{}
		,	arrLanguages:		null



		,	initColors:
				function ( bReload )
				{
					if ( ( bReload == null || bReload == false ) && this.arrColors != null )
						return;

					if ( _blvarGlobalConstants && _blvarGlobalConstants.colors )
						this.arrColors	= _blvarGlobalConstants.colors;
					else if ( _varColorList )
						this.arrColors	= _varColorList;

					this.mapColors	= {};

					if ( this.arrColors != null )
					{
						for ( var i = 0; i < this.arrColors.length; ++i )
						{
							try
							{
								var		thisColor	= this.arrColors[ i ];
								var		valR		= parseInt( thisColor.rgb.substring( 0, 2 ), 16 );
								var		valG		= parseInt( thisColor.rgb.substring( 2, 4 ), 16 );
								var		valB		= parseInt( thisColor.rgb.substring( 4, 6 ), 16 );
								var		a			= 1 - ( 0.299 * valR + 0.587 * valG + 0.114 * valB) / 255;

								thisColor.rgbTxt	= ( a < 0.5 ? "000000" : "FFFFFF" );
							}
							catch ( e )
							{
								thisColor.rgbTxt	= "FF0000";
							}

							this.mapColors[ thisColor.idColor ] = thisColor;
						}
					}					
				}
		,	getColorInfo:
				function ( idColor )
				{
					if ( this.arrColors == null )
						this.initColors();

					if ( this.arrColor == null )
						return null;

					if ( this.mapColors[ idColor ] == null )
					{
						return {
									idColor:		idColor
								,	strColorName:	"Unknown"
								,	group:			""
								,	groupName:		"(Other)"
								,	rgb:			'FFFFFF'
								,	rgbTxt:			'FF0000'
								};						
					}

					return this.mapColors[ idColor ];
				}

		,	initCategories:
				function ( bReload )
				{
					if ( ( bReload == null || bReload == false ) && this.arrCategories != null )
						return;

					if ( _blvarGlobalConstants && _blvarGlobalConstants.categories )
						this.arrCategories	= _blvarGlobalConstants.categories
					else if ( _varArrayCategory )
						this.arrCategories	= _varArrayCategory;

					this.mapCategories	= {}

					if ( this.arrCategories != null )
					{
						this.arrCategories.sort( function( l, r ) { return l.strCatName.localeCompare( r.strCatName ); } );
						for ( var i = 0; i < this.arrCategories.length; ++i )
						{
							var	thisCategory	= this.arrCategories[ i ];
							this.mapCategories[ thisCategory.idCategory ]	= thisCategory;
						}
					}					
				}
		,	getCategoryInfo:
				function ( idCategory )
				{
					if ( this.arrCategories == null )
						this.initCategories();

					return this.mapCategories[ idCategory ];

				}

		,	initCoBrands:
				function ( bReload )
				{
					if ( ( bReload == null || bReload == false ) && this.arrCoBrands != null )
						return;

					if ( _blvarGlobalConstants && _blvarGlobalConstants.cobrands )
					{
						this.arrCoBrands	= _blvarGlobalConstants.cobrands
					}
					else if ( _varPromoList )
					{
						this.arrCoBrands	= {};
						for ( var i = 0; i < _varPromoList.length; ++i )
						{
							var p	= _varPromoList[ i ];
							this.arrCoBrands.push( { idCoBrand: p.idPromo, strCoBrandName: p.strPromoName, typeCoBrand: null, strCoBrandTypeName: null } );
						}
					}

					this.mapCoBrands	= {}

					if ( this.arrCoBrands != null )
					{
						this.arrCoBrands.sort( function( l, r ) { return l.strCoBrandName.localeCompare( r.strCoBrandName ); } );
						for ( var i = 0; i < this.arrCoBrands.length; ++i )
						{
							var	thisItem	= this.arrCoBrands[ i ];
							this.mapCoBrands[ thisItem.idCoBrand ]	= thisItem;
						}
					}					
				}

		,	getCoBrandInfo:
				function ( idCoBrand )
				{
					if ( this.arrCoBrands == null )
						this.initCoBrands();

					return this.mapCoBrands[ idCoBrand ];
				}

		,	initLanguages:
				function ( bReload )
				{
					if ( ( bReload == null || bReload == false ) && this.arrLanguages != null )
						return;

					if ( _blvarGlobalConstants && _blvarGlobalConstants.languages )
						this.arrLanguages	= _blvarGlobalConstants.languages
	
					this.mapLanguages		= {}
					this.mapLanguagesByCode	= {}

					if ( this.arrLanguages != null )
					{
						this.arrLanguages.sort( function( l, r ) { return l.strLanguageName.localeCompare( r.strLanguageName ); } );
						for ( var i = 0; i < this.arrLanguages.length; ++i )
						{
							var	thisItem	= this.arrLanguages[ i ];
							this.mapLanguages[ thisItem.idLanguage ]			= thisItem;
							this.mapLanguagesByCode[ thisItem.codeLanguage ]	= thisItem;
						}
					}					
				}

		,	getLanguageInfo:
				function ( idLanguage )
				{
					if ( this.arrLanguages == null )
						this.initLanguages();

					return this.mapLanguages[ idLanguage ];
				}				

		,	getLanguageInfoByCode:
				function ( codeLanguage )
				{
					if ( this.arrLanguages == null )
						this.initLanguages();

					return this.mapLanguagesByCode[ codeLanguage ];
				}			

		,	initAll:
				function ()
				{
					this.initColors();
					this.initCategories();
					this.initCoBrands();
					this.initLanguages();		
				}
		}

		var blc_AccountConsent = 
		{
			submitIntercept: 
				function() 
				{
					var checkboxChecked = false;

					var modal = document.createElement('div');
					
					modal.innerHTML = '<div class="bl-3"><div class="modal"><div class="modal-overlay"></div><div class="modal-dialog"><div class="modal-body small"><p class="l-margin-bottom l-margin-top--sm">To proceed with your update, please check the consent box.</p><label class="l-flex"><input type="checkbox" class="l-margin-right--sm js-account-info-submit-checkbox"/><p>I consent to BrickLink\'s use of my personal information to process and operate my account.</p></label></div><div class="modal-footer"><div class="l-margin-top l-flex l-center l-split"><button class="bl-btn link js-account-info-submit-close">Cancel</button><button class="bl-btn primaryBlue js-account-info-submit-submit disabled">Submit changes</button></div></div></div></div></div>';

					document
						.querySelector('.js-account-info-submit')
						.addEventListener(
							'click'
						,	function(e) 
							{
								e.preventDefault();
								document.body.prepend(modal);
							}
						);

					modal
						.querySelector('.js-account-info-submit-checkbox')
						.addEventListener(
							'change'
						,	function(e) 
							{
								if ( e.target.checked ) 
								{
									modal.querySelector('.js-account-info-submit-submit').classList.remove('disabled');
									checkboxChecked = true;
								}
								else
								{
									modal.querySelector('.js-account-info-submit-submit').classList.add('disabled');
									checkboxChecked = false;
								}
							}
						);

					modal.querySelector('.js-account-info-submit-close').addEventListener('click', function() {	modal.remove(); });
					modal.querySelector('.js-account-info-submit-submit').addEventListener('click', function() { if ( checkboxChecked ) { modal.remove(); } });
				}
		}		

		var blc_SrcMap	=
		{
			location:	{
							STUDIO:					1
						,	REBRICKABLE:			2

						,	GENERAL_CLASSIC:		100
						,	GENERAL_XP:				101

						,	AFFILIATE:				200
						
						,	MS_BASEPLATE:			1000
						,	MS_GALLERY:				1010
						,	MS_DETAIL:				1020
						,	MOSAICK:				1030
						,	MOCSHOP:				1040

						,	STOREFRONT:				1100
						,	STOREFRONT_WANTEDLIST:	1110
						,	STOREFRONT_FEATURED:	1120
						,	STOREFRONT_CART:		1130

						,	SEARCH_RESULT:			1200
						,	SEARCH_RESULT_XP:		1201

						,	CATALOG:				1300
						,	CATALOG_XP:				1301
						,	CATALOG_ITEM_DETAIL:	1310
						,	CATALOG_ITEM_DETAIL_XP:	1311
						,	CATALOG_ITEM_INV_TAB:	1320
						,	CATALOG_CONSISTS_OF_XP:	1321

						,	WANTEDLIST:				1400
						,	WANTEDLIST_XP:			1401
						,	WANTEDLIST_DETAIL:		1410
						,	WANTEDLIST_DETAIL_XP:	1411
						,	WANTEDLIST_BUY:			1420
						,	WANTEDLIST_PARTOUT:		1430

						,	GLOBALCART:				1500
						,	GLOBALCART_XP:			1501
						,	ORDER_DETAIL_XP:		1511

						,	CROWD_PREORDER: 		1600
						,	CROWD_SALES:			1601

						,	COLLECTION:				1700

						,	MYBL:					1800
						}
		,	method:		{
							UPLOAD:					"U"
						,	PART_OUT:				"P"
						,	WL_AUTOFINDER:			"A"
						,	EASYBUY:				"E"
						,	ALTERNATIVE_STORE:		"N"
						,	REDUCE_STORE:			"R"
						}
		}

		var blc_StateNew	=
		{
			initialized:		false
		,	mapStateByID:		{}
		,	mapStateByCountry:	{}

		,	init:
				function ()
				{
					if ( this.initialized == true )
						return;

					this.initialized	= true;

					for ( var i = 0; i < _blvarGlobalConstants.states_new.length; ++i )
					{
						var	s	= _blvarGlobalConstants.states_new[ i ];
						var	ca	= this.mapStateByCountry[ s.codeCountryRoot.toUpperCase() ];

						this.mapStateByID[ s.idStateNew ]	= s;

						if ( ca == null )
							this.mapStateByCountry[ s.codeCountryRoot.toUpperCase() ]	= [ s ];
						else
							ca.push( s );
					}
				}
		,	get:
				function ( idStateNew )
				{
					return this.mapStateByID[ idStateNew ];
				}
		,	getListByCountry:
				function ( codeCountry )
				{
					return this.mapStateByCountry[ codeCountry.toUpperCase() ];
				}
		};

		var blc_StateLegacy	=
		{
			initialized:		false
		,	mapStateByID:		{}
		,	mapStateByCountry:	{}

		,	init:
				function ()
				{
					if ( this.initialized == true )
						return;

					this.initialized	= true;

					for ( var i = 0; i < _blvarGlobalConstants.states_legacy.length; ++i )
					{
						var	s	= _blvarGlobalConstants.states_legacy[ i ];
						var	ca	= this.mapStateByCountry[ s.codeCountryRoot.toUpperCase() ];

						this.mapStateByID[ s.idStateLegacy ]	= s;

						if ( ca == null )
							this.mapStateByCountry[ s.codeCountryRoot.toUpperCase() ]	= [ s ];
						else
							ca.push( s );
					}				
				}
		,	get:
				function ( idStateLegacy )
				{
					return this.mapStateByID[ idStateLegacy ];
				}

		,	getListByCountry:
				function ( codeCountry )
				{
					return this.mapStateByCountry[ codeCountry.toUpperCase() ];
				}
		};

		var	blc_Continent	=
		{
			initialized:	false
		,	mapContinent:	{}
		,	arrContinent:	[]
		,	init:
				function ()
				{
					if ( this.initialized == true )
						return;

					this.initialized	= true;
					this.arrContinent	= _blvarGlobalConstants.continents;

					for ( var i = 0; i < this.arrContinent.length; ++i )
					{
						var 	c	= this.arrContinent[ i ];

						this.mapContinent[ c.idContinent ]	= c;
					}
				}

		,	get:
				function ( idContinent )
				{
					return this.mapContinent[ idContinent ];
				}

		,	getAllList:
				function ()
				{
					return this.arrContinent;
				}
		}

		var	blc_Country	=
		{
			initialized:	false
		,	mapCountry:		{}
		,	arrCountry:		[]
		,	init:
				function ()
				{
					if ( this.initialized == true )
						return;

					this.initialized	= true;

					blc_StateNew.init();
					blc_StateLegacy.init();
					blc_Continent.init();

					for ( var i = 0; i < _blvarGlobalConstants.countries.length; ++i )
					{
						var	c	= _blvarGlobalConstants.countries[ i ];

						c.arrStatesNew		= blc_StateNew.getListByCountry( c.idCountry );
						c.arrStatesLegacy	= blc_StateLegacy.getListByCountry( c.idCountry );

						this.mapCountry[ c.idCountry ]	= c;
						if (!c.bExclude)
							this.arrCountry.push( c );
					}
				}

		,	get:	
				function ( codeCountry )
				{
					if ( this.mapCountry.hasOwnProperty( codeCountry ) )
						return this.mapCountry[ codeCountry ];
					return null;
				}

		,	getStateNew:
				function ( idStateNew )
				{
					return blc_StateNew.get( idStateNew );
				}

		,	getStateLegacy:
				function ( idStateLegacy )
				{
					return blc_StateLegacy.get( idStateLegacy );
				}
		
		,	getStateList:
				function( codeCountry )
				{
					return blc_StateNew.getListByCountry( codeCountry );
				}

		,	getEUCountryList:
				function ( )
				{
					return this.arrCountry.filter(c => c.isEUCountry);
				}

		,	getContinent:
				function ( idContinent )
				{
					return blc_Continent.get( idContinent );
				}

		,	getContinentList:
				function ()
				{
					return blc_Continent.getAllList();
				}
		}

		var	blc_Address	=
		{
			mapAddressFormat:		{}
		,	mapAddressFormatOrder: 	{}
		,	init:
				function ()
				{
					for ( var i = 0; i < _blvarGlobalConstants.address_formats.length; ++i )
					{
						var	af	= _blvarGlobalConstants.address_formats[ i ];

						this.mapAddressFormat[ af.idAddressFormat ]	= af;
					}

					this.mapAddressFormatOrder = _blvarGlobalConstants.address_format_orders;
				}

		,	removeUnusedFields:
				function ( address )
				{
					var	cInfo	= blc_Country.get( address.codeCountry );
					var	fmt		= this.getFormat( cInfo.idAddressFormat );
					var	newAddress = _.clone( address );

					if ( !fmt.typeAddress1 )
					{ 
						newAddress.strAddress1 = '';
					}
					if ( !fmt.typeAddress2  )
					{ 
						newAddress.strAddress2 = '';
					}
					if ( !fmt.typeAddress3 )
					{
						newAddress.strAddress3 = '';
					}
					if ( !fmt.typeCity )
					{
						newAddress.strCity = '';
					}
					if ( !fmt.typeState )
					{
						newAddress.strStateName = '';
						newAddress.idState = 0;
					}
					if ( !fmt.typePostalCode )
					{
						newAddress.strPostalCode = '';
					}

					return newAddress;
				}

		,	verifyAddress:
				function ( address, checkName, checkPhone )
				{
					var result	= 	{
										isOK: 	true
									, 	errors:	{
													firstName: 	null
												,	lastName: 	null
												,	address1: 	null
												,	address2: 	null
												,	address3: 	null
												,	city: 		null
												,	postalCode: null
												,	state: 		null
												,	country:	null
												,	tel: 		null
												}
									}

					try
					{	
						var	cInfo	= blc_Country.get( address.codeCountry );
						var	fmt		= this.getFormat( cInfo.idAddressFormat );

						if ( !this.isValidField( checkName ? 1 : 0, address.strFirstName ) )
						{ 
							result.errors.firstName		= "error"; 
							result.isOK					= false; 
						}
						if ( !this.isValidField( checkName ? 1 : 0, address.strLastName ) )
						{ 
							result.errors.lastName		= "error"; 
							result.isOK					= false; 
						}
						if ( checkName ) 
						{ 
							var regex =  new RegExp(/^[\s]+$/); 
							var special = new RegExp(/^[|\":\<\>\[\]\{\}`\\\(\)\'\;\!\@\#\$\%\^\&\*\-\_\+\=\,\.\/~\?\s]+$/i) 
							if ( regex.test(address.strFirstName) || special.test(address.strFirstName) ) 
							{ 
								result.errors.firstName	= "error"; 
								result.isOK				= false;  
							} 
 
							if ( regex.test(address.strLastName) || special.test(address.strLastName)  ) 
							{ 
								result.errors.lastName	= "error"; 
								result.isOK				= false;  
							} 
						} 
						if ( !this.isValidField( fmt.typeAddress1, address.strAddress1 ) )
						{ 
							result.errors.address1		= "error";
							result.isOK					= false; 
						}
						if ( !this.isValidField( fmt.typeAddress2, address.strAddress2 ) )
						{ 
							result.errors.address2		= "error";
							result.isOK					= false; 
						}
						if ( !this.isValidField( fmt.typeAddress3, address.strAddress3 ) )
						{
							result.errors.address3		= "error";
							result.isOK					= false; 
						}
						if ( !this.isValidField( fmt.typeCity, address.strCity ) )
						{
							result.errors.city			= "error";
							result.isOK					= false; 
						}
						if ( !this.isValidField( fmt.typeState, this.getStateName( address ) ) )
						{
							result.errors.state			= "error";
							result.isOK					= false; 
						}
						if ( !this.isValidField( fmt.typePostalCode, address.strPostalCode ) )
						{
							result.errors.postalCode	= "error";
							result.isOK					= false; 
						}
						if ( address.strPostalCode ) 
						{
							var regex = new RegExp(/^[a-z0-9][a-z0-9\- ]{0,14}[a-z0-9]$/i);
							if ( !regex.test(address.strPostalCode) )
							{
								result.errors.postalCode	= "error";
								result.isOK					= false; 
							}
						}
						if ( !this.isValidField( checkPhone ? 1 : 0, address.strTel ) )
						{ 
							result.errors.tel			= "error"; 
							result.isOK					= false; 
						}

						var sListNew = blc_Country.get( address.codeCountry ).arrStatesNew;
						if ( fmt.typeState == 1 && sListNew )
						{
							var sInfoNew = sListNew.find(st => st.idStateNew == address.idStateNew);
							if( !sInfoNew )
							{
								result.errors.state			= "error";
								result.isOK					= false; 
							}
						}

						// Add if we want to force all NI buyers to update their postal code
						if ( address.codeCountry == "UK" && address.idStateLegacy == 23739 ) {
							if ( address.strPostalCode.substring(0,2) != "BT" ) {
								result.errors.postalCode	= "error";
								result.isOK					= false; 
							}
						}
					}
					catch ( e )
					{
						result.isOK	= false;
					}

					return result;
				}

		,	getFormat:	
				function ( idAddressFormat )
				{
					return this.mapAddressFormat[ idAddressFormat ];
				}

		,	isValidField:
				function ( field, value )
				{
					if ( field == 1 && ( value == null || value.trim() == "" ) )
						return false;
					return true;
				}

		,	getFormatOrder:	
				function ( codeCountry )
				{
					return this.mapAddressFormatOrder[ codeCountry ];
				}

		,	formatAddress:
				function( dmUserAddress, includeName, includeCountry, includeTel, includeCompany = false )
				{
					var	addrLine		= [];
					var	strNameLine		= ( ( dmUserAddress.strFirstName || "" ) + " " + ( dmUserAddress.strLastName || "" ) ).trim();
					var	strCompanyLine		= ( dmUserAddress.strCompanyName || "" ).trim();
					var	c				= blc_Country.get( dmUserAddress.codeCountry );
					var	defaultFormatCountry = "US";
					var	fmtOrder		= this.getFormatOrder( dmUserAddress.codeCountry ) || this.getFormatOrder(defaultFormatCountry);
					var	fmt				= this.getFormat( c.idAddressFormat );

					if ( includeName && !_.isEmpty( strNameLine ) )
						addrLine.push( strNameLine );

					if (includeCompany && !_.isEmpty( strCompanyLine ) ) 
						addrLine.push( strCompanyLine );
					
					_.forEach( fmtOrder, function(o) {
						var value = blc_Address.getValue( o.name, dmUserAddress );
						var type = blc_Address.getFieldType( o.name, fmt );

						if ( ( dmUserAddress.codeCountry.toUpperCase() == "SE" || dmUserAddress.codeCountry.toUpperCase() == "FR" )
								&& o.name == "state" )
						{
							// FOR SWEDEN AND FRANCE : we need state field for BL, but don't need to display it for shipping address
							return;
						}
						if ( type == 0 || _.isEmpty( value ) || _.isEmpty( value.trim() ) )
							return;

						if ( o.colNum == 0 )
						{
							addrLine.push( value )
						}
						else
						{
							var prevValue = addrLine[addrLine.length-1];
							addrLine[addrLine.length-1] = prevValue + " " + value;
						}
					});

					if ( includeCountry )
						addrLine.push( c != null ? c.strCountryName : dmUserAddress.codeCountry );


					if ( includeTel && !_.isEmpty( dmUserAddress.strTel ) )
						addrLine.push( dmUserAddress.strTel );

					return addrLine;
				}

		,	getValue:
				function( formatName, address )
				{
					switch ( formatName )
					{
					case "address1":				return address.strAddress1;
					case "address2":				return address.strAddress2;
					case "address3":				return address.strAddress3;
					case "state":					return this.getStateName( address );
					case "city":					return address.strCity;
					case "province":				return address.strProvince;
					case "postalCode":				return address.strPostalCode;
					default:						return "";
					}
				}
		,	getFieldType:
				function( formatName, format )
				{
					switch ( formatName )
					{
					case "address1":				return format.typeAddress1;
					case "address2":				return format.typeAddress2;
					case "address3":				return format.typeAddress3;
					case "state":					return format.typeState;
					case "city":					return format.typeCity;
					case "province":				return format.typeProvince;
					case "postalCode":				return format.typePostalCode;
					default:						return "";
					}
				}
		,	getStateName:
				function ( address )
				{
					if ( address.strStateName )
						return address.strStateName;
					
					if ( address.idState )
					{
						var	st	= blc_Country.getStateNew( address.idState );

						if ( st )
							return st.strStateName;
					}

					if ( address.idStateLegacy )
					{
						var	st	= blc_Country.getStateLegacy( address.idStateLegacy );

						if ( st )
							return st.strStateName;
					}

					return "";
				}
		,	getEmptyAddress:
				function (codeCountry, bDefault)
				{
					return	{
						idAddress: 		0
					,	strFirstName: 	''
					,	strLastName: 	''
					,	strAddress1: 	''
					,	strAddress2: 	''
					,	strCity: 		''
					,	idStateNew:		0
					,	idStateLegacy:	0
					,	strStateName: 	''
					,	strPostalCode: 	''
					,	codeCountry: 	codeCountry || ''
					,	strTel: 		''
					,	bDefault:		bDefault ? true : false
					};
				}
		,	getAddressWithDefaultValue:
				function ( address, codeCountry )
				{
					if ( !address ) {
						return this.getEmptyAddress( codeCountry );
					}

					return {
						idAddress: 		address.idAddress || 0
					,	strFirstName: 	address.strFirstName || ''
					,	strLastName: 	address.strLastName || ''
					,	strAddress1: 	address.strAddress1 || ''
					,	strAddress2: 	address.strAddress2 || ''
					,	strCity: 		address.strCity || ''
					,	idStateNew:		address.idStateNew || 0
					,	idStateLegacy:	address.idStateLegacy || 0
					,	strStateName: 	address.strStateName || ''
					,	strPostalCode: 	address.strPostalCode || ''
					,	codeCountry: 	address.codeCountry || codeCountry
					,	strTel: 		address.strTel || ''
					};
				}
		,	getEmptyAddressError:
				function()
				{
					return {
						firstName:		null
					,	lastName:		null
					,	address1:		null
					,	address2:		null
					,	address3:		null
					,	city:			null
					,	postalCode:		null
					,	state:			null
					,	tel:			null
					}
				}
		}

		blUtil.registerToBL( "util", blUtil );
		blUtil.registerToBL( "url", blURL );
		blUtil.registerToBL( "login", blc_Login );
		blUtil.registerToBL( "sitewidealert", blc_SiteWideAlert );	
		blUtil.registerToBL( "mainnav", blc_MainNav );		
		blUtil.registerToBL( "subnav", blc_SubNav );	
		blUtil.registerToBL( "search", blc_Search );				
		blUtil.registerToBL( "cart", blc_GlobalCart );
		blUtil.registerToBL( "toparrow", blc_TopArrow );
		blUtil.registerToBL( "wanted", blc_Wanted );
		blUtil.registerToBL( "catalogitem", blc_CatalogItem );
		blUtil.registerToBL( "category", blc_Category );
		blUtil.registerToBL( "tracker", blc_Tracker );
		blUtil.registerToBL( "tab", blc_Tab );
		blUtil.registerToBL( "loadingicon", blc_LoadingIcon );
		blUtil.registerToBL( "constants", blc_Constants );
		blUtil.registerToBL( "accountconsent", blc_AccountConsent );
		blUtil.registerToBL( "srcmap", blc_SrcMap );
		blUtil.registerToBL( "country", blc_Country );
		blUtil.registerToBL( "address", blc_Address );
		blUtil.registerToBL( "collection", blc_MyCollection );

		$( 
			function()
			{
				blc_MainNav.init();
				blc_DropDown.init();
				blc_Select.init();
				blc_Country.init();
				blc_Address.init();

				if ( _var_ie == 9 ) setTimeout( function() { bl.util.checkPlaceholders(); }, 0 );

				if ( $( "#id-main-legacy-table" ).length > 0 )
				{
					var	resizeFunc	= 	function ()
										{
											var leftPos = ( window.innerWidth - $( "#id-main-legacy-table" ).width() ) / 2;

											if ( leftPos < 0 )	leftPos = 0;

											$( "#id-main-legacy-table" ).css( "margin-left", leftPos ).css( "margin-right", "auto" );
										}

					$( window ).resize( resizeFunc );
					resizeFunc();
				}

				blUtil.reserveRefresh();

				blc_ActionTrigger.init();
				blc_Tab.init();
				blc_Tracker.init();
				
				blUtil.floatNotification();			


			}
		);
	}
)();

if ( typeof Object.assign != 'function' ) 
{
	Object.assign = function(target, varArgs) 
	{
		'use strict';
		if (target == null) 
		{ // TypeError if undefined or null
				throw new TypeError('Cannot convert undefined or null to object');
		}

		var to = Object(target);

		for (var index = 1; index < arguments.length; index++) 
		{
				var nextSource = arguments[index];

				if (nextSource != null) 
				{ // Skip over if undefined or null
					for (var nextKey in nextSource) 
					{
							// Avoid bugs when hasOwnProperty is shadowed
							if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) 
							{
								to[nextKey] = nextSource[nextKey];
							}
						}
				}
			}
			return to;
		};
}
