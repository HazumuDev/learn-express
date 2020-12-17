const db = require("../libs/db.js");
const sprintf = require('sprintf-js').sprintf;

module.exports = {
    getAll: () => {
        return new Promise((resolve, reject) => {
            const query = sprintf(
                "SELECT * FROM test"
            );

            db.getAll(query, [], (row) => {
                resolve(row);
            });
        });
    }
};