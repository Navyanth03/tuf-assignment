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
const express_1 = __importDefault(require("express"));
const zod_1 = require("zod");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
const middleware_1 = require("../middleware/middleware");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Define Zod schemas
const signupSchema = zod_1.z.object({
    userName: zod_1.z.string(),
    password: zod_1.z.string().min(6)
});
const signinSchema = zod_1.z.object({
    userName: zod_1.z.string(),
    password: zod_1.z.string().min(6)
});
const router = express_1.default.Router();
router.use(express_1.default.json());
router.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parseResult = signupSchema.safeParse(req.body);
    console.log(parseResult);
    if (!parseResult.success) {
        return res.status(411).json("already taken / Incorrect inputs");
    }
    const { userName, password } = parseResult.data;
    const userExists = yield prisma.admin.findFirst({
        where: {
            userName
        }
    });
    if (userExists) {
        return res.status(411).json("Email already taken / Incorrect inputs");
    }
    try {
        const userDB = yield prisma.admin.create({
            data: {
                userName, password
            }
        });
        console.log(userDB);
        const token = jsonwebtoken_1.default.sign({ userName }, config_1.default);
        return res.status(201).json({ message: "User created successfully", token });
    }
    catch (error) {
        return res.status(411).json("Error creating user");
    }
}));
router.post('/signin', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parseResult = signinSchema.safeParse(req.body);
    if (!parseResult.success) {
        return res.status(411).json('Send valid credentials');
    }
    const { userName, password } = parseResult.data;
    const userDB = yield prisma.admin.findFirst({ where: { userName, password } });
    if (!userDB) {
        return res.status(411).json({ message: "Error while logging in" });
    }
    const token = jsonwebtoken_1.default.sign({ userName }, config_1.default);
    return res.status(201).json({ token });
}));
router.get('/authenticate', middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.status(200).json("logged in successfully");
}));
exports.default = router;
