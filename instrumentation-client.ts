import { initBotId } from "botid/client/core";

initBotId({
  protect: [
    {
      path: "/api/diagnostics",
      method: "POST",
      advancedOptions: { checkLevel: "basic" },
    },
  ],
});
