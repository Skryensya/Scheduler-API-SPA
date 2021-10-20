<template>
  <h1>About Panel</h1>
  <el-card class="box-card">
    <p>
      <strong>Made by Allison Peña October 2021</strong><br />
      <strong><a href="">Github repository</a></strong
      ><br />
    </p>
    <hr />
    <div style="text-align: left">
      <p>The requirements:</p>
      <ol>
        <li>
          Create an REST API and implement it as a CRUD that keeps appointments
          with the following considerations:
          <ul>
            <li>
              The system should not allow to book more than 1 appointment for
              the same hour.
            </li>
            <li>
              The schedule must be set for office hours (9 am to 6 pm Monday to
              Friday) all year long
            </li>
            <li>
              every appointment must contain date, start time and contact
              information (like e-mail).
            </li>
            <li>You can only book appointments of 1 hour long</li>
          </ul>
        </li>
        <li>
          Create a web client for the API you just created:
          <ul>
            <li>
              The first layout will display a date selector showcasing the
              current month
            </li>
            <li>
              If you click on any date, the available hour spaces will be
              displayed on screen to be selected.
            </li>
          </ul>
        </li>
      </ol>
    </div>

  </el-card>
</template>

