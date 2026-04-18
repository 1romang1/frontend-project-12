import { Form, Button, InputGroup } from 'react-bootstrap';

function MessageInput() {
  return (
    <div className="mt-auto px-5 py-3">
      <Form className="py-1 border rounded-2">
        <InputGroup>
          <Form.Control
            name="body"
            placeholder="Введите сообщение..."
            className="border-0 p-0 ps-2"
          />
          <Button disabled variant="light">
            ➤
          </Button>
        </InputGroup>
      </Form>
    </div>
  );
}

export default MessageInput;
