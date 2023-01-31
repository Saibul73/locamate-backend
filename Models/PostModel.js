import mongoose from 'mongoose';
const { ObjectId } = mongoose.Schema;

const postSchema = mongoose.Schema(
  {
    // userId: {
    //   type: String,
    //   required: true },
    userId: {
      type: ObjectId,
      ref: 'Users',
      required: true
    },
    desc: String,
    likes: [],
    image: String,
    comments:[{
      commentedUser:{
          type:String,
          required: true
      },
      comment:{
          type:String,
          required:true
      },
      time:{
          type: Date,
          required: true
      },
      user:{
          type:ObjectId,
          required:true
      }
  }]
  },
  {
    timestamps: true
  }
);

var PostModel = mongoose.model('Posts', postSchema);

export default PostModel;
