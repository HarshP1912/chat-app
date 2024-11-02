import React from "react";
import { ChatState } from "../Context/chatProvider";
import { Box } from "@chakra-ui/react";
import SingleChat from "./SingleChat";

function ChatBox({ fetchAgain, setFetchAgain }) {
  const { selectedChat } = ChatState();
  return (
    <>
      <Box
        display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
        w={{ base: "100%", md: "67%" }}
        alignItems={"center"}
        flexDir={"column"}
        p={3}
        bg={"white"}
        borderRadius={"lg"}
        borderWidth={"1px"}
      >
        <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
      </Box>
    </>
  );
}

export default ChatBox;
