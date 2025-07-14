"use client";

import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { QuestionCard } from '@/components/QuestionCard';
import questionsData from '@/data/questions.json';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, RotateCcw } from 'lucide-react';

export default function QuizPage() {
  // 只在首次渲染时生成10个随机题目
  const choiceQuestions = useMemo(() => {
    const all = questionsData.filter(q => q.type === 'choice');
    const shuffled = all.slice().sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 10);
  }, []);

  const [questionIndex, setQuestionIndex] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const handleNext = (isCorrect: boolean) => {
    if (isCorrect) {
      setCorrectAnswers(correctAnswers + 1);
    }
    if (questionIndex < choiceQuestions.length - 1) {
      setQuestionIndex(questionIndex + 1);
    } else {
      setIsFinished(true);
    }
  };

  const restartQuiz = () => {
    setQuestionIndex(0);
    setCorrectAnswers(0);
    setIsFinished(false);
  };

  const getScoreColor = () => {
    const percentage = (correctAnswers / choiceQuestions.length) * 100;
    if (percentage >= 80) return 'text-green-600 dark:text-green-400';
    if (percentage >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  if (isFinished) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center min-h-[60vh] space-y-6"
      >
        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
              <Trophy className="h-16 w-16 text-yellow-500" />
            </div>
            <CardTitle className="text-2xl">Quiz Complete!</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className={`text-3xl font-bold ${getScoreColor()}`}>
              {correctAnswers} / {choiceQuestions.length}
            </div>
            <p className="text-muted-foreground">
              {correctAnswers >= choiceQuestions.length * 0.8 
                ? "Excellent! You're ready for the test!" 
                : "Keep practicing to improve your score!"}
            </p>
            <Button onClick={restartQuiz} className="w-full" size="lg">
              <RotateCcw className="mr-2 h-4 w-4" />
              Restart Quiz
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-[80vh] w-full px-4">
      <div className="w-full max-w-2xl">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Progress</span>
            <span className="text-sm text-muted-foreground">
              {questionIndex + 1} of {choiceQuestions.length}
            </span>
          </div>
          <div className="w-full bg-secondary rounded-full h-2">
            <motion.div
              className="bg-primary h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((questionIndex + 1) / choiceQuestions.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={questionIndex}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <QuestionCard
              question={choiceQuestions[questionIndex]}
              onNext={handleNext}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}