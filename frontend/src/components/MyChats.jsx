  import React from "react";
  import { ChatState } from "../Context/chatProvider";
  import { useState, useEffect } from "react";
  import { useToast } from "@chakra-ui/react";
  import axios from "axios";
  import ChatLoading from "./ChatLoading";
  import { getSender } from "../config/ChatLogic";
  import { Box, Button, Text, Stack } from "@chakra-ui/react";
  import { AddIcon } from "@chakra-ui/icons";
  import GroupChatModal from "./Misc/GroupChatModal";

  function MyChats({fetchAgain}) {
    const [loggedUser, setLoggedUser] = useState();
    const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();
    const toast = useToast();

    const fetchChats = async () => {
      try {
        // console.log(user.token);
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.get("/api/chat/", config,);
        // console.log(data);
        setChats(data);
      } catch (error) {
        toast({
          title: "Error Occured",
          description: "Failed to load the chats",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom-left",
        });
        return;
      }
    };

    useEffect(() => {
      setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
      fetchChats();
    }, [fetchAgain]);

    return (
      <>
        <Box
          display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
          flexDir="column"
          alignItems="center"
          p={3}
          bg="white"
          w={{ base: "100%", md: "31%" }}
          borderRadius="lg"
          borderWidth="1px"
        >
          <Box
            p={3}
            bg="white"
            w="100%"
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}
            fontSize={{ base: "28px", md: "30px" }}
            fontFamily={"Work sans"}
          >
            My Chats
            <GroupChatModal>
              <Button
                display={"flex"}
                fontSize={{ base: "17px", md: "10px", lg: "17px" }}
                rightIcon={<AddIcon />}
              >
                New Group Chat
              </Button>
            </GroupChatModal>
          </Box>
          <Box
            d="flex"
            flexDir="column"
            p={3}
            bg="#F8F8F8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {chats? (
              <Stack>
                {chats.map((chat) => (
                  <Box
                    onClick={() => setSelectedChat(chat)}
                    cursor="pointer"
                    bg={selectedChat === chat ? "purple" : "#E8E8E8"}
                    color={selectedChat === chat ? "white" : "black"}
                    px={3}
                    py={2}
                    borderRadius="lg"
                    key={chat._id}
                  >
                    <Text>
                      {!chat.isGroupChat
                        ? getSender(loggedUser, chat.users)
                        : chat.chatName}
                    </Text>
                  </Box>
                ))}
              </Stack>
            ) : (
              <ChatLoading />
            )}
          </Box>
        </Box>
      </>
    );
  }

  export default MyChats;
