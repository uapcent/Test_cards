function msgLinkAlert( targetUrl )
{
    var _inBrickLink = /^https?:\/\/\w+\.(bricklink.com|lego.com)\//.test( targetUrl.toLowerCase() );
    if ( _inBrickLink 
        || confirm( 'You are about to follow a link that leads outside of our platform. Be careful! External sites may attempt phishing or misuse your information. Proceed only if you trust the destination' ) ) 
    { 
        window.open( targetUrl, '_blank' );  
    } 
}

