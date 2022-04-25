"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var better_sqlite3_1 = __importDefault(require("better-sqlite3"));
var database = new better_sqlite3_1.default("./database.sqlite", {});
exports.default = database;
//# sourceMappingURL=database.js.map