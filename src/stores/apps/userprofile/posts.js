import { defineStore } from "pinia"
// project imports
import axios from "@/utils/axios"

export const usePostsStore = defineStore("post", {
  state: () => ({
    posts: [],
  }),
  getters: {},
  actions: {
    // Fetch Posts from action
    async fetchPosts() {
      try {
        const response = await axios.get("/api/posts/list")
        this.posts = response.data
      } catch (error) {
        alert(error)
        console.log(error)
      }
    },
    // like post
    async likePost(postId) {
      try {
        const response = await axios.post("/api/posts/list/like", { postId })
        this.posts = response.data.posts
      } catch (error) {
        alert(error)
        console.log(error)
      }
    },
    // add Comment
    async addComment(postId, comment) {
      try {
        const response = await axios.post("/api/comments/add", {
          postId,
          comment,
        })
        this.posts = response.data.posts
      } catch (error) {
        alert(error)
        console.log(error)
      }
    },
    // add Comment
    async addReply(postId, commentId, reply) {
      try {
        const response = await axios.post("/api/replies/add", {
          postId,
          commentId,
          reply,
        })
        this.posts = response.data.posts
      } catch (error) {
        alert(error)
        console.log(error)
      }
    },
  },
})
