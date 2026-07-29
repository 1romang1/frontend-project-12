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
                dispatch(setCurrentChannelId(response.id));
              } catch (error) {
                console.error("Login error", error);
              }
            }}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
            }) => (
              <FormikForm id='create-modal-form'>
                <Form.Group controlId='name' className="mb-3">
                  <Form.Control
                    name='name'
                    type='text'
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    autoFocus
                    isInvalid={touched.name && !!errors.name}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.name}
                  </Form.Control.Feedback>
                </Form.Group>
              </FormikForm>
            )}
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
