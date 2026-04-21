'use client';

import Cal, { getCalApi } from "@calcom/embed-react";
import { useEffect } from "react";

export default function CalEmbed() {
  useEffect(() => {
    (async function () {
      const cal = await getCalApi({});
      cal("ui", {
        theme: "dark",
        hideBranding: true,
        cssVarsPerTheme: {
          light: { "cal-brand": "#FF6B35" },
          dark: { "cal-brand": "#FF6B35" },
        },
        hideEventTypeDetails: false,
        layout: "month_view",
      });
    })();
  }, []);

  return (
    <div
      id="book"
      className="w-full rounded-xl overflow-hidden"
    >
      <Cal
        calLink="bad-alien/free-consult"
        style={{ width: "100%", overflow: "scroll" }}
        config={{ layout: "month_view" }}
      />
    </div>
  );
}
