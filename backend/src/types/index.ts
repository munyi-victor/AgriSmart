export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: string;
  passwordResetToken: String;
  passwordResetExpires: Date;
  matchPassword(password: string): Promise<string>;
}