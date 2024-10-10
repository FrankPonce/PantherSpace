import "./rightBar.scss";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";

const RightBar = () => {
  const { currentUser } = useContext(AuthContext);

  // Fetch all users
  const { isLoading, error, data: usersData } = useQuery(["allUsers"], () =>
    makeRequest.get("/users/all").then((res) => {
      return res.data;
    })
  );

  // Fetch relationships (who current user is following)
  const { data: followingData } = useQuery(["relationships"], () =>
    makeRequest.get("/relationships?followerUserId=" + currentUser.id).then((res) => res.data)
  );

  const queryClient = useQueryClient();

  const mutation = useMutation(
    (userId) => {
      if (followingData.includes(userId)) {
        return makeRequest.delete("/relationships?userId=" + userId);
      }
      return makeRequest.post("/relationships", { userId });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["relationships"]);
      },
    }
  );

  const handleFollow = (userId) => {
    mutation.mutate(userId);
  };

  return (
    <div className="rightBar">
      <div className="container">
        {/* Suggestions For You */}
        <div className="item">
          <span>Suggestions For You</span>
          {isLoading
            ? "loading..."
            : usersData
                ?.filter((user) => user.id !== currentUser.id) // Exclude the current user
                ?.map((user) => (
                  <div className="user" key={user.id}>
                    <div className="userInfo">
                      <Link to={`/profile/${user.id}`}>
                        <img src={"/upload/" + user.profilePic} alt={user.name} />
                      </Link>
                      <span>{user.name}</span>
                    </div>
                    <div className="buttons">
                      <button onClick={() => handleFollow(user.id)}>
                        {followingData.includes(user.id) ? "Following" : "Follow"}
                      </button>
                      <button>Dismiss</button>
                    </div>
                  </div>
                ))}
        </div>

        {/*
        <div className="item">
          <span>Latest Activities</span>
          <div className="user">
            <div className="userInfo">
              <img
                src="https://images.pexels.com/photos/4881619/pexels-photo-4881619.jpeg?auto=compress&cs=tinysrgb&w=1600"
                alt=""
              />
              <p>
                <span>Jane Doe</span> changed their cover picture
              </p>
            </div>
            <span>1 min ago</span>
          </div>
          
        </div>

        */}
        {/* 
        <div className="item">
          <span>Online Friends</span>
          
        </div>
          */}
      </div>
    </div>
  );
};

export default RightBar;
