import React from "react";
import { getAuth, buildClerkProps } from "@clerk/nextjs/server";
import { type GetServerSideProps } from "next";

const ProfilePage = () => {
  return <div>ProfilePage</div>;
};

export default ProfilePage;

// eslint-disable-next-line @typescript-eslint/require-await
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = getAuth(ctx.req);

  const userId = { session };

  console.log("userId", userId);

  if (!userId) {
    // handle user is not logged in.
  }

  // Load any data your application needs for the page using the userId
  return { props: { ...buildClerkProps(ctx.req) } };
};
