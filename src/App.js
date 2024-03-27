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
  const [tryOneMore, setTryOneMore] = useState(false);
  const [startGameAfterADS, setStartGameAfterADS] = useState(false);
  const [startGameAfterADSInterstitial, setStartGameAfterADSInterstitial] = useState(false);
  const [newGame, setNewGame] = useState(false);
  const [adBlockError, setAdBlockError] = useState(false);

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
      message: 'Заходи и прокачивай свою память!',
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
    async function ShowNativeAdsReward() {
      bridge.send('VKWebAppShowNativeAds', {
        ad_format: 'reward' /* Тип рекламы */
        })
        .then( (data) => { 
          if (data.result) {
            setStartGameAfterADS(true);
          } else {
            // Ошибка
          }
        })
        .catch((error) => { console.log(error); setAdBlockError(true);});
    }

    async function ShowNativeAdsInterstitial() {
      bridge.send('VKWebAppShowNativeAds', {
        ad_format: 'interstitial' /* Тип рекламы */
        })
        .then( (data) => { 
          if (data.result) {
            setStartGameAfterADSInterstitial(true);
          } else {
            // Ошибка
          }
        })
        .catch((error) => { 
          console.log(error); 
          setStartGameAfterADSInterstitial(true);
        });
    }

    if (tryOneMore){
      ShowNativeAdsReward();
      setTryOneMore(false);
    } 

    if (newGame) {
      ShowNativeAdsInterstitial();
      setNewGame(false);
    }
  }, [tryOneMore, newGame])

  return (
    <SplitLayout popout={popout}>
      <SplitCol>
        <View activePanel={activePanel}>
          <Coders 
            id="home" 
            setBunnerActive={setBunnerActive} 
            setTryOneMore={setTryOneMore} 
            setNewGame={setNewGame} 
            ShareWithFriends={ShareWithFriends}
            startGameAfterADS={startGameAfterADS}
            setStartGameAfterADS={setStartGameAfterADS}
            startGameAfterADSInterstitial={startGameAfterADSInterstitial}
            setStartGameAfterADSInterstitial={setStartGameAfterADSInterstitial}
            adBlockError={adBlockError}
            setAdBlockError={setAdBlockError}
          />
        </View>
      </SplitCol>
    </SplitLayout>
  );
};
