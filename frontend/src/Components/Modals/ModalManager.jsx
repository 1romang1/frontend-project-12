import { useSelector } from "react-redux";
import CreateChannelModal from "./CreateChannelModal";

const ModalManager = () => {
    const modalType = useSelector(state => state.modal.type);

    switch (modalType) {
        case 'create':
            return <CreateChannelModal />
            break;
        case 'rename':
            return <RenameModal />
            break;
        case 'remove':
            return <RemoveModal />
            break;
        default:
            return null
            break;
    }
}

export default ModalManager;