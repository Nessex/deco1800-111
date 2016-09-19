/* Things that need to be run after the page loads, on every page */

$(".autoemoji").each(function() {
    $(this).html(emojione.shortnameToImage($(this).html()));
});
