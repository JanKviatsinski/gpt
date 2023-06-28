export const commandEnterListenener = (collback: () => void) => {
  document.addEventListener("keydown", (event: KeyboardEvent) => {
    if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
      // Key combination detected: Command/Ctrl + Enter
      // Perform your desired action here
      collback();
    }
  });
};
