import { RootNavigation } from "@navigation";
import { store } from "@store";
import { Provider } from "react-redux";
import Toast from "react-native-toast-message";
import { toastConfig } from "@config";
import "react-native-reanimated";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <RootNavigation />
        <Toast config={toastConfig} />
      </Provider>
    </QueryClientProvider>
  );
}
