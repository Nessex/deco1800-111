var BASE_URL = "/api";

/**
 * @param {array<string>} tags - an array of tags to search for
 * @param {array<string>} reactions - an array of reactions to sort by
 * @param {int} offset - result number offset (for pagination)
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

var getWorkItem = function(workId) {
    return $.get({
        url: `${BASE_URL}/work`,
        data: {
            'work': workId
        },
        dataType: "json"
    });
};
