import { Formik, Form, useField } from "formik";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import { setCredentials, logout } from "../store/slices/authSlice";
import { useLoginMutation } from "../api/authApi";

const MyTextInput = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  return (
    <>
      <label htmlFor={props.id || props.name}>{label}</label>
      <input className="text-input" {...field} {...props} />
      {meta.touched && meta.error ? (
        <div className="error">{meta.error}</div>
      ) : null}
    </>
  );
};

const LoginForm = () => {
  const dispatch = useDispatch();
  const [login]  = useLoginMutation();
  return (
    <>
      <Formik
        initialValues={{
          userName: "",
          password: "",
        }}
        validationSchema={Yup.object({
          userName: Yup.string()
            .max(15, "Must be 15 characters or less")
            .required("Required"),
          password: Yup.string()
            .required("Required")
            .min(5, "Minimum of 5 characters"),
        })}
        onSubmit={async (values) => {
          try {
            const response = await login(values).unwrap();
            dispatch(setCredentials(response));
          } catch (error) {
            console.error("Login error", error);
          }
        }}
      >
        <Form>
          <MyTextInput
            label="User Name"
            name="userName"
            type="text"
            placeholder="Ivan"
          />

          <MyTextInput
            label="Password"
            name="password"
            type="text"
            placeholder="**********"
          />

          <button type="submit">Submit</button>
        </Form>
      </Formik>
    </>
  );
};

export default LoginForm;
