<template>
  <div class="error">
    <div>
      <h2>404 The page you were looking for was not found...</h2>
      <h3>Go back <nuxt-link to="/">home</nuxt-link></h3>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  head() {
    return {
      title: "KomodoPoll - 404 Not found",
      meta: [
        // hid is used as unique identifier. Do not use "vmid` for it as it will not work
        {
          hid: "apple-mobile-web-app-title",
          name: "apple-mobile-web-app-title",
          content: "KomodoPoll - 404 Not found",
        },
        {
          hid: "og:title",
          name: "og:title",
          content: "KomodoPoll - 404 Not found",
        },
        {
          hid: "twitter:title",
          name: "twitter:title",
          content: "KomodoPoll - 404 Not found",
        },
        {
          hid: "og:site_name",
          name: "og:site_name",
          content: "KomodoPoll - 404 Not found",
        },
        {
          hid: "og:url",
          name: "og:url",
          content: "https://poll.komodohype.dev",
        },
        {
          hid: "twitter:description",
          name: "twitter:description",
          content: "KomodoPoll - 404 Not found",
        },
        {
          hid: "og:description",
          name: "og:description",
          content: "KomodoPoll - 404 Not found",
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
});
</script>

<style scoped lang="scss">
.error {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  flex-grow: 1;
  text-align: center;
  font-size: 1.5rem;
  > div {
    margin: auto;
  }
}

a {
  color: #55e43c;
  text-decoration: none;
  transition: color 200ms ease;
  font-weight: 400;
  &:hover {
    color: #22a30b;
  }
}
</style>
