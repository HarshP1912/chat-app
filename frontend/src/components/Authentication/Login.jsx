  import React, { useState } from "react";
  import { Button, FormControl, FormLabel, VStack } from "@chakra-ui/react";
  import { Input, InputRightElement, InputGroup } from "@chakra-ui/react";
  import { useToast } from "@chakra-ui/react";
  import { useNavigate } from "react-router-dom";
  import axios  from "axios";

  function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const navigate = useNavigate();

    const handleClick = () => setShow(!show);

    const submitHandler = async () => {
      setLoading(true);
      if (!email || !password) {
        toast({
          title: "Please fill out all fields",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
        setLoading(false);
        return;
      }

      try {
        const config = {
          headers: {
            "Content-type": "application/json",
          },
        };
        const response = await axios.post(
          "/api/user/login",
          {email, password},
          config
        );
        const { data } = response;

        localStorage.setItem("userInfo", JSON.stringify(data));
        setLoading(false);
        navigate("/chats");
        toast({
          title: "Login Successful",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
      } catch (err) {
        const errorMessage = err.response
          ? err.response.data.message
          : "An error occurred";
        toast({
          title: "Error Occured",
          description: errorMessage,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
        setLoading(false);
      }
    };

    return (
      <VStack spacing={"5px"}>
        <FormControl id="e-mail" isRequired>
          <FormLabel>E-mail</FormLabel>
          <Input
            placeholder={"Enter your E-mail"}
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </FormControl>
        <FormControl id="password" isRequired>
          <FormLabel>Password</FormLabel>
          <InputGroup>
            <Input
              type={show ? "text" : "password"}
              placeholder={"Enter your password"}
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
            <InputRightElement>
              <Button h="1.75rem" size={"sm"} onClick={handleClick}>
                {show ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>
        <Button
          colorScheme="purple"
          width={"100%"}
          marginTop={"1rem"}
          onClick={submitHandler}
          isLoading={loading}
        >
          Login
        </Button>
        <Button
          marginTop={"0.5rem"}
          variant={"solid"}
          colorScheme="pink"
          width={"100%"}
          onClick={() => {
            setEmail("guest@example.com");
            setPassword("123456");
          }}
        >
          Guest User
        </Button>
      </VStack>
    );
  }

  export default Login;
