<template>
  <div>
    <br />
    <div v-if="bookAppointmentFlag" style="min-height: 500px">
      <div class="block">
        <h2 class="demonstration">Select a date</h2>
        <el-date-picker
          v-model="date"
          type="date"
          placeholder="Select a day"
          :disabled-date="disabledDate"
          format="DD-MM-YYYY"
          value-format="DD-MM-YYYY"
          @change="getAllAppointments"
          :clearable="true"
        ></el-date-picker>
      </div>
      <br />
      <div class="center90" v-if="date">
        <!-- table -->
        <table class="table center">
          <thead>
            <tr>
              <th scope="col" colspan="2">Available hours</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, index) in tableData" :key="index">
              <td align="right">{{ row.start_time }} hrs.</td>
              <td>
                <el-button
                  type="primary"
                  size="medium"
                  @click="bookIt(row)"
                  round
                  plain
                >
                  Book it!
                </el-button>
              </td>
            </tr>
          </tbody>
        </table>
        <!-- table -->
      </div>
    </div>
    <div v-if="formFlag">
      <div class="container">
        <el-page-header
          content="Confirm Date and Time"
          @back="goBack"
          class="row"
        />
      </div>
      <br />
      <br />
      <div class="container">
        <form>
          <div class="row">
            <div class="col-sm-12 col-md-4">
              <div class="form-group">
                <label for="date">Date</label>
                <input
                  class="form-control"
                  type="text"
                  :value="date"
                  readonly
                />
              </div>
            </div>
            <div class="col-sm-12 col-md-4">
              <div class="form-group">
                <label for="time">Hour</label>
                <input
                  class="form-control"
                  type="text"
                  :value="time"
                  readonly
                />
              </div>
            </div>

            <div class="col-sm-12 col-md-4">
              <div class="form-group">
                <label for="email">Email address</label>
                <input
                  id="email"
                  v-model="email"
                  name="email"
                  type="email"
                  class="form-control"
                  aria-describedby="emailHelp"
                  placeholder="test@email.com"
                  required
                />
              </div>
            </div>

            <small v-if="error" class="form-text col-md-12" style="color: red">
              {{ error }}
            </small>

            <small v-else id="emailHelp" class="form-text text-muted col-md-12">
              (It doesn't have to be a real email)
            </small>
          </div>
          <br />

          <el-button
            size="medium"
            icon="el-icon-arrow-left"
            @click="goBack()"
            plain
            round
            >Previous Step</el-button
          >
          <el-button
            type="primary"
            size="medium"
            class="danger"
            @click="createAppointment()"
            round
            >Submit</el-button
          >
        </form>
      </div>
    </div>
    <!-- Success Screen -->
    <div v-if="successFlag" class="container">
      <div class="container">
        <el-page-header
          title="Homepage"
          content="Success"
          @back="goBack"
          class="row"
        />
      </div>
      <br />
      <div>
        <h2>Process completed!</h2>
        <br />
        <p>
          You have successfully booked an appointment (id
          <strong>#{{ returnedAppointment.id }}</strong
          >) on the date <strong>{{ returnedAppointment.date }}</strong> at
          <strong>{{ returnedAppointment.time }} hours</strong> and your contact
          email is <strong>{{ returnedAppointment.email }}</strong> <br /><br />

          <small>(You can cancel your appointment or book another one!)</small>
        </p>
        <el-button
          type="primary"
          size="medium"
          icon="el-icon-arrow-left"
          @click="goBack()"
          plain
          round
          >Start Again</el-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      appointments: [],
      hours: [],
      tableData: [],

      step: 1,
      date: "",
      time: "",
      email: "",
      error: null,
      returnedAppointment: {},
      bookAppointmentFlag: true,
      formFlag: false,
      successFlag: false,

      URL: process.env.VUE_APP_PORT
        ? `${process.env.VUE_APP_BASE_URL}:${process.env.VUE_APP_PORT}`
        : `${process.env.VUE_APP_BASE_URL}`,
    };
  },
  methods: {
    disabledDate(time) {
      //Disable the date in the datePicker if it is a weekend day
      const isPast = time.getTime() < Date.now() - 1000 * 60 * 60 * 24;
      const isWeekend = time.getDay() == 6 || time.getDay() == 0;
      return isPast || isWeekend ? true : false;
    },
    async getAllAppointments() {
      await axios
        .get(`${this.URL}/api/appointments/`, {
          params: {
            date: this.date,
          },
        })
        .then((res) => {
          this.appointments = res.data;
        });
      this.fillTable();
    },
    fillTable() {
      this.tableData = [];
      for (let i = 9; i <= 17; i++) {
        // i = amount of whole hours from 09 to 17

        //checks if the hour corresponding to i exsits in the Appointments array
        //If not, hour is undefined
        const hour = this.appointments.find(
          (appointment) =>
            appointment != undefined && appointment.start_time == i
        );

        //checks if hour exist, uf it does, it's marked as booked
        const isBooked = hour != undefined ? true : false;

        //push data to the tableData array
        if (!isBooked) {
          this.tableData.push({
            start_time: `${i > 9 ? i : "0" + i}`,
          });
        }
      }
    },
    createAppointment() {
      //if there is not an email, return before asking the API
      if (!this.email) return (this.error = "Insert an Email");
      axios
        .post(`${this.URL}/api/appointments/`, {
          appointment_date: this.date,
          start_time: this.time,
          email: this.email,
        })
        .then((res) => {
          this.successCreatingAppointment(res.data[0]);
        })
        .catch((err) => {
          this.error = err.response.data;
        });
    },
    bookIt(row) {
      //Manages flags and sets the Hour based on the row
      this.formFlag = true;
      this.time = row.start_time;
      this.bookAppointmentFlag = false;
      this.error = null;
    },
    goBack() {
      //Manages flags and reset the email to an empty string
      this.successFlag = false;
      this.bookAppointmentFlag = true;
      this.formFlag = false;
      this.email = "";
    },
    successCreatingAppointment(data) {
      //reserts the data variables to empty strings
      this.date = "";
      this.time = "";
      this.email = "";
      //manages errors and flags
      this.error = null;
      this.formFlag = false;
      this.successFlag = true;
      this.returnedAppointment = {
        id: data.id,
        date: data.appointment_date,
        time: data.start_time,
        email: data.email,
      };
    },
  },
};
</script>
<style>
</style>