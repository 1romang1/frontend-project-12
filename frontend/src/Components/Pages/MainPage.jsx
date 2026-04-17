import { Container, Row, Col } from "react-bootstrap";
import { ChannelList } from "../Channels/ChannelList";
import { MessagesList } from "../Messages/MessagesList";

const MainPage = () => {
  return (
    <div className="vh-100 d-flex flex-column bg-light">
      <div className="h-100">
        <div className="h-100" id="chat">
          <div className="d-flex flex-column h-100">
            <Container className="h-100 my-4 overflow-hidden rounded shadow">
              <Row className="h-100 bg-white flex-md-row">
                <Col
                  md={2}
                  xs={4}
                  className="border-end px-0 bg-light d-flex flex-column h-100"
                >
                  <ChannelList />
                </Col>
                <Col className="p-0 h-100">
                  <MessagesList />
                </Col>
              </Row>
            </Container>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
