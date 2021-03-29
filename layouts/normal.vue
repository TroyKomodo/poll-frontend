<template>
  <div class="normal">
    <header>
      <h2>
        <nuxt-link to="/"
          >KomodoPoll <img src="@/static/komodohype.webp"
        /></nuxt-link>
      </h2>
    </header>
    <main>
      <Nuxt />
    </main>
    <footer>
      <span
        >Made by Troy @
        <a href="https://komodohype.dev" target="_BLANK">KomodoHype</a></span
      ><span
        ><a href="https://streamervods.live/privacy" target="_BLANK"
          >Privacy Policy</a
        ></span
      >
    </footer>
  </div>
</template>

<style lang="scss">
@import "@/assets/scss/normal.scss";
</style>
