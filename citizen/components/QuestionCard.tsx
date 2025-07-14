// components/QuestionCard.tsx

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Volume2, CheckCircle, XCircle, Info } from "lucide-react";

interface Option {
  en: string;
  zh: string;
  isCorrect: boolean;
}

interface Question {
  id: number;
  type: string;
  question_en: string;
  question_zh: string;
  options: Option[];
  explanation_en: string;
  explanation_zh: string;
}

interface Props {
  question: Question;
  onNext: (isCorrect: boolean) => void;
}

export function QuestionCard({ question, onNext }: Props) {
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const selectedOption = question.options.find((o) => o.en === selectedValue);

  const handleCheckAnswer = () => {
    if (!selectedValue) return;
    setIsAnswered(true);
  };

  const handleNextClick = () => {
    onNext(selectedOption?.isCorrect || false);
    setIsAnswered(false);
    setSelectedValue(null);
  };

  const handlePlaySound = () => {
    const utterance = new SpeechSynthesisUtterance(question.question_en);
    utterance.lang = "en-US";
    window.speechSynthesis.speak(utterance);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto rounded-2xl shadow-2xl border-0 bg-white/90 dark:bg-zinc-900/90 backdrop-blur py-8 px-2">
      <CardHeader className="text-center space-y-2">
        <div className="flex justify-center items-center gap-2">
          <CardTitle className="text-2xl font-extrabold">{question.question_en}</CardTitle>
          <Button variant="ghost" size="icon" onClick={handlePlaySound} className="ml-1">
            <Volume2 className="h-5 w-5" />
          </Button>
        </div>
        <CardDescription className="text-base text-muted-foreground">{question.question_zh}</CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup value={selectedValue ?? ""} onValueChange={setSelectedValue} disabled={isAnswered} className="space-y-10">
          {question.options.map((option) => {
            const isSelected = selectedValue === option.en;
            const isCorrect = option.isCorrect;
            let optionStyle = "";
            if (isAnswered) {
              if (isCorrect) optionStyle = "border-green-500 bg-green-50 text-green-700";
              else if (isSelected && !isCorrect) optionStyle = "border-red-400 bg-red-50 text-red-600";
              else optionStyle = "opacity-60";
            } else if (isSelected) {
              optionStyle = "border-blue-500 bg-blue-50 text-blue-700";
            } else {
              optionStyle = "hover:border-blue-300 hover:bg-blue-50";
            }
            return (
              <Label
                key={option.en}
                htmlFor={option.en}
                className={` flex flex-col items-start gap-1 p-4 border-2 rounded-xl cursor-pointer transition-all duration-150 w-full bg-white/80 dark:bg-zinc-800/80 shadow-sm ${optionStyle}`}
              >
                <div className="flex items-center gap-2 w-full ">
                  <RadioGroupItem value={option.en} id={option.en} />
                  <span className="text-lg font-medium">{option.en} <span className="text-sm text-muted-foreground"> / {option.zh}</span></span>
                  {isAnswered && isCorrect && <CheckCircle className="ml-1 text-green-500 w-5 h-5" />}
                  {isAnswered && isSelected && !isCorrect && <XCircle className="ml-1 text-red-400 w-5 h-5" />}
                </div>
              </Label>
            );
          })}
        </RadioGroup>
        {isAnswered && (
          <div className=" mt-8 flex items-start gap-2 bg-blue-50 dark:bg-zinc-800/60 rounded-xl p-4 text-left">
            <Info className="text-blue-400 mt-1 w-5 h-5" />
            <div>
              <div className="font-semibold text-blue-700 dark:text-blue-300 mb-1">Explanation</div>
              <div className="text-sm text-gray-900 dark:text-gray-100 mb-1">{question.explanation_en}</div>
              <div className="text-xs text-muted-foreground">{question.explanation_zh}</div>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-6 flex flex-col gap-2 mt-10">
        {isAnswered ? (
          <Button onClick={handleNextClick} className="w-full rounded-full text-lg font-bold">
            Next
          </Button>
        ) : (
          <Button onClick={handleCheckAnswer} disabled={!selectedValue} className="w-full rounded-full text-lg font-bold">
            Check Answer
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}