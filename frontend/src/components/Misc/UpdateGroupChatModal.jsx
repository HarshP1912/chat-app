import React, { useState } from "react";
import {
  Box,
  IconButton,
  Input,
  Spinner,
  Text,
  useDisclosure,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import { ChatState } from "../../Context/chatProvider";
import UserBadgeItem from "./UserBadgeItem";
import UserListItem from "../UserListItem";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function UpdateGroupChatModal({ fetchAgain, setFetchAgain, fetchMessages }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, selectedChat, setSelectedChat } = ChatState();
  const [groupChatName, setGroupChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const handleRename = async () => {
    if (!groupChatName) {
      toast({
        title: "Please fill Updated Chat Name",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    if (!selectedChat?._id) {
      toast({
        title: "No chat selected",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    try {
      setRenameLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        "/api/chat/rename",
        {
          chatId: selectedChat._id,
          chatName: groupChatName,
        },
        config
      );
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
    } catch (error) {
      toast({
        title: "Failed to Rename the Chat",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      setRenameLoading(false);
    }
  };

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      setSearchResult([]);
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/user?search=${query}`, config);
      setSearchResult(data);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load search results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      setLoading(false);
    }
  };

  const handleRemove = async (delUser) => {
    if (!selectedChat) {
      toast({
        title: "No chat selected",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    if (selectedChat.users.length === 3) {
      toast({
        title: "A group must have more than two members",
        status: "error",
        duration: 5000,
        position: "top",
        isClosable: true,
      });
      return;
    }
    if (
      delUser._id === selectedChat.groupAdmin._id &&
      selectedChat.groupAdmin._id !== user._id
    ) {
      toast({
        title: "You cannot remove admin",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
      return;
    } else if (selectedChat.groupAdmin._id !== user._id) {
      toast({
        title: "Only Admin can remove users",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
      return;
    } else if (delUser._id === user._id) {
      handleLeave();
      return;
    }
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        "/api/chat/groupremove",
        {
          chatId: selectedChat._id,
          userId: delUser._id,
        },
        config
      );
      setSelectedChat(data);
      fetchMessages();
      setFetchAgain(!fetchAgain);

    } catch (error) {
      toast({
        title: "Failed to remove user",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }
  };

  const handleAddUser = async (useradd) => {
    if (!selectedChat) {
      toast({
        title: "No chat selected",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    if (selectedChat.users.find((u) => u._id === useradd._id)) {
      toast({
        title: "User already in the group",
        status: "warning",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    if (selectedChat.groupAdmin._id !== user._id) {
      toast({
        title: "Only the admin can add someone",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        "/api/chat/groupadd",
        {
          chatId: selectedChat._id,
          userId: useradd._id,
        },
        config
      );
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
    } catch (error) {
      toast({
        title: "Failed to add user",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }
  };

  const handleLeave = async () => {
    if (!selectedChat) {
      toast({
        title: "No chat selected",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    if (selectedChat.users.length === 3) {
      toast({
        title: "A group must have more than two members",
        status: "error",
        duration: 5000,
        position: "top",
        isClosable: true,
      });
      return;
    }
    if (selectedChat.groupAdmin._id === user._id) {
      toast({
        title:
          "You are the admin, please transfer your Admin rights before leaving group",
        status: "error",
        duration: 5000,
        position: "top",
        isClosable: true,
      });
      return;
    }
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        "/api/chat/groupremove",
        {
          chatId: selectedChat._id,
          userId: user._id,
        },
        config
      );
      navigate("/api/chats");
      setFetchAgain(!fetchAgain);
      toast({
        title: "You have left the group",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    } catch (error) {
      toast({
        title: "Failed to leave the group",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }
  };
  return (
    <>
      <IconButton
        display={{ base: "flex" }}
        onClick={onOpen}
        icon={<HamburgerIcon />}
      ></IconButton>
      <Modal isOpen={isOpen} onClose={onClose} isCentered size={'2xl'}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize={"35px"}
            fontFamily={"Work sans"}
            display={"flex"}
            justifyContent={"center"}
          >
            {selectedChat.chatName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box w="100%" display={"flex"} flexWrap={"wrap"}>
              <Text>Members: </Text>
              {selectedChat.users?.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  handleFunction={() => handleRemove(u)}
                />
              ))}
            </Box>
            <FormControl display={"flex"} justifyContent={"space-evenly"}>
              <Input
                placeholder={"Update Chat Name"}
                mb={3}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <Button
                colorScheme="purple"
                isLoading={renameLoading}
                ml={1}
                onClick={handleRename}
              >
                Update
              </Button>
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add Users to Group"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            {loading ? (
              <div>
                <Spinner size={"sm"}></Spinner>
              </div>
            ) : (
              searchResult
                ?.slice(0, 4)
                .map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleAddUser(user)}
                  />
                ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={handleLeave}>
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default UpdateGroupChatModal;
