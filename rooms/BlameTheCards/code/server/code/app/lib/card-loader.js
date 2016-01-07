'use strict';
const fs = require('fs');
const he = require('he');
const encodeOptions = {
    'allowUnsafeSymbols': false
};

class CardLoader {
    load(game, sources) {
        return Promise.all([
            this.questionPromise(game, sources.questions),
            this.answerPromise(game, sources.answers)
        ]);
    }

    _load(game, list, cb) {
        function readOne(fname) {
            return new Promise((resolve, reject) => {
                fs.readFile(fname, 'utf8', function(err, data) {
                    if (err) {
                        reject(err);
                        return;
                    }
                    const lines = data.split(/\r\n|\r|\n/);
                    console.log(`Read file: ${fname}.  ${lines.length} lines.`);
                    const htmlLines = lines.map(line => he.encode(line, encodeOptions));
                    const filteredLines = htmlLines.filter(line => line.trim() !== '');
                    cb.call(game, filteredLines);
                    resolve();
                });
            });
        }

        return new Promise(function(resolve, reject) {
            const pmis = list.map(readOne);
            Promise.all(pmis).then(resolve).catch(err => reject(err));
        });

    }

    questionPromise(game, list) {
        return this._load(game, list, game.loadQuestionCards);
    }

    answerPromise(game, list) {
        return this._load(game, list, game.loadAnswerCards);
    }
}

exports = module.exports = new CardLoader();
