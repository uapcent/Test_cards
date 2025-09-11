//Protect the console object.
(function() {
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

(
	function( $ )
	{
		$.extend(
			{
				deepClone: function(obj) //note: don't call 'clone' because then it will conflict with jQ
				{
					return JSON.parse(JSON.stringify(obj));
				}
			,	isObject: function(a)
				{
					return typeof a === 'object';
				}
			,	isEmptyObject: function(obj)
				{
					for(var prop in obj) {
				    	if (Object.prototype.hasOwnProperty.call(obj, prop))
							return false;
					}
					return true;
				}
			,	combineKeys: function (source, target){
					for (var prop in source) target[prop] = source[prop];
				}
			,	decodeURL:				function( str )
				{
					 return decodeURIComponent((str+'').replace(/\+/g, '%20'));
				}
			,	getVarsFromHashString : function ( strHash )
				{
					var	vars	= {}, hash;
					var	hashes 	= strHash.slice(strHash.indexOf('#') + 1).split('&');
					for ( var i = 0; i < hashes.length; i++ )
					{
						hash = hashes[i].split('=');
						vars[hash[0]] = $.decodeURL( hash[1] );
					}
					return vars;
				}
			,	getVarsFromUrlString : function ( url )
				{
					var	vars	= {}, hash;
					var	strURL	= String( url );
					var	hashIdx	= strURL.indexOf('#');
					var	hashes 	= strURL.slice(strURL.indexOf('?') + 1, hashIdx == -1 ? strURL.length : hashIdx).split('&');
					for ( var i = 0; i < hashes.length; i++ )
					{
						hash = hashes[i].split('=');
						vars[hash[0]] = $.decodeURL( hash[1] );
					}
					return vars;
				}
			,	getUrlVars: function()
				{
					return $.getVarsFromUrlString( window.location.href );
				}
			,	getHashVars: function()
				{
					return $.getVarsFromHashString( window.location.href );
				}
			,	getUrlVar: function ( name )
				{
					return $.getUrlVars()[name];
				}
			,	getHashVar: function ( name )
				{
					return $.getHashVars()[name];
				}
			,	unescapeUnicode: function( txt )
				{
					return String( txt ).replace( /\\u([\d\w]{4})/gi, function (match, grp) { return String.fromCharCode(parseInt(grp, 16)); } );
				}
			,	encodeHtml: function( txt )
				{
					return String( txt ).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
				}
			,	decodeHtml: function( txt )
				{
					return String( txt ).replace(/&quot;/g, '"').replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/&amp;/g, '&');
				}
			,	escapeJS: function ( txt )
				{
					return ( txt + '').replace(/[\\']/g, '&apos;').replace(/[\\"]/g, '&quot;');
				}
			,	unescapeJS: function ( txt )
				{
					return ( txt + '').replace( /&apos;/g, "'" ).replace(/&quot;/g, '"');
				}
			,	isMobile: function ()
				{
					var	str	= navigator.userAgent||navigator.vendor||window.opera;
					if ( /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(str)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(str.substr(0,4)) )
						return true;
					return false;
				}
			,	isIE:	function ()
				{
					var	userAgent = navigator.userAgent;
					return userAgent.indexOf("MSIE ") > -1 || userAgent.indexOf("Trident/") > -1;

				}
			,	loadCSS: function ( url )
				{
					var cssElem = document.createElement( "link" );

					cssElem.setAttribute( "rel", "stylesheet" );
					cssElem.setAttribute( "type", "text/css" );
					cssElem.setAttribute( "href", url );
					if ( typeof cssElem != "undefined" )
						document.getElementsByTagName( "head" )[0].appendChild( cssElem );
				}
			,	blisNumeric:	function ( str )
				{
					var RE = /^-{0,1}\d*\.{0,1}\d+$/;
					return (RE.test(str));
				}
			,	bindParams:		function ( elem, template, convert, index, bRemoveSpecialTag )
				{
					var content = template;

					for ( var key in elem )
						content = content.split( '[%' + key + '%]' ).join( $.encodeHtml( elem[ key ] ) );

					for ( var key in elem )
						content = content.split( '[%=' + key + '%]' ).join( elem[ key ] );

					if ( convert != undefined )
					{
						var bindData = convert( elem, index );

						for ( var key in bindData )
						{
							content = content.split( '[%' + key + '%]' ).join( $.encodeHtml( bindData[ key ] ) );
							content = content.split( '[%=' + key + '%]' ).join( bindData[ key ] );
						}
					}

					if ( bRemoveSpecialTag )
						content	= content.replace( /<blimg/gi, "<img" ).replace( /<\x2Fblimg>/gi, "" );

					return content;
				}
			,	formatInteger:	function ( num )
				{
						return parseInt( num ).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
				}
			,	setCookie:	function ( name, value, exdays, domain )
				{
					var		cookieStr;

					cookieStr	= name + "=" + value;

					if ( domain != null )
						cookieStr	= cookieStr	+ ";domain=" + domain + ";path=/";

					if ( exdays != null )
					{
						var d = new Date();
						d.setTime(d.getTime() + (exdays*24*60*60*1000));
						cookieStr = cookieStr + ";expires=" + d.toUTCString();
					}

					document.cookie	= cookieStr;
				}
			,	getCookie:	function ( cname )
				{
					var name 	= cname + "=";
					var ca 		= document.cookie.split(';');
					for ( var i=0; i<ca.length; i++ )
					{
						var c = ca[i];
						while ( c.charAt(0)==' ' )
							c = c.substring(1);
						if ( c.indexOf(name) == 0 )
							return c.substring( name.length,c.length );
					}
					return "";
				}
			,	getFeedbackIconHTML:		function( score )
				{
					var		starIndex	= 0;

					if ( score < 10 )				starIndex	= 0;
					else if ( score < 50 )			starIndex	= 1;
					else if ( score < 100 )		starIndex	= 5;
					else if ( score < 500 )		starIndex	= 2;
					else if ( score < 1000 )		starIndex	= 3;
					else if ( score < 2500 )		starIndex	= 4;
					else if ( score < 5000 )		starIndex	= 6;
					else if ( score < 10000 )		starIndex	= 7;
					else if ( score < 25000 )		starIndex	= 8;
					else if ( score < 50000 )		starIndex	= 9;
					else 							starIndex	= 10;

					if ( starIndex > 0 )
						return "<img alt='' width='16' hspace='3' align='ABSMIDDLE' height='16' border='0' src='//" + _var_assoc_host + "/images/bricks/star" + starIndex + ".png'>";
					return "";
				}
			,   assert: 					function( pred, msg, code )
				{
					if (!pred) 
					{
						// console.log(arguments);
						throw {msg: 'Assertion failed: ' + code + ' '  + msg, type: 'assert'};
					}

				}
			,   assertPush: 				function(pred, msg, errors, code)
				{
					if (typeof code === 'number'){
						if (!pred) errors.push({code: code, msg:msg});
					} else {
						if (!pred) errors.push({msg:msg});
					}
				}
			,	buildColorSelection:		function ( elem )
				{
					var		prevGroup	= 0;
					
					elem.append( $("<OPTGROUP LABEL='-'><OPTGROUP LABEL='- LEGO Colors'><OPTGROUP LABEL='-'>") );

					for ( var i = 0; i < _varColorList.length; ++i )
					{
						var	itemColor	= _varColorList[ i ];

						if ( prevGroup != itemColor.group )
						{
							if ( itemColor.group == 10 )
								elem.append( $("<OPTGROUP LABEL='-'><OPTGROUP LABEL='- Modulex Colors'><OPTGROUP LABEL='-'>") );
							prevGroup	= itemColor.group;
						}


						elem.append( $( "<option value='" + itemColor.idColor + "'>" + itemColor.strColorName + "</option>" ) );
					}
				}
			}
		);

		$.fn.extend(
		{
			bindParams : function ( data, convert, bRemoveSpecialTag )
			{
				return this.each(
					function()
					{
						var		thisHtml	= $( this ).html();
						var		newHtml		= "";

						if ( $.isArray( data ) )
						{
							$.each( data, function( i, elem ) { newHtml += $.bindParams( elem, thisHtml, convert, i, bRemoveSpecialTag ); } );
						}
						else
						{
							newHtml		= $.bindParams( data, thisHtml, convert, 0, bRemoveSpecialTag );
						}

						$( this ).html( newHtml );
					}
				);
			}
		,	appendBindParams : function ( data, template, convert, initIndex, RemoveSpecialTag )
			{
				return this.each(
					function()
					{
						var target = $( this );

						if ( $.isArray( data ) )
						{
							$.each( data, function( i, elem ) { target.append( $.bindParams( elem, template, convert, initIndex !== undefined ? initIndex + i : i, bRemoveSpecialTag ) ); } );
						}
						else
						{
							target.append( $.bindParams( data, template, convert, initIndex !== undefined ? initIndex : 0, bRemoveSpecialTag ) );
						}
					}
				);
			}
		} );

		$.expr[':'].truncated = function(obj) {
		  var $this = $(obj);
		  var $c = $this
		             .clone()
		             .css({display: 'inline', width: 'auto', visibility: 'hidden'})
		             .appendTo('body');

		  var c_width = $c.width();
		  $c.remove();

		  if ( c_width > $this.width() )
		    return true;
		  else
		    return false;
		};
	}( jQuery )
);


 String.prototype.capitalize = function()
	{
		return this.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
	};

String.prototype.endsWith = function( suffix )
	{
		return this.indexOf(suffix, this.length - suffix.length) !== -1;
	};

if (typeof Array.prototype.forEach != 'function')
{
	Array.prototype.forEach = function(callback)
	{
		for (var i = 0; i < this.length; i++)
			callback.apply(this, [this[i], i, this]);
    };
}

var JSON = JSON || {};

JSON.stringify = JSON.stringify || function (obj)
{
	var t = typeof (obj);
	if (t != "object" || obj === null) {

		// simple data type
		if (t == "string") obj = '"'+obj+'"';
		return String(obj);

	}
	else {

		// recurse array or object
		var n, v, json = [], arr = (obj && obj.constructor == Array);

		for (n in obj) {
			v = obj[n]; t = typeof(v);

			if (t == "string") v = '"'+v+'"';
			else if (t == "object" && v !== null) v = JSON.stringify(v);

			json.push((arr ? "" : '"' + n + '":') + String(v));
		}

		return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
	}
};

// implement JSON.parse de-serialization
JSON.parse = JSON.parse || function (str)
{
	if (str === "") str = '""';
	eval("var p=" + str + ";");
	return p;
};

var		_type_info		= [];
var		_type_info_arr	= [];

_type_info.push( 'S' );		_type_info[ 'S' ]	= {		type: "S",	so:	8,	name:	"Set"			,	namePL:	"Sets"				};
_type_info.push( 'P' );		_type_info[ 'P' ]	= {		type: "P",	so:	7,	name:	"Part"			,	namePL:	"Parts"				};
_type_info.push( 'M' );		_type_info[ 'M' ]	= {		type: "M",	so:	6,	name:	"Minifigure"	,	namePL:	"Minifigures"		};
_type_info.push( 'B' );		_type_info[ 'B' ]	= {		type: "B",	so:	5,	name:	"Book"			,	namePL:	"Books"				};
_type_info.push( 'G' );		_type_info[ 'G' ]	= {		type: "G",	so:	4,	name:	"Gear"			,	namePL:	"Gear"				};
_type_info.push( 'C' );		_type_info[ 'C' ]	= {		type: "C",	so:	3,	name:	"Catalog"		,	namePL:	"Catalogs"			};
_type_info.push( 'I' );		_type_info[ 'I' ]	= {		type: "I",	so:	2,	name:	"Instruction"	,	namePL:	"Instructions"		};
_type_info.push( 'O' );		_type_info[ 'O' ]	= {		type: "O",	so:	1,	name:	"Original Box"	,	namePL:	"Original Boxes"	};
_type_info.push( 'U' );		_type_info[ 'U' ]	= {		type: "U",	so:	0,	name:	"Unsorted Lot"	,	namePL:	"Unsorted Lots"		};

_type_info_arr.push( _type_info[ 'S' ] );
_type_info_arr.push( _type_info[ 'P' ] );
_type_info_arr.push( _type_info[ 'M' ] );
_type_info_arr.push( _type_info[ 'B' ] );
_type_info_arr.push( _type_info[ 'G' ] );
_type_info_arr.push( _type_info[ 'C' ] );
_type_info_arr.push( _type_info[ 'I' ] );
_type_info_arr.push( _type_info[ 'O' ] );
_type_info_arr.push( _type_info[ 'U' ] );

function onBLImgError( event, thisElem )
{
	if ( !$.isIE() )
		thisElem.attr( "src", "//static.bricklink.com/clone/img/no_image_err.png" );
}

$.fn.setFeedbackIcon = function (){
	var feedback = $(this).attr('data-feedback');
	var icon = '';
	if (feedback < 10 ){icon = 'zero'}
	else if (feedback < 49 ){icon = 'one'}
	else if (feedback < 99){icon = 'two'}
	else if (feedback < 499){icon = 'three'}
	else if (feedback < 999){icon = 'four'}
	else if (feedback < 2499){icon = 'five'}
	else if (feedback < 4999){icon = 'six'}
	else if (feedback < 9999){icon = 'seven'}
	else if (feedback < 24999){icon = 'eight'}
	else if (feedback < 49999){icon = 'nine'}
	else if (feedback < 100000){icon = 'ten'}
	$(this).after('<a href="//www.bricklink.com/help.asp?helpID=54" target="_blank" class="feedback-stud ' + icon + '"></a>');
}
$.fn.setFeedbackLevel = function (){
	var feedback = $(this).attr('data-feedback');
	var icon = '';
	if (feedback < 10 ){icon = '0'}
	else if (feedback < 49 ){icon = '1'}
	else if (feedback < 99){icon = '2'}
	else if (feedback < 499){icon = '3'}
	else if (feedback < 999){icon = '4'}
	else if (feedback < 2499){icon = '5'}
	else if (feedback < 4999){icon = '6'}
	else if (feedback < 9999){icon = '7'}
	else if (feedback < 24999){icon = '8'}
	else if (feedback < 49999){icon = '9'}
	else if (feedback < 100000){icon = '10'}
	$(this).html(icon);
}

var globalCart = function(cb){
	$.getJSON('//' + _var_clone_host + '/ajax/clone/cart/list.ajax', StoreFront.user.id, function(cartList) {
		// EXCEPTION THING
		// When cart reaches unique lot size of 42, server returns string
		// this is that check and converts it to object like when the lots are under 42.
		if (typeof cartList === 'string') {
			cartList = $.parseJSON(cartList);
		}


		$('.js-global-cart-button').attr('cart-count', cartList.carts.length);
		$('.global-cart-count').html(cartList.carts.length);
		// console.log("globalCart update", cartList)
		var globalCartHTML = '';
		var summaryItems = 0;
		for (var i = 0; i < cartList.carts.length; i++) {
			var cartInfo = cartList.carts[i];
			// console.log("cart total items" ,cartInfo.current_cart.totalItems)
			summaryItems += cartInfo.current_cart.totalItems;
			globalCartHTML += '<a href="//' + _var_www_host + '/store/home.page?p='+ cartInfo.sellerName +'&mode=cart">'
											+ 	'<img class="flag" src="http://www.bricklink.com/images/flagsM/'+ cartInfo.countryID +'.gif">'
											+		'<strong>'+ cartInfo.storeName +' ('+ cartInfo.feedback +')</strong>'
											+		'<span class="rating"></span><br>'
											+		'<span class="caption">'
											+			'<strong>Subtotal: '+ cartInfo.current_cart.totalPrice +'</strong> '
											+			'<span class="items">('+ cartInfo.current_cart.totalItems +' items)</span>'
											+		'</span>'
											+	'</a>';
		}
		var globalCartSummaryHTML 	= '<p class="cart-summary">'
												+		'<span class="fas fa-shopping-cart fa-fw"></span>'
												+		cartList.carts.length +' stores, '+ summaryItems +' items'
												+	'</p>';
		$('.js-global-cart-currents').html(globalCartSummaryHTML + globalCartHTML);
		cb(cartList.carts.length);
	});

}

$(document).ready(function() {
	$('.js-feedback-rating-icon').setFeedbackIcon();
	$('.js-feedback-rating-level').setFeedbackLevel();



	var $cartCurrent 	= $('.js-global-cart-current');
	var $cartLoading 	= $('.js-global-cart-loading');
	var $cartEmpty		= $('.js-global-cart-empty');
		// for updaing the global cart list
	$('.js-global-cart-button').click(function(event) {
		// ytp provides initial value on load -- this checks it
		// value also updated via updateCartlist in as part of adding/updating cart on store pages
		if ($(this).data('cart') > 0){ // if there are carts do function -- otherwise do nothing
			$cartCurrent.empty();
			$cartEmpty.hide()
			$cartLoading.show();
			globalCart(function(cartLength) {
				$cartLoading.hide();
				if (cartLength == 0){
					$cartEmpty.show();
					$cartCurrent.empty();
				}
			})
		}
		//  // prevent empty href from refreshing page or adding # to url
	});
});