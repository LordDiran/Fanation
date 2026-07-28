import { redirect } from "next/navigation";

/** app.fanation.app root — the app lives at /feed; landing stays on fanation.app. */
export default function Root() {
  redirect("/feed");
}
