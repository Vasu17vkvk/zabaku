import bcrypt from "bcrypt";
import { LoginUserDto } from "../dtos/auth/LoginUser.dto";
import { generateToken } from "../utils/generateToken";
import { User } from "../models/User";
import { AppError } from "../errors/AppError";
import { RegisterUserDto } from "../dtos/auth/RegisterUser.dto";

export async function registerUser(data: RegisterUserDto) {
    const { firstName, lastName, email, password } = data;

    // Check if email already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
        throw new AppError("User already exists", 409);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
    });

    const safeUser = await User.findById(user._id);

    return safeUser;
}
export async function loginUser(data: LoginUserDto) {
    const { email, password } = data;

    // Find the user and include the password
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        throw new AppError("Invalid email or password", 401);
    }

    // Compare passwords
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
        throw new AppError("Invalid email or password", 401);
    }

    // Generate JWT
    const token = generateToken(user._id.toString());

    // Remove password before returning
    const safeUser = await User.findById(user._id);

    return {
        token,
        user,
    };
}