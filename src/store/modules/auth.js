import axios from '@/api';
import moment from 'moment';

const state = {
  user: {},
  isAuthenticated: false
};
const getters = {
  getUnavailabilityAsEvents: state => {
    if (!state.user.current_unavailability) return [];
    return state.user.current_unavailability.map(p => {
      return {
        id: 'unavailable',
        title: 'Busy',
        editable: false,
        eventType: 'unavailability',
        start: p.start,
        end: p.end,
        dow: p.dow
      };
    });
  },
  getCourseScheduleAsEvents: (state, getters, rootState, rootGetters) => {
    if (!rootGetters.current_schedule) return [];
    // Turn periods into this week's schedule...
    const events = rootGetters.current_schedule
      .map(c =>
        c.periods.map(p => {
          let start = moment(p.start, 'Hmm', true).format('HH:mm');

          let end = moment(p.end, 'Hmm', true).format('HH:mm');

          return {
            id: 'course',
            eventType: 'course',
            title: `${c.longname} ${getters.periodType(p.type)}`,
            start,
            end,
            dow: [p.day],
            color: c.color,
            editable: false,
            period: p,
            course: c
          };
        })
      )
      .flat();

    return events;
  }
};

const actions = {
  async GET_USER ({ dispatch }) {
    try {
      const response = await axios.get('/students/user');
      const user = response.data.user;
      await dispatch('SET_USER', user);
    } catch (e) {
      console.log('Not logged in!');
    }
  },
  async SET_USER ({ dispatch, commit }, user) {
    commit('SET_USER', user);
    await dispatch('UPDATE_SCHEDULE');
  },
  async UPDATE_COURSE ({ state, commit, rootGetters }, updatedCourse) {
    commit('UPDATE_COURSE', {
      currentTermCode: rootGetters.currentTerm.code,
      updatedCourse
    });

    // call API
    const request = await axios.post('/setup/courses', {
      courses: rootGetters.current_schedule
    });

    commit('SET_USER', request.data.updatedUser);
  }
};

const mutations = {
  SET_USER: (state, user) => {
    state.user = user;
    state.isAuthenticated = true;
  },
  UPDATE_COURSE: (state, { currentTermCode, updatedCourse }) => {
    Object.assign(
      state.user.semester_schedules[currentTermCode].find(
        c => c.crn === updatedCourse.crn
      ),
      updatedCourse
    );
  },
  UNSET_USER: state => {
    state.user = {};
    state.isAuthenticated = false;
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
