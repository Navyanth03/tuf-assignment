"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const admin_1 = __importDefault(require("./admin"));
const banner_1 = __importDefault(require("./banner"));
const router = express_1.default.Router();
router.use('/admin', admin_1.default);
router.use('/banner', banner_1.default);
exports.default = router;
