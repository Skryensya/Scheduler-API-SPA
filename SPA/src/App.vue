<template>
  <el-tabs class="container" style="margin-top: -65px">
    <el-tab-pane label="Main">
      <h1>Death's Scheduler</h1>
      <span>Where you can book an appointment to dance with the Death!</span>
      <br />
      <br />
      <el-tabs type="border-card">
        <el-tab-pane label="Book Appointments"
          ><CreateAppointments
        /></el-tab-pane>
        <el-tab-pane label="Cancel Appointments"
          ><DeleteAppointments
        /></el-tab-pane>
      </el-tabs>
    </el-tab-pane>
    <el-tab-pane label="Audit">
      <AuditAppointments />
    </el-tab-pane>
    <el-tab-pane label="About">
      <About/>
    </el-tab-pane>
  </el-tabs>
  <el-backtop />
</template>

<script>
import CreateAppointments from "./components/CreateAppointments.vue";
import DeleteAppointments from "./components/DeleteAppointments.vue";
import AuditAppointments from "./components/AuditAppointments.vue";
import About from "./components/About.vue"
export default {
  name: "App",
  components: {
    CreateAppointments,
    DeleteAppointments,
    AuditAppointments,
    About,
  },
};
</script>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
