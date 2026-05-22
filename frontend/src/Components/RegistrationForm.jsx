import { Formik, Form, useField } from "formik";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { setCredentials } from "../store/slices/authSlice";
import { useSignupMutation } from "../api/signupApi";

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

const RegistrationForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [signup, { isError }] = useSignupMutation();
    return (
        <>
            <Formik
                initialValues={{
                    username: "",
                    password: "",
                    passwordConfirmation: "",
                }}
                validationSchema={Yup.object({
                    username: Yup.string()
                        .max(15, "Must be 15 characters or less")
                        .required("Required"),
                    password: Yup.string()
                        .required("Required")
                        .min(5, "Minimum of 5 characters"),
                    passwordConfirmation: Yup.string()
                        .required("Required")
                        .oneOf([Yup.ref("password")], "Passwords must match"),
                })}
                onSubmit={async (values) => {
                    try {
                        const { username, password } = values;
                        const response = await signup({
                            username,
                            password,
                        }).unwrap();
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
                        placeholder="Имя пользователя"
                    />

                    <MyTextInput
                        label="Password"
                        name="password"
                        type="password"
                        placeholder="Пароль"
                    />

                    <MyTextInput
                        label="passwordConfirmation"
                        name="passwordConfirmation"
                        type="password"
                        placeholder="Подтвердите пароль"
                    />
                    {isError && <div>Неверный логин или пароль</div>}
                    <button type="submit">Submit</button>
                </Form>
            </Formik>
        </>
    );
};

export default RegistrationForm;
