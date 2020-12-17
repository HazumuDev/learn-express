const app = require('express')();
const mysql = require("mysql");
const config = require("config");
const springf = require("sprintf-js").sprintf;
const log = require("../libs/log.js");
const date = require("date-utils");

const express = require("express");

module.exports = {
    connection: null,
    connect: () => {
        this.connection = mysql.createConnection(config.db);
        this.connection.connect();
    },
    errorHandler: (err) => {
        if (err) {
            throw new Error(err);
        }
    },
    query: (query, params, callback) => {
        log.app(`${query}\n[${params}]`);
        this.connection.query(query, params, callback);
    },
    getOne: (query, params, callback) => {
        const self = this;
        this.query (query, params, (err, rows) => {
            self.errorHandler(err);
            callback(rows.length < 1 ? null : row[0]);
        });
    },
    getAll: (query, params, callback) => {
        const self = this;
        this.query (query, params, (err, rows) => {
            self.errorHandler(err);
            callback(rows);
        });
    },
    insert: (table, data, callback) => {
        const self = this;
        const query = `INSERT INTO ${table} set ?`;
        this.query(query, data, (err, result, fields) => {
            self.errorHandler(err);
            callback(result.insertId);
        });
    },
    update: (table, data, id,  callback) => {
        const fields = "",
              params = [];
        for(const k in data) {
            fields += k + " = ?, ";
            params.push(data[k]);
        }

        fields = fields.substr(0, fields.length - 1);
        params.push(id);

        const self = this;
        const query = `UPDATE ${table} SET ${fields} WHERE id = ?`;
        this.query(query, data, (err, result, fields) => {
            self.errorHandler(err);
            callback(result);
        });
    }
};