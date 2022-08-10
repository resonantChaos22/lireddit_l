import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  CloseButton,
  Flex,
  Link,
  useDisclosure,
} from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { NextPage } from "next";
import { withUrqlClient } from "next-urql";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { InputField } from "../../components/InputField";
import Wrapper from "../../components/Wrapper";
import { useChangePasswordMutation } from "../../generated/graphql";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { toErrorMap } from "../../utils/toErrorMap";

const ChangePassword: NextPage = () => {
  const [tokenError, setTokenError] = useState("");
  const [, changePassword] = useChangePasswordMutation();
  const router = useRouter();
  const { isOpen, onClose, onOpen } = useDisclosure({ defaultIsOpen: true });
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ newPassword: "" }}
        onSubmit={async (values, { setErrors }) => {
          const response = await changePassword({
            token:
              typeof router.query.token === "string" ? router.query.token : "",
            newPassword: values.newPassword,
          });
          if (response.data?.changePassword.errors) {
            const errorMap = toErrorMap(response.data.changePassword.errors);
            if ("token" in errorMap) {
              setTokenError(errorMap.token);
              onOpen();
            }

            setErrors(errorMap);
          } else if (response.data?.changePassword.user) {
            router.push("/");
          }
        }}
      >
        {({ values, handleChange, isSubmitting }) => (
          <Form>
            <InputField
              name="newPassword"
              placeholder="new password"
              label="New Password"
              type="password"
            />
            <Button type="submit" mt={4} color="teal" isLoading={isSubmitting}>
              Change Password
            </Button>
            {tokenError && isOpen ? (
              <Alert status="error" mt={8}>
                <AlertIcon />
                <Flex>
                  <AlertTitle>{tokenError}</AlertTitle>
                  <AlertDescription mr={2}>
                    <NextLink href={"/forgot-password"}>
                      <Link>Try Again</Link>
                    </NextLink>
                  </AlertDescription>
                </Flex>
                <CloseButton onClick={onClose} ml="auto" />
              </Alert>
            ) : null}
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

//  this is used to given token the value based on what's the url
// ChangePassword.getInitialProps = ({ query }) => {
//   return {
//     token: query.token as string,
//   };
// };
//  Do not use if not needed, as it prevents it from server-side rendering the page.

export default withUrqlClient(createUrqlClient)(ChangePassword);
