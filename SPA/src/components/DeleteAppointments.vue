<template>
  <div class="container">
    <div>
      <div class="row">
        <div class="center">
          <div class="form-group">
            <label for="email">Insert your email</label>
            <input
              id="email"
              v-model="email"
              name="email"
              type="email"
              class="form-control"
              aria-describedby="emailHelp"
              placeholder="test@email.com"
              required
              @change="searchForAppointments()"
            />
          </div>
        </div>

        <small v-if="error" class="form-text col-md-12" style="color: red">
          {{ error }}
        </small>

        <small v-else id="emailHelp" class="form-text text-muted col-md-12">
          (of the appointment you want to cancel)
        </small>
      </div>
      <br />

      <el-button
        type="primary"
        size="medium"
        @click="searchForAppointments()"
        round
        >Check Email
      </el-button>
    </div>
  </div>
  <br />
  <div v-if="tableFlag">
    <!-- table -->
    <div>
      <table class="table center">
        <thead>
          <tr>
            <th scope="col">id</th>
            <th scope="col">Date</th>
            <th scope="col">Hour</th>
            <th scope="col">
              <el-button
                type="danger"
                size="mini"
                icon="el-icon-delete"
                @click="DeleteAllAppointmentsByEmail()"
                round
              >
                Delete All
              </el-button>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="appointment in appointments" :key="appointment.start_time">
            <td align="center">{{ appointment.id }}</td>
            <td align="center">{{ appointment.appointment_date }}</td>
            <td align="center">{{ appointment.start_time }} hrs.</td>
            <td>
              <el-button
                type="danger"
                size="small"
                icon="el-icon-delete"
                @click="DeleteAppointment(appointment.id)"
                round
                plain
              >
                Delete
              </el-button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- table -->
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      email: "",
      appointments: [],
      error: null,
      returnedAppointment: null,

      tableFlag: false,
      emptyFlag: false,
      
      URL: `${process.env.VUE_APP_BASE_URL}:${process.env.VUE_APP_PORT}`
    };
  },
  methods: {
    async searchForAppointments() {
      if (!this.email) return (this.error = "Insert an Email");
      await axios
        .get(`${this.URL}/api/appointments/`, {
          params: {
            email: this.email,
          },
        })
        .then((res) => {
          this.appointments = res.data;
          if (this.appointments.length > 0) {
            this.error = null;
            this.tableFlag = true;
          } else {
            this.tableFlag = false;
            this.error = "There are no appointments with this email";
          }
        })
        .catch((err) => {
          this.error = err.response.data;
        });
    },
    async DeleteAppointment(id) {
      if (id) {
        await axios
          .delete(`${this.URL}/api/appointments/${id}`)
          .then(() => {
            this.searchForAppointments();
            this.returnedAppointment = res.data;
          })
          .catch(() => {
            this.searchForAppointments();
          });
      } else {
        console.log("not a valid id");
      }
    },
    async DeleteAllAppointmentsByEmail() {
      if (email) {
        await axios
          .delete(`${this.URL}/api/appointments/`, {
            params: {
              email: this.email,
            },
          })
          .then(() => {
            this.searchForAppointments();
            this.returnedAppointment = res.data;
          })
          .catch(() => {
            this.searchForAppointments();
          });
      } else {
        console.log("not a valid email");
      }
    },
  },
};
</script>

<style>
.center {
  margin: auto;
  width: 100%;
}
@media only screen and (min-width: 850px) {
  .center {
    margin: auto;
    width: 70%;
  }
}
@media only screen and (min-width: 1000px) {
  .center {
    margin: auto;
    width: 60%;
  }
}
</style>