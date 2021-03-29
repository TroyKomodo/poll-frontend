<template>
  <div class="poll">
    <div class="heading">
      <h3>{{ poll.title }}</h3>
      <span v-if="expiryText" class="right">{{ expiryText }}</span>
    </div>
    <ul>
      <li
        v-for="(option, i) in poll.options"
        :key="i"
        @click="() => toggleSelection(i)"
      >
        <font-awesome-icon
          :icon="
            selected.includes(i) ? ['fas', 'check-square'] : ['fas', 'square']
          "
        /><span>{{ option.title }}</span>
      </li>
    </ul>
    <div v-if="errorText" class="error">
      <font-awesome-icon :icon="['fas', 'exclamation-circle']" />{{ errorText }}
    </div>
    <div class="actions">
      <button
        class="vote button"
        @click="castVote"
        :disabled="voted || expired"
        :class="{ expired }"
        :title="expired ? expiryText : ''"
      >
        Vote
      </button>
      <button
        v-if="share"
        class="copy right button"
        @click="copy"
        :disabled="coppied"
      >
        <font-awesome-icon :icon="['fas', 'share-alt']" />{{
          coppied ? "Coppied" : "Copy Link"
        }}
      </button>
      <nuxt-link to="r" class="results right button" append
        ><font-awesome-icon :icon="['fas', 'poll']" />Results</nuxt-link
      >
    </div>
    <div class="timestamp">
      Created <span :title="poll.created_at">{{ agoText }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import moment from "moment";
import { castVote } from "@/assets/funcs";

export default Vue.extend({
  props: ["poll", "share", "now", "embed"],
  data() {
    return {
      selected: [] as number[],
      coppied: false,
      voted: false,
      errorText: "",
      expiryText: "",
      agoText: "",
      expired: false,
    };
  },
  created() {
    this.computeExpiryText();
  },
  head() {
    const desc = `KomodoPoll - ${this.poll.title}`;
    return {
      title: `KomodoPoll - ${this.poll.title}`,
      meta: [
        // hid is used as unique identifier. Do not use `vmid` for it as it will not work
        {
          hid: "apple-mobile-web-app-title",
          name: "apple-mobile-web-app-title",
          content: `KomodoPoll - ${this.poll.title}`,
        },
        {
          hid: "og:title",
          name: "og:title",
          content: `KomodoPoll - ${this.poll.title}`,
        },
        {
          hid: "twitter:title",
          name: "twitter:title",
          content: `KomodoPoll - ${this.poll.title}`,
        },
        {
          hid: "og:site_name",
          name: "og:site_name",
          content: `KomodoPoll - ${this.poll.title}`,
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
  methods: {
    computeExpiryText(this: any) {
      this.agoText = moment(this.poll.created_at).from(this.now);
      if (!this.poll.expiry) return (this.expiryText = null);
      const date = new Date(this.poll.expiry);
      const ts = moment(date).from(this.now, true);
      this.expired = this.now > date;
      this.expiryText = this.expired ? `Expired ${ts} ago` : `Expires in ${ts}`;
    },
    toggleSelection(index: number) {
      const pos = this.selected.indexOf(index);
      if (pos !== -1) {
        this.selected.splice(pos, 1);
      } else if (!this.poll.multi_answer) {
        this.selected = [index];
      } else {
        this.selected.push(index);
      }
    },
    async castVote() {
      if (this.selected.length === 0) return;
      this.voted = true;
      const vote = await castVote(this, this.poll.id, this.selected);
      if (vote === "SUCCESS") {
        this.$router.push(`/${this.embed ? "/embed/" : ""}${this.poll.id}/r`);
      } else if (vote === "ALREADY_VOTED") {
        this.errorText = "You have already voted on this poll.";
      } else if (vote === "EXPIRED") {
        this.errorText =
          "The time for voting on this poll has already expired.";
      }
      this.voted = false;
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
  watch: {
    now(newValue) {
      this.computeExpiryText();
    },
  },
});
</script>

<style lang="scss">
@import "@/assets/scss/poll.scss";
</style>
