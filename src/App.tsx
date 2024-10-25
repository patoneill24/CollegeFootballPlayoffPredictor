import './App.css';
import { useCallback, useState } from 'react';
import {DndProvider} from 'react-dnd';
import {HTML5Backend} from 'react-dnd-html5-backend';
import {useDrag} from 'react-dnd';
import {useDrop} from 'react-dnd';
import React, {useEffect } from 'react';
import { Client } from 'appwrite';

const client = new Client();
client.setProject('671af1940018ab6ff0e3');

interface Team {
  name: string;
}


interface Match {
  name: string;
  teams: Team[];
}

interface Round {
  name: string;
  matches: Match[];
}

interface BracketProps {
  rounds: Round[];
}

class DropZoneProps {
  onDrop: (name: string) => void;
}

interface Item {
  name: string;
}


function Title(){
  return <div>
    <h1>2025 CFB Playoff Prediction</h1>
    <h2>Team Selection</h2>
  </div>
}

const initialTeams:Team[] = [
  {name: 'Texas'},
  {name: 'Oregon'},
  {name: 'Penn State'},
  {name: 'Ohio State'},
  {name: 'Georgia'},
  {name: 'Miami FL'},
  {name: 'Alabama'},
  {name: 'LSU'},
  {name: 'Iowa State'},
  {name: 'Clemson'},
  {name: 'Tennessee'},
  {name: 'Notre Dame'},
  {name: 'BYU'},
  {name: 'Texas A&M'},
  {name: 'Boise State'},
  {name: 'Indiana'},
  {name: 'Kansas State'},
  {name: 'Ole Miss'},
  {name: 'Missouri'},
  {name: 'Pitt'},
  {name: 'SMU'},
  {name: 'Illinois'},
  {name: 'Army'},
  {name: 'Michigan'},
  {name: 'Navy'},
  {name: 'Utah'}
];

function TeamSelection({name}:Team){
  
  const [, drag] = useDrag(() => ({
    type: 'box',
    item: {name},
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));
  return(
      <>
        <button ref={drag}>{name}</button>
      </>
  )
}


function CreateBracket(){
  const [topTeams, setTeams] = useState<Team[]>([]);
  const [teams, setAvailableTeams] = useState<Team[]>(initialTeams);
  const [rounds, setRounds] = useState<Round[]>([]);
  const [championshipTeams, setChampionshipTeams] = useState<Team[]>([]);
  const [championshipScore, setChampionshipScore] = useState<[number, number]>([0,0]);
  const [showChampionshipScore, setShowChampionshipScore] = useState(false);
  const [showScoreBoard, setShowScoreBoard] = useState(false);

  function DropZone({onDrop}: DropZoneProps) {
    const [, drop] = useDrop<Item>(() => ({
      accept: 'box',
      drop: (item) => onDrop(item.name),
      collect: (monitor) => ({
        isOver: monitor.isOver(),
      }),
    }));
    return (
      <div className='TeamSlots' ref={drop}> 
        <h2>Drop Top 12 Teams Here</h2>
          {topTeams.map((team) => (
            <button className='Slot'>{team.name}</button>
          ))}
      </div>
    );
  }

  const moveTeam = (name: string) => {
    if (topTeams.length >= 12) {
      alert('You Cannot add any more teams!');
      return;
    }
    const newTeams = teams.filter((team) => name === team.name);
    const newAvailableTeams = teams.filter((team) => name !== team.name);
    setTeams(topTeams => [...topTeams, newTeams[0]]);
    setAvailableTeams(newAvailableTeams);
  };

  const initializeBracket = useCallback(() => {
    const newRounds: Round[] = [
      {name: 'Round 1'
      ,matches: [
        { name: 'Match 1', teams: [topTeams[11], topTeams[4]] },
        { name: 'Match 2', teams: [topTeams[8], topTeams[7]] },
        { name: 'Match 3', teams: [topTeams[10], topTeams[5]] },
        { name: 'Match 4', teams: [topTeams[9], topTeams[6]] }
      ]},
      {name: 'Quarterfinals',
      matches: [
        { name: 'Match 5', teams: [{name: "Winner of Match 1"}, topTeams[3]]},
        { name: 'Match 6', teams: [{name: "Winner of Match 2"}, topTeams[0]] },
        { name: 'Match 7', teams: [{name: "Winner of Match 3"}, topTeams[2]] },
        { name: 'Match 8', teams: [{name: "Winner of Match 4"}, topTeams[1]] }
      ]},
      {name: 'Semifinals',
      matches: [
        {name: 'Match 9', teams: [{name:"Winner of Match 5"}, {name: "Winner of Match 6"}]},
        {name: 'Match 10', teams: [{name:"Winner of Match 7"}, {name: "Winner of Match 8"}]}
      ]},
      {name: 'Championship',
      matches: [
        {name: 'Match 11', teams: [{name: "Winner of Match 9"}, {name: "Winner of Match 10"}]}
      ]},
      {name: 'Champion',
      matches: [
        {name: 'National Champion', teams: [{name: "Winner of Match 11"}] }
      ]
      }
    ];
    setRounds(newRounds);
  },[topTeams]);


  const initializeChampionshipTeams = useCallback(() => {
  const newChampionshipTeams: Team[] = [
    {name: 'Championship Team 1'},
    {name: 'Championship Team 2'}
  ]; 
  setChampionshipTeams(newChampionshipTeams);
  },[]);

  const initializeChampionshipScore = useCallback(() => {
    const newChampionshipScore: [number, number] = [0,0];
    setChampionshipScore(newChampionshipScore);
  },[]);

  function ScoreBoard() { 
    const [score1, setScore1] = useState('');
    const [score2, setScore2] = useState('');

    const ChooseScore = () => {
      if(score1 === '' || score2 === ''){
        alert('Please enter a score');
        return;
      }
      if(score1 < score2){
        alert(`You selected ${championshipTeams[0].name} as the winner, but the score does not reflect that`);
        return;
      }
      setChampionshipScore([parseInt(score1), parseInt(score2)]);
      setShowChampionshipScore(true);
    }
    return(
      <div>
        <h2>Predict Final Score</h2>
        <p>{championshipTeams[0].name}     vs     {championshipTeams[1].name}</p>
        <input type='text' placeholder='Enter Score' value={score1}
        onChange={(e) => setScore1(e.target.value)}/>
        <input type='text' placeholder='Enter Score' value={score2}
        onChange={(e)=> setScore2(e.target.value)}/>
        <button className='SubmitButton' onClick={() => ChooseScore()}>Submit</button>
      </div>
    );
  }

  useEffect(() => {
    if(topTeams.length === 12){
      alert('Bracket is Full!');
      initializeBracket();
      initializeChampionshipTeams();
      initializeChampionshipScore();
    }
  }, [topTeams, initializeBracket, initializeChampionshipTeams,initializeChampionshipScore]
  );

  function ChooseWinner(roundIndex: number, matchIndex: number, teamIndex: number) {
    const newRounds = [...rounds];
    const currentRound = newRounds[roundIndex];
    const currentMatch = newRounds[roundIndex].matches[matchIndex];
    const advancingTeam = currentMatch.teams[teamIndex];
    console.log(championshipTeams)
    if(!currentRound){
      alert('invalid round');
      return;
    }
    if(!currentMatch){
      alert('invalid match');
      return;
    }
    if(!advancingTeam || advancingTeam.name.includes('Winner')){
      alert('invalid team');
      return;
    }
    if (roundIndex + 1 < newRounds.length) {
      const nextRound = newRounds[roundIndex + 1];
      var nextMatch = nextRound.matches[Math.floor(matchIndex/2)];
      if(roundIndex === 0){
        nextMatch = nextRound.matches[matchIndex];
      }
      if (nextMatch) {
        if(roundIndex > 0){
          if(matchIndex % 2 === 0 && nextMatch.teams[0].name.includes('Winner')){
            nextMatch.teams[0] = advancingTeam;
          }else{
            if(matchIndex % 2 === 1 && nextMatch.teams[1].name.includes('Winner')){
              nextMatch.teams[1] = advancingTeam;
            }
          }
          if(roundIndex === 2){
            setChampionshipTeams([nextMatch.teams[0], nextMatch.teams[1]]);
          }
          if(roundIndex === 3){
            setShowScoreBoard(true);
            if(teamIndex === 0){
              setChampionshipTeams([nextMatch.teams[0], currentMatch.teams[1]]);
            }else{
              setChampionshipTeams([nextMatch.teams[0], currentMatch.teams[0]]);
            }
          }
        }else{
          nextMatch.teams = nextMatch.teams.map(team => team.name.includes('Winner') ? advancingTeam : team);
        }
      }
    }
    setRounds(newRounds);
  }


  function FinalScore(){
    setShowScoreBoard(false);
    return(
      <div>
        <h2>Final Score</h2>
        <p>{championshipTeams[0].name}     vs     {championshipTeams[1].name}</p>
        <p>{championshipScore[0]} - {championshipScore[1]}</p>
      </div>
    );
  }

  function Bracket({rounds}:BracketProps) {
    return(
    <>
    <div className='Bracket'>
      {rounds.map((round,roundIndex) => (
        <div key={roundIndex} className={`round-${roundIndex}`}>
          <h2>{round.name}</h2>
        {round.matches.map((match,matchIndex) => (
          <div className='Match' key={matchIndex}>
            <h3>{match.name}</h3>
            <div className='Teams1'>
              {match.teams.map((team,teamIndex) => (
                <div className='Team' key={teamIndex}><button onClick={() => ChooseWinner(roundIndex,matchIndex,teamIndex)}>{team.name}</button></div>
              ))}
            </div>
          </div>
        ))}
        </div>
      ))}
      <div className='ScoreBoard'>
        {showScoreBoard && <ScoreBoard />}
        {showChampionshipScore && <FinalScore />}
      </div>

    </div>
    </>
    );
  };
  const [showBracket, setShowBracket] = useState(false);

  function handleClick(){
    if(topTeams.length < 12){
      alert('Please select 12 teams to create a bracket');
      return;
    }
    setShowBracket(true);
  }

  return(
    <>
      <div className='Teams'>
        <div className='TeamsBox'>
          <h2>Top 25 Teams</h2>
          {teams.map((team) => (
            <TeamSelection key= {team.name} name={team.name}/>
          ))}
        </div>
        <DropZone onDrop={moveTeam}/>
      </div>
      <div className='BracketButton'>
        <button onClick={()=> handleClick()}>Create Bracket!</button>
        {showBracket && <Bracket rounds = {rounds}/>}
      </div>
    </>
  );
}

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="App">
        <Title/>
        <CreateBracket/>
        <header className="App-header">
        </header>
      </div>
    </DndProvider>
  );
}

export default App;
