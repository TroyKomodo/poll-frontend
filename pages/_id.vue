<template>
  <PollResults :poll="poll" :share="true" v-if="results" :now="now" />
  <Poll :poll="poll" :share="true" :now="now" v-else />
</template>

<script lang="ts">
import Vue from "vue";
import { getPoll, getPollVotes, getPollVotesSubscribe } from "@/assets/funcs";

export default Vue.extend({
  layout: "normal",
  computed: {
    results() {
      return this.$route.name === "id-results";
    },
  },
  data() {
    return {
      poll: null as any,
      unsub: null as any,
      now: new Date(),
      interval: null as null | NodeJS.Timeout,
    };
  },
  mounted() {
    if (this.results) {
      this.unsub = getPollVotesSubscribe(this, this.poll.id, this.subCallback);
    }
    this.interval = setInterval(() => {
      this.now = new Date();
    }, 1000);
  },
  watch: {
    results(newValue) {
      if (newValue) {
        this.unsub = getPollVotesSubscribe(
          this,
          this.poll.id,
          this.subCallback
        );
      } else if (this.unsub) {
        this.unsub();
      }
    },
  },
  beforeDestroy() {
    if (this.unsub) {
      this.unsub();
    }
    if (this.interval) {
      clearInterval(this.interval);
    }
  },
  async asyncData({ error, app, route }) {
    const poll =
      route.name === "id-results"
        ? await getPollVotes(app, route.params.id)
        : await getPoll(app, route.params.id);
    if (!poll) return error({ statusCode: 404, message: "who" });
    return {
      poll,
    };
  },
  methods: {
    subCallback(options: any) {
      this.poll.options = options;
    },
  },
});
</script>
