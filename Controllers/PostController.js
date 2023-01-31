import PostModel from '../Models/PostModel.js';
import mongoose from 'mongoose';
import UserModel from '../Models/UserModel.js';

// Create new Post

export const createPost = async (req, res) => {
  const newPost = new PostModel(req.body);

  try {
    await newPost.save();
    res.status(200).json(newPost);
  } catch (error) {
    res.status(500).json(error);
  }
};

// Get a post

export const getPost = async (req, res) => {
  const id = req.params.id;

  try {
    const post = await PostModel.findById(id);
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json(error);
  }
};

// Update post

export const updatePost = async (req, res) => {
  const postId = req.params.id;
  const { userId } = req.body;

  try {
    const post = await PostModel.findById(postId);

    if (post.userId === userId) {
      await post.updateOne({ $set: req.body });
      res.status(200).json('Post Updated');
    } else {
      res.status(403).json('Action forbidden');
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

// Delete a post

export const deletePost = async (req, res) => {
  const postId = req.params.id;
  const userId = req.params.userId;

  try {
    const post = await PostModel.findById(postId);
    if (userId == post.userId) {
      await post.deleteOne();
      res.status(200).json('Post deleted successfully');
    } else {
      res.status(403).json('Action forbidden');
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

// LIke/dislike

export const likePost = async (req, res) => {
  const id = req.params.id;
  const { userId } = req.body;

  try {
    const post = await PostModel.findById(id);
    if (!post.likes.includes(userId)) {
      await post.updateOne({ $push: { likes: userId } });
      res.status(200).json('post liked');
    } else {
      await post.updateOne({ $pull: { likes: userId } });
      res.status(200).json('post unliked');
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

// comment on post

export const addComment = async (req, res) => {
  const { comment } = req.body;
  const id = req.params.id;

  const commentData = await PostModel.findOneAndUpdate(
    { _id: id },
    { $push: { comments: comment } }
  );
  res.status(200).json({data:'coment added sucess'})
};

// delete a comment

export const deleteComment = async (req, res) => {
  const postId = req.params.postId;
  const commentId = req.params.commentId;
  try {
    const post = await PostModel.findOneAndUpdate(
      { _id: postId },
      {
        $pull: {
          comments: {
            _id: commentId
          }
        }
      }
    );
    res.status(200).json({data:"comment successfully deleted"})
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

// Get timeline posts

export const getTimeLine = async (req, res) => {
  const userId = req.params.id;

  try {
   
    const currentUserPosts = await PostModel.find({ userId: userId }).lean();
    const followingPosts = await UserModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(userId)
        }
      },
      {
        $lookup: {
          from: 'posts',
          localField: 'following',
          foreignField: 'userId',
          as: 'followingPosts'
        }
      },
      {
        $project: {
          followingPosts: 1,
          _id: 0
        }
      }
    ])

    res.status(200).json(
      currentUserPosts.concat(...followingPosts[0].followingPosts).sort((a, b) => {
        return b.createdAt - a.createdAt;
      })
    );
    // res.status(200).json(timeLinePost);
  } catch (error) {
    res.status(500).json(error);
  }
};
export const fetchComment=async(req,res)=>{
  const id=req.params.id;
  const data=await PostModel.findOne({_id:id},{comments:1});
  res.status(200).json({datas:data});
}
