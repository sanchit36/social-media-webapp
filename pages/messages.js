import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import axios from "axios";
import baseUrl from "../utils/baseUrl";
import { parseCookies } from "nookies";
import { useRouter } from "next/router";
import { Segment, Header, Divider, Comment, Grid } from "semantic-ui-react";
import Chat from "../components/Chats/Chat";
import ChatListSearch from "../components/Chats/ChatListSearch";
import { NoMessages } from "../components/Layout/NoData";

const scrollDivToBottom = (divRef) =>
  divRef.current !== null &&
  divRef.current.scrollIntoView({ behaviour: "smooth" });

function Messages({ chatsData, user }) {
  const [chats, setChats] = useState(chatsData);
  const router = useRouter();

  const socket = useRef();

  // Connection with the server
  useEffect(() => {
    if (!socket.current) {
      socket.current = io(baseUrl);
    }

    if (socket.current) {
      socket.current.emit("helloWorld", { name: "John Doe", age: 22 });
      socket.current.on("dataReceived", (msg) => {
        console.log(msg);
      });
    }
  }, []);

  useEffect(() => {
    if (chats.length > 0 && !router.query.message)
      router.push(`/messages?message=${chats[0].messagesWith}`, undefined, {
        shallow: true,
      });
  }, []);

  return (
    <>
      <Segment padded basic size="large" style={{ marginTop: "5px" }}>
        <Header
          icon="home"
          content="Go Back!"
          onClick={() => router.push("/")}
          style={{ cursor: "pointer" }}
        />
        <Divider hidden />

        <div style={{ marginBottom: "10px" }}>
          <ChatListSearch chats={chats} setChats={setChats} />
        </div>

        {chats.length > 0 ? (
          <>
            <Grid stackable>
              <Grid.Column width={4}>
                <Comment.Group size="big">
                  <Segment
                    raised
                    style={{ overflow: "auto", maxHeight: "32rem" }}
                  >
                    {chats.map((chat, i) => (
                      <Chat key={i} chat={chat} setChats={setChats} />
                    ))}
                  </Segment>
                </Comment.Group>
              </Grid.Column>
            </Grid>
          </>
        ) : (
          <NoMessages />
        )}
      </Segment>
    </>
  );
}

Messages.getInitialProps = async (ctx) => {
  try {
    const { token } = parseCookies(ctx);

    const res = await axios.get(`${baseUrl}/api/chats`, {
      headers: { Authorization: token },
    });

    return { chatsData: res.data };
  } catch (error) {
    return { errorLoading: true };
  }
};

export default Messages;
