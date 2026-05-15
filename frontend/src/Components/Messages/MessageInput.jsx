import { Form, Button, InputGroup } from 'react-bootstrap';
import { useSendMessageMutation } from '../../api/messagesApi';
import { useSelector } from 'react-redux';
import { useFormik } from 'formik';

export const MessageInput = () => {
  const [sendMessage] = useSendMessageMutation();

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
          channelsId: currentChannelId,
          username,
        }).unwrap();
        
      }
    }
  })
}