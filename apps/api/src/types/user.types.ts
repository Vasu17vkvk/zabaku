export interface IUser {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    avatar: string;
    role: "Owner" | "Admin" | "Member";
    isVerified: boolean;
    lastLogin: Date | null;

    comparePassword(candidatePassword: string): Promise<boolean>;
}