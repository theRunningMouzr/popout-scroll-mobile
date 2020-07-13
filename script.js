(function() {

    if (document.querySelector('#popout__container') !== null) {

        // fill out these variables with your desired parameters
        const cookieName = 'cookie-name'; // name of the cookie *string
        const cookieValue = 'shown'; // value of the cookie *string
        const cookieAge = 30; // *number in days
        const scrollTarget = 1000; // *number in pixels
        const imageSource = '#'; // link image source *string
        const imageLink = '#'; // URL where click on the image itself leads *string

        let scrollPosition = 0;
        let popoutExists = false;
        let isPopoutAllowed;


        // ===================================
        // FUNCTIONS
        // ===================================

        const addPopoutHTML = function() {
            if (isPopoutAllowed) {
                document.getElementById('popout__container').innerHTML = '<div id="popout" class="popout"><div class="popout__close-btn"><span id="popout__close-btn-1">&nbsp;</span><span id="popout__close-btn-2">&nbsp;</span></div><a href="' + imageLink + '" class="popout__link"><div class="popout__img"><img src="' + imageSource + '" alt="image"></div></a></div>';

                popoutExists = true;
            }
        };

        const removePopout = function() {
            if (popoutExists) {
                var popout = document.getElementById('popout');
                popout.parentNode.removeChild(popout);

                popoutExists = false;
            }
        };

        const createCookie = function(name, value, age) {
            age = age * 86400; // for days (max age is in seconds)
            document.cookie = name + '=' + value + '; max-age=' + age + '; SameSite=Strict; path=/';
        };

        const killPopoutAndSetCookie = function() {
            removePopout();
            isPopoutAllowed = false;
            createCookie(cookieName, cookieValue, cookieAge);
        };

        const scrollLogic = function() {
            scrollPosition = window.scrollY;
            if (scrollPosition >= scrollTarget && !popoutExists) {
                addPopoutHTML();
            }

            if (scrollPosition < scrollTarget && popoutExists) {
                removePopout();
            }

            if (popoutExists) {
                document.querySelector('.popout__close-btn').addEventListener('click', killPopoutAndSetCookie);
                document.querySelector('.popout__link').addEventListener('click', killPopoutAndSetCookie);
            }
        };

        const checkForCookie = function() {
            if (document.cookie.split(';').some(function(item) {
                    return item.trim().indexOf(cookieName + '=') == 0;
                })) {
                isPopoutAllowed = false;
            } else {
                isPopoutAllowed = true;
            }
        };

        const popoutNoDesktop = function() {
            if (window.innerWidth >= 600) {
                isPopoutAllowed = false;
                if (popoutExists) {
                    removePopout();
                }
            } else {
                if (checkForCookie()) {
                    isPopoutAllowed = true;
                }
            }
        };


        // ===================================
        // EVENTS AND INIT
        // ===================================
        checkForCookie();

        document.addEventListener('DOMContentLoaded', popoutNoDesktop);

        window.addEventListener('scroll', scrollLogic);

        window.addEventListener('resize', popoutNoDesktop);
    }

})();