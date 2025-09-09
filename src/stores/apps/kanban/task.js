import { defineStore } from "pinia"
// project imports
import axios from "@/utils/axios"
import { map } from "lodash"
import { uniqueId } from "lodash"
import { sub } from "date-fns"

export const useTaskStore = defineStore("tasks", {
  state: () => ({
    tasks: [],
    taskContent: "1",
  }),
  actions: {
    // Fetch tasks
    async fetchTasks() {
      try {
        const data = await axios.get("/api/data/task/TaskData")
        this.tasks = data.data
      } catch (error) {
        alert(error)
        console.log(error)
      }
    },

    //select chat
    SelectTask(itemID) {
      this.taskContent = itemID
    },

    deleteTask(itemID) {
      const taskObj = this.tasks.map((task) => {
        const tasks = task.tasks?.filter((t) => t.id !== itemID)
        return {
          ...task,
          tasks,
        }
      })
      this.tasks = taskObj
    },

    addTask(columnId, title, subtitle, category, categorybg) {
      const newTask = {
        id: uniqueId("#task_"),
        title: title,
        subtitle: subtitle,
        category: category,
        date: sub(new Date(), { seconds: 1 }),
        categorybg: categorybg,
      }
      this.tasks = map(this.tasks, (task) => {
        if (task.id === columnId) {
          // Correctly push the new task to the array
          if (task.tasks) {
            task.tasks.push(newTask)
          } else {
            task.tasks = [newTask]
          }
          return task
        }
        return task
      })
    },
  },
})
