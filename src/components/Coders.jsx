import React, { useState, useEffect } from 'react';
import './Coders.css'
import { Panel, Input, Button, PanelHeader, SplitLayout, ModalRoot, ModalPage, ModalCard, Spacing } from '@vkontakte/vkui';
import logo from '../assets/logo.svg';

const Coders = ({ setBunnerActive, setTryOneMore, setNewGame, ShareWithFriends, startGameAfterADS, setStartGameAfterADS, startGameAfterADSInterstitial, setStartGameAfterADSInterstitial, adBlockError, setAdBlockError }) => {
  const [blocks, setBlocks] = useState([]);
  const [currentNums, setCurrentNums] = useState(null);
  const [targetNumberToString, setTargetNumberToString] = useState('');
  const [userInput, setUserInput] = useState('');
  const [isCorrect, setIsCorrect] = useState(null);
  const [isInputDisabled, setIsInputDisabled] = useState(true);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [timer, setTimer] = useState(5);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isInputValid, setIsInputValid] = useState(false);

  const [activeModal, setActiveModal] = useState('');

  const [round,setRound] = useState(1)

  const [numberSize, setNumberSize] = useState(5);
  const [sizeInput, setSizeInput] = useState(5);

  const modal = (
    <ModalRoot activeModal={activeModal}> 
      <ModalCard
        id={'GameOver'}
        // onClose={() => setActiveModal(null)}
        header="Вы проиграли"
        subheader="Можете продолжить, посмотрев короткий рекламный ролик, или начать заново."
        dismissButtonMode='none'
        actions={
          <React.Fragment>
            <Spacing size={16} />
            <Button
              size="l"
              mode="primary"
              stretched
              onClick={
                () => {
                  setTryOneMore(true);
                }
              } 
            >
              Попробовать снова 
            </Button>
            <Spacing size={16} />
            <Button
              size="l"
              mode="secondary" 
              stretched
              onClick={
                () => {
                  setNewGame(true);
                }
              }
            >
              <span style={{color:'#0AA5C7'}}>Начать заново</span>
            </Button>
            
          </React.Fragment>
        }
      />
      
      <ModalCard
        id={'EndGame'}
        header="Вы победили!"
        subheader="Продолжайте тренировать свою память, приглашайте друзей и соревнуйтесь!"
        dismissButtonMode='none'
        actions={
          <React.Fragment>
            <Spacing size={16} />
            <Button
              size="l"
              mode="primary" 
              stretched
              onClick={
                () => {
                  setNewGame(true);
                }
              } 
            >
              Сыграть ещё раз
            </Button>
            <Spacing size={16} />
            <Button 
              size="l"
              appearance="accent" 
              mode="secondary" 
              stretched
              onClick={ShareWithFriends}
            >
              <span style={{color:'#0AA5C7'}}>Поделиться с друзьями</span>
            </Button>
          </React.Fragment>
        }
      />

      <ModalCard
        id={'AdsBlockModal'}
        header="Не получилось загрузить рекламу"
        subheader="Попробуйте отключить блокировщик рекламы и VPN, а также перезпгрузите страницу, или начните игру заново."
        dismissButtonMode='none'
        actions={
          <React.Fragment>
            <Spacing size={16} />
            <Button
              size="l"
              mode="primary"
              stretched
              onClick={
                () => {
                  setActiveModal('GameOver');
                  setAdBlockError(false);
                }
              } 
            >
              Хорошо
            </Button>
          </React.Fragment>
        }
      />

    </ModalRoot>
  );

  useEffect(() => {
    if(round === 6 && isCorrect) {
      setActiveModal('EndGame');
    }
  }, [round, isCorrect])

  useEffect(() => {
    if (adBlockError) {
      setActiveModal('AdsBlockModal');
    }
  }, [adBlockError])

  useEffect(() => {
    if(startGameAfterADS) {
      startNextLevel(); 
      setRound(round);
      setStartGameAfterADS(false);
    }
    if(startGameAfterADSInterstitial) {
      startNewGame(); 
      setRound(1);
      setStartGameAfterADSInterstitial(false);
    }
  }, [startGameAfterADS, startGameAfterADSInterstitial])

  useEffect(() => {
    let intervalId;
    if (isGameStarted){
      setBunnerActive(true);
    } else {
      setBunnerActive(false)
    }

    if (isGameStarted && timer > 0) {
      intervalId = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }

    return () => clearInterval(intervalId);
  }, [isGameStarted, timer]);

  const GetRandomNum = () => {
    
    let randomNum = Math.floor(Math.random() * 9)

    if (randomNum > 9){
      randomNum = 5;
    }
    
    return `${randomNum}`;
  }

  const InitTheGame = (size) => {
    const newBlocks = Array.from({ length: size }, () => GetRandomNum());

    setBlocks(newBlocks);
    setActiveModal(null)

    setCurrentNums(null)
    setUserInput('');
    setTargetNumberToString(newBlocks.join(''));
    setIsCorrect(null);
    setIsInputDisabled(true);
    setIsGameStarted(true);
    setTimer(5);
    setIsAnswered(false);
  }

  const startNewGame = () => {
    setNumberSize(5); 
    setSizeInput(5); 
    InitTheGame(5);
    
    // Спустя 5 секунд цифры в блоках исчезнут
    setTimeout(() => {
      setBlocks(Array.from({ length: 5 }, () => ''));
      setIsInputDisabled(false);
    }, 5000);
  };

  const startNextLevel = () => {
    InitTheGame(numberSize);
    setRound(round+1)
    // Спустя 5 секунд цифры в блоках исчезнут
    setTimeout(() => {
      setBlocks(Array.from({ length: numberSize }, () => ''));
      setIsInputDisabled(false);
    }, 5000);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && isInputValid) {
      checkAnswer();
    }
  };

  const handleInputChange = (e) => {
    let value = e.target.value.replace(/\D/g, ''); // Оставляем только цифры
    value = value.slice(0, numberSize); // Ограничиваем длину до 8 символов
    setUserInput(value);
    
    if (value.length === numberSize) {
        setIsInputValid(true);
    } else {
        setIsInputValid(false);
    }
  };


  const checkAnswer = () => {
    setIsInputDisabled(true);
    let answer = '';
    if (userInput === targetNumberToString) {
      setIsCorrect(true);
      setNumberSize(numberSize + 1)

      for (let index = 0; index < userInput.length; index++) {
        const element = userInput[index];

        if (targetNumberToString[index] === element){
          answer += 'yes ';
        } else if (userInput.length - 1 == index) {
          answer += 'no';
        }
        else {
          answer += 'no ';
        }
      }
    } else {
      setIsCorrect(false);
      setActiveModal('GameOver');
      
      // setActiveModal('AdBlock');
      for (let index = 0; index < userInput.length; index++) {
        const element = userInput[index];

        if (targetNumberToString[index] === element){
          answer += 'yes ';
        } else if (userInput.length - 1 == index) {
          answer += 'no';
        }
        else {
          answer += 'no ';
        }
      }
    }
    setBlocks(targetNumberToString.split(''));
    setCurrentNums(answer.split(' '));
    setIsAnswered(true);
  };

  const isValid = userInput.trim() != '' ;

  return (
    <SplitLayout modal={modal}> 
      {isGameStarted ? (
        <Panel>
           
          <div className='famel-time'>
            <div className='round'>Раунд: {round}</div>
            <div className='timer'> ⌛ {timer} </div>
          </div>

          <div className='line'></div>
          <div className='text-zap'>Запомни код:</div>
          <div className='game'>
            {blocks.map((block, index) => (
              <div className={currentNums? `block ${currentNums[index]}` : 'block'} key={index}>{block}</div>
            ))}
          </div>

          <div className='famel-input'>
            <Input 
              className='input-game' 
              placeholder="Введите код" 
              type="text" 
              value={userInput} 
              onChange={handleInputChange} 
              onInput={e => e.target.value}
              onKeyDown={handleKeyPress}
              disabled={isInputDisabled} 
            />
          </div>                
         <div className='char-count'>{userInput.length}/{sizeInput}</div>
          {!isAnswered && (
            <div className='famel-btn'>
              <Button className='btn-snt' onClick={checkAnswer} disabled={!isInputValid || isInputDisabled || !isValid}>Проверить ответ</Button>
            </div>
          )}
            {isCorrect !== null && (
            <div className='famel-btn'>
              <div className='text-z'>
                {isCorrect ? 'Верно!' : 'Неверно!'}
              </div>
              <div className='btn-sn-container'>
                <Button 
                  className='btn-sn' 
                  onClick={
                    () => {
                      startNextLevel(); 
                      setSizeInput(sizeInput + 1);
                    }
                  }
                >
                  Продолжить
                </Button>
                
                <Button 
                  appearance="accent" 
                  mode="secondary" 
                  className='btn-sn1' 
                  onClick={ShareWithFriends}
                >
                  <span style={{color:'#0AA5C7'}}>Поделиться с друзьями</span>
                </Button>
              </div>
            </div>
          )}
        </Panel>
      ) : (
        <Panel>
          <div className='start'>
            <div className='name-app'>Запомни код</div>
            <img src={logo} alt="логотип" />
            <div className='gude'>
              Запомни за 5 секунд комбинацию цифр и введи её в поле для ответа
            </div>
            <Button className='start-game' onClick={startNewGame}>Начать игру</Button>
          </div> 
        </Panel>
      )}
    </SplitLayout>
  );
};

export default Coders;