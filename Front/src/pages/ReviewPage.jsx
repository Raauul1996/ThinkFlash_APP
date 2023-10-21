import { useState, useEffect } from "react";
import GeneralCard from "../components/GeneralCard/GeneralCard";
import ContainerDiv from "../components/ContainerDiv";
import getPreferentColor from "../services/colors/getPreferentColor";
import useAppContext from "../../context/AppContext";
import getDeckCards from "../services/cards/getDeckCards";
import { useParams } from "react-router-dom";
import LoadingPage from "./LoadingPage";
import "../../style.css";

export default function ReviewPage() {
    const [cardList, setCardList] = useState([]);
    const [learnedCardList, setLearnedCardList] = useState([]);
    const [midLearnedCardList, setMidLearnedCardList] = useState([]);
    const [toLearnCardList, setToLearnCardList] = useState([]);
    const [isLoading, setIsLoading] = useState(true)
    const { store } = useAppContext();
    const { id } = store;

    const params = useParams();
    const deck_id = params.deck_id;

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const res = await getDeckCards(id, deck_id);
                setCardList(res.cards);
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching decks:', error);
                setIsLoading(false);
            }
        };

        fetchData();
    }, [deck_id, id]);

useEffect(() => {
    setToLearnCardList(cardList.filter(card => card.score === 1));
    setMidLearnedCardList(cardList.filter(card => card.score > 1 && card.score < 4));
    setLearnedCardList(cardList.filter(card => card.score === 4));
}, [cardList]);

console.log("card list", cardList)
console.log("learned list", learnedCardList)
console.log("midlearnedList", midLearnedCardList)
console.log("tolearnlist", toLearnCardList)


const colorMode = getPreferentColor();

return (
    <div className="h-auto container">
         <ContainerDiv title="To Learn Cards" overflow="y">
            {toLearnCardList.map((card, index) => {
                return(
                    <GeneralCard key={index} title={card.concept} minWidth="15rem" minHeight="20rem" shadow={"-lg"}
                    className=""
                    img='https://i.ibb.co/Phs1CSV/Logo-2-removebg-preview.png'>
                        {card.description}
                    </GeneralCard>
                )
            })

            }

        </ContainerDiv>
        <ContainerDiv title="MidLearned Cards" overflow="y">
            {midLearnedCardList.map((card, index) => {
                return(
                    <GeneralCard key={index} title={card.concept} minWidth="15rem" minHeight="20rem" shadow={"-lg"}
                    className=""
                    img='https://i.ibb.co/Phs1CSV/Logo-2-removebg-preview.png'>
                        {card.description}
                    </GeneralCard>
                )
            })

            }

        </ContainerDiv>
        <ContainerDiv title="Learned Cards" overflow="y">
            {learnedCardList.map((card, index) => {
                return(
                    <GeneralCard key={index} title={card.concept} minWidth="15rem" minHeight="20rem" shadow={"-lg"}
                    className=""
                    img='https://i.ibb.co/Phs1CSV/Logo-2-removebg-preview.png'>
                        {card.description}
                    </GeneralCard>
                )
            })

            }

        </ContainerDiv>
    </div>
);
}