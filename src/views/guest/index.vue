<template>
  <div>
    <!-- Input Passcode ===================================================================== -->
    <a-space align="center">
      <a-input
          id="passcodeInput"
          v-model:value="passcodeText.passcode"
          placeholder="Passcode..."
          @pressEnter="loadTodoList"
      />
      <a-button @click="copyPasscode">
        <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M19.5 16.5L19.5 4.5L18.75 3.75H9L8.25 4.5L8.25 7.5L5.25 7.5L4.5 8.25V20.25L5.25 21H15L15.75 20.25V17.25H18.75L19.5 16.5ZM15.75 15.75L15.75 8.25L15 7.5L9.75 7.5V5.25L18 5.25V15.75H15.75ZM6 9L14.25 9L14.25 19.5L6 19.5L6 9Z" fill="#080341"/>
        </svg>
      </a-button>
      <a-button
          type="primary"
          :loading="LoadingPasscode"
          @click="loadTodoList"
      >
        Load Passcode
      </a-button>
      <a-popconfirm
          placement="rightTop"
          ok-text="Yes"
          cancel-text="No"
          @confirm="createPasscode">
        <template v-slot:title>
          <p> This will overwrite current passcode!</p>
          <p> Are you sure? </p>
        </template>
        <a-button>Create new Passcode</a-button>
      </a-popconfirm>
    </a-space>

    <!-- Create task form ===================================================================== -->
    <div class="creatNewTask">
      <a-space align="center">
        <a-textarea
            :auto-size="{ minRows: 1, maxRows: 4 }"
            class="inputTask"
            v-model:value="newTask"
            placeholder="What's on your mind?..."
            @pressEnter="createNewTask"
        />
        <a-button type="primary" @click="createNewTask" :loading="LoadingCreateNewTask">
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
        >
          <template #bodyCell="{ column, index, record }">
            <template v-if="column.key === 'status'">
              <a-checkbox
                  v-model:checked="record.status"
                  @change="saveTodoStatus(record.id)"
                  :disabled="LoadingCheckbox"
              ></a-checkbox>
            </template>
            <template v-if="column.key === 'index'">
                  <span :class="{ 'line-through': record.status }">
                    {{ index + 1 }}
                  </span>
            </template>

            <!--              Button to delete a task ============================================-->
            <template v-if="column.key === 'delete' && record.status === false">
              <a-button block @click="() => deleteTodo(record.id)"
                        style="background-color: #000; color: white; border: none;">
                Delete?
              </a-button>
            </template>
            <template v-if="column.key === 'delete' && record.status === true">
              <a-button block @click="() => deleteTodo(record.id)"
                        style="background-color: #ff5052; color: white; border: none;">
                Delete
              </a-button>
            </template>
            <!--              Button to delete a task END ============================================-->
          </template>
        </a-table>
      </a-space>
    </div>
  </div>
</template>

<script>
import apiClient from "@/axios.js";
import {message} from "ant-design-vue";

export default {
  data() {
    return {
      passcodeText: {
        passcode: '',
      },
      LoadingPasscode: false,
      LoadingCheckbox: false,
      LoadingCreateNewTask: false,

      newTask: '',
      tasks: [],
      columns: [
        {
          title: '',
          key: 'status',
          width: '10%',
        },
        {
          title: 'Task',
          dataIndex: 'title',
          width: '70%',
        },
        {
          title: '',
          key: 'delete',
          width: '20%',
          sorter: (a, b) => a.done - b.done,
        },
      ],
      }
    },
  methods: {


    async createPasscode() {
      try {
        const response = await apiClient.post('/guest/register/');
        // console.log('Response:', response);
        this.passcodeText.passcode = response.data.passcode;
        // console.log('Passcode:', this.passcodeText.passcode);
        message.success('Generate Passcode successfully!');
        message.info('Your passcode is: ' + this.passcodeText.passcode);
      }
      catch (error) {
        // console.log('Error:', error);
        message.error('Generate Passcode failed!');
      }
    },

    copyPasscode() {
      const passcodeInput = document.getElementById('passcodeInput');
      passcodeInput.select();
      document.execCommand('copy');
      message.info('Passcode copied to clipboard!');
    },

    async loadTodoList() {
      try {
        this.LoadingPasscode = true;
        const response = await apiClient.post('/guest/get-list/',{
          passcode: this.passcodeText.passcode,
        });
        // console.log('Passcode:', response);
        if (response) {
          this.tasks = response.data.map(task => ({
            ...task,
            status: task.status === 1,
          }));
          console.log('Tasks:', this.tasks);
          message.success('List load!');
        }
      }
      catch (error) {
        this.tasks = []; // Clear the task list
        let errorMessage;
        if (error.response) {
          errorMessage = error.response.data.message
        } else {
          errorMessage = 'No response from the server. Please check your network connection.';
        }
        message.error(errorMessage);
      }
      finally {
        this.LoadingPasscode = false;
      }
    },

    async createNewTask() {
      try {
        this.LoadingCreateNewTask = true;
        // console.log('Creating new task:', this.newTask); // Debug log
        if (!this.newTask.trim()) {
          message.error('Task cannot be empty!');
          return;
        }
        const newTask = {
          passcode: this.passcodeText.passcode,
          title: this.newTask,
        };
        // console.log('New task:', newTask);
        // console.log('before:', this.tasks);
        const response = apiClient.post('/guest/list/add/', newTask);
        // console.log('Response:', response);
        this.tasks = [(await response).data, ...this.tasks];
        this.newTask = ''; // Clear the input field after adding the task
        message.success('Task added successfully!');
        // console.log('after:', this.tasks);
      } catch (error) {
        let errorMessage;
        if (error.response) {
          errorMessage = error.response.data.message
        } else {
          errorMessage = 'No response from the server. Please check your network connection.';
        }
        message.error(errorMessage);
      }
      finally {
        this.LoadingCreateNewTask = false;
      }
    },

    async saveTodoStatus(id) {
      try {
        this.LoadingCheckbox = true;
        const task = this.tasks.find((task) => task.id === id);
        // console.log('Task:', task);
        await apiClient.post('/guest/list/update/status/', {
          passcode: this.passcodeText.passcode,
          toDoId: task.id,
          status: task.status ? 1 : 0,
        });
        // console.log('Response:', response);
        // message.success('Task status updated successfully!');
        this.LoadingCheckbox = false;
      } catch (error) {
        let errorMessage;
        if (error.response) {
          errorMessage = error.response.data.message
        } else {
          errorMessage = 'No response from the server. Please check your network connection.';
        }
        message.error(errorMessage);
        this.LoadingCheckbox = true; // Restrict the user from changing the checkbox
      }
    },

    async deleteTodo(id) {
      try {
        // const response = await apiClient.post('/guest/list/delete/', {
        //   passcode: this.passcodeText.passcode,
        //   toDoId: id,
        // });
        // // console.log('Response:', response);
        // this.tasks = this.tasks.filter((task) => task.id !== id);
        // message.success('Task deleted successfully!');
      } catch (error) {
        let errorMessage;
        if (error.response) {
          errorMessage = error.response.data.message
        } else {
          errorMessage = 'No response from the server. Please check your network connection.';
        }
        message.error(errorMessage);
      }
    },

  }
}

</script>

<style scoped>
.creatNewTask, .taskTable {
  max-width: 1200px;
  margin-bottom: 20px;
}

.inputTask {
  min-width: 400px;
  width: auto;
}
.taskTable{
  height: auto;
}
.taskTable table {
  background-color: aliceblue;
}
.taskTable p {
  text-align: left;
}
</style>
