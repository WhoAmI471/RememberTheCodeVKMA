import { useState, useEffect } from 'react';
import bridge from '@vkontakte/vk-bridge';
import { View, SplitLayout, SplitCol, ScreenSpinner } from '@vkontakte/vkui';
import { useActiveVkuiLocation } from '@vkontakte/vk-mini-apps-router';

import { Home } from './panels';
import Coders from './components/Coders'
import { DEFAULT_VIEW_PANELS } from './routes';

export const App = () => {
  const { panel: activePanel = DEFAULT_VIEW_PANELS.HOME } = useActiveVkuiLocation();
  const [fetchedUser, setUser] = useState();
  const [popout, setPopout] = useState(<ScreenSpinner size="large" />);

  const [bunnerActive, setBunnerActive] = useState(false);
  const [countGames, setCountGames] = useState(0);

  useEffect(() => {
    async function fetchData() {
      const user = await bridge.send('VKWebAppGetUserInfo');
      setUser(user);
      setPopout(null);
    }
   
    fetchData();
  }, []);

  useEffect(() => {
    async function ShowBanner() {
      bridge.send('VKWebAppShowBannerAd', {
        banner_location: 'bottom'
        })
       .then((data) => { 
          if (data.result) {
            // Баннерная реклама отобразилась
          }
        })
        .catch((error) => {
          // Ошибка
          console.log(error);
        });
    }
    async function HideBanner(){
      bridge.send('VKWebAppHideBannerAd')
        .then((data) => { 
          if (data.result) {
            // Баннерная реклама скрыта
          }
        })
        .catch((error) => {
          // Ошибка
          console.log(error);
        });
    }

    if (bunnerActive){
      ShowBanner();
    } else {
      HideBanner();
    }
  }, [bunnerActive])

  async function ShareWithFriends () {
    bridge.send('VKWebAppShowWallPostBox', {
      message: 'Заходи и прокачивай свою память :-)',
      attachments: 'https://vk.com/app51876996'
      })
      .then((data) => { 
        if (data.post_id) {
          // Запись размещена
          
        }
      })
      .catch((error) => {
        // Ошибка
        console.log(error);
      });
  };

  useEffect(() => {
    async function ShowNativeAds() {
      bridge.send('VKWebAppShowNativeAds', {
        ad_format: 'interstitial' /* Тип рекламы */
        })
        .then( (data) => { 
          if (data.result) {
            // Реклама была показана
          } else {
            // Ошибка
          }
        })
        .catch((error) => { console.log(error); });
    }

    // console.log(`countGames: ${countGames}`);
    if (countGames === 3){
      ShowNativeAds();
      setCountGames(0);
    } 
  }, [countGames])

  return (
    <SplitLayout popout={popout}>
      <SplitCol>
        <View activePanel={activePanel}>
          <Coders 
            id="home" 
            setBunnerActive={setBunnerActive} 
            countGames={countGames}
            setCountGames={setCountGames} 
            ShareWithFriends={ShareWithFriends}
          />
        </View>
      </SplitCol>
    </SplitLayout>
  );
};
