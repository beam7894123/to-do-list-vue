<template>
  <div class="flex-container">
    <div class="flex-item">
      <a-space align="baseline" :size="10" >
      <img alt="logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />
        <div class="flex-container-small">
          <h1>Todo List (Cookie mode) ‧₊˚ 🍪 ⋅ ☆ </h1>
          <p>Please note that the tasks will be saved in your browser cookies and will be deleted if you clear or eat your cookies. (๑ᵔ⤙ᵔ๑) </p>
        </div>
        </a-space>
    </div>
    <!-- Create task form ===================================================================== -->
    <div class="flex-item-small">
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
    <!-- Advance option ===================================================================== -->
    <div class="flex-item-small">
      <a-collapse class="drop-more-collapse">
        <a-collapse-panel key="1" :show-arrow="false">
          <template #header>
            <span class="drop-more-header-text">Advance option</span>
          </template>

          <!-- Input Export URL ===================================================================== -->
          <div class="flex-container-small cookieDataInput">
            <div>
              <p class="inputApiUrlLabel" >Cookie Data</p>
              <a-textarea
                  id="cookieDataInput"
                  class="cookieDataInput"
                  v-model:value="cookieData"
                  placeholder="Enter your json cookie..."
                  rows="10"
                  cols="50"
              />
            </div>
            <div class="flex-item">
              <a-space align="baseline">
                <a-button type="primary" @click="exportCookieData">Export Date</a-button>
                <a-popconfirm
                    placement="rightTop"
                    ok-text="Yes"
                    cancel-text="No"
                    @confirm="loadCookieData">
                  <template v-slot:title>
                    <p> This will overwrite current task that you have!</p>
                    <p> Are you sure? </p>
                  </template>
                  <a-button>Import Cookie Data</a-button>
                </a-popconfirm>
              </a-space>
            </div>

          </div>
        </a-collapse-panel>
      </a-collapse>
    </div>
    <!-- List Tasks table ===================================================================== -->
    <div class="flex-item taskTable">
      <a-space align="center">
        <a-table
            :dataSource="tasks"
            :columns="columns"
            :scroll="{ x: 576, y: 900}"
            :pagination="{ pageSize: 5 }"
            :rowClassName="setRowClassName"
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

      cookieData: '',
      cookieDataBeautified: '',
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
      try {
        const tasksString = Cookies.get('tasks');
        if (tasksString) {
          this.tasks = JSON.parse(tasksString);
        }
      } catch (e) {
        message.error('Warning: Corrupted JSON data!');
        this.tasks = [];
        Cookies.set('tasks', this.tasks, { expires: 365 });
      }
      // console.log('Loaded tasks:', this.tasks); // Debug log
      // console.log('Loaded dataSource:', this.tasks.length); // Debug log
    },

    setRowClassName(record) {
      return record.done ? 'tableDone' : 'tableNotDone';
    },

    exportCookieData() {
      this.cookieData = Cookies.get('tasks') || '';

      this.$nextTick(() => {
        const cookieDataInput = document.getElementById('cookieDataInput');
        cookieDataInput.select();
        document.execCommand('copy');
        message.info('Cookie Data copied to clipboard!');
      });
    },
    loadCookieData() {
      try {
        JSON.parse(this.cookieData)
        if (this.cookieData === '') {
          message.error('No cookie data to import!');
        }
        Cookies.set('tasks', this.cookieData, { expires: 365 });
        this.tasks = JSON.parse(this.cookieData);
        message.success('Cookie data imported!');
        }
      catch (e) {
        message.error('Invalid JSON data!');
      }
    }

  },
  // Load tasks from cookies when the app is created
  created() {
    this.loadTasks();
  },
};
</script>

<style>

.flex-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: stretch;
  margin: 2rem auto 20rem;
  width: 75rem;
}
.flex-container-small {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: stretch;
}

.flex-item {
  flex: 1; /* Equal width for all items */
  padding: 1rem;
}


.creatNewTask, .taskTable {
  max-width: 1200px;
  margin-bottom: 20px;
}

.inputTask {
  min-width: 64rem;
  width: auto;
}
.taskTable{
  height: auto;
}
.taskTable p {
  text-align: left;
}
.line-through {
  text-decoration: line-through;
}

.tableDone {
  background-color: #e2ffe5;
}

.cookieDataInput {
  width: 40rem;
}

</style>
