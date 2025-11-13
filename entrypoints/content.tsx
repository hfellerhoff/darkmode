// entrypoints/example-ui.content/index.tsx
import ReactDOM from "react-dom/client";
import App from "./content/App";
import "./content/App.css";

export default defineContentScript({
  matches: ["*://*/*"],
  main(ctx) {
    const ui = createIntegratedUi(ctx, {
      position: "overlay",
      anchor: "body",
      onMount: (container) => {
        console.log("mount");

        // Create a root on the UI container and render a component
        const root = ReactDOM.createRoot(container);
        root.render(<App />);
        return root;
      },
      onRemove: (root) => {
        // Unmount the root when the UI is removed
        root.unmount();
      },
    });

    // Call mount to add the UI to the DOM
    ui.mount();
  },
});
