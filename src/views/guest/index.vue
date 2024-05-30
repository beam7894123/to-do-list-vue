<template>
  <div class="flex-container">
    <div class="flex-item">
      <a-space align="baseline" :size="10" >
        <img alt="logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />
        <div class="flex-container-small">
          <h1>Todo List (API mode) ‧₊˚ ｡🇯‌🇸‌ ⋅ ☆ </h1>
          <p>Please keep your passcode safe. If you lose it, you will lose all access to your tasks!（• ˕ •マ.ᐟ </p>
        </div>
      </a-space>
    </div>

    <div>
      <!-- Input Passcode ===================================================================== -->
      <div class="flex-item-small">
        <a-space align="center">
          <a-input
              class = "inputPasscode"
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
          <a-button @click="$router.push(`/old`)">
            Local Mode >
          </a-button>
        </a-space>
      </div>

      <!-- Advance option ===================================================================== -->
      <div class="flex-item-small">
        <a-collapse class="custom-collapse">
          <a-collapse-panel key="1" :show-arrow="false">
            <template #header>
              <span class="custom-header-text">Advance option</span>
            </template>
            <!-- Input API URL ===================================================================== -->
            <a-space align="baseline">
              <p class="inputApiUrlLabel" >Api url</p>
<!--              <label class="inputApiUrl" for="apiUrlInput">Api url: </label>-->
              <a-input
                  class="inputApiUrl"
                  id="apiUrlInput"
                  v-model:value="apiUrl"
                  placeholder="Enter your api url..."
                  @pressEnter="changeApiUrl"
              />
              <a-button @click="changeApiUrl" type="primary">
                Load
              </a-button>
              <a-popconfirm
                  placement="rightTop"
                  ok-text="Yes"
                  cancel-text="No"
                  @confirm="resetApiUrl">
                <template v-slot:title>
                  <p> This will overwrite current api url!</p>
                  <p> Are you sure? </p>
                </template>
                <a-button>Reset</a-button>
              </a-popconfirm>
            </a-space>
          </a-collapse-panel>
        </a-collapse>
      </div>
    </div>

    <a-divider />

    <!-- Create Todo form ===================================================================== -->
    <div class="flex-item">
      <a-space align="center">
        <a-textarea
            :auto-size="{ minRows: 1, maxRows: 4 }"
            class="inputTodo"
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
    <div class="flex-item taskTable">
      <a-space align="center">
        <a-table
            :dataSource="tasks"
            :columns="columns"
            :rowClassName="setRowClassName"
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
                    {{ index + 1 }}
            </template>

            <!--              Button to delete a task ============================================-->
            <template v-if="column.key === 'delete' && record.status === false">
              <a-button block @click="() => deleteTodo(record.id)"
                        style="background-color: #000; color: white; border: none;"
                        :loading="LoadingDeleteTask"
              >
                Delete?
              </a-button>
            </template>
            <template v-if="column.key === 'delete' && record.status === true">
              <a-button block @click="() => deleteTodo(record.id)"
                        style="background-color: #ffa1a2; color: #000000; border: none;"
                        :loading="LoadingDeleteTask"
              >
                Delete
              </a-button>
            </template>
            <!--              Button to delete a task END ============================================-->
          </template>
        </a-table>
      </a-space>
    </div>
    <a-divider />
  </div>
</template>

<script>
import apiClient, {setBaseURL} from "@/axios.js";
import {message} from "ant-design-vue";
import {onMounted, ref} from "vue";
import Cookies from 'js-cookie';

export default {
  data() {
    return {
      passcodeText: {
        passcode: '',
      },
      LoadingPasscode: false,
      LoadingCheckbox: false,
      LoadingCreateNewTask: false,
      LoadingDeleteTask: false,

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
          sorter: (a, b) => a.status - b.status,
        },
      ],
    }
  },

  setup() {
    const apiUrl = ref('');

    onMounted(() => {
      // Retrieve the apiUrl from cookies when the component is mounted
      const savedApiUrl = Cookies.get('apiUrl');
      if (savedApiUrl) {
        apiUrl.value = savedApiUrl;
        setBaseURL(savedApiUrl);
      }
      else {
        apiUrl.value = import.meta.env.VITE_API_BASE_URL; // Default API URL
      }
    });

    const changeApiUrl = () => {
      if (apiUrl.value) {
        try {
          setBaseURL(apiUrl.value);
          Cookies.set('apiUrl', apiUrl.value); // Save the apiUrl in a cookie
          // console.log('New API baseURL:', apiUrl.value);  // Debug: Check the updated URL
          message.success('API URL changed successfully!');
          message.info('Your new API URL is: ' + apiUrl.value);
        } catch (error) {
          let errorMessage;
          if (error.response) {
            errorMessage = error.response.data.message
          } else {
            errorMessage = 'API URL change failed!';
          }
          message.error(errorMessage);
        }

      }
    };

    const resetApiUrl= () => {
      try {
        apiUrl.value = import.meta.env.VITE_API_BASE_URL; // Default API URL
        setBaseURL(apiUrl.value);
        // console.log('New API baseURL:', import.meta.env.VITE_API_BASE_URL);  // Debug: Check the updated URL
        message.success('API URL changed successfully!');
        message.info('Your new API URL is: ' + apiUrl.value);
      } catch (error) {
        let errorMessage;
        if (error.response) {
          errorMessage = error.response.data.message
        } else {
          errorMessage = 'API URL change failed!';
        }
        message.error(errorMessage);
      }
    };

    return {
      apiUrl,
      changeApiUrl,
      resetApiUrl
    };
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
      finally {
        this.tasks = []; // Clear the task list
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
          // console.log('Tasks:', this.tasks);
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
        // Save the task to the server first before adding it to the list
        const response = await apiClient.post('/guest/list/add/', newTask)

        // Convert the status if necessary and update the tasks list
        const addedTask = {
          ...response.data,
          status: response.data.status === 1
        };
        this.tasks = [addedTask, ...this.tasks];
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
        this.LoadingDeleteTask = true;
        // console.log('Deleting task:', id);
        await apiClient.post('/guest/list/delete/', {
          passcode: this.passcodeText.passcode,
          toDoId: id,
        });
        // console.log('Response:', response);
        this.tasks = this.tasks.filter((task) => task.id !== id);
        message.success('Task deleted successfully!');
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
        this.LoadingDeleteTask = false;
      }
    },

    setRowClassName(record) {
      return record.status ? 'tableDone' : 'tableNotDone';
    },

  }
}

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

.flex-item {
  flex: 1; /* Equal width for all items */
  padding: 1rem;
}
.flex-item-small{
  flex: 1; /* Equal width for all items */
  padding: 0rem 1rem;
}

.taskTable {
  width: 100%;
  height: auto;
}

.inputPasscode {
  width: 40rem;
}
.inputTodo{
  width: 64rem;
}
.tableNotDone {

}

.tableDone {
  background-color: #e2ffe5;
}

.taskTable p {
  text-align: left;
}

.custom-collapse {
  border: none;
  background: none;
  width: 10rem;
  padding: 0;
  font-size: 0.8rem; /* Smaller font size for the header */
}

.custom-header-text {
  color: #009847;
  text-decoration: underline;
}

.custom-collapse .ant-collapse-item {
  border: none;
}

.custom-collapse .ant-collapse-content {
  border: none;
  padding: 0;
}

.inputApiUrl {
  width: 20rem;
}

.inputApiUrlLabel {
  width: 3rem;
}
</style>
