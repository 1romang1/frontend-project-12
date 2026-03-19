import { Formik, Form, useField } from "formik";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { setCredentials } from "../store/slices/authSlice";
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
  const navigate = useNavigate();
  const [login, { isError }] = useLoginMutation();
  return (
    <>
      <Formik
        initialValues={{
          username: "",
          password: "",
        }}
        validationSchema={Yup.object({
          username: Yup.string()
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
            navigate("/");
          } catch (error) {
            console.error("Login error", error);
          }
        }}
      >
        <Form>
          <MyTextInput
            label="User Name"
            name="username"
            type="text"
            placeholder="Ivan"
          />

          <MyTextInput
            label="Password"
            name="password"
            type="text"
            placeholder="**********"
          />
          {isError && <div>Неверный логин или пароль</div>}
          <button type="submit">Submit</button>
        </Form>
      </Formik>
    </>
  );
};

export default LoginForm;
