<template>
  <form class="index" @submit.prevent="callback">
    <div class="heading">
      <input
        v-model="title"
        maxlength="64"
        placeholder="Type your poll title here"
        required
      />
    </div>
    <ul>
      <li v-for="(option, i) in options" :key="i">
        <input
          v-model="option.value"
          maxlength="64"
          placeholder="Enter poll option"
          :required="opts.length < 2"
          @keyup="i === options.length - 1 && addNew()"
        />
      </li>
    </ul>
    <div class="options">
      <span class="cursor" @click="checkIP = !checkIP"
        ><font-awesome-icon
          :icon="checkIP ? ['fas', 'check-square'] : ['fas', 'square']"
        />IP Duplication Checking</span
      >
      <span class="cursor" @click="multiAnswer = !multiAnswer"
        ><font-awesome-icon
          :icon="multiAnswer ? ['fas', 'check-square'] : ['fas', 'square']"
        />Allow multiple answers</span
      >
      <div class="expiry">
        <span>Expiry in seconds</span
        ><input
          v-model="expiry"
          type="number"
          min="60"
          max="31536000"
          placeholder="Type the number of seconds that people will have to vote on this poll here"
        />
      </div>
    </div>
    <div v-if="errorText" class="error">
      <font-awesome-icon :icon="['fas', 'exclamation-circle']" />{{ errorText }}
    </div>
    <div class="actions">
      <button
        class="create button"
        type="submit"
        :disabled="creating"
        @click="tryCreate"
      >
        {{ !creating ? "Create Poll" : "Creating..." }}
      </button>
      <button
        class="draft button"
        type="submit"
        :disabled="creatingDraft"
        @click="tryDraft"
      >
        {{ !creatingDraft ? "Create Draft" : "Creating..." }}
      </button>
    </div>
  </form>
</template>

<script lang="ts">
import Vue from "vue";
import { createNewPoll, createNewDraft, getDraft } from "@/assets/funcs";

export default Vue.extend({
  layout: "normal",
  async asyncData({ route, app }) {
    if (typeof route.query.draft !== "string") return {};

    const draft = await getDraft(app, route.query.draft);
    if (!draft)
      return {
        errorText: "The draft you are looking for was not found.",
      };

    const options = draft.options.map((value: string) => ({ value }));
    if (options.length < 15) {
      options.push({ value: "" });
    }

    return {
      title: draft.title,
      checkIP: draft.check_ip,
      multiAnswer: draft.multi_answer,
      expiry: draft.expiry ? `${draft.expiry}` : "",
      errorText: "",
      options,
    };
  },
  data() {
    return {
      title: "",
      checkIP: true,
      multiAnswer: false,
      expiry: "",
      options: [{ value: "" }, { value: "" }, { value: "" }],
      errorText: "",
      creating: false,
      creatingDraft: false,
      callback: () => {},
    };
  },
  head() {
    return {
      title: "KomodoPoll - Create a poll!",
      meta: [
        // hid is used as unique identifier. Do not use `vmid` for it as it will not work
        {
          hid: "apple-mobile-web-app-title",
          name: "apple-mobile-web-app-title",
          content: "KomodoPoll - Create a poll!",
        },
        {
          hid: "og:title",
          name: "og:title",
          content: "KomodoPoll - Create a poll!",
        },
        {
          hid: "twitter:title",
          name: "twitter:title",
          content: "KomodoPoll - Create a poll!",
        },
        {
          hid: "og:site_name",
          name: "og:site_name",
          content: "KomodoPoll - Create a poll!",
        },
        {
          hid: "og:url",
          name: "og:url",
          content: `https://poll.komodohype.dev`,
        },
        {
          hid: "twitter:description",
          name: "twitter:description",
          content: "A site for creating polls.",
        },
        {
          hid: "og:description",
          name: "og:description",
          content: "A site for creating polls.",
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
    opts() {
      const os: string[] = [];
      this.options.forEach((o) => {
        if (o.value !== "") {
          os.push(o.value);
        }
      });
      return os;
    },
    draft() {
      return this.$route.query.draft || "";
    },
  },
  watch: {
    async draft(newValue) {
      if (newValue) {
        const draft = await getDraft(this, newValue);
        if (!draft) {
          this.title = "";
          this.checkIP = true;
          this.multiAnswer = false;
          this.expiry = "";
          this.options = [{ value: "" }, { value: "" }, { value: "" }];
          this.errorText = "The draft you are looking for was not found.";
        }

        const options = draft.options.map((value: string) => ({ value }));
        if (options.length < 15) {
          options.push({ value: "" });
        }
        this.title = draft.title;
        this.checkIP = draft.check_ip;
        this.multiAnswer = draft.multi_answer;
        this.expiry = draft.expiry ? `${draft.expiry}` : "";
        this.options = options;
        this.errorText = "";
      } else {
        this.title = "";
        this.checkIP = true;
        this.multiAnswer = false;
        this.expiry = "";
        this.options = [{ value: "" }, { value: "" }, { value: "" }];
        this.errorText = "";
      }
    },
  },
  methods: {
    tryCreate() {
      this.callback = this.createPoll;
    },
    tryDraft() {
      this.callback = this.createDraft;
    },
    addNew() {
      if (
        this.options[this.options.length - 1].value !== "" &&
        this.options.length < 20
      ) {
        this.options.push({ value: "" });
      }
    },
    async createPoll() {
      this.creating = true;
      const { poll } = await createNewPoll(
        this,
        this.title,
        this.checkIP,
        this.multiAnswer,
        this.expiry ? parseInt(this.expiry) : undefined,
        this.opts
      );
      this.$router.push(`/${poll.id}`);
      setTimeout(() => {
        this.creating = false;
      }, 1500);
    },
    async createDraft() {
      this.creatingDraft = true;
      const { poll } = await createNewDraft(
        this,
        this.title,
        this.checkIP,
        this.multiAnswer,
        this.expiry ? parseInt(this.expiry) : undefined,
        this.opts
      );
      this.$router.push(`/?draft=${poll.id}`);
      setTimeout(() => {
        this.creatingDraft = false;
      }, 1500);
    },
  },
});
</script>

<style lang="scss">
@import "@/assets/scss/index.scss";
</style>
