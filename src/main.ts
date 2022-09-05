import initRouter, {charts} from "./routing/router";
import "./style.css";

initRouter();
charts[window.location.hash.slice(1) ?? 'default']();
