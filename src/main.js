import "$css/global.css";
import "$css/spinner.css";
import HMR from "@roxi/routify/hmr";
import App from "./App.svelte";

let el = document.getElementById("loading");
while (el.firstChild) el.firstChild.remove();
el.remove();

const app = HMR(App, { target: document.body }, "routify-app");

export default app;
