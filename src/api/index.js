import axios from "axios";

export const getAllArticles = () => {
  return axios.get("https://northcoders-news-back.herokuapp.com/api/articles");
};

export const getUserByUsername = username => {
  return axios.get(
    `https://northcoders-news-back.herokuapp.com/api/users/${username}`
  );
};

export const getArticleById = id => {
  return axios.get(
    `https://northcoders-news-back.herokuapp.com/api/articles/${id}`
  );
};

export const getCommentsByArticleId = id => {
  return axios.get(
    `https://northcoders-news-back.herokuapp.com/api/articles/${id}/comments`
  );
};

export const postComment = (comment, article_id, user_id) => {
  const formattedComment = {
    body: comment,
    belongs_to: article_id,
    created_by: user_id
  };
  return axios.post(
    `https://northcoders-news-back.herokuapp.com/api/articles/${article_id}/comments`,
    formattedComment
  );
};
