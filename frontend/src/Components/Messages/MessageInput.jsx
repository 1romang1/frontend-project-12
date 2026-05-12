import { Form, Button, InputGroup } from 'react-bootstrap';
import { useSendMessageMutation } from '../../api/messagesApi';
import { useSelector } from 'react-redux';
import { useFormik } from 'formik';

export const MessageInput = () => {
  const [sendMessage] = useSendMessageMutation;

  const currentChannelId = useSelector((state) => state.channels.currentChannelId);

  const username = useSelector((state) => state.auth.username);

console.log(username)
return (
    <div className="text-break mb-2">
      <b>{username}</b>: {currentChannelId}
    </div>
  );
}