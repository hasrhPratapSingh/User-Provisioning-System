"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoleAssignment = exports.Role = exports.User = void 0;
const mongoose_1 = __importStar(require("mongoose"));
mongoose_1.default.connect('mongodb+srv://harshranabrosam:EXjVxfZpZCzSZQ44@cluster0.zcucq.mongodb.net/');
const userSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    status: { type: String, enum: ["Active", "Inactive"], default: 'Active' },
    createdDate: { type: Date, default: Date.now }
});
exports.User = mongoose_1.default.model('User', userSchema);
const roleSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String, }
});
exports.Role = mongoose_1.default.model('Role', roleSchema);
const userroleassignmentSchema = new mongoose_1.default.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    roleId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Role', required: true },
    assignedDate: { type: Date, default: Date.now },
});
exports.UserRoleAssignment = mongoose_1.default.model('UserRoleAssignment', userroleassignmentSchema);
