<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png" />
    <!-- Create task form ===================================================================== -->
    <div class="creatNewTask">
      <a-space align="center">
        <a-textarea
          :auto-size="{ minRows: 1, maxRows: 4 }"
          class="inputTask"
          v-model:value="newTask"
          placeholder="What's on your mind?..."
          @pressEnter="onCreateNewTask"
        />
        <a-button type="primary" @click="onCreateNewTask">
          Create new task
        </a-button>
      </a-space>
    </div>
    <!-- List Tasks table ===================================================================== -->
    <div class="taskTable">
      <a-space align="center">
          <a-table
            :dataSource="tasks"
            :columns="columns"
            :scroll="{ x: 576, y: 900}"
            :pagination="{ pageSize: 5 }"
            :loading="loading"
          >
            <template #bodyCell="{ column, index, record }">
              <template v-if="column.key === 'checkbox'">
                <a-checkbox v-model:checked="record.done" @change="onTaskChange"></a-checkbox>
              </template>
              <template v-if="column.key === 'index'">
                <span :class="{ 'line-through': record.done }">
                  {{ index + 1 }}
                </span>
              </template>

<!--              Button to delete a task ============================================-->
              <template v-if="column.key === 'delete' && record.done === false">
                <a-button block @click="() => onDeleteTask(record.id)"
                          style="background-color: #000; color: white; border: none;">
                  Delete?
                </a-button>
              </template>
              <template v-if="column.key === 'delete' && record.done === true">
                <a-button block @click="() => onDeleteTask(record.id)"
                          style="background-color: #ff5052; color: white; border: none;">
                  Delete
                </a-button>
<!--              Button to delete a task END ============================================-->
              </template>
            </template>
          </a-table>
      </a-space>
      </div>
    </div>
</template>

<script>
import Cookies from 'js-cookie';
import { message } from 'ant-design-vue';

// Editable cell component =====================================================================
// const EditableCell = {
//   template: `
//       <div class="editable-cell">
//         <div v-if="editable" class="editable-cell-input-wrapper">
//           <a-input :value="value" @change="handleChange" @pressEnter="check" /><a-icon
//             type="check"
//             class="editable-cell-icon-check"
//             @click="check"
//           />
//         </div>
//         <div v-else class="editable-cell-text-wrapper">
//           {{ value || ' ' }}
//           <a-icon type="edit" class="editable-cell-icon" @click="edit" />
//         </div>
//       </div>
//     `,
//   props: {
//     text: String,
//   },
//   data() {
//     return {
//       value: this.text,
//       editable: false,
//     };
//   },
//   methods: {
//     handleChange(e) {
//       const value = e.target.value;
//       this.value = value;
//     },
//     check() {
//       this.editable = false;
//       this.$emit('change', this.value);
//     },
//     edit() {
//       this.editable = true;
//     },
//   },
// };

export default {
  name: 'App',
  data() {
    return {
      newTask: '',
      tasks: [],
      columns: [
        {
          title: '',
          key: 'checkbox',
          width: '10%',
        },
        {
          title: 'Task',
          dataIndex: 'taskName',
          width: '70%',
        },
        {
          title: '',
          key: 'delete',
          width: '20%',
          sorter: (a, b) => a.done - b.done,
        },
      ],
    };
  },
  methods: {
    onCreateNewTask() {
      // console.log('Creating new task:', this.newTask); // Debug log
      if (!this.newTask.trim()) {
        message.error('Task cannot be empty!');
        return;
      }
      const newTask = {
        id: new Date().getTime(),
        taskName: this.newTask,
        done: false,
      };
      this.tasks = [newTask, ...this.tasks];
      this.saveTasks();
      this.newTask = ''; // Clear the input field after adding the task
      message.success('Task added successfully!');
    },
    onDeleteTask(id) {
      this.tasks = this.tasks.filter((task) => task.id !== id);
      this.saveTasks();
      message.success('Task deleted successfully!');
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
      // console.log('Loaded tasks:', this.tasks); // Debug log
      // console.log('Loaded dataSource:', this.tasks.length); // Debug log
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
  height: 28px;
  margin-left: 10px;
}
.creatNewTask .inputTask {
  width: 450px;
}

.taskTable table {
  background-color: aliceblue;
  margin: 0px auto;
  width: 420px;
}
.taskTable p {
  text-align: left;
}
.line-through {
  text-decoration: line-through;
  color: #ffffff;
}
</style>
