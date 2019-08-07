// Mobile navigation toggle
$('#nav-icon-menu').click(function(){
    $(this).toggleClass('open');
    $('body').toggleClass('navigation-opened');
});


// Add the 'external' class to every outbound link on the site.
// The css will add a small right arrow after the link.
$('a').filter(function() {
   return this.hostname && this.hostname !== location.hostname;
}).addClass("external");

// Remove external mark on Octocat icons, that already look external enough.
$("i.fa-github-alt").parent().removeClass("external");


// Prettyprint
$('pre').addClass("prettyprint");
$.getScript("/libs/prettify/js/run_prettify.js", function(){});
$.getScript("/libs/prettify/js/lang-css.js", function(){});
$.getScript("/libs/prettify/js/lang-go.js", function(){});
$.getScript("/libs/prettify/js/lang-proto.js", function(){});
$.getScript("/libs/prettify/js/lang-swift.js", function(){});
$.getScript("/libs/prettify/js/lang-yaml.js", function(){});


var initialHeadHeight = $("#header").innerHeight();
var tocNav = $('#toc');
var headerFixPosition = $(".nav-hero-container").innerHeight();
var tocNavFixedPosition = 120; // Sticky TOC offset


$(function() {
    expandItemOnHashChange();
    preventDefaultScroll();
    initTocTocify();
    showScrollTopBtn();
    addCollapseAttr();
    expandNavigation();
    openNavLinkInNewTab();
});

jQuery(window).on('load', function() {
    scrollToAnchor();
    ifCookiesExist();
    tocHeight();
});

// Make functions works immediately on hash change
window.onhashchange = function() {
    expandItemOnHashChange();
    scrollToAnchor();
};

window.onscroll = function() {
    fixToc();
    fixHead();
    tocHeight();
    showScrollTopBtn();
};

$(window).resize(function() {
    resizeTocHeightWithWindow();
    ifCookiesExist();
});

/**
 * Inits `toc` navigation if a page has more than 2 headers.
 *
 * @see {@link http://gregfranko.com/jquery.tocify.js/ Toc Tocify}
 */
function initTocTocify() {
    const docsContainer = $(".docs-content");
    const headersQuantity = docsContainer.find("h2, h3, h4");
    const topOffset = 12; // Offset from the `header` navigation

    if (headersQuantity.length >= 3) {
        tocNav.tocify({
            selectors: "h2, h3, h4",
            showAndHide: false,
            scrollTo: initialHeadHeight + topOffset,
            extendPage: false
        });
    }
}

// Fix TOC navigation on page while scrolling
function fixToc() {
    if (tocNav.length) {
        if (window.pageYOffset > tocNavFixedPosition) {
            tocNav.addClass("sticky");
        }
        else {
            tocNav.removeClass("sticky");
        }
    }
}

// Animation header on scroll
function fixHead() {
    var header = $('#header');
    if (header.length) {
        if (window.pageYOffset > headerFixPosition) {
            header.addClass("not-top"); // When navigation below offset
            header.addClass("pinned"); // When navigation below hero section
            header.removeClass("unpinned");
        }
        else {
            header.removeClass("pinned");
            header.addClass("unpinned");
        }

        // Return classes to the initial state when the navigation at the top of the page
        if (window.pageYOffset < initialHeadHeight) {
            header.removeClass("not-top");
            header.removeClass("unpinned");
        }
    }
}

function tocHeight() {
    if (tocNav.length) {
        var windowHeight = $(window).height();
        var scrollPosition = $(window).scrollTop();
        var footerTopPoint = $(".footer").position().top;
        var cookieContainerHeight = $("#cookieChoiceInfo").innerHeight();
        var contentMarginBottom = 60; /* The distance from the TOC to the bottom of the window. The value the same
        as a docs content. So the content and the TOC will be ended at the same line */

        /* Initial TOC max-height when the scroll at the top or middle of the page */
        var initialTocHeight = windowHeight - tocNavFixedPosition - contentMarginBottom - cookieContainerHeight;

        /* Dynamic value that changes on scroll. When the scroll at the bottom of the page, TOC height decreases. */
        var maxHeightValue = footerTopPoint - scrollPosition - tocNavFixedPosition - contentMarginBottom;


        /*The max-height value can be bigger than browser window if the scroll at the top of page.
        * So here is added the check*/
        if (maxHeightValue < initialTocHeight) {
            $(tocNav).css('max-height', maxHeightValue);
        }

        else {
            $(tocNav).css('max-height', initialTocHeight);
        }
    }
}

// Resize TOC height when window height is changing
function resizeTocHeightWithWindow() {
    if ($(window).height() > 600) {
        tocHeight();
    }
}

// Expand FAQ item on hash change
function expandItemOnHashChange() {
    if ("onhashchange" in window) {
        $(location.hash).collapse('show');
    }
}

// Prevent default scroll and double click on the same hash
function preventDefaultScroll() {
    $('.anchor-link').click(function(event) {
        var anchor = $(this).attr("href");
        var x = window.pageXOffset;
        var y = window.pageYOffset;
        event.preventDefault();
        window.location.hash = anchor;
        window.scrollTo(x, y);
    });
}

function scrollToAnchor() {
    var anchor = location.hash;
    var offset = -150; // Top offset for move header below fixed header

    if ($(anchor).length) {
        $(window).scrollTo($(anchor), 500, {offset: offset});
    }
}


var goTopBtn = $("#go-top-btn");
var copyrightEl = $(".copyright");

/**
 * Adds additional padding values if the `cookieChoiceInfo` exist on the page.
 */
function ifCookiesExist() {
    var cookieInfo = $("#cookieChoiceInfo");
    var cookieAgreeBtn = $("#cookieChoiceDismiss");
    var cookieContainerHeight = cookieInfo.innerHeight();
    var marginBottom = 10; // A bottom margin for the `Go to Top` button
    var copyrightPaddingBottom = 24; // A bottom padding for the `Copyright` div element

    if(cookieInfo.length){
        $(goTopBtn).css('bottom', cookieContainerHeight + marginBottom);
        $(copyrightEl).css('padding-bottom', cookieContainerHeight + copyrightPaddingBottom);

        /**
         * Removes additional padding values on the `Agree` button click.
         */
        $(cookieAgreeBtn).click(function(){
            $(goTopBtn).css('bottom', marginBottom);
            $(copyrightEl).css('padding-bottom', copyrightPaddingBottom);
        });
    }

    else {
        $(goTopBtn).css('bottom', marginBottom);
        $(copyrightEl).css('padding-bottom', copyrightPaddingBottom);
    }
}

// When the user scrolls down 1500px from the top of the document, show the button ”Go to Top“
function showScrollTopBtn() {
    if ($(this).scrollTop() > 1500 ) {
        $(goTopBtn).show();

    } else {
        $(goTopBtn).hide();
    }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
    $("html, body").stop().animate({scrollTop: 0}, 500, 'swing'); return false;
}

/**
 * Adds a `data-toggle: collapse` attribute to the link if a `<li>` element has a child `<ul>` sub-menu.
 * Uses only for the document side navigation.
 *
 * <p>Also, adds `tree-title` and `collapsed` classes that is needed to style opened and collapsed states.
 * Styles you can find in the `sass/modules/doc-nav.scss`file.
 */
function addCollapseAttr() {
    const $collapsibleTitleLink = $('ul.docs-side-nav li ul').siblings('a');
    $collapsibleTitleLink.attr('data-toggle', 'collapse');
    $collapsibleTitleLink.addClass('tree-title collapsed');
}

/**
 * Expands docs side-navigation to show currently active page.
 *
 * <p>When the user clicks on the link in the side navigation, the page reloads and the navigation collapses.
 * To avoid this the navigation will be expanded automatically when the page is reloaded.
 */
function expandNavigation() {
    const activeElementContainer = $('.sub-nav a.active').parents('.sub-nav');
    activeElementContainer.addClass('show');
    activeElementContainer.prev('.side-nav-link.collapsed').removeClass('collapsed');
}

/**
 * Opens a docs navigation links in a new tab if they have an external `href`.
 */
function openNavLinkInNewTab() {
    $('.side-nav-link.external').attr('target', '_blank');
}

/**
 * Adds the body class `docs-side-navigation-opened`.
 *
 * <p>By clicking on the `docs-side-nav-toggle` the CSS will open a documents side navigation
 * as a full page above the content. It will be available for mobile devices only.
 */
$('#docs-side-nav-toggle').click(function(){
    $('body').addClass('docs-side-navigation-opened');
});

/**
 * Removes the body class `docs-side-navigation-opened`.
 *
 * <p>By clicking on the `close-btn` the CSS will hide the document side navigation.
 */
$('.navigation-title-on-mobile a.close-btn').click(function(){
    $('body').removeClass('docs-side-navigation-opened');
});
