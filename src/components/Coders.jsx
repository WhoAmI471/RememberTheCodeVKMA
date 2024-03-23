import React, { useState, useEffect } from 'react';
import './Coders.css'
import { Panel, Input, Button, PanelHeader } from '@vkontakte/vkui';
import logo from '../assets/logo.svg';

const Coders = ({ setBunnerActive, countGames, setCountGames, ShareWithFriends }) => {
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

  const startNewGame = () => {
    setCurrentNums(null)
    const newBlocks = Array.from({ length: 8 }, () => GetRandomNum());
    setBlocks(newBlocks);
    setTargetNumberToString(newBlocks.join(''));
    setIsCorrect(null);
    setUserInput('');
    setIsInputDisabled(true);
    setIsGameStarted(true);
    setTimer(5);
    setIsAnswered(false);
    
    // Спустя 5 секунд цифры в блоках исчезнут
    setTimeout(() => {
      setBlocks(Array.from({ length: 8 }, () => ''));
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
    value = value.slice(0, 8); // Ограничиваем длину до 8 символов
    setUserInput(value);
    
    if (value.length === 8) {
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
    setCountGames(countGames + 1);

  };

  const isValid = userInput.trim() != '' ;

  return (
    <> 
      {isGameStarted ? (
        <Panel>
          <div className='famel-time'>
            <div className='timer'>⌛ {timer} </div>
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
         <div className='char-count'>{userInput.length}/8</div>
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
                <Button className='btn-sn' onClick={startNewGame}>Играть снова</Button>
                <Button appearance="accent" mode="secondary" className='btn-sn1' onClick={ShareWithFriends}><span style={{color:'#0AA5C7'}}>Поделиться с друзьями</span></Button>
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
    </>
  );
};

export default Coders;