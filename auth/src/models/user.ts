import mongoose from 'mongoose';

/*  An interface that describes the properties
    that are requried to create a new User */
interface UserAttrs {
  email: string;
  password: string;
}

/*  An inteface that describes the properties
    that a User Model has */
interface UserModel extends mongoose.Model<any> {
  build(attrs: UserAttrs): any;
}

const userShema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

userShema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

const User = mongoose.model<any, UserModel>('User', userShema);

export { User };
