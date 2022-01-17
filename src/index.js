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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var ioredis_1 = __importDefault(require("ioredis"));
var cacheMiddleware = /** @class */ (function () {
    function cacheMiddleware(options) {
        autoBind(this);
        this.instances = options.instances;
        this.redisClient = new ioredis_1.default(options.redisOptions);
    }
    cacheMiddleware.prototype.handle = function (params, next) {
        return __awaiter(this, void 0, void 0, function () {
            var result, _i, _a, instance, cacheKey, findCache, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        result = null;
                        _i = 0, _a = this.instances;
                        _c.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 11];
                        instance = _a[_i];
                        if (!(instance.model === params.model && instance.action === params.action)) return [3 /*break*/, 10];
                        cacheKey = "" + (instance.keyPrefix ? instance.keyPrefix + '-' : '') + params.model + ":" + params.action + ":" + JSON.stringify(params.args);
                        return [4 /*yield*/, this.redisClient.get(cacheKey)];
                    case 2:
                        findCache = _c.sent();
                        if (!findCache) return [3 /*break*/, 3];
                        result = JSON.parse(findCache);
                        return [3 /*break*/, 9];
                    case 3: return [4 /*yield*/, next(params)];
                    case 4:
                        result = _c.sent();
                        if (!instance.ttl) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.redisClient.set(cacheKey, JSON.stringify(result), 'EX', instance.ttl)];
                    case 5:
                        _b = _c.sent();
                        return [3 /*break*/, 8];
                    case 6: return [4 /*yield*/, this.redisClient.set(cacheKey, JSON.stringify(result))];
                    case 7:
                        _b = _c.sent();
                        _c.label = 8;
                    case 8:
                        _b;
                        _c.label = 9;
                    case 9: return [3 /*break*/, 11];
                    case 10:
                        _i++;
                        return [3 /*break*/, 1];
                    case 11:
                        if (!!result) return [3 /*break*/, 13];
                        return [4 /*yield*/, next(params)];
                    case 12:
                        result = _c.sent();
                        _c.label = 13;
                    case 13: return [2 /*return*/, result];
                }
            });
        });
    };
    return cacheMiddleware;
}());
var getAllProperties = function (object) {
    var properties = new Set();
    do {
        for (var _i = 0, _a = Reflect.ownKeys(object); _i < _a.length; _i++) {
            var key = _a[_i];
            properties.add([object, key]);
        }
    } while ((object = Reflect.getPrototypeOf(object)) && object !== Object.prototype);
    return properties;
};
function autoBind(self) {
    //@ts-ignore
    for (var _i = 0, _a = getAllProperties(self.constructor.prototype); _i < _a.length; _i++) {
        var _b = _a[_i], object = _b[0], key = _b[1];
        if (key === 'constructor') {
            continue;
        }
        var descriptor = Reflect.getOwnPropertyDescriptor(object, key);
        if (descriptor && typeof descriptor.value === 'function') {
            self[key] = self[key].bind(self);
        }
    }
    return self;
}
function prismaCacheMiddleware(options) {
    return new cacheMiddleware(options).handle;
}
exports.default = prismaCacheMiddleware;
