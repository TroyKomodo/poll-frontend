import { Plugin } from "@nuxt/types";
import { EventEmitter } from "eventemitter3";

class WS extends EventEmitter {
  ws?: WebSocket;
  destroyed = false;
  open = false;
  constructor() {
    super();
    if (!process.client) throw new Error("client only!");
    this.configure();
  }
  private configure() {
    this.emit("configure");
    this.open = false;
    this.ws = new WebSocket(process.env.WS_URL!);
    this.ws.onmessage = this.onMessage.bind(this);
    this.ws.onopen = this.onOpen.bind(this);
    this.ws.onclose = this.onClose.bind(this);
  }
  private onMessage(ev: Event) {
    this.emit("message", ev);
  }
  private onOpen() {
    this.open = true;
    this.emit("open");
  }
  private onClose() {
    this.emit("closed");
    if (this.destroyed) return;
    this.configure();
  }
  public async Send(data: string) {
    if (!this.open) await new Promise((resolve) => this.once("open", resolve));
    this.ws?.send(data);
  }
  public destroy() {
    this.destroyed = true;
    this.ws?.close();
    this.emit("destroy");
  }
}

declare module "vue/types/vue" {
  // this.$myInjectedFunction inside Vue components
  interface Vue {
    $ws: WS;
  }
}

declare module "@nuxt/types" {
  // nuxtContext.app.$myInjectedFunction inside asyncData, fetch, plugins, middleware, nuxtServerInit
  interface NuxtAppOptions {
    $ws: WS;
  }
  // nuxtContext.$myInjectedFunction
  interface Context {
    $ws: WS;
  }
}

declare module "vuex/types/index" {
  // this.$myInjectedFunction inside Vuex stores
  interface Store<S> {
    $ws: WS;
  }
}

const myPlugin: Plugin = (context, inject) => {
  const ws = new WS();
  inject("ws", ws);
};

export default myPlugin;
