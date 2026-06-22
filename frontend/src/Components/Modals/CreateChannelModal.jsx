import { useSelector } from "react-redux";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Formik, Form, useField } from "formik";
import { useDispatch } from "react-redux";
// import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { use } from "react";
import { closeModal, openModal } from "../../store/slices/modalSlice";
// import { setCredentials } from "../store/slices/authSlice";
// import { useSignupMutation } from "../api/signupApi";

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

const CreateChannelModal = () => {
  // const modalStatus = useSelector((state) => state.modal.type);
  const dispatch = useDispatch();
  // const navigate = useNavigate();
  // const [signup, { isError }] = useSignupMutation();
  return (
    <Modal aria-labelledby="contained-modal-title-vcenter" centered show onHide={()=> dispatch(closeModal())}>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Добавить канал
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <>
          <Formik //код ниже взять из другого модуля для образца
            initialValues={{
              name: "",
            }}
            validationSchema={Yup.object({
              name: Yup.string()
                .max(20, "Must be 20 characters or less")
                .required("Required")
                .min(3, "Minimum of 3 characters"),
            })}
            // onSubmit={async (values) => {
            //   try {
            //     const response = await login(values).unwrap();
            //     dispatch(setCredentials(response));
            //     navigate("/");
            //   } catch (error) {
            //     console.error("Login error", error);
            //   }
            // }}
          >
            <Form>
              <MyTextInput
                label="User Name"
                name="name"
                type="text"
                placeholder="Ivan"
              />

              {/* {isError && <div>Неверный логин или пароль</div>} */}

            </Form>
          </Formik>
        </>
      </Modal.Body>
      <Modal.Footer>
        <Button>Отменить</Button>
        <Button>Отправить</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateChannelModal;
