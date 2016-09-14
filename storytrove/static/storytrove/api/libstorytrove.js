var BASE_URL = "/api";

/**
 * @param {array<string>} tags - an array of tags to search for
 * @param {array<string>} reactions - an array of reactions to sort by
 * @return {object} - A jQuery.get() response. Can use like search([],[]).done(fn) etc.
 */
var search = function(tags, reactions, offset) {
    var data = {
        tags: tags.join(","),
        reactions: reactions.join(","),
        offset: offset || 0
    };

    return $.get({
        url: `${BASE_URL}/prompts`,
        data: data,
        dataType: "json"
    });
};
