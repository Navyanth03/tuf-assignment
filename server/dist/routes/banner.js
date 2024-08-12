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
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Define Zod schemas
const signupSchema = zod_1.z.object({
    isVisible: zod_1.z.boolean(),
    title: zod_1.z.string(),
    timer: zod_1.z.number(),
    link: zod_1.z.string(),
});
const router = express_1.default.Router();
router.use(express_1.default.json());
router.post('/putbanner', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parseResult = signupSchema.safeParse(req.body);
    if (!parseResult.success) {
        return res.status(411).json("already taken / Incorrect inputs");
    }
    const { isVisible, title, timer, link } = parseResult.data;
    try {
        const newBanner = yield prisma.banner.create({
            data: {
                isVisible, title, timer, link
            }
        });
        return res.status(201).json({ message: "User created successfully" });
    }
    catch (error) {
        return res.status(411).json("Error creating user");
    }
}));
router.get('/getbanner', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newBanner = yield prisma.banner.findFirst({
            where: {
                id: 1
            }
        });
        return res.status(201).json({ newBanner });
    }
    catch (error) {
        return res.status(411).json("Error fecthing banner");
    }
}));
router.post('/updatebanner', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parseResult = signupSchema.safeParse(req.body);
    if (!parseResult.success) {
        return res.status(411).json("Incorrect inputs");
    }
    const { isVisible, title, timer, link } = parseResult.data;
    try {
        const newBanner = yield prisma.banner.update({
            where: { id: 1 },
            data: {
                isVisible, title, timer, link
            }
        });
        return res.status(201).json({ newBanner });
    }
    catch (error) {
        return res.status(411).json("Error updating banner");
    }
}));
exports.default = router;
