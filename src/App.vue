<template>
  <div id='app'>
    <img alt='Vue logo' src='./assets/logo.png' />

    <!-- Create task form -->
    <div class="creatNewTask">
      <span>
        <input aria-label="inputTask"
               type='text'
               class="inputTask"
               v-model="newTask"
        />
        <button
          type="button"
          class="buttonAdd"
          v-on:click="onCreateNewTask"
        >
          Create new task
        </button>
      </span>
    </div>

    <!-- Task table -->
    <div class="taskTable">
      <table>
        <tr v-for="task in tasks" v-bind:key="task.id">
          <td>
            <input aria-label="checkbox"
                   type="checkbox"
                   v-model="task.done"
                   @change="onTaskChange"
            >
          </td>
          <td>
            <p :style="task.done && { textDecoration: 'line-through' }">{{ task.name }}</p>
          </td>
          <td>
            <button
              type="button"
              class="buttonDelete"
              v-on:click="() => onDeleteTask(task.id)"
            >
              Delete
            </button>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import Cookies from 'js-cookie';

export default {
  name: 'App',
  data() {
    return {
      newTask: '',
      tasks: [],
    };
  },
  methods: {
    onCreateNewTask() {
      const newTask = {
        id: new Date().getTime(),
        name: this.newTask,
        done: false,
      };
      this.tasks = [newTask, ...this.tasks];
      this.newTask = '';
      this.saveTasks();
    },
    onDeleteTask(id) {
      this.tasks = this.tasks.filter((task) => task.id !== id);
      this.saveTasks();
    },
    onTaskChange() {
      this.saveTasks();
    },
    // Save tasks to cookies
    saveTasks() {
      const tasksString = JSON.stringify(this.tasks);
      Cookies.set('tasks', tasksString, { expires: 365 });
    },
    // Load tasks from cookies
    loadTasks() {
      const tasksString = Cookies.get('tasks');
      if (tasksString) {
        this.tasks = JSON.parse(tasksString);
      }
    },
  },
  // Load tasks from cookies when the app is created
  created() {
    this.loadTasks();
  },
};
</script>

<style>
#app {
  text-align: center;
}

.creatNewTask {
  margin-bottom: 10px;
}
.creatNewTask .inputTask {
  width: 300px;
  height: 28px;
}
.creatNewTask .buttonAdd {
  height: 28px;
  margin-left: 10px;
}

.taskTable table {
  background-color: aliceblue;
  margin: 0px auto;
  width: 420px;
}
.taskTable p {
  text-align: left;
}
</style>
