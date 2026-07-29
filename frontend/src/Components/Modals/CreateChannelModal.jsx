import { useSelector } from "react-redux";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from 'react-bootstrap/Form'
import { Formik, Form as FormikForm } from "formik";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import { closeModal, openModal } from "../../store/slices/modalSlice";
import { useCreateChannelMutation } from "../../api/channelsApi";
import { setCurrentChannelId } from "../../store/slices/channelsSlice";

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
  const [createChannel, { isError }] = useCreateChannelMutation();

  return (
    <Modal aria-labelledby="contained-modal-title-vcenter" centered show onHide={() => dispatch(closeModal())}>
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
            onSubmit={async (values) => {
              try {
                const response = await createChannel(values).unwrap();
                console.log("response:", response);
                console.log("response.id:", response.id);
                dispatch(setCurrentChannelId(response.id));
                // navigate("/");

              } catch (error) {
                console.error("Login error", error);
              }
            }}
          >
            <FormikForm id='create-modal-form'>
              <MyTextInput
                name="name"
                type="text"
              />

              {/* {isError && <div>Неверный логин или пароль</div>} */}

            </FormikForm>
          </Formik>
        </>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary">Отменить</Button>
        <Button type='submit' form='create-modal-form'>Отправить</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateChannelModal;
