'use strict';

/* Stolen, without shame, from
https://davidwalsh.name/pubsub-javascript
*/

const events = (function() {
    let topics = {};
    let hOP = topics.hasOwnProperty.bind(topics);

    return {
        subscribe: function(topic, listener) {
            // Create the topic's object if not yet created
            if (!hOP(topic)) {
                topics[topic] = [];
            }

            // Add the listener to queue
            let index = topics[topic].push(listener) - 1;

            // Provide handle back for removal of topic
            return {
                remove: function() {
                    delete topics[topic][index];
                }
            };
        },
        publish: function(topic, info) {
            // If the topic doesn't exist, or there's no listeners in queue, just leave
            /* istanbul ignore if */
            if (!hOP(topic)) {
                return;
            }

            // Cycle through topics queue, fire!
            topics[topic].forEach(function(item) {
                item(info ? info : /* istanbul ignore next */ {});
            });
        }
    };
})();

exports = module.exports = events;
