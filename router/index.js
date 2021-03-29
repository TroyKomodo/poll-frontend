import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export function createRouter(ssrContext, createDefaultRouter, routerOptions) {
  const options = routerOptions || createDefaultRouter(ssrContext).options;

  options.routes.forEach((r) => {
    if (r.name === "id") {
      options.routes.push({
        path: "/:id/r",
        component: r.component,
        name: "id-results",
      });
    } else if (r.name === "embed-id") {
      options.routes.push({
        path: "/embed/:id/r",
        component: r.component,
        name: "embed-id-results",
      });
    }
  });

  return new Router(options);
}
