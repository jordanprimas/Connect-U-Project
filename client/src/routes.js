import React from 'react';
import App from "./App"
import PostCard from "./components/posts/PostCard"
import PostForm from "./components/posts/PostForm"
import Home from "./components/static/Home"

const routes = [
    {
      path: "/",
      element: <App />,
      children: [
        {
          path: "/",
          element: <Home />
        },
        {
          path: "/posts",
          element: <PostCard />
        },
        {
          path: "/posts/new",
          element: <PostForm />
        },
      ]
    }, 
];

export default routes;
