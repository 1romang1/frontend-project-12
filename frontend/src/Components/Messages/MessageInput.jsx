import { Form, Button, InputGroup } from 'react-bootstrap';
import { useSendMessageMutation } from '../../api/messagesApi';
import { useSelector } from 'react-redux';
import { useFormik } from 'formik';

export const MessageInput = () => {
  const [sendMessage, {isLoading}] = useSendMessageMutation();

  const currentChannelId = useSelector((state) => state.channels.currentChannelId);

  const username = useSelector((state) => state.auth.username);

  const formik = useFormik({
    initialValues: {
      body: '',
    },
    onSubmit: async (values, {resetForm}) => {
      const trimmedValues = values.body.trim();
      if(!trimmedValues) return;

      try {
        await sendMessage({
          body: trimmedValues,
          channelId: currentChannelId,
          username,
        }).unwrap();
        
        resetForm();
      } catch (err) {
        console.error('Ошибка сети', err);
      }
    }
  });
   return (
    <div className="mt-auto px-5 py-3">
      <Form
        className="py-1 border rounded-2"
        onSubmit={formik.handleSubmit}
      >
        <InputGroup>
          <Form.Control
            name="body"
            placeholder="Введите сообщение..."
            className="border-0 p-0 ps-2"
            value={formik.values.body}
            onChange={formik.handleChange}
          />

          <Button
            type="submit"
            variant="light"
            disabled={isLoading || !formik.values.body.trim()}
          >
            ➤
          </Button>
        </InputGroup>
      </Form>
    </div>
  );
}