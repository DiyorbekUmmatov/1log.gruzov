import { useEffect, useState } from "react";
import { Header } from "@/widgets/Header";
import { Navbar } from "@/widgets/Navbar";
import { Outlet } from "react-router-dom";
import { I18nProvider } from "./providers/i18nProvider";
import { initDataUser, init, isTMA, viewport } from "@telegram-apps/sdk";
import { useScrollTop } from "@/shared/lib/useScroll";
import { setUserId } from "@/features/user/model/userSlice";
import { STORAGE_KEYS } from "@/shared/config/storageKeys";
import { useAppDispatch } from "@/app/hooks";

function App() {
  const [isTgReady, setIsTgReady] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    let isCancelled = false;

    (async () => {
      if (!(await isTMA())) return;
      init();

      const tgUser = initDataUser();
      if (tgUser?.id && !localStorage.getItem(STORAGE_KEYS.USER_ID)) {
        localStorage.setItem(STORAGE_KEYS.USER_ID, String(tgUser.id));
      }
      if (tgUser?.id) {
        dispatch(setUserId(String(tgUser.id)));
      }

      if (viewport.mount.isAvailable()) {
        await viewport.mount();
        viewport.expand();
      }

      if (viewport.requestFullscreen.isAvailable()) {
        await viewport.requestFullscreen();
      }

      if (!isCancelled) {
        setIsTgReady(true);
      }
    })();

    return () => {
      isCancelled = true;
    };
  }, [dispatch]);

  const mainRef = useScrollTop<HTMLDivElement>();

  return (
    <I18nProvider>
      <div
        className={`main-container ${isTgReady ? "pt-[100px]" : ""} !pb-[78px]`}
        ref={mainRef}
      >
        <Header />
        <main>
          <Outlet />
        </main>
        <Navbar />
      </div>
    </I18nProvider>
  );
}

export default App;
