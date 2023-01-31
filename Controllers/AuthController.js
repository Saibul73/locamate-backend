import UserModel from '../Models/UserModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

//sign UP

export const registerUser = async (req, res) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPass = await bcrypt.hash(req.body.password, salt);

  req.body.password = hashedPass;
  const newUser = new UserModel(req.body);
  const { username } = req.body;
  try {
    const oldUser = await UserModel.findOne({ username });
    if (oldUser) {
      return res.status(400).json({ message: 'Username is already exists!' });
    }

    const user = await newUser.save();

    const token = jwt.sign(
      {
        username: user.username,
        id: user._id
      },
      process.env.JWT_KEY,
      { expiresIn: '1h' }
    );
    res.status(200).json({ user, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login user

export const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await UserModel.findOne({ username: username });
    if (user) {
      const validity = await bcrypt.compare(password, user.password);

      if (!validity) {
        res.status(400).json({ message: 'Wrong Password' });
      } else {
        const token = jwt.sign(
          {
            username: user.username,
            id: user._id
          },
          process.env.JWT_KEY,
          { expiresIn: '1h' }
        );
        res.status(200).json({ user, token });
      }
    } else {
      res.status(404).json({ message: 'User does not exists' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// check password when password change

export const updatePassword = async (req, res) => {
  const { oldpassword, newpassword } = req.body;
  const id = req.params.id;
  try {
    const user = await UserModel.findById(id);
    const verify = await bcrypt.compare(oldpassword, user.password);
    if (!verify) {
      res.status(401).json({ message: 'Old password is incorrect' });
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashedPass = await bcrypt.hash(newpassword, salt);
      await UserModel.findByIdAndUpdate(id, { password: hashedPass });
      res.status(200).json({ message: 'Password updated' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
