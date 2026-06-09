import { useSelector } from "react-redux";

const ModalManger = () => {
    const modalType = useSelector(state => state.modal.type);

    switch (modalType) {
        case 'create':
            return <CreateModal />
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