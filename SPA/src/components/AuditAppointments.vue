<template>
  <h1>Audit Panel</h1>
  <p>Here is a back door to all the appointments scheduled</p>
  <el-card class="box-card">
    <!-- table -->
    <div style="margin-bottom: 25px">
      <el-button
        size="medium"
        icon="el-icon-refresh"
        @click="searchForAppointments()"
        plain
        round
        >Reload</el-button
      >
      <el-button
        type="primary"
        size="medium"
        icon="el-icon-files"
        @click="randomAppointments()"
        plain
        round
        >Insert random appointments</el-button
      >
    </div>
    <div v-if="appointments.length > 0">
      <table class="table center">
        <thead>
          <tr>
            <th scope="col">id</th>
            <th scope="col">DD-MM-YY</th>
            <th scope="col">Hour</th>
            <th scope="col">Email</th>
            <th scope="col">
              <el-button
                type="danger"
                size="mini"
                icon="el-icon-delete"
                @click="DeleteAllAppointments()"
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
            <td align="center">{{ appointment.email }}</td>
            <td>
              <el-button
                type="danger"
                size="medium"
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
    <div v-else>
      <p>
        There are no appointment booked just yet <br />
        <small>(Try booking a few ones yourself and then come back!)</small>
      </p>
    </div>
  </el-card>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      email: "",
      appointments: [],
      error: null,
      tableFlag: false,
      emptyFlag: false,
      returnedAppointment: "",
      
      URL: `${process.env.VUE_APP_BASE_URL}:${process.env.VUE_APP_PORT}`
    };
  },
  methods: {
    async searchForAppointments() {
      await axios.get(`${this.URL}/api/appointments/`).then((res) => {
        this.appointments = res.data;
        if (this.appointments.length > 0) {
          this.error = null;
        } else {
          this.error = "There are no appointments";
        }
      });
    },
    async DeleteAppointment(id) {
      if (id) {
        await axios
          .delete(`${this.URL}/api/appointments/${id}`)
          .then((res) => {
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
    async DeleteAllAppointments() {
      await axios
        .delete(`${this.URL}/api/appointments/`)
        .then(() => {
          this.searchForAppointments();
          this.returnedAppointment = res.data;
        })
        .catch(() => {
          this.searchForAppointments();
        });
    },
    addZeroIfNeeded(number) {
      return number > 9 ? number : "0" + number;
    },
    dateParser(date) {
      //Parse the date in DD-MM-YY to a ISO-8601 date "YY-MM-DDT04:00:00.000Z"
      return `${date.slice(6)}-${date.slice(3, 5)}-${date.slice(
        0,
        2
      )}T04:00:00.000Z`;
    },
    isWeekDay(stringDate) {
      const isoDate = this.dateParser(stringDate);
      const date = new Date(isoDate);
      const weekDay = date.getDay();
      if (weekDay > 0 && weekDay < 6) {
        return true;
      } else {
        return false;
      }
    },
    async randomAppointments() {
      let date = new Date();
      const currentDate = date.getDate();
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      let failedAttemps = 0;
      const attempts = 10;
      for (let i = 0; i < attempts; i++) {
        let day = Math.floor(
          Math.random() * (30 - currentDate + 1) + currentDate
        );

        let stringDate = `${this.addZeroIfNeeded(day)}-${this.addZeroIfNeeded(
          month
        )}-${year}`;
        const isAvailable = this.isWeekDay(stringDate);
        if (!isAvailable) {
          day = day >= 29 ? day - 2 : day + 2;
          stringDate = `${this.addZeroIfNeeded(day)}-${this.addZeroIfNeeded(
            month
          )}-${year}`;
        }
        const hour = Math.floor(Math.random() * (17 - 9 + 1) + 9);
        // console.log(year, month, day, hour);
        await axios
          .post(`${this.URL}/api/appointments/`, {
            appointment_date: stringDate,
            start_time: `${this.addZeroIfNeeded(hour)}`,
            email: "test@email.com",
          })
          .catch((err) => {
            failedAttemps++;
            console.log(
              `Attempt #${i} to book at date ${stringDate} and hour ${this.addZeroIfNeeded(
                hour
              )} failed because: "${err.response.data}"`
            );
          });
        this.searchForAppointments();
      }
      console.log(
        `${attempts} attempts to book appointments were done, ${failedAttemps} attempms failed`
      );
    },
  },
  mounted() {
    axios.get(`${this.URL}/api/appointments/`, {}).then((res) => {
      this.appointments = res.data;
      if (this.appointments.length > 0) {
        this.error = null;
      } else {
        this.error = "There are no appointments with this email";
      }
    });
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
    width: 90%;
  }
}
@media only screen and (min-width: 1000px) {
  .center {
    margin: auto;
    width: 80%;
  }
}
</style>