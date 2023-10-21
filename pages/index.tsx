import React, { useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import { getToken } from "next-auth/jwt";
import { getSession } from "next-auth/react";
import AlbumList from "../components/AlbumList";
import Heading from "../components/Heading";
import Layout from "../components/Layout";
import PlaylistList from "../components/PlaylistList";
import { customGet } from "../utils/customGet";
import { getGreeting } from "../utils/getGreeting";
import { isAuthenticated } from "../utils/isAuthenticated";
import { Profile } from "../types/types"
import Question from "../components/gpt/Question.jsx";
import { systemConditions1 } from "../components/gpt/systemConditions/systemConditions1"
import { getProfile } from "../utils/database/calls";


export default function Home({ newReleases, featuredPlaylists }) {
  const [reply, setReply] = useState("")
  return (
    <Layout title="Welcome to Spotify">
      <h1 className="mb-5 text-3xl font-bold">Good {getGreeting()}</h1>
      {/* <Question setReply={setReply} systemConditions={systemConditions1} /> */}
      
      <Heading text="New releases" className="mt-10" />
      <AlbumList albums={newReleases?.albums.items} />

      <Heading text={featuredPlaylists?.message} className="mt-16" />
      <PlaylistList playlists={featuredPlaylists?.playlists.items} />
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx);

  if (!(await isAuthenticated(session))) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
  console.log(`session = ${JSON.stringify(session)}`)

  // Add profile to database
  const newProfile = {
    name: session.user.name,
    email: session.user.email,
    credits: 10
  }
  await getProfile(newProfile)

  const newReleases = await customGet(
    "https://api.spotify.com/v1/browse/new-releases?country=AU&limit=25",
    session
  );

  const featuredPlaylists = await customGet(
    "https://api.spotify.com/v1/browse/featured-playlists?country=AU",
    session
  );

  return { props: { newReleases, featuredPlaylists } };
};
