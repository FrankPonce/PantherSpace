// LeftBar.jsx
import "./leftBar.scss";
import { AuthContext } from "../../context/authContext";
import { useContext, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";


const LeftBar = () => {
  const { currentUser } = useContext(AuthContext);
  const [trendingHashtags, setTrendingHashtags] = useState([]);

  // Fetch posts data
  const { isLoading, error, data } = useQuery(["leftbarPosts"], () =>
    makeRequest.get("/posts").then((res) => res.data)
  );

  useEffect(() => {
    if (!isLoading && !error && data) {
      console.log("Fetched Posts Data:", data);

      const hashtagCounts = {};
      data.forEach((post) => {
        // Adjust 'desc' to match your actual data field
        const postDescription = post.desc || "";
        const hashtagsInPost = postDescription.match(/#\w+/g);
        console.log("Post Description:", postDescription);
        console.log("Hashtags in Post:", hashtagsInPost);
        if (hashtagsInPost) {
          hashtagsInPost.forEach((hashtag) => {
            const lowerCaseHashtag = hashtag.toLowerCase();
            if (hashtagCounts[lowerCaseHashtag]) {
              hashtagCounts[lowerCaseHashtag]++;
            } else {
              hashtagCounts[lowerCaseHashtag] = 1;
            }
          });
        }
      });
      console.log("Hashtag Counts:", hashtagCounts);

      // Convert the counts object into an array and sort
      const trending = Object.entries(hashtagCounts)
        .sort((a, b) => b[1] - a[1]) // Sort by count descending
        .slice(0, 10) // Get top 10
        .map((entry) => entry[0]); // Get the hashtag

      console.log("Trending Hashtags:", trending);
      setTrendingHashtags(trending);
    }
  }, [isLoading, error, data]);

  return (
    <div className="leftBar">
      <div className="container">
        <div className="menu">
          <div className="user">
            <img
              src={`http://localhost:3000/upload/${currentUser.profilePic}`}
              alt=""
            />
            <span>{currentUser.name}</span>
          </div>
          <div className="item">
            <span>Trending Hashtags</span>
            {isLoading ? (
              <div>Loading...</div>
            ) : error ? (
              <div>Error loading hashtags</div>
            ) : trendingHashtags.length > 0 ? (
              trendingHashtags.map((hashtag, index) => (
                <div key={index} className="hashtag">
                  {hashtag}
                </div>
              ))
            ) : (
              <div>No hashtags yet</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeftBar;
