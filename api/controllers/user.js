import { db } from "../connect.js";
import jwt from "jsonwebtoken";

export const getUser = (req, res) => {
  const userId = req.params.userId;
  const q = "SELECT * FROM users WHERE id=?";

  db.query(q, [userId], (err, data) => {
    if (err) return res.status(500).json(err);
    
    // Check if the profilePic is being returned correctly
    console.log("Fetched profilePic:", data[0].profilePic);

    const { password, ...info } = data[0]; // Exclude password
    return res.json(info);
  });
};

export const getAllUsers = (req, res) => {
  const q = "SELECT id, name, profilePic FROM users";

  db.query(q, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};


export const updateUser = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const userId = req.params.userId;  // Get the userId from the URL parameters

    if (!userInfo) {
      console.error("User info is undefined");
      return res.status(400).json("User info not available");
    }

    console.log("Updating profilePic:", req.body.profilePic);
    console.log("Updating coverPic:", req.body.coverPic);

    const q =
      "UPDATE users SET `name`=?, `city`=?, `website`=?, `profilePic`=?, `coverPic`=? WHERE id=?";

    db.query(
      q,
      [
        req.body.name,
        req.body.city,
        req.body.website,
        req.body.profilePic,
        req.body.coverPic,
        userId,  // Use the userId from the URL
      ],
      (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.affectedRows > 0) {
          console.log("Profile updated successfully for userId:", userId);
          return res.json("Profile updated successfully!");
        }
        return res.status(403).json("You can update only your profile!");
      }
    );
  });
};
