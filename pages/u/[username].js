import { useState, useEffect } from "react";
import Head from "next/head";

import Navbar from "../../component/profile/Navbar";
import { getCookieValue } from "../../lib/cookie";
import Activity from "../../component/profile/Activity";
import ProfileDetails from "../../component/profile/ProfileDetails";
import Count from "../../component/profile/Count";
import FollowersList from "../../component/profile/FollowersList";
import BlogList from "../../component/profile/BlogList";
import LuckEgg from "../../component/profile/LuckEgg";
import SiteHeader from "../../component/layout/SiteHeader/SiteHeader";
import UserService from "../../services/UserService";
import PostService from "../../services/PostService";
import Cookies from "universal-cookie";
import Profilestyles from "../../styles/Profile.module.css";
import SkillSet from "../../component/profile/SkillSet";
import notify from "../../lib/notify";

export async function getServerSideProps(context) {
  try {
    if (context.req.headers.cookie) {
      const contextCookie = getCookieValue(
        context.req.headers.cookie,
        "userNullcast"
      );
      if (contextCookie) {
        const cookie = JSON.parse(contextCookie);
        const userId = cookie.id;
        const username = context.params.username;
        const id = context.params.username;

    // let isThisUserTheCurrentLoggedIn = false;
    const data = await UserService.getUserByUsername(username);
    return {
      props: {
        userData: data.data,
      }
    };
      } else {
        return {
          redirect: {
            permanent: false,
            destination: "/404"
          }
        };
      }
    } else {
      return {
        redirect: {
          permanent: false,
          destination: "/404"
        }
      };
    }
  } catch (err) {
    //Redirect to 404 page if there is any kind of error
    // console.log(err);
    return {
      redirect: {
        permanent: false,
        destination: "/404"
      }
    };
  }
}

export default function Username({ userData }) {
  const [currentNav, setCurrentNav] = useState("profile");
  const [newBlogs, setNewBlogs] = useState();
  const [postsCount, setPostsCount] = useState();
  const [postsLimit, setPostsLimit] = useState();

  useEffect(() => {
      getPublishedUserPosts();
  }, []);

  const changeNav = (data) => {
    setCurrentNav(data);
  };

  const getPublishedUserPosts = async () => {
    const postParams = {
      status: "published",
    };
    const response = await PostService.getUserPostsByUser(postParams);
    console.log(response.data.posts, 'error');  
    setNewBlogs(response.data.posts)
    setPostsCount(response.data.count);
    setPostsLimit(response.data.limit);
  };


  const getNewPostsWithCount = (postsCount) => {
    getNewPosts(postsCount);
  };

  const getNewPosts = async (count) => {
    const postParams = {
      status: "published",
      count: count,
      order: "DESC",
    };
    const responsePost = await PostService.getUserPostsByUser(postParams);

    setNewBlogs((prevValue) => {
      return [...prevValue, ...responsePost.posts];
    });
  };

  return (
    <div>
      <Head>
        <title> @{userData.user_name} | Nullcast</title>
      </Head>
      <SiteHeader />
      <div className="bg-gray-100 py-2 pb-6 px-6">
        <Navbar changeNav={changeNav} currentNav={currentNav} />
        <div className="flex lg:flex-row flex-col max-w-panel min-h-screen">
          <div className="flex flex-col lg:w-3/4 w-full">
            <ProfileDetails userData={userData} />
            <SkillSet userData={userData} />
            {currentNav === "profile" && (
              <>
                {/* <Activity /> */}
                <BlogList
                  posts={newBlogs}
                  getNewPostsWithCount={getNewPostsWithCount}
                  postsCount={postsCount}
                />
              </>
            )}
            {currentNav === "store" && <LuckEgg />}
          </div>
          <div
            className={`bg-white shadow-sm rounded lg:w-1/4 w-full mt-3 lg:mt-0 lg:ml-4 p-3 overflow-auto ${Profilestyles.h_max_40rem}`}
          >
            <Count postsCount={postsCount} />
            <FollowersList />
          </div>
        </div>
      </div>
    </div>
  );
}
