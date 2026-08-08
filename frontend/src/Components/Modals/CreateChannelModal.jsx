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
import { useRef } from "react";



const CreateChannelModal = () => {
  const inputRef = useRef(null);
  // const modalStatus = useSelector((state) => state.modal.type);
  const dispatch = useDispatch();
  const [createChannel, { isError }] = useCreateChannelMutation();

  return (
    <Modal aria-labelledby="contained-modal-title-vcenter"
    centered
    show
    onHide={() => dispatch(closeModal())}
    onEntered={() => inputRef.current?.focus()}>
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
                  ref={inputRef}
                    name='name'
                    type='text'
                    value={values.name}
                    onChange={handleChange}
                    onFocus={() => console.log("FOCUS")}
                    onBlur={(e) => {
                      console.log("BLUR");
                      handleBlur(e);
                    }}
                    isInvalid={touched.name && !!errors.name}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.name}
                  </Form.Control.Feedback>
                </Form.Group>
                <div className="d-flex justify-content-end gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => dispatch(closeModal())}
                  >
                    Отменить
                  </Button>

                  <Button type="submit">
                    Отправить
                  </Button>
                </div>
              </FormikForm>
            )}
          </Formik>
        </>
      </Modal.Body>
      {/* <Modal.Footer>
        <Button variant="secondary">Отменить</Button>
        <Button type='submit' form='create-modal-form'>Отправить</Button>
      </Modal.Footer> */}
    </Modal>
  );
};

export default CreateChannelModal;
