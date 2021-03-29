<template>
  <div class="poll">
    <div class="heading">
      <h3>{{ poll.title }}</h3>
      <span v-if="expiryText" class="right">{{ expiryText }}</span>
    </div>
    <ul>
      <template v-for="(option, i) in poll.options">
        <li :key="`${i}-1`">
          <span>{{ option.title }}</span
          ><span class="value">{{ option.votes }} Votes</span>
        </li>
        <li :key="`${i}-2`">
          <div
            class="percent"
            :style="{ width: `${total ? (option.votes / total) * 100 : 0}%` }"
          ></div>
          <span class="value"
            >{{ total ? round((option.votes / total) * 100) : 0 }}%</span
          >
        </li>
      </template>
    </ul>
    <div class="total">{{ total }} total votes</div>
    <div class="actions">
      <nuxt-link
        class="vote button"
        :to="`${embed ? '/embed/' : '/'}${poll.id}`"
        >Cast a vote</nuxt-link
      >
      <button
        v-if="share"
        class="share right button"
        :disabled="coppied"
        @click="copy"
      >
        <font-awesome-icon :icon="['fas', 'share-alt']" />{{
          coppied ? "Coppied" : "Share"
        }}
      </button>
    </div>
    <div class="timestamp">
      Created <span :title="poll.created_at">{{ agoText }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import moment from "moment";

export default Vue.extend({
  props: ["poll", "share", "now", "embed"],
  data() {
    return {
      coppied: false,
      expiryText: "",
      agoText: "",
    };
  },
  head() {
    const desc = `KomodoPoll Results - ${
      this.poll.title
    }\n${this.poll.options.map(
      (o: any) =>
        `[${o.title}] - ${o.votes} out of ${this.total} - ${
          this.total ? this.round((o.votes / this.total) * 100) : 0
        }%`
    )}`;
    return {
      title: `KomodoPoll Results - ${this.poll.title}`,
      meta: [
        // hid is used as unique identifier. Do not use `vmid` for it as it will not work
        {
          hid: "apple-mobile-web-app-title",
          name: "apple-mobile-web-app-title",
          content: `KomodoPoll Results - ${this.poll.title}`,
        },
        {
          hid: "og:title",
          name: "og:title",
          content: `KomodoPoll Results - ${this.poll.title}`,
        },
        {
          hid: "twitter:title",
          name: "twitter:title",
          content: `KomodoPoll Results - ${this.poll.title}`,
        },
        {
          hid: "og:site_name",
          name: "og:site_name",
          content: `KomodoPoll Results - ${this.poll.title}`,
        },
        {
          hid: "og:url",
          name: "og:url",
          content: `https://poll.komodohype.dev/${this.poll.id}`,
        },
        {
          hid: "twitter:description",
          name: "twitter:description",
          content: desc,
        },
        {
          hid: "og:description",
          name: "og:description",
          content: desc,
        },
        {
          hid: "twitter:image",
          name: "twitter:image",
          content: "/komodohype.webp",
        },
        {
          hid: "og:image",
          name: "og:image",
          content: "/komodohype.webp",
        },
        {
          hid: "twitter:site",
          name: "twitter:site",
          content: "@troydota",
        },
        {
          hid: "twitter:image:alt",
          name: "twitter:image:alt",
          content: "KomodoHype",
        },
        {
          hid: "og:type",
          name: "og:type",
          content: "website",
        },
      ],
    };
  },
  computed: {
    total() {
      let i = 0;
      this.poll.options.forEach((o: any) => (i += o.votes));
      return i;
    },
  },
  created() {
    this.computeExpiryText();
  },
  methods: {
    computeExpiryText(this: any) {
      this.agoText = moment(this.poll.created_at).from(this.now);
      if (!this.poll.expiry) return (this.expiryText = null);
      const date = new Date(this.poll.expiry);
      const ts = moment(date).from(this.now, true);
      this.expiryText =
        this.now > date ? `Expired ${ts} ago` : `Expires in ${ts}`;
    },
    round(n: number) {
      return Math.round(n * 100) / 100;
    },
    copy() {
      const input = document.createElement("input");
      input.setAttribute("value", location.href);
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      this.coppied = true;
      setTimeout(() => {
        this.coppied = false;
      }, 1500);
    },
  },
});
</script>

<style lang="scss">
@import "@/assets/scss/poll.scss";
</style>
