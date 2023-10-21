import React, { useState, useEffect } from 'react';
import ContainerDiv from '../components/ContainerDiv';
import GeneralCard from '../components/GeneralCard/GeneralCard';
import getMyDecks from '../services/decks/getMyDecks';
import useAppContext from '../../context/AppContext';
import getDeckProgress from '../services/decks/getDeckProgress';
import getPreferentColor from '../services/colors/getPreferentColor';
import { Link } from 'react-router-dom';
import LoadingPage from './LoadingPage';
import '../../style.css';
import resetCardsScore from '../services/decks/resetCardsScore';
import removeDeckFromUser from '../services/decks/removeDeckFromUser';

export default function MyDecksPage() {
  const [deckList, setDeckList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [myProgressList, setMyProgressList] = useState({});
  const [deleteMode, setDeleteMode] = useState(false);
  const { store } = useAppContext();
  const { username, id } = store;

  useEffect(() => {
    getMyDecks(id)
      .then((res) => {
        setDeckList(res.decks);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching decks:', error);
        setIsLoading(false);
      });
  }, [id]);

  useEffect(() => {
    const fetchProgress = async () => {
      const progressList = {};
      for (const deck of deckList) {
        try {
          const progress = await getDeckProgress({ user_id: id, deck_id: deck.id });
          progressList[deck.id] = progress;
        } catch (error) {
          console.error('Error fetching deck progress:', error);
        }
      }
      setMyProgressList(progressList);
    };

    if (deckList.length > 0) {
      fetchProgress();
    }
  }, [deckList, id]);

  const getDecksAreas = () => {
    const areas = [...new Set(deckList.map((deck) => deck.area))];
    return areas;
  };

  const colorMode = getPreferentColor();

  const toggleDeleteMode = () => {
    setDeleteMode(!deleteMode);
  };

  const handleDeleteDeck = (deckId) => {
    console.log(deckId)
    resetCardsScore(id, deckId)
      .then(() => {
        removeDeckFromUser(id, deckId)
          .then(() => {
            setTimeout(() => {
              setDeckList((prevDeckList) => prevDeckList.filter((deck) => deck.id !== deckId));
            }, 2000);
          })
          .catch((error) => {
            console.error('Error removing deck from user:', error);
          });
      })
      .catch((error) => {
        console.error('Error resetting card scores:', error);
      });
  };

  if (isLoading) {
    return <LoadingPage />;
  }

  if (!deckList.length) {
    return (
      <div className="h-auto container">
        <ContainerDiv title="My Decks" overflow="y" className="text-dark-mode justify-content-center align-items-center flex-direction-row">
          <div className="text-center g-0">
            <p className="pt-5 text-white">
              You don't have activated any decks!! 😊 <br /> Go to <Link to={`../../${username}/alldecks`}>All decks</Link> to activate the first one
            </p>
          </div>
        </ContainerDiv>
      </div>
    );
  }

  return (
    <div className="h-auto container">
      <button className={`btn card-btn-${colorMode} float-end me-3`} onClick={toggleDeleteMode}>
        {deleteMode ? <i className="fa-solid fa-arrow-right-from-bracket"></i> : <i className="fas fa-edit"></i>}
      </button>

      <ContainerDiv title="My Decks" overflow="y">
        {getDecksAreas().map((area, index) => (
          <ContainerDiv key={index} subtitle={area} height="75" overflow="x">
            {deckList.map((deck, index) => {
              if (deck.area === area) {
                return (
                  <div key={index} className={`deck-card${deleteMode ? ' shake' : ''}`}>

                    <GeneralCard title={deck.specialize} minWidth="15rem" minHeight="20rem" shadow="-lg" progress={myProgressList[deck.id]}>
                      {deck.theme}
                      {!deleteMode ?  (
                        <div className="d-flex mt-3">
                          <Link to={`../../${username}/${deck.id}`} className={`btn card-btn-${colorMode} my-auto w-100 me-2`}>Go Game</Link>
                          <Link to={`../../${username}/${deck.id}/review`} className={`btn card-btn-${colorMode} my-auto w-100`}>Review</Link>
                        </div>
                      ): (
                        <div>
                          <btn className="btn btn-danger" onClick={() => handleDeleteDeck(deck.id)}>
                            {/* <i className="fas fa-circle-minus text-white" style={{ color: '#d20f0f' }}> Delete</i> */}
                            DELETE
                          </btn>
                        </div>
                      )}
                    </GeneralCard>
                  </div>
                );
              }
            })}
          </ContainerDiv>
        ))}
      </ContainerDiv>
    </div>
  );
}
