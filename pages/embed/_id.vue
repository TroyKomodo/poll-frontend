<template>
  <div class="embed">
    <PollResults
      v-if="results"
      :poll="poll"
      :share="true"
      :now="now"
      :embed="true"
    />
    <Poll v-else :poll="poll" :share="true" :now="now" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { getPoll, getPollVotes, getPollVotesSubscribe } from "@/assets/funcs";

export default Vue.extend({
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
  data() {
    return {
      poll: null as any,
      unsub: null as any,
      now: new Date(),
      interval: null as null | NodeJS.Timeout,
    };
  },
  computed: {
    results() {
      return this.$route.name === "embed-id-results";
    },
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
  mounted() {
    if (this.results) {
      this.unsub = getPollVotesSubscribe(this, this.poll.id, this.subCallback);
    }
    this.interval = setInterval(() => {
      this.now = new Date();
    }, 1000);
  },
  beforeDestroy() {
    if (this.unsub) {
      this.unsub();
    }
    if (this.interval) {
      clearInterval(this.interval);
    }
  },
  methods: {
    subCallback(options: any) {
      this.poll.options = options;
    },
  },
});
</script>

<style lang="scss">
@import "@/assets/scss/embed.scss";
</style>
