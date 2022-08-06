import { Alert, AlertIcon, Button } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import React, { useState } from "react";
import { InputField } from "../components/InputField";
import Wrapper from "../components/Wrapper";
import { useForgotPasswordMutation } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";

const forgotPassword: React.FC<{}> = ({}) => {
  const [isComplete, setIsComplete] = useState(false);
  const [, sendLink] = useForgotPasswordMutation();

  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ email: "" }}
        onSubmit={async (values, { setErrors }) => {
          await sendLink(values);
          setIsComplete(true);
        }}
      >
        {({ values, handleChange, isSubmitting }) =>
          isComplete ? (
            <Alert status="success">
              <AlertIcon />
              If an account exists, an email with the reset link has been sent!
            </Alert>
          ) : (
            <Form>
              <InputField name="email" placeholder="email" label="Email" />
              <Button
                type="submit"
                color="teal"
                isLoading={isSubmitting}
                mt={4}
              >
                Send Link
              </Button>
            </Form>
          )
        }
      </Formik>
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient)(forgotPassword);
