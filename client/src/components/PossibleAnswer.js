import React, {useState, forwardRef, useImperativeHandle} from "react";
import ListGroup from 'react-bootstrap/ListGroup';

const PossibleAnswer = forwardRef((props, ref) => {
    const [AnswerRevealed, setAnswerRevealed] = useState(false);
    const [color, setColor] = useState("");

    const clicked = () => {
        setAnswerRevealed(true);
        setColor(props.correctAnswer ? "success" : "danger");
    };

    useImperativeHandle(ref, () => ({

        refreshAnswer () {
            setAnswerRevealed(false);
            setColor("");
        }
    
      }));


  return (
    <ListGroup.Item 
    action
    onClick={clicked} 
    as="li"
    className="d-flex justify-content-between align-items-start"
    variant={color}
    >
        <div className="ms-2">
        {props.word.meaning}
        </div>   
        {(AnswerRevealed) &&       
        <div className="border-left me-2">
            {props.word.translation}
        </div>
        }
    </ListGroup.Item>
  );
});

export default PossibleAnswer;
