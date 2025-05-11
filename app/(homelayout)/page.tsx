"use client";

import { useAppContext } from "@/lib/context";
import { redirect } from "next/navigation";

const Home: React.FC = () => {
  const { user } = useAppContext();

  // check if the url has any query params
  const urlParams = new URLSearchParams(window.location.search);
  const queryString = urlParams.toString();
  const querySuffix = queryString ? `?${queryString}` : "";

  if (user?.role === "admin") {
    return redirect(`/manage-events${querySuffix}`);
  }

  return redirect(`/${querySuffix}`);

  // if (user?.role === "user") {
  //   return redirect(`/events${querySuffix}`);
  // }

  // return redirect(`/login${querySuffix}`);
};

export default Home;
