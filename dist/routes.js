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
const db_1 = require("./db");
const zod_1 = __importDefault(require("zod"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
const userCreateSchema = zod_1.default.object({
    name: zod_1.default.string(),
    email: zod_1.default.string().email(),
    status: zod_1.default.enum(["Active", "Inactive"]),
    createdDate: zod_1.default.date().optional(),
});
app.post("/users", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const parseResult = userCreateSchema.safeParse(req.body);
        if (!parseResult.success) {
            res.status(400).json({
                message: "Validation failed",
                errors: parseResult.error.errors,
            });
            return;
        }
        const { name, email, status } = parseResult.data;
        const existingUser = yield db_1.User.findOne({ email });
        if (existingUser) {
            res.status(409).json({
                message: "Email already taken",
            });
            return;
        }
        const newUser = new db_1.User({ name, email, status });
        yield newUser.save();
        res.status(201).json({
            message: "User created successfully",
            user: newUser,
        });
    }
    catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({
            message: "Failed to create user",
        });
    }
}));
app.get("/users", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield db_1.User.find();
        res.status(200).json({
            message: "Users fetched successfully",
            users,
        });
    }
    catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({
            message: "Failed to fetch users",
        });
    }
}));
app.get("/users/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const user = yield db_1.User.findById(id);
        if (!user) {
            res.status(404).json({
                message: "User not found",
            });
            return;
        }
        res.status(200).json({
            message: "User fetched successfully",
            user,
        });
    }
    catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({
            message: "Failed to fetch user",
        });
    }
}));
app.put("/users/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const user = yield db_1.User.findById(id);
        if (!user) {
            res.status(404).json({
                message: "User not found"
            });
            return;
        }
        const userupdateSchema = zod_1.default.object({
            name: zod_1.default.string().optional(),
            email: zod_1.default.string().email().optional(),
            status: zod_1.default.enum(["Active", "Inactive"]).optional(),
        });
        const parsedResult = userupdateSchema.safeParse(req.body);
        if (!parsedResult.success) {
            res.status(404).json({
                message: "validation failed",
                errors: parsedResult.error.errors,
            });
            return;
        }
        const updatedData = parsedResult.data;
        Object.assign(user, updatedData);
        yield user.save();
        res.status(200).json({
            message: "User updated successfully",
            user,
        });
    }
    catch (error) {
        console.error("Error Updating User");
        res.status(500).json({
            message: "Failed to update user"
        });
    }
}));
app.delete("/users/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const user = yield db_1.User.findById(id);
        if (!user) {
            res.status(404).json({
                message: "User not found",
            });
            return;
        }
        user.status = "Inactive";
        yield user.save();
        res.status(200).json({
            message: "marked as Inactive successfully(soft deleted)",
            user
        });
    }
    catch (error) {
        console.error("Error in Deleting User:", error);
        res.status(500).json({
            message: "Failed to soft delete user"
        });
    }
}));
const roleCreateSchema = zod_1.default.object({
    name: zod_1.default.string(),
    description: zod_1.default.string(),
});
app.post("/roles", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const parsedResult = roleCreateSchema.safeParse(req.body);
        if (!parsedResult.success) {
            res.status(400).json({
                message: "Validation failed",
                errors: parsedResult.error.errors,
            });
            return;
        }
        const { name, description } = parsedResult.data;
        const existingRole = yield db_1.Role.findOne({ name });
        if (existingRole) {
            res.status(400).json({
                message: "Role already exists",
            });
            return;
        }
        // Create a new role
        const role = new db_1.Role({ name, description });
        yield role.save();
        res.status(201).json({
            message: "Role created successfully",
            role,
        });
    }
    catch (error) {
        console.error("Error creating role:", error);
        res.status(500).json({
            message: "Failed to create role",
        });
    }
}));
app.get("/roles", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const roles = yield db_1.Role.find();
        res.status(200).json({
            message: "Roles listed successfully",
            roles,
        });
    }
    catch (error) {
        console.error("Error while fetching the roles:", error);
        res.status(500).json({
            message: "Failed to fetch roles",
        });
    }
}));
app.get("/roles/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const role = yield db_1.Role.findById(id);
        if (!role) {
            res.status(404).json({
                message: "Role not found",
            });
            return;
        }
        res.status(200).json({
            message: "Role fetched successfully",
            role,
        });
    }
    catch (error) {
        console.error("Error fetching role:", error);
        res.status(500).json({
            message: "Failed to fetch role",
        });
    }
}));
app.put("/roles/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const role = yield db_1.Role.findById(id);
        if (!role) {
            res.status(404).json({
                message: "Role not found",
            });
            return;
        }
        const roleUpdateSchema = zod_1.default.object({
            name: zod_1.default.string().optional(),
            description: zod_1.default.string().optional(),
        });
        const parsedResult = roleUpdateSchema.safeParse(req.body);
        if (!parsedResult.success) {
            res.status(400).json({
                message: "Validation failed",
                errors: parsedResult.error.errors,
            });
            return;
        }
        const updatedRole = parsedResult.data;
        Object.assign(role, updatedRole);
        yield role.save();
        res.status(200).json({
            message: "Role updated successfully",
            role,
        });
    }
    catch (error) {
        console.error("Error updating role:", error);
        res.status(500).json({
            message: "Failed to update role",
        });
    }
}));
app.delete("/roles/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const role = yield db_1.Role.findById(id);
        if (!role) {
            res.status(404).json({
                message: "role not found"
            });
            return;
        }
        yield role.deleteOne();
        res.status(200).json({
            message: "role deleted successfully"
        });
    }
    catch (error) {
        console.error("Error deleting role:", error);
        res.status(500).json({
            message: "Failed to delete role",
        });
    }
}));
app.post("/user-roles", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, roleId } = req.body;
        // Validate the user and role IDs
        const user = yield db_1.User.findById(userId);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        const role = yield db_1.Role.findById(roleId);
        if (!role) {
            res.status(404).json({ message: "Role not found" });
            return;
        }
        // Check if the assignment already exists
        const existingAssignment = yield db_1.UserRoleAssignment.findOne({ userId, roleId });
        if (existingAssignment) {
            res.status(409).json({ message: "Role already assigned to the user" });
            return;
        }
        // Create a new user-role assignment
        const newAssignment = new db_1.UserRoleAssignment({ userId, roleId });
        yield newAssignment.save();
        res.status(201).json({
            message: "Role assigned to user successfully",
            userRoleAssignment: newAssignment,
        });
    }
    catch (error) {
        console.error("Error assigning role to user:", error);
        res.status(500).json({ message: "Failed to assign role to user" });
    }
}));
app.get("/user-roles", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, roleId } = req.query;
        const filter = {};
        if (userId)
            filter.userId = userId;
        if (roleId)
            filter.roleId = roleId;
        const assignments = yield db_1.UserRoleAssignment.find(filter)
            .populate("userId", "name email status")
            .populate("roleId", "name description");
        res.status(200).json({
            message: "User-role assignments fetched successfully",
            assignments,
        });
    }
    catch (error) {
        console.error("Error fetching user-role assignments:", error);
        res.status(500).json({ message: "Failed to fetch user-role assignments" });
    }
}));
app.delete("/user-roles/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        // Check if the user-role assignment exists
        const assignment = yield db_1.UserRoleAssignment.findById(id);
        if (!assignment) {
            res.status(404).json({ message: "User-role assignment not found" });
            return;
        }
        // Delete the user-role assignment
        yield assignment.deleteOne();
        res.status(200).json({
            message: "User-role assignment removed successfully",
        });
    }
    catch (error) {
        console.error("Error removing user-role assignment:", error);
        res.status(500).json({ message: "Failed to remove user-role assignment" });
    }
}));
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
