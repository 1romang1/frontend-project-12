import { Container, Row, Col } from "react-bootstrap";
import { ChannelList } from "../Channels/ChannelList";
import { MessagesList } from "../Messages/MessagesList";

const MainPage = () => {
  return (
    <div className="h-100 bg-light">
      <div className="h-100">
        <div className="h-100" id="chat">
          <Container fluid className="h-100">
            <Row className="h-100">
              <Col xs={3} className="border-end px-0">
                <ChannelList />
              </Col>
              <Col xs={9} className="d-flex flex-column px-0">
                <MessagesList />
              </Col>
            </Row>
          </Container>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
