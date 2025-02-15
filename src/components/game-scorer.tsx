
import React, { useState, useEffect } from 'react';
import { Check, Play, Pause, RotateCcw, ChevronRight, Pencil, SkipForward } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const GameScorer = () => {
  const [teams, setTeams] = useState({ team1: '', team2: '' });
  const [gameStarted, setGameStarted] = useState(false);
  const [currentRound, setCurrentRound] = useState(1);
  const [activeTeam, setActiveTeam] = useState(1);
  const [timer, setTimer] = useState(45);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [showResetButton, setShowResetButton] = useState(false);
  const [scores, setScores] = useState({
    1: { team1: [], team2: [] },
    2: { team1: [], team2: [] },
    3: { team1: [], team2: [] }
  });
  const [roundComplete, setRoundComplete] = useState({ 1: false, 2: false, 3: false });
  const [showScoreInput, setShowScoreInput] = useState(false);
  const [currentScore, setCurrentScore] = useState('');
  
  useEffect(() => {
    let interval;
    if (isTimerRunning && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsTimerRunning(false);
      setShowScoreInput(true);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timer]);

  const startGame = () => {
    if (teams.team1 && teams.team2) {
      setGameStarted(true);
    }
  };

  const startTimer = () => {
    setIsTimerRunning(true);
    setShowResetButton(true);
  };

  const pauseTimer = () => {
    setIsTimerRunning(false);
  };

  const resetTimer = () => {
    setTimer(45);
    setIsTimerRunning(false);
  };

  const skipTurn = () => {
    setTimer(45);
    setIsTimerRunning(false);
    setActiveTeam(activeTeam === 1 ? 2 : 1);
  };

  const handleScoreSubmit = (e) => {
    e.preventDefault();
    if (currentScore !== '') {
      const score = parseInt(currentScore);
      setScores(prev => ({
        ...prev,
        [currentRound]: {
          ...prev[currentRound],
          [`team${activeTeam}`]: [...prev[currentRound][`team${activeTeam}`], score]
        }
      }));
      setCurrentScore('');
      setShowScoreInput(false);
      setTimer(45);
      setActiveTeam(activeTeam === 1 ? 2 : 1);
    }
  };

  const endRound = () => {
    setRoundComplete(prev => ({ ...prev, [currentRound]: true }));
    if (currentRound < 3) {
      setCurrentRound(prev => prev + 1);
      setTimer(45);
      setActiveTeam(1);
      setIsTimerRunning(false);
    }
  };

  const calculateRoundTotal = (round, team) => {
    return scores[round][`team${team}`].reduce((acc, curr) => acc + curr, 0);
  };

  const calculateGameTotal = (team) => {
    return Object.keys(scores).reduce((acc, round) => 
      acc + calculateRoundTotal(round, team), 0);
  };

  const editRoundScores = (round) => {
    // Implementation for editing scores would go here
    console.log(`Editing scores for round ${round}`);
  };

  if (!gameStarted) {
    return (
      <div className="p-4 max-w-md mx-auto">
        <div className="space-y-4">
          <Input
            placeholder="Team 1 Name"
            value={teams.team1}
            onChange={(e) => setTeams(prev => ({ ...prev, team1: e.target.value }))}
          />
          <Input
            placeholder="Team 2 Name"
            value={teams.team2}
            onChange={(e) => setTeams(prev => ({ ...prev, team2: e.target.value }))}
          />
          <Button 
            className="w-full"
            onClick={startGame}
            disabled={!teams.team1 || !teams.team2}
          >
            Start Game
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">
          {teams.team1} vs {teams.team2}
        </h2>
        <div className="flex items-center space-x-4 mb-4">
          <div className="text-xl font-semibold">
            Round {currentRound}
          </div>
          {Object.keys(roundComplete).map((round) => (
            roundComplete[round] && (
              <Check key={round} className="text-green-500" />
            )
          ))}
          {!roundComplete[currentRound] && currentRound < 4 && (
            <Button onClick={endRound}>End Round</Button>
          )}
        </div>
        <div className="text-xl mb-2">
          Current Turn: {activeTeam === 1 ? teams.team1 : teams.team2}
        </div>
        <div className="text-3xl font-bold mb-4">
          {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
        </div>
        <div className="flex space-x-2">
          {!isTimerRunning ? (
            <Button onClick={startTimer}>
              <Play className="w-4 h-4 mr-2" />
              Start
            </Button>
          ) : (
            <Button onClick={pauseTimer}>
              <Pause className="w-4 h-4 mr-2" />
              Pause
            </Button>
          )}
          {showResetButton && (
            <Button onClick={resetTimer}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          )}
          <Button onClick={skipTurn}>
            <SkipForward className="w-4 h-4 mr-2" />
            Skip
          </Button>
        </div>
      </div>

      {showScoreInput && (
        <form onSubmit={handleScoreSubmit} className="mb-6">
          <Input
            type="number"
            value={currentScore}
            onChange={(e) => setCurrentScore(e.target.value)}
            placeholder="Enter score"
            autoFocus
          />
        </form>
      )}

      <div className="space-y-6">
        {[1, 2, 3].map((round) => (
          <div key={round} className="border p-4 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Round {round}</h3>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Pencil className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Uh oh! Somebody messed up...</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to edit the scores, you cheat?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>No</AlertDialogCancel>
                    <AlertDialogAction onClick={() => editRoundScores(round)}>
                      Yes
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">{teams.team1}</h4>
                <div className="space-y-1">
                  {scores[round].team1.map((score, idx) => (
                    <div key={idx}>{score}</div>
                  ))}
                  <div className="font-bold border-t pt-1">
                    Total: {calculateRoundTotal(round, 1)}
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">{teams.team2}</h4>
                <div className="space-y-1">
                  {scores[round].team2.map((score, idx) => (
                    <div key={idx}>{score}</div>
                  ))}
                  <div className="font-bold border-t pt-1">
                    Total: {calculateRoundTotal(round, 2)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 p-4 bg-gray-100 rounded-lg">
        <div>
          <h3 className="font-bold mb-2">{teams.team1}</h3>
          <div className="text-2xl font-bold">
            Total: {calculateGameTotal(1)}
          </div>
        </div>
        <div>
          <h3 className="font-bold mb-2">{teams.team2}</h3>
          <div className="text-2xl font-bold">
            Total: {calculateGameTotal(2)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameScorer;