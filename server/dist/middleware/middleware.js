"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
function authMiddleware(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const authHeader = req.headers.authorization;
        // Check for Authorization header and Bearer scheme
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(403).json("Authorization header missing or invalid format");
            return; // Exit after sending response
        }
        const token = authHeader.split(' ')[1];
        try {
            // Verify the token
            const decoded = jsonwebtoken_1.default.verify(token, config_1.default);
            req.userId = decoded.userId;
            next(); // Proceed to next middleware
        }
        catch (error) {
            // Handle token verification errors
            res.status(401).json({ message: "Not authenticated" });
            return; // Exit after sending response
        }
    });
}
