<!--Sidebar: Daily schedule module-->
<template>
  <div class="sidebar-schedule">
    <div
      v-if="onBreak"
      class="no-classes"
    >
      <i class="fas fa-umbrella-beach no-classes-icon" />
      <div class="panel-block has-text-grey no-hover">
        <span v-if="!nextTerm">No courses over break!</span>
        <span v-else>
          {{ daysUntilNextTerm }} days left of break until
          {{ nextTerm.name }}!
        </span>
      </div>
    </div>
    <div
      v-else-if="!setup"
      class="no-classes"
    >
      <i class="far fa-frown no-classes-icon" />
      <div class="panel-block has-text-grey no-hover">
        You have not set your course schedule yet!
      </div>
    </div>
    <div
      v-else
      class="sidebar-body agenda"
    >
      <div
        v-if="filteredTodaysAgenda.length === 0"
        class="no-classes"
      >
        <i class="far fa-calendar-check no-classes-icon" />
        <div class="panel-block has-text-grey">
          Nothing scheduled for the
          {{
            todaysAgenda.length === filteredTodaysAgenda.length
              ? ""
              : "rest of the "
          }}day!
        </div>
      </div>
      <div
        v-for="event in filteredTodaysAgenda"
        :key="
          event.course.crn + '-' + event.start.toString() + event.end.toString()
        "
        class="panel-block event is-flex"
        :class="{
          'is-active': isCurrentEvent(event),
          passed: hasPassed(event.end),
          clickable: event.link
        }"
        @click="$store.commit('OPEN_COURSE_MODAL', event.course); eventClicked(event)"
      >
        <CourseAssessmentDot :course="event.course" />
        <span
          class="event-title"
          style="flex: 1"
          :title="
            event.eventType === 'period'
              ? 'Class at ' + event.period.location
              : 'Work/Study'
          "
        >
          <template v-if="event.eventType === 'period'">
            <b class="period-title">{{ event.course.title }}</b>
            <span class="has-text-grey">{{ periodType(event.period.type) }}</span>
          </template>
          <template v-else-if="event.eventType === 'work-block'">
            <span>
              {{
                event.assessmentType === "assignment"
                  ? "Work on "
                  : "Study for "
              }}
            </span>
            <b>{{ event.assessment.title }}</b>
          </template>
        </span>

        <span
          class="event-times is-pulled-right has-text-grey tooltip is-tooltip-left"
          :data-tooltip="
            timeFormat(event.start) + ' - ' + timeFormat(event.end)
          "
        >{{ timeFormat(event.start) }}</span>
      </div>
    </div>
    <div
      v-if="!onBreak && setup"
      class="panel-block has-background-light has-text-centered no-hover"
    >
      <b-button
        :class="{'is-active': showPassed}"
        class="is-fullwidth showPassedButton"
        @click="showPassed = !showPassed"
      >
        <i
          class="show-passed-icon far"
          :class="[showPassed ? 'fa-eye' : 'fa-eye-slash']"
        />
        {{ showPassed ? "Hide" : "Show" }} Past
      </b-button>
    </div>
    <div
      v-if="!onBreak && !setup"
      class="panel-block has-background-light has-text-centered no-hover"
    >
      <router-link
        class="button is-secondary is-fullwidth showPassedButton"
        to="/account"
      >
        <i class="show-passed-icon far fa-edit" />
        Account Setup
      </router-link>
    </div>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  name: 'SidebarSchedule',
  props: {
    todaysAgenda: { type: Array, required: true }
  },
  data () {
    return {
      showPassed: true
    }
  },
  computed: {
    setup () {
      return this.$store.getters.userSetup.course_schedule
    },
    filteredTodaysAgenda () {
      return this.showPassed
        ? this.todaysAgenda
        : this.todaysAgenda.filter(e => !this.hasPassed(e.end))
    },
    nextTerm () {
      return this.$store.getters.nextTerm
    },
    daysUntilNextTerm () {
      return moment(this.nextTerm.start).diff(this.rightNow, 'days')
    },
    schedule () {
      return this.$store.state.schedule
    },
    classesOver () {
      return this.$store.getters.classesOver
    },
    isWeekend () {
      return moment().day() === 6 || moment().day() === 0
    },
    dateStr () {
      return moment(this.schedule.date).format('YYYY-MM-DD')
    },
    currentEvent () {
      return this.todaysAgenda.find(this.isCurrentEvent)
    }
  },
  watch: {
    showPassed (sP) {
      localStorage.setItem('agendaShowPassed', sP)
    }
  },
  mounted () {
    if (localStorage.getItem('agendaShowPassed')) {
      try {
        this.showPassed = JSON.parse(localStorage.getItem('agendaShowPassed'))
      } catch (e) {
        localStorage.removeItem('agendaShowPassed')
      }
    }
  },
  created () {
    this.$emit('update-current-event', this.currentEvent)
  },
  methods: {
    openCourseModal (course) {
      this.$store.commit('OPEN_COURSE_MODAL', course)
    },
    periodType (type) {
      return this.$store.getters.periodType(type)
    },
    eventClicked (event) {
      if (event.link) this.$router.push(event.link)
    },
    fromNow (datetime) {
      const time = moment(datetime, 'Hmm', true)
      return `${time.isBefore(this.rightNow) ? 'Started' : 'Starting'} ${time.from(
        this.rightNow
      )}`
    },
    hasPassed (datetime) {
      return datetime.isBefore(this.rightNow)
    },
    isCurrentEvent (event) {
      return moment(this.rightNow).isBetween(event.start, event.end)
    },
    duration: p => p.end.diff(p.start, 'minutes')
  }
}
</script>

<style lang='scss' scoped>
.panel-block.is-active {
  border-left: 3px solid #3273dc;
}

.event {
  padding: 10px;
  cursor: pointer;
  &.has-background-success {
    font-weight: bold;
    color: white;
    .event-times span {
      color: white;
    }
  }

  &.passed {
    background-color: #eaeaea;
    color: #929292;
  }

  .period-title {
    cursor: pointer;
    margin-right: 3px;
  }
}

.showPassedButton:hover {
  background-color: #f5efef;
}
.showPassedButton:focus {
  border-color: #dbdbdb;
  box-shadow: none !important;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0) !important;
}

.show-passed-icon {
  margin-right: 5px;
}

.no-classes i {
  width: 100%;
  text-align: center;
  font-size: 4em;
  padding: 15px 0px 5px 0px;
  display: block;
  color: rgba(128, 128, 128, 0.5);

  border-left: 1px solid #dbdbdb;
  border-right: 1px solid #dbdbdb;
}

.no-classes div {
  display: block;
  width: 100%;
  text-align: center;
}

.no-classes div:hover {
  background-color: inherit !important;
}
</style>
