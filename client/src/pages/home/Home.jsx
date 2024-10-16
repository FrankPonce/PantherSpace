import { useState } from "react";
import Posts from "../../components/posts/Posts";
import Share from "../../components/share/Share";
import "./home.scss";

const Home = () => {
  const [hashtags, setHashtags] = useState([]); // State to hold extracted hashtags

  return (
    <div className="home">
      <Share />
      <Posts setHashtags={setHashtags} />
    </div>
  );
};

export default Home;