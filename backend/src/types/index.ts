export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: string;
  passwordResetToken: String;
  passwordResetExpires: Date;
  matchPassword(password: string): Promise<string>;
}

export interface ICommunity extends Document {
  name: string;
  description: string;
  admin: mongoose.Types.ObjectId;
  members: mongoose.Types.ObjectId[];
}


export interface IMessage extends Document {
  sender: mongoose.Types.ObjectId;
  community: mongoose.Types.ObjectId;
  content: string;
  createdAt: Date;
}