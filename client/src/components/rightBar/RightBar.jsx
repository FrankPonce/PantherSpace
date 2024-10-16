import "./rightBar.scss";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";

const RightBar = () => {
  const { currentUser } = useContext(AuthContext);

  // Fetch all users
  const { isLoading: usersLoading, error: usersError, data: usersData } = useQuery(["allUsers"], () =>
    makeRequest.get("/users/all").then((res) => res.data)
  );

  // Fetch relationships (who current user is following)
  const { isLoading: followingLoading, data: followingData } = useQuery(["relationships"], () =>
    makeRequest.get("/relationships?followerUserId=" + currentUser.id).then((res) => res.data)
  );

  const queryClient = useQueryClient();

  const mutation = useMutation(
    (userId) => {
      if (followingData?.includes(userId)) {
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

  if (usersLoading || followingLoading) return "Loading...";

  return (
    <div className="rightBar">
      <div className="container">
        {/* Suggestions For You */}
        <div className="item">
          <span>Suggestions For You</span>
          {usersError
            ? "Error loading users"
            : usersData
                ?.filter((user) => user.id !== currentUser.id && !followingData?.includes(user.id)) // Exclude the current user and already followed users
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
                        {followingData?.includes(user.id) ? "Following" : "Follow"}
                      </button>
                      <button>Dismiss</button>
                    </div>
                  </div>
                ))}
        </div>

        {/* Additional sections can go here if needed */}
      </div>
    </div>
  );
};

export default RightBar;
