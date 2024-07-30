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
exports.ready = exports.redisClient = exports.getMongoose = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
const mongoose_1 = __importDefault(require("mongoose"));
exports.getMongoose = mongoose_1.default;
const mongoConnect = () => {
    const { NODE_ENV, MONGO_HOST, MONGO_ACCESS_USER, MONGO_ACCESS_PASSWORD, MONGO_PORT, MONGO_DATABASE } = process.env;
    console.log('dasdadasdsd' + NODE_ENV);
    const mongoURI = NODE_ENV === 'production' ?
        `mongodb+srv://${MONGO_ACCESS_USER}:${encodeURIComponent(MONGO_ACCESS_PASSWORD)}@${MONGO_HOST}/${MONGO_DATABASE}` :
        `mongodb://${MONGO_ACCESS_USER}:${encodeURIComponent(MONGO_ACCESS_PASSWORD)}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DATABASE}`;
    // Throw mongoose error if querying fields aren't defined
    mongoose_1.default.set('strictQuery', true);
    return mongoose_1.default.connect(mongoURI);
};
exports.redisClient = (() => {
    const { REDIS_HOST, REDIS_PORT } = process.env;
    return new ioredis_1.default(`redis://${REDIS_HOST}:${REDIS_PORT}`);
})();
const redisConnect = () => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        exports.redisClient.on('connect', () => {
            resolve();
        });
        exports.redisClient.on('error', (err) => {
            reject(err);
        });
    });
});
exports.ready = Promise.all([
    mongoConnect(),
    // redisConnect()
]);
//# sourceMappingURL=database.js.map