import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth.js';
import { useUiStoreApi } from '../store/ui.js';

export default function useLogout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const logout = useAuthStore((state) => state.logout);
  const uiStore = useUiStoreApi();

  return () => {
    logout();
    uiStore.setState({ currentChannelId: null, modal: null, modalChannelId: null });
    queryClient.clear();
    navigate('/login', { replace: true });
  };
}
